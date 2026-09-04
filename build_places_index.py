"""
Build-Zeit-Skript: erzeugt placeReferenceIndex.json aus placesProperNouns.json
+ der Zuercher-Bibel-XML. Wird EINMALIG offline ausgefuehrt (nicht bei jedem
App-Load) - das Ergebnis ist eine statische JSON-Datei, die die App laedt.

EXAKT dieselbe Pipeline-Architektur wie build_persons_index.py (s. dort fuer
die ausfuehrliche Begruendung) - Versifikations-Korrekturen (Kapitelgrenzen-
Verschiebungen, Psalm-Ueberschriften) sind eine Eigenschaft der ZUERCHER-
BIBEL-TEXT selbst, nicht der Personen-Pipeline, gelten also unveraendert
auch fuer Orte. Deshalb hier woertlich uebernommen statt neu hergeleitet.

Einziger inhaltlicher Unterschied zu build_persons_index.py: KEIN Male/
Female-Typ-Filter auf oberster Ebene - placesProperNouns.json hat kein
aequivalentes Feld. Alle 1014 Eintraege sind bereits echte Orte (die
Datei ist dediziert fuer Orte, im Gegensatz zu peopleProperNouns.json, wo
ein Typ-Filter noetig war, um z. B. Gruppen wie "Amoriter" auszuschliessen).

Architektur (s. Chat-Konsultation zu Personen, identisch uebertragen):
1. Referenzen aus whereFound extrahieren (NICHT allRefs - das ist bei
   vielbelegten Orten wie Jerusalem auf einen Bruchteil der echten
   Referenzen gekuerzt, empirisch verifiziert: Jerusalem 995 vs. 87,
   97% Verlust - noch extremer als bei David unter den Personen).
2. Buchcode-Mapping STEPBible -> interne Buchnamen (identisch zur
   Personen-Pipeline, unveraendert uebernommen).
3. Direkte 1:1-Vers-Abbildung als Basis.
4. Fuer die verbleibenden Randfaelle: dieselbe kleine, EINZELN
   VERIFIZIERTE Tabelle bekannter Kapitelgrenzen-Verschiebungen zwischen
   englischer und hebraeischer Zaehlung wie bei den Personen.
5. Kreuzvalidierung: jede Referenz, die auch nach Korrektur nicht auf
   einen existierenden Zuercher-Vers trifft, wird geloggt statt
   stillschweigend verworfen.
"""
import json
import re
import xml.etree.ElementTree as ET
from collections import Counter

PLACES_JSON_PATH = "/mnt/user-data/uploads/placesProperNouns.json"
BIBLE_XML_PATH = "/mnt/user-data/uploads/SF_2009-04-12_GER_ZUERCHER__ZUERCHER_BIBEL_1931_.xml"
OUTPUT_PATH = "/home/claude/pipeline/placeReferenceIndex.json"

BOOK_CODE_MAP = {
    "Gen": "Genesis", "Exo": "Exodus", "Lev": "Leviticus", "Num": "Numbers",
    "Deu": "Deuteronomy", "Jos": "Joshua", "Jdg": "Judges", "Rut": "Ruth",
    "1Sa": "1 Samuel", "2Sa": "2 Samuel", "1Ki": "1 Kings", "2Ki": "2 Kings",
    "1Ch": "1 Chronicles", "2Ch": "2 Chronicles", "Ezr": "Ezra", "Neh": "Nehemiah",
    "Est": "Esther", "Job": "Job", "Psa": "Psalm", "Pro": "Proverbs",
    "Ecc": "Ecclesiastes", "Sng": "Song of Solomon", "Isa": "Isaiah",
    "Jer": "Jeremiah", "Lam": "Lamentations", "Ezk": "Ezekiel", "Dan": "Daniel",
    "Hos": "Hosea", "Jol": "Joel", "Amo": "Amos", "Oba": "Obadiah",
    "Jon": "Jonah", "Mic": "Micah", "Nam": "Nahum", "Hab": "Habakkuk",
    "Zep": "Zephaniah", "Hag": "Haggai", "Zec": "Zechariah", "Mal": "Malachi",
    "Mat": "Matthew", "Mrk": "Mark", "Luk": "Luke", "Jhn": "John", "Act": "Acts",
    "Rom": "Romans", "1Co": "1 Corinthians", "2Co": "2 Corinthians",
    "Gal": "Galatians", "Eph": "Ephesians", "Php": "Philippians",
    "Col": "Colossians", "1Th": "1 Thessalonians", "2Th": "2 Thessalonians",
    "1Ti": "1 Timothy", "2Ti": "2 Timothy", "Tit": "Titus", "Phm": "Philemon",
    "Heb": "Hebrews", "Jas": "James", "1Pe": "1 Peter", "2Pe": "2 Peter",
    "1Jn": "1 John", "2Jn": "2 John", "3Jn": "3 John", "Jud": "Jude",
    "Rev": "Revelation",
}

REF_PATTERN = re.compile(r'^(?:LXX\.)?\[?([1-3]?[A-Za-z]{2,3})\.(\d+)\.(\d+)[a-z]?\]?$')

# ---- Empirisch verifizierte Kapitelgrenzen-Verschiebungen (unveraendert
# aus build_persons_index.py uebernommen - s. dort fuer die Herleitung) --
CHAPTER_BOUNDARY_SHIFTS = [
    ("2 Samuel", 18, 33, "2 Samuel", 19, -32),
    ("1 Kings", 4, 21, "1 Kings", 5, -20),
    ("1 Samuel", 23, 29, "1 Samuel", 24, -28),
    ("Hosea", 11, 12, "Hosea", 12, -11),
    ("Numbers", 29, 40, "Numbers", 30, -39),
    ("Jonah", 1, 17, "Jonah", 2, -16),
    ("Nahum", 1, 15, "Nahum", 2, -14),
    ("Daniel", 4, 4, "Daniel", 4, -3),
    # Neu verifiziert bei der Orte-Pipeline (s. Chat) - betraf bislang
    # keine Personen-Referenz, daher in der Personen-Pipeline nie
    # aufgefallen; gilt aber genauso fuer die Zuercher-Bibel als Text,
    # unabhaengig davon, was referenziert wird:
    # Numbers 12:16 (engl.) = Numbers 13:1 (Zuercher) - Inhalt
    # "brach das Volk von Hazeroth auf..." verifiziert identisch.
    ("Numbers", 12, 16, "Numbers", 13, -15),
    # Ezekiel 20:46-47 (engl.) = Ezekiel 21:1-2 (Zuercher) - Inhalt
    # "richte dein Angesicht gen Mittag..." verifiziert identisch.
    ("Ezekiel", 20, 46, "Ezekiel", 21, -45),
]
DANIEL_4_TO_3 = ("Daniel", 4, 3, "Daniel", 3, 30)

SINGLE_VERSE_FIXES = {
    ("2 Corinthians", 13, 14): ("2 Corinthians", 13, 13),
}

PSALM_TWO_LINE_HEADING = {51, 52, 54, 60}


def apply_versification_correction(book, chapter, verse):
    """Reine Funktion, identisch zu build_persons_index.py - die Zuercher-
    Bibel-Versifikationsquirks haengen nicht davon ab, WAS referenziert
    wird (Person oder Ort), nur WELCHER Vers gemeint ist."""
    if book == "Psalm" and chapter in PSALM_TWO_LINE_HEADING:
        return book, chapter, verse + 1

    if book == "Daniel" and chapter == 4 and verse <= 3:
        _, _, _, tb, tc, off = DANIEL_4_TO_3
        return tb, tc, verse + off

    for (b, c, min_v, tb, tc, off) in CHAPTER_BOUNDARY_SHIFTS:
        if book == b and chapter == c and verse >= min_v:
            return tb, tc, verse + off

    if (book, chapter, verse) in SINGLE_VERSE_FIXES:
        return SINGLE_VERSE_FIXES[(book, chapter, verse)]

    return book, chapter, verse


def load_places_json(path):
    with open(path, encoding="utf-8") as f:
        lines = f.readlines()
    start = next(i for i, l in enumerate(lines) if l.strip() == "{")
    return json.loads("".join(lines[start:]))


def load_zuercher_bible(path):
    tree = ET.parse(path)
    root = tree.getroot()
    chapters = {}
    for book in root.findall("BIBLEBOOK"):
        bname = book.get("bname")
        for chapter in book.findall("CHAPTER"):
            cnum = int(chapter.get("cnumber"))
            verses = set(int(v.get("vnumber")) for v in chapter.findall("VERS"))
            chapters[(bname, cnum)] = verses
    return chapters


def parse_reference(raw_ref):
    m = REF_PATTERN.match(raw_ref)
    if not m:
        return None
    return m.group(1), int(m.group(2)), int(m.group(3))


def main():
    print("Lade placesProperNouns.json ...")
    places = load_places_json(PLACES_JSON_PATH)
    print(f"  {len(places)} Orts-Datensaetze geladen")

    print("Lade Zuercher-Bibel-XML ...")
    zuercher = load_zuercher_bible(BIBLE_XML_PATH)
    print(f"  {len(zuercher)} Kapitel, {sum(len(v) for v in zuercher.values())} Verse")

    places_by_verse = {}   # "Book|Chapter|Verse" -> [placeId, ...]
    verses_by_place = {}   # placeId -> [{book,chapter,verse}, ...]
    places_meta = {}       # placeId -> Stammdaten
    total_raw_refs = 0
    resolved_refs = 0
    unresolved = []
    unmapped_book_codes = Counter()

    for place_id, record in places.items():
        # KEIN Type-Filter noetig - s. Modulkommentar oben.

        raw_refs = []
        for sd in record.get("supplementaryData", []):
            for raw_ref in sd.get("whereFound", []):
                parsed = parse_reference(raw_ref)
                if parsed:
                    raw_refs.append(parsed)
        total_raw_refs += len(raw_refs)

        resolved_for_place = []
        seen = set()
        for book_code, chapter, verse in raw_refs:
            book_name = BOOK_CODE_MAP.get(book_code)
            if book_name is None:
                unmapped_book_codes[book_code] += 1
                continue

            final_book, final_chapter, final_verse = apply_versification_correction(
                book_name, chapter, verse
            )

            verses_in_chapter = zuercher.get((final_book, final_chapter))
            if verses_in_chapter is not None and final_verse in verses_in_chapter:
                key = (final_book, final_chapter, final_verse)
                if key not in seen:
                    seen.add(key)
                    resolved_for_place.append(
                        {"book": final_book, "chapter": final_chapter, "verse": final_verse}
                    )
                    resolved_refs += 1
            else:
                unresolved.append((place_id, book_name, chapter, verse, final_book, final_chapter, final_verse))

        if resolved_for_place:
            verses_by_place[place_id] = resolved_for_place
            near = record.get("near", "-")
            area = record.get("geographicalArea", "-")
            places_meta[place_id] = {
                "displayName": record.get("baseNameFromUnifiedName", place_id),
                "description": record.get("briefDescription") or record.get("briefestDescription") or record.get("summaryDescription", ""),
                "geographicalArea": area if area and area != "-" else None,
                "near": near if near and near != "-" else None,
                "count": len(resolved_for_place),
            }
            for ref in resolved_for_place:
                key = f"{ref['book']}|{ref['chapter']}|{ref['verse']}"
                places_by_verse.setdefault(key, []).append(place_id)

    print()
    print(f"Orte mit mind. 1 aufgeloester Referenz: {len(places_meta)}")
    unique_resolved = sum(len(v) for v in verses_by_place.values())
    print(f"Roh-Referenzen (nach String-Dedup): {total_raw_refs}")
    print(f"Davon zu eindeutigen Vers-Links aufgeloest: {unique_resolved}")
    print(f"Nicht gemappte Buchcodes: {dict(unmapped_book_codes)}")
    print(f"Nicht aufloesbare Faelle (Vers existiert auch nach Korrektur nicht): {len(unresolved)}")
    for u in unresolved[:50]:
        print("   ", u)
    if len(unresolved) > 50:
        print(f"   ... und {len(unresolved) - 50} weitere")

    output = {
        "meta": {
            "totalPlaces": len(places_meta),
            "totalResolvedReferences": resolved_refs,
            "totalRawReferences": total_raw_refs,
            "unresolvedCount": len(unresolved),
        },
        "placesByVerse": places_by_verse,
        "versesByPlace": verses_by_place,
        "places": places_meta,
    }
    with open(OUTPUT_PATH, "w", encoding="utf-8") as f:
        json.dump(output, f, ensure_ascii=False, separators=(",", ":"))

    import os
    size_kb = os.path.getsize(OUTPUT_PATH) / 1024
    print()
    print(f"Geschrieben: {OUTPUT_PATH} ({size_kb:.0f} KB)")


if __name__ == "__main__":
    main()
