#!/usr/bin/env python3
"""
build_word_index.py — baut wordReferenceIndex.json aus der Zuercher-Bibel-
XML per spaCy (de_core_news_md).

Struktur EXAKT wie personReferenceIndex.json / placeReferenceIndex.json:
  {
    "meta": {...},
    "words": { "<id>": {displayName, pos, count, surfaceForms: [...]} },
    "versesByWord": { "<id>": [{book, chapter, verse}, ...] }
  }

Entity-ID = Lemma + POS (z. B. "gehen__VERB"), NICHT nur Lemma - dasselbe
Lemma kann als unterschiedliche Wortart auftreten (z. B. "gut" als ADJ vs.
ADV) und soll dann als ZWEI separate Eintraege im Register erscheinen,
nicht vermischt.

Vorgehen pro Vers:
  1. Fussnoten-Querverweise ("(a) Jes 45:7; Ps 8:7") aus dem Verstext
     entfernen (dieselbe Regex-Logik wie extractCrossRefTargets in
     script.js) - sonst wuerden Buchkuerzel/Zahlen aus den Referenzen
     selbst als "Woerter" mitgezaehlt.
  2. spaCy (tagger+morphologizer+lemmatizer, OHNE parser/ner - fuer
     Lemma/POS nicht benoetigt, deutlich schneller) tokenisiert,
     lemmatisiert, taggt.
  3. Nur "echte Wortformen" behalten: token.is_alpha (schliesst Zahlen,
     Satzzeichen, Sonderzeichen aus).
  4. surfaceForms pro Entity sammeln (die TATSAECHLICH im Text
     vorkommenden Flexionsformen, z. B. "ging"/"geht"/"gegangen" alle
     unter "gehen__VERB") - fuer die Namens-Pille im Kapiteltext (exakt
     dasselbe Prinzip wie bei GERMAN_PERSON_NAME_ALIASES/surfaceForms bei
     Zeiten, s. Projektstand).

KEINE Mindesthaeufigkeits-Schwelle (Nutzer-Entscheidung: alle Formen).
KEINE Stopwort-Filterung hier - das uebernimmt die Sidebar/Frontend per
POS-Filter (Default: NOUN/ADJ/VERB). Wortarten wie DET/ADP/CCONJ/PRON/AUX/
PART werden trotzdem mit erfasst und einfach nicht im Default-Filter
gezeigt - so bleibt "sein"/"haben" als AUX automatisch aus der
Standardansicht, ohne dass eine explizite Stopwortliste gepflegt werden
muss (die, wie sich beim Testen zeigte, spaCys eingebaute Liste teils
unerwuenschte Treffer wie "Tage" oder "gehen" enthaelt).
"""

import json
import re
import time
import xml.etree.ElementTree as ET
from collections import defaultdict

import spacy

XML_PATH = "bible.xml"
OUTPUT_PATH = "wordReferenceIndex.json"
SPACY_MODEL = "de_core_news_md"

# Gleiche bookOrder wie bookMap.js in script.js - noetig, um die Buecher in
# kanonischer Reihenfolge zu verarbeiten (fuer deterministische Ausgabe;
# die eigentliche Sortierung nach Buch/Kapitel/Vers passiert ohnehin im
# Frontend, s. getEntityEntryRows in script.js).
BOOK_ORDER = [
    "Genesis", "Exodus", "Leviticus", "Numbers", "Deuteronomy", "Joshua",
    "Judges", "Ruth", "1 Samuel", "2 Samuel", "1 Kings", "2 Kings",
    "1 Chronicles", "2 Chronicles", "Ezra", "Nehemiah", "Esther", "Job",
    "Psalm", "Proverbs", "Ecclesiastes", "Song of Solomon", "Isaiah",
    "Jeremiah", "Lamentations", "Ezekiel", "Daniel", "Hosea", "Joel",
    "Amos", "Obadiah", "Jonah", "Micah", "Nahum", "Habakkuk", "Zephaniah",
    "Haggai", "Zechariah", "Malachi", "Matthew", "Mark", "Luke", "John",
    "Acts", "Romans", "1 Corinthians", "2 Corinthians", "Galatians",
    "Ephesians", "Philippians", "Colossians", "1 Thessalonians",
    "2 Thessalonians", "1 Timothy", "2 Timothy", "Titus", "Philemon",
    "Hebrews", "James", "1 Peter", "2 Peter", "1 John", "2 John",
    "3 John", "Jude", "Revelation",
]

# Dieselbe Regex-Logik wie extractCrossRefTargets() in script.js -
# entfernt Fussnoten-Querverweise wie " (a) Jes 45:7; Ps 8:7" aus dem
# Verstext, BEVOR er an spaCy geht (sonst wuerden Buchkuerzel/Zahlen aus
# den Referenzen selbst als "Woerter" gezaehlt).
FOOTNOTE_REGEX = re.compile(r"\([a-z]\)\s*[^()]+")


def strip_footnotes(text):
    return FOOTNOTE_REGEX.sub(" ", text)


def load_verses():
    tree = ET.parse(XML_PATH)
    root = tree.getroot()
    books = sorted(
        root.findall("BIBLEBOOK"),
        key=lambda b: BOOK_ORDER.index(b.get("bname")),
    )

    verses = []  # (book, chapter, verse, cleaned_text)
    for book in books:
        book_name = book.get("bname")
        chapters = sorted(
            book.findall("CHAPTER"), key=lambda c: int(c.get("cnumber"))
        )
        for chapter in chapters:
            chapter_number = int(chapter.get("cnumber"))
            for vers in chapter.findall("VERS"):
                verse_number = int(vers.get("vnumber"))
                raw_text = vers.text or ""
                cleaned = strip_footnotes(raw_text)
                verses.append((book_name, chapter_number, verse_number, cleaned))
    return verses


def make_entity_id(lemma, pos):
    # "__" als Trenner: Lemmas selbst enthalten laut Beobachtung keine
    # doppelten Unterstriche, daher eindeutig genug fuer eine simple
    # Aufsplittung, falls das je noetig werden sollte. Kein Slugifying
    # noetig - JSON-Keys duerfen beliebige Unicode-Zeichen enthalten.
    return f"{lemma}__{pos}"


def main():
    print(f"Lade Verse aus {XML_PATH} ...")
    verses = load_verses()
    print(f"{len(verses)} Verse geladen.")

    print(f"Lade spaCy-Modell {SPACY_MODEL} (ohne parser/ner) ...")
    nlp = spacy.load(SPACY_MODEL, disable=["parser", "ner"])
    # Fuer eine Bibel dieser Groesse (~30k Verse) reicht ein grosszuegiger
    # Batch, um den Pipe-Overhead klein zu halten.
    nlp.max_length = 2_000_000

    words = {}  # id -> {displayName, pos, count, surfaceForms:set}
    verses_by_word = defaultdict(list)  # id -> [ {book,chapter,verse}, ... ]

    texts = [v[3] for v in verses]
    meta_per_text = [(v[0], v[1], v[2]) for v in verses]

    t0 = time.time()
    processed = 0
    total = len(texts)

    for (book, chapter, verse_number), doc in zip(
        meta_per_text, nlp.pipe(texts, batch_size=200)
    ):
        seen_ids_this_verse = set()
        for token in doc:
            if not token.is_alpha:
                continue
            lemma = token.lemma_.strip()
            if not lemma:
                continue
            pos = token.pos_
            entity_id = make_entity_id(lemma, pos)

            entry = words.get(entity_id)
            if entry is None:
                entry = {
                    "displayName": lemma,
                    "pos": pos,
                    "count": 0,
                    "surfaceForms": set(),
                }
                words[entity_id] = entry
            entry["count"] += 1
            entry["surfaceForms"].add(token.text)

            if entity_id not in seen_ids_this_verse:
                seen_ids_this_verse.add(entity_id)
                verses_by_word[entity_id].append(
                    {"book": book, "chapter": chapter, "verse": verse_number}
                )

        processed += 1
        if processed % 5000 == 0:
            elapsed = time.time() - t0
            print(f"  {processed}/{total} Verse verarbeitet ({elapsed:.1f}s) ...")

    elapsed = time.time() - t0
    print(f"Fertig getaggt in {elapsed:.1f}s. {len(words)} eindeutige Lemma+POS-Entities.")

    # Sets -> sortierte Listen fuer JSON-Serialisierung.
    for entry in words.values():
        entry["surfaceForms"] = sorted(entry["surfaceForms"])

    pos_counts = defaultdict(int)
    for entry in words.values():
        pos_counts[entry["pos"]] += 1

    output = {
        "meta": {
            "generatedAt": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
            "model": SPACY_MODEL,
            "sourceXml": XML_PATH,
            "totalVerses": len(verses),
            "totalEntities": len(words),
            "minFrequencyThreshold": 0,
            "posDistribution": dict(sorted(pos_counts.items(), key=lambda kv: -kv[1])),
        },
        "words": words,
        "versesByWord": dict(verses_by_word),
    }

    print(f"Schreibe {OUTPUT_PATH} ...")
    with open(OUTPUT_PATH, "w", encoding="utf-8") as f:
        json.dump(output, f, ensure_ascii=False, separators=(",", ":"))

    print("Fertig.")
    print("POS-Verteilung (Anzahl eindeutiger Lemmas je Wortart):")
    for pos, count in sorted(pos_counts.items(), key=lambda kv: -kv[1]):
        print(f"  {pos:8s} {count}")


if __name__ == "__main__":
    main()
