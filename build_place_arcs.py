#!/usr/bin/env python3
"""
build_place_arcs.py — baut placeArcs.json: das Querverweis-NETZ zwischen
ORTEN, fuer die Bogen-Darstellung auf der 3D-Globe (s. createGlobeView in
script.js).

IDEE (s. Chat/Machbarkeitsanalyse): Die bestehende Boegen-Ansicht
verbindet KAPITEL miteinander (Quelle/Ziel eines Fussnoten-Querverweises).
Auf der Karte gibt es keine Kapitel-Achse - dort sind ORTE die Knoten.
Ein Bogen entsteht deshalb, wenn ein Querverweis einen Vers, in dem ein
(geokodierter) Ort vorkommt, mit einem anderen Vers verbindet, in dem
ebenfalls ein (geokodierter) Ort vorkommt: dann laesst sich eine Linie
zwischen den beiden tatsaechlichen Koordinaten spannen.

MASSSTAB (empirisch ermittelt, s. Chat):
- 10.426 Quell->Ziel-Querverweispaare insgesamt im Zuercher-Text
- davon 656 Vers-Paare mit geokodiertem Ort auf BEIDEN Seiten
- daraus 1.051 Orts-zu-Orts-Verknuepfungen (kartesisches Produkt, wenn
  ein Vers mehrere Orte nennt), Selbstbezuege ausgeschlossen
- nach Deduplizierung: 594 EINDEUTIGE Orts-Paare, ueber 269 Orte verteilt
Bewusste Entscheidung (mit dem Nutzer abgestimmt): es werden die
EINDEUTIGEN Paare gezeichnet, nicht alle 1.051 Einzelverknuepfungen -
ergibt ein deutlich aufgeraeumteres Netz, ohne Informationsverlust
(dasselbe Ortspaar mehrfach zu verbinden wuerde optisch nichts
hinzufuegen). Die Anzahl der zugrundeliegenden Vers-Belege wird pro Paar
als `weight` mitgegeben - so laesst sich ein haeufig belegtes Paar bei
Bedarf staerker/deckender zeichnen, ohne mehrere Linien uebereinander zu
legen.

Bewusst KEINE kapitelweise Aggregation (im Chat erwogen und verworfen):
Verse sind bereits die praezisere Ebene - ein Kapitel nennt oft mehrere
Orte, eine Aggregation wuerde also Bezuege erfinden, die im Text so nicht
stehen.
"""

import json
import re
import xml.etree.ElementTree as ET
from collections import defaultdict

XML_PATH = "bible.xml"
PLACES_PATH = "placeReferenceIndex.json"
COORDS_PATH = "placeCoordinates.json"
OUTPUT_PATH = "placeArcs.json"

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

# Identisch zu shortToFull in script.js - die Fussnoten-Querverweise im
# Zuercher-Text nutzen deutsche Buchkuerzel ("Jes 45:7").
SHORT_TO_FULL = {
    "1Mo": "Genesis", "1.Mo": "Genesis", "1M": "Genesis",
    "2Mo": "Exodus", "2.Mo": "Exodus", "2M": "Exodus",
    "3Mo": "Leviticus", "3.Mo": "Leviticus", "3M": "Leviticus",
    "4Mo": "Numbers", "4.Mo": "Numbers", "4M": "Numbers",
    "5Mo": "Deuteronomy", "5.Mo": "Deuteronomy", "5M": "Deuteronomy",
    "Jos": "Joshua", "Ri": "Judges", "Jdg": "Judges",
    "Rut": "Ruth", "Ru": "Ruth", "Rth": "Ruth",
    "1Sam": "1 Samuel", "1Sa": "1 Samuel", "1Sm": "1 Samuel",
    "2Sam": "2 Samuel", "2Sa": "2 Samuel", "2Sm": "2 Samuel",
    "1Kön": "1 Kings", "1Koe": "1 Kings", "1Kon": "1 Kings", "1Ki": "1 Kings", "1Kö": "1 Kings",
    "2Kön": "2 Kings", "2Koe": "2 Kings", "2Kon": "2 Kings", "2Ki": "2 Kings", "2Kö": "2 Kings",
    "1Chr": "1 Chronicles", "1Ch": "1 Chronicles",
    "2Chr": "2 Chronicles", "2Ch": "2 Chronicles",
    "Esr": "Ezra", "Ezr": "Ezra", "Neh": "Nehemiah", "Ne": "Nehemiah",
    "Est": "Esther", "Hi": "Job", "Hiob": "Job", "Ijob": "Job", "Job": "Job",
    "Ps": "Psalm", "Psa": "Psalm", "Spr": "Proverbs", "Pr": "Proverbs", "Pro": "Proverbs",
    "Pred": "Ecclesiastes", "Koh": "Ecclesiastes", "Ecc": "Ecclesiastes",
    "Hld": "Song of Solomon", "Hoh": "Song of Solomon", "Hhld": "Song of Solomon", "Son": "Song of Solomon",
    "Jes": "Isaiah", "Isa": "Isaiah", "Jer": "Jeremiah",
    "Klgl": "Lamentations", "Klg": "Lamentations", "Lam": "Lamentations",
    "Hes": "Ezekiel", "Hesek": "Ezekiel", "Ez": "Ezekiel", "Eze": "Ezekiel",
    "Dan": "Daniel", "Da": "Daniel", "Hos": "Hosea",
    "Joe": "Joel", "Joel": "Joel", "Am": "Amos", "Amo": "Amos",
    "Obd": "Obadiah", "Ob": "Obadiah", "Oba": "Obadiah", "Obadja": "Obadiah",
    "Jon": "Jonah", "Mi": "Micah", "Mic": "Micah", "Nah": "Nahum",
    "Hab": "Habakkuk", "Zef": "Zephaniah", "Ze": "Zephaniah", "Zep": "Zephaniah",
    "Hag": "Haggai", "Sach": "Zechariah", "Zec": "Zechariah", "Mal": "Malachi",
    "Mt": "Matthew", "Mat": "Matthew", "Matth": "Matthew",
    "Mk": "Mark", "Mar": "Mark", "Lk": "Luke", "Luk": "Luke",
    "Joh": "John", "Apg": "Acts", "Act": "Acts",
    "Rö": "Romans", "Roe": "Romans", "Rom": "Romans",
    "1Kor": "1 Corinthians", "1Ko": "1 Corinthians", "1Co": "1 Corinthians",
    "2Kor": "2 Corinthians", "2Ko": "2 Corinthians", "2Co": "2 Corinthians",
    "Gal": "Galatians", "Eph": "Ephesians",
    "Phil": "Philippians", "Php": "Philippians",
    "Kol": "Colossians", "Col": "Colossians",
    "1Thess": "1 Thessalonians", "1Th": "1 Thessalonians",
    "2Thess": "2 Thessalonians", "2Th": "2 Thessalonians",
    "1Tim": "1 Timothy", "1Ti": "1 Timothy",
    "2Tim": "2 Timothy", "2Ti": "2 Timothy",
    "Tit": "Titus", "Phm": "Philemon", "Phlm": "Philemon",
    "Hebr": "Hebrews", "Heb": "Hebrews", "Jak": "James", "Jas": "James",
    "1Petr": "1 Peter", "1Pe": "1 Peter", "1Pt": "1 Peter",
    "2Petr": "2 Peter", "2Pe": "2 Peter", "2Pt": "2 Peter",
    "1Joh": "1 John", "1Jo": "1 John", "1Jn": "1 John",
    "2Joh": "2 John", "2Jo": "2 John", "2Jn": "2 John",
    "3Joh": "3 John", "3Jo": "3 John", "3Jn": "3 John",
    "Jud": "Jude", "Offb": "Revelation", "Off": "Revelation",
    "Rev": "Revelation", "Apk": "Revelation",
}

CROSSREF_REGEX = re.compile(r"\(([a-z])\)\s*([^()]+)", re.IGNORECASE)
REF_REGEX = re.compile(r"^([A-Za-z0-9]+)\s+(\d+):(\d+)$")


def make_verse_key(book, chapter, verse):
    return f"{book}|{chapter}|{verse}"


def extract_crossref_targets(text):
    targets = []
    for match in CROSSREF_REGEX.finditer(text):
        for raw_ref in match.group(2).split(";"):
            parts = REF_REGEX.match(raw_ref.strip())
            if not parts:
                continue
            short = parts.group(1)
            targets.append(
                {
                    "bookFull": SHORT_TO_FULL.get(short, short),
                    "bookShort": short,
                    "chapter": int(parts.group(2)),
                    "verse": int(parts.group(3)),
                }
            )
    return targets


def resolve_unknown_book_name(raw_short, known_book_names):
    """Identisch zur Fallback-Logik in script.js (resolveUnknownBookName) -
    faengt Kuerzel ab, die nicht in SHORT_TO_FULL stehen (z. B. "Hio",
    "Sac", "Kla"), indem der normalisierte Kuerzel-/Buchname-Praefix
    verglichen wird."""
    normalize = lambda s: s.lower().replace(".", "").replace(" ", "")
    n_short = normalize(raw_short)
    for full_name in known_book_names:
        n_full = normalize(full_name)
        if n_full.startswith(n_short) or n_short.startswith(n_full):
            return full_name
    return None


def main():
    tree = ET.parse(XML_PATH)
    root = tree.getroot()
    known_book_names = set(BOOK_ORDER)

    cross_refs = []
    for book in root.findall("BIBLEBOOK"):
        book_name = book.get("bname")
        for chapter in book.findall("CHAPTER"):
            chapter_number = int(chapter.get("cnumber"))
            for vers in chapter.findall("VERS"):
                verse_number = int(vers.get("vnumber"))
                targets = extract_crossref_targets(vers.text or "")
                if not targets:
                    continue
                for target in targets:
                    if target["bookFull"] not in known_book_names:
                        resolved = resolve_unknown_book_name(target["bookShort"], known_book_names)
                        if resolved:
                            target["bookFull"] = resolved
                cross_refs.append(
                    {
                        "source": {"book": book_name, "chapter": chapter_number, "verse": verse_number},
                        "targets": targets,
                    }
                )

    print(f"Querverweis-Quellverse: {len(cross_refs)}")

    places_data = json.load(open(PLACES_PATH, encoding="utf-8"))
    coords = json.load(open(COORDS_PATH, encoding="utf-8"))["coordinates"]

    # verseKey -> {placeIds} - NUR geokodierte Orte (ohne Koordinate laesst
    # sich kein Bogenendpunkt bestimmen).
    verse_to_places = defaultdict(set)
    for place_id, verses in places_data["versesByPlace"].items():
        if place_id not in coords:
            continue
        for v in verses:
            verse_to_places[make_verse_key(v["book"], v["chapter"], v["verse"])].add(place_id)

    print(f"Verse mit mindestens einem geokodierten Ort: {len(verse_to_places)}")

    # Eindeutige Ortspaare sammeln. Schluessel ist das SORTIERTE Paar -
    # ein Querverweis hat zwar eine Richtung (Quelle->Ziel), fuer die
    # Kartendarstellung ist die Verbindung zweier Orte aber ungerichtet
    # (eine Linie zwischen zwei Punkten, kein Pfeil).
    pair_weight = defaultdict(int)
    pair_examples = {}

    verse_pair_count = 0
    expanded_count = 0

    for ref in cross_refs:
        source_key = make_verse_key(ref["source"]["book"], ref["source"]["chapter"], ref["source"]["verse"])
        source_places = verse_to_places.get(source_key)
        if not source_places:
            continue
        for target in ref["targets"]:
            target_key = make_verse_key(target["bookFull"], target["chapter"], target["verse"])
            target_places = verse_to_places.get(target_key)
            if not target_places:
                continue
            verse_pair_count += 1
            for sp in source_places:
                for tp in target_places:
                    if sp == tp:
                        continue  # Selbstbezug - kein zeichenbarer Bogen
                    expanded_count += 1
                    pair_key = tuple(sorted((sp, tp)))
                    pair_weight[pair_key] += 1
                    # Erstes Vorkommen als Beleg-Beispiel merken (fuer den
                    # Tooltip auf der Karte: "wodurch sind diese beiden
                    # Orte verbunden?").
                    if pair_key not in pair_examples:
                        pair_examples[pair_key] = {
                            "sourceBook": ref["source"]["book"],
                            "sourceChapter": ref["source"]["chapter"],
                            "sourceVerse": ref["source"]["verse"],
                            "targetBook": target["bookFull"],
                            "targetChapter": target["chapter"],
                            "targetVerse": target["verse"],
                        }

    print(f"Vers-Paare mit Ort auf beiden Seiten: {verse_pair_count}")
    print(f"Orts-zu-Orts-Verknuepfungen (mit Mehrfachnennungen): {expanded_count}")
    print(f"EINDEUTIGE Ortspaare: {len(pair_weight)}")

    arcs = []
    for (a, b), weight in sorted(pair_weight.items(), key=lambda kv: -kv[1]):
        arcs.append(
            {
                "from": a,
                "to": b,
                "weight": weight,
                "example": pair_examples[(a, b)],
            }
        )

    involved = set()
    for arc in arcs:
        involved.add(arc["from"])
        involved.add(arc["to"])
    print(f"Beteiligte Orte: {len(involved)}")

    output = {
        "meta": {
            "uniquePairs": len(arcs),
            "expandedLinks": expanded_count,
            "versePairs": verse_pair_count,
            "involvedPlaces": len(involved),
        },
        "arcs": arcs,
    }

    with open(OUTPUT_PATH, "w", encoding="utf-8") as f:
        json.dump(output, f, ensure_ascii=False, separators=(",", ":"))

    print(f"Geschrieben: {OUTPUT_PATH}")


if __name__ == "__main__":
    main()
