"""
Build-Zeit-Skript: erzeugt timeReferenceIndex.json aus der Zuercher-Bibel-XML
selbst - ANDERS als bei Personen/Orten gibt es hier KEINE STEPBible-
Referenzdatei mit vorab disambiguierten Eintraegen. Zeitausdruecke werden
deshalb per Muster-Erkennung DIREKT aus dem deutschen Zuercher-Text 1931
extrahiert (s. Chat-Konsultation zu "Phase 1"): kein Lemma-/Strong's-/
Morphologie-Datensatz liegt vor, daher bewusst NICHT die Referenz-statt-
Text-Architektur der Personen-/Orte-Pipeline, sondern textbasierte Muster
MIT klar abgestuftem Vertrauen (s. CATEGORY-Kommentare unten).

Kategorien (bewusst NICHT "relativ/narrativ" wie "danach", "zuvor" - das
waere reines Text-Pattern-Matching ohne Diskursverstaendnis und wuerde
tausende kaum aussagekraeftige Treffer erzeugen, s. Chat-Begruendung):

- QUANTITATIVE: Zahl (Ziffer ODER ausgeschriebenes Wort) + Zeiteinheit,
  z. B. "vierzig Tage", "969 Jahre", "1 260 Tage" (Leerzeichen als
  Tausender-Trenner, im Zuercher-Text empirisch verifiziert).
- CALENDAR: Ordnungszahl + Zeiteinheit, z. B. "am siebenten Tag",
  "im ersten Monat".
- CYCLICAL: feste, kleine Woerterliste (Sabbat, Passa, Laubhuettenfest,
  Halljahr, Neumond, Versoehnungstag, Wochenfest).
- ETERNAL: feste, kleine Woerter-/Phrasenliste (ewig, immerdar, fuer immer,
  Ewigkeit, von Geschlecht zu Geschlecht).
- PROPHETIC: NICHT musterbasiert, sondern eine kleine, EINZELN gegen den
  Zuercher-Text VERIFIZIERTE Liste (analog zu den Versifikations-
  Sonderfaellen bei Personen/Orten) - "Zeit, Zeiten und eine halbe Zeit"
  (Daniel 7:25, 12:7, Offenbarung 12:14) laesst sich nicht ueber Zahl+
  Einheit erkennen (keine explizite Zahl im Text). Zusaetzlich werden
  bestimmte quantitative Kombinationen (1260 Tage, 42 Monate, 70 Wochen,
  1000 Jahre), die im biblischen Kontext praktisch IMMER apokalyptisch-
  symbolisch gemeint sind, per SYMBOLIC_QUANTITIES nachtraeglich als
  "prophetic"/isSymbolic markiert statt als gewoehnliche Quantitaet.

WICHTIG (s. Anfrage "nicht alles kuenstlich normalisieren"): es gibt
bewusst KEINE automatische Umrechnung in eine gemeinsame Einheit (z. B.
Jahre -> Tage). `quantity`/`unit` spiegeln exakt das im Text erkannte
Zahlwort/die Einheit - mehr nicht.
"""
import json
import re
import xml.etree.ElementTree as ET
from collections import Counter

BIBLE_XML_PATH = "/mnt/user-data/uploads/SF_2009-04-12_GER_ZUERCHER__ZUERCHER_BIBEL_1931_.xml"
OUTPUT_PATH = "/home/claude/pipeline/timeReferenceIndex.json"

# ============================================================================
# Deutsche Zahlwoerter: 1-999 + "tausend" werden PROGRAMMATISCH generiert,
# nicht von Hand aufgelistet - deutsche Zahlwoerter folgen einem
# regelmaessigen Kompositionsschema (Einer+"und"+Zehner, Hunderter+Rest),
# das sich zuverlaessig nachbilden laesst. Empirisch am Zuercher-Text
# verifiziert (u. a. "vierzig", "dreissig", "vierhundert", "969"/"950"/
# "175"/"120"/"430" als Ziffern - GEMISCHTE Schreibweise, deshalb muessen
# BEIDE Formen erkannt werden, s. Chat).
# ============================================================================

UNITS_1_9 = {
    "eins": 1, "ein": 1, "eine": 1,
    "zwei": 2, "drei": 3, "vier": 4, "fuenf": 5, "fünf": 5,
    "sechs": 6, "sieben": 7, "acht": 8, "neun": 9,
}
TEENS = {
    "zehn": 10, "elf": 11, "zwoelf": 12, "zwölf": 12, "dreizehn": 13,
    "vierzehn": 14, "fuenfzehn": 15, "fünfzehn": 15, "sechzehn": 16,
    "siebzehn": 17, "achtzehn": 18, "neunzehn": 19,
}
TENS = {
    "zwanzig": 20, "dreissig": 30, "dreißig": 30, "vierzig": 40,
    "fuenfzig": 50, "fünfzig": 50, "sechzig": 60, "siebzig": 70,
    "achtzig": 80, "neunzig": 90,
}
# Fuer Komposita (einundzwanzig etc.) - "eins" wird zu "ein", nicht dupliziert
UNIT_PREFIX = {
    "ein": 1, "zwei": 2, "drei": 3, "vier": 4, "fuenf": 5, "fünf": 5,
    "sechs": 6, "sieben": 7, "acht": 8, "neun": 9,
}


def generate_cardinal_words():
    """Baut ein Woerterbuch {Zahlwort: Wert} fuer 1-999 plus "tausend"."""
    words = {}
    words.update(UNITS_1_9)
    words.update(TEENS)
    words.update(TENS)

    # 21-99 (ausser Vielfache von 10): [Einer]und[Zehner]
    for tw, tv in TENS.items():
        for uw, uv in UNIT_PREFIX.items():
            words[f"{uw}und{tw}"] = tv + uv

    # 100-900 (Hunderter): [Einer]hundert (100 selbst: "hundert" ohne Praefix)
    hundreds = {"hundert": 100}
    for uw, uv in UNIT_PREFIX.items():
        hundreds[f"{uw}hundert"] = uv * 100
    words.update(hundreds)

    # 101-999: Hunderter + Rest (mit UND "hundertundeins" und ohne
    # "hunderteins" - beide Formen kommen in aelteren Texten vor)
    rest_words = {w: v for w, v in words.items() if 0 < v < 100}
    for hw, hv in hundreds.items():
        for rw, rv in rest_words.items():
            words[f"{hw}{rw}"] = hv + rv
            words[f"{hw}und{rw}"] = hv + rv

    words["tausend"] = 1000
    return words


CARDINAL_WORDS = generate_cardinal_words()

# ---- Ordnungszahlen (1.-31., deckt Kalendertag/-monat vollstaendig ab) ----
# Stamm OHNE Fallendung (e/en/er/es) - die Endung wird separat im Regex
# angehaengt. "siebent" (nicht nur "siebt") basiert auf empirischer Pruefung
# des Zuercher-Texts ("der siebente Tag", "des siebenten Monats").
ORDINAL_STEMS_1_19 = {
    1: "erst", 2: "zweit", 3: "dritt", 4: "viert", 5: "fuenft",
    6: "sechst", 7: "siebent", 8: "acht", 9: "neunt", 10: "zehnt",
    11: "elft", 12: "zwoelft", 13: "dreizehnt", 14: "vierzehnt",
    15: "fuenfzehnt", 16: "sechzehnt", 17: "siebzehnt", 18: "achtzehnt",
    19: "neunzehnt",
}
ORDINAL_TENS_STEMS = {20: "zwanzigst", 30: "dreissigst"}
UNIT_PREFIX_ASCII = {
    "ein": 1, "zwei": 2, "drei": 3, "vier": 4, "fuenf": 5,
    "sechs": 6, "sieben": 7, "acht": 8, "neun": 9,
}


def generate_ordinal_stems():
    stems = dict(ORDINAL_STEMS_1_19)
    for base, stem in ORDINAL_TENS_STEMS.items():
        stems[base] = stem
        for uw, uv in UNIT_PREFIX_ASCII.items():
            if base + uv <= 31:
                stems[base + uv] = f"{uw}und{stem}"
    return stems


ORDINAL_STEMS = generate_ordinal_stems()

# ---- Zeiteinheiten: Regex-Fragment -> kanonischer Name + Singular/Plural
# fuer die Anzeige. "N[äa]chte?n?" deckt sowohl "Nacht" als auch die
# (in ae-Schreibweise moegliche) Umschrift ab.
TIME_UNITS = [
    (r"Tage?n?s?", "Tag", "Tag", "Tage"),
    (r"Jahre?n?s?", "Jahr", "Jahr", "Jahre"),
    (r"Monate?n?s?", "Monat", "Monat", "Monate"),
    (r"Wochen?", "Woche", "Woche", "Wochen"),
    (r"Stunden?", "Stunde", "Stunde", "Stunden"),
    (r"N[äa]chte?n?", "Nacht", "Nacht", "Nächte"),
]
UNIT_ALTERNATION = "|".join(f"(?:{pat})" for pat, *_ in TIME_UNITS)
UNIT_CANONICAL = {pat: (canon, sing, plur) for pat, canon, sing, plur in TIME_UNITS}

# ---- Kombinierte Zahl-Alternation: Zahlwoerter (laengste zuerst, damit
# Komposita vor ihren Praefixen greifen) ODER Ziffern (inkl. "1 260" mit
# Leerzeichen als Tausender-Trenner, empirisch verifiziert). ----
_cardinal_words_sorted = sorted(CARDINAL_WORDS.keys(), key=len, reverse=True)
NUMBER_WORD_PATTERN = "|".join(re.escape(w) for w in _cardinal_words_sorted)
DIGIT_PATTERN = r"\d{1,4}(?: \d{3})?"

QUANTITATIVE_RE = re.compile(
    rf"(?<![\wäöüÄÖÜ])(?P<num>{NUMBER_WORD_PATTERN}|{DIGIT_PATTERN})\s+"
    rf"(?P<unit>{UNIT_ALTERNATION})\b",
    re.IGNORECASE,
)

_ordinal_stems_sorted = sorted(ORDINAL_STEMS.items(), key=lambda kv: -len(kv[1]))
ORDINAL_PATTERN = "|".join(re.escape(stem) for _, stem in _ordinal_stems_sorted)
ORDINAL_STEM_TO_VALUE = {stem: val for val, stem in ORDINAL_STEMS.items()}

CALENDAR_RE = re.compile(
    rf"(?<![\wäöüÄÖÜ])(?P<ord>{ORDINAL_PATTERN})(?:e|en|er|es)\s+"
    rf"(?P<unit>{UNIT_ALTERNATION})\b",
    re.IGNORECASE,
)

# ---- CYCLICAL: feste, kleine Woerterliste (empirisch am Zuercher-Text
# verifiziert: "Sabbattag(es)", "Passa(feier)", "Laubhuettenfest",
# "Halljahr" - NICHT "Jubeljahr", das Zuercher 1931 nicht verwendet -,
# "Neumond", "Versoehnungstag", "Wochenfest"). Anzeigename EXPLIZIT
# angegeben (nicht aus der Regex abgeleitet) - ein frueherer Versuch, ihn
# per String-Split aus dem Pattern zu gewinnen, brach bei Patterns mit
# Zeichenklasse MITTEN im Wort (z. B. "Vers[öo]hnungstag" -> faelschlich
# nur "Vers"), s. Chat. ----
CYCLICAL_TERMS = [
    ("sabbat", r"Sabbat[a-zäöüß]*", "Sabbat"),
    ("passa", r"Passa[a-zäöüß]*", "Passa"),
    ("laubhuettenfest", r"Laubh[üu]ttenfest[a-zäöüß]*", "Laubhüttenfest"),
    ("halljahr", r"Halljahr[a-zäöüß]*", "Halljahr"),
    ("neumond", r"Neumond[a-zäöüß]*", "Neumond"),
    ("versoehnungstag", r"Vers[öo]hnungstag[a-zäöüß]*", "Versöhnungstag"),
    ("wochenfest", r"Wochenfest[a-zäöüß]*", "Wochenfest"),
]

# ---- ETERNAL: feste Woerter-/Phrasenliste. "ewig" fasst alle Flexionen/
# Ableitungen (ewige, ewigen, ewiglich, Ewigkeit) unter EINER Entity
# zusammen - unterschiedliche Formen desselben Begriffs, kein eigener
# Begriff (anders als bei "fuer immer"/"immerdar", die eigene Woerter sind). --
ETERNAL_TERMS = [
    ("ewig", r"[Ee]wig(?:e|es|er|en|lich|keit)?"),
    ("fuer_immer", r"[Ff]ür immer"),
    ("immerdar", r"[Ii]mmerdar"),
    ("allezeit", r"[Aa]llezeit"),
    ("geschlecht_zu_geschlecht", r"Geschlecht zu Geschlecht"),
]

# ---- PROPHETIC: NICHT musterbasiert - einzeln verifizierte Stellen. ----
PROPHETIC_ENTRIES = {
    "zeit_zeiten_halbe_zeit": {
        "displayName": "Zeit, Zeiten und eine halbe Zeit",
        "refs": [("Daniel", 7, 25), ("Daniel", 12, 7), ("Revelation", 12, 14)],
    },
    # "Siebzig (Jahr-)Wochen" - die eingeschobene Klammer-Anmerkung
    # "(Jahr-)" im Zuercher-Text zwischen Zahl und Einheit bricht die vom
    # QUANTITATIVE_RE vorausgesetzte direkte Zahl-Einheit-Adjazenz, das
    # regulaere Muster findet diese prominente Stelle deshalb NICHT -
    # empirisch am Text geprueft und deshalb hier wie bei den
    # Versifikations-Sonderfaellen der Personen-/Orte-Pipeline hand-
    # kuratiert nachgetragen statt versucht, das Muster fuer diesen einen
    # Fall zu verkomplizieren.
    "siebzig_wochen": {
        "displayName": "Siebzig Wochen",
        "refs": [("Daniel", 9, 24)],
    },
}

# Quantitative Treffer, die im biblischen Kontext praktisch IMMER
# apokalyptisch-symbolisch gemeint sind - werden NACHTRAEGLICH als
# "prophetic"/isSymbolic markiert statt als gewoehnliche Quantitaet
# (s. Modulkommentar oben). (quantity, unit) -> True.
SYMBOLIC_QUANTITIES = {(1260, "Tag"), (42, "Monat"), (70, "Woche"), (1000, "Jahr")}


def load_zuercher_verses(path):
    """Liefert [(book, chapter, verse, text), ...] fuer ALLE Verse -
    Fussnoten-Querverweise ("(a) ...") werden VORHER entfernt, damit sie
    keine Zahl-Einheit-Treffer verunreinigen (z. B. "(a) 2Mo 1:13; 12:40"
    - die "12:40" darin ist kein Zeitausdruck). Gleiche Grundidee wie
    extractCrossRefTargets in script.js, hier nur zum Entfernen statt
    Extrahieren genutzt."""
    tree = ET.parse(path)
    root = tree.getroot()
    footnote_re = re.compile(r"\([a-z]\)\s*[^()]+")
    verses = []
    for book in root.findall("BIBLEBOOK"):
        bname = book.get("bname")
        for chapter in book.findall("CHAPTER"):
            cnum = int(chapter.get("cnumber"))
            for v in chapter.findall("VERS"):
                vnum = int(v.get("vnumber"))
                text = footnote_re.sub("", v.text or "")
                verses.append((bname, cnum, vnum, text))
    return verses


def parse_number_token(token):
    low = token.lower()
    if low in CARDINAL_WORDS:
        return CARDINAL_WORDS[low]
    digits = token.replace(" ", "")
    if digits.isdigit():
        return int(digits)
    return None


def unit_display(canon, quantity):
    _, sing, plur = next((c, s, p) for _, c, s, p in TIME_UNITS if c == canon)
    return sing if quantity == 1 else plur


def main():
    print("Lade Zuercher-Bibel-XML ...")
    verses = load_zuercher_verses(BIBLE_XML_PATH)
    print(f"  {len(verses)} Verse geladen")

    verses_by_time = {}
    times_meta = {}
    # Sammelt pro Entity ALLE tatsaechlich im Text vorkommenden Schreib-
    # weisen (z. B. sowohl "40 Tage" als auch "vierzig Tage" fuer dieselbe
    # Entity q_40_Tag) - der displayName ist IMMER die Ziffernform (s.
    # unit_display), aber die Namens-Pille im Kapiteltext (s. main.js/
    # highlightPersonName) muss die tatsaechliche Textform wiederfinden,
    # nicht nur die kanonische Anzeige. Ohne das wuerde z. B. "vierzig
    # Tage" im Fliesstext NIE eine Pille bekommen, obwohl die Entity
    # "40 Tage" heisst und den Vers correct zugeordnet bekommt.
    surface_forms_by_entity = {}

    def add_hit(entity_id, meta_builder, book, chapter, verse, surface_text=None):
        bucket = verses_by_time.setdefault(entity_id, [])
        # Dedup: derselbe Vers soll nicht mehrfach in derselben Entity
        # auftauchen (z. B. bei zwei Zahlformaten im selben Satz).
        entry = {"book": book, "chapter": chapter, "verse": verse}
        if entry not in bucket:
            bucket.append(entry)
        if entity_id not in times_meta:
            times_meta[entity_id] = meta_builder()
        if surface_text:
            surface_forms_by_entity.setdefault(entity_id, set()).add(surface_text)

    quant_count = 0
    cal_count = 0
    cyc_count = 0
    eternal_count = 0

    for book, chapter, verse, text in verses:
        # ---- QUANTITATIVE ----
        for m in QUANTITATIVE_RE.finditer(text):
            qty = parse_number_token(m.group("num"))
            if qty is None:
                continue
            unit_raw = m.group("unit")
            canon = next(
                c for pat, c, *_ in TIME_UNITS if re.fullmatch(pat, unit_raw, re.IGNORECASE)
            )
            is_symbolic = (qty, canon) in SYMBOLIC_QUANTITIES
            category = "prophetic" if is_symbolic else "quantitative"
            entity_id = f"q_{qty}_{canon}"

            def _builder(qty=qty, canon=canon, is_symbolic=is_symbolic, category=category):
                return {
                    "displayName": f"{qty} {unit_display(canon, qty)}",
                    "category": category,
                    "quantity": qty,
                    "unit": canon,
                    "isSymbolic": is_symbolic,
                }

            add_hit(entity_id, _builder, book, chapter, verse, surface_text=m.group(0))
            quant_count += 1

        # ---- CALENDAR ----
        for m in CALENDAR_RE.finditer(text):
            ord_stem = m.group("ord").lower()
            ord_val = ORDINAL_STEM_TO_VALUE.get(ord_stem)
            if ord_val is None:
                continue
            unit_raw = m.group("unit")
            canon = next(
                c for pat, c, *_ in TIME_UNITS if re.fullmatch(pat, unit_raw, re.IGNORECASE)
            )
            entity_id = f"c_{ord_val}_{canon}"

            def _builder(ord_val=ord_val, canon=canon):
                return {
                    "displayName": f"{ord_val}. {canon}",
                    "category": "calendar",
                    "quantity": ord_val,
                    "unit": canon,
                    "isSymbolic": False,
                }

            add_hit(entity_id, _builder, book, chapter, verse, surface_text=m.group(0))
            cal_count += 1

        # ---- CYCLICAL ----
        for slug, pattern, label in CYCLICAL_TERMS:
            m = re.search(pattern, text)
            if m:
                entity_id = f"cyc_{slug}"

                def _builder(label=label):
                    return {
                        "displayName": label,
                        "category": "cyclical",
                        "quantity": None,
                        "unit": None,
                        "isSymbolic": False,
                    }

                add_hit(entity_id, _builder, book, chapter, verse, surface_text=m.group(0))
                cyc_count += 1

        # ---- ETERNAL ----
        for slug, pattern in ETERNAL_TERMS:
            m = re.search(pattern, text)
            if m:
                entity_id = f"et_{slug}"
                label = {
                    "ewig": "ewig",
                    "fuer_immer": "für immer",
                    "immerdar": "immerdar",
                    "allezeit": "allezeit",
                    "geschlecht_zu_geschlecht": "von Geschlecht zu Geschlecht",
                }[slug]

                def _builder(label=label):
                    return {
                        "displayName": label,
                        "category": "eternal",
                        "quantity": None,
                        "unit": None,
                        "isSymbolic": False,
                    }

                add_hit(entity_id, _builder, book, chapter, verse, surface_text=m.group(0))
                eternal_count += 1

    # ---- PROPHETIC (hand-kuratiert, s. Modulkommentar) ----
    # Bewusst OHNE surfaceForms: die tatsaechliche Formulierung variiert
    # zwischen den Stellen (u. a. eingeschobene Klammer-Anmerkungen wie
    # "(zwei)"/"(Jahr-)") und waere als woertlicher Pillen-Text ohnehin
    # nicht robust - diese 5 Entities bekommen dadurch keine Namens-Pille
    # im Kapiteltext, der Sprung zum Vers ueber das Dropdown funktioniert
    # aber unveraendert.
    for slug, info in PROPHETIC_ENTRIES.items():
        entity_id = f"pr_{slug}"
        times_meta[entity_id] = {
            "displayName": info["displayName"],
            "category": "prophetic",
            "quantity": None,
            "unit": None,
            "isSymbolic": True,
        }
        verses_by_time[entity_id] = [
            {"book": b, "chapter": c, "verse": v} for b, c, v in info["refs"]
        ]

    # surfaceForms aus den gesammelten Sets in times_meta uebernehmen
    # (sortiert nach Laenge absteigend - konsistent mit der Sortierung, die
    # highlightPersonName im Frontend fuer die Regex-Alternation erwartet).
    for entity_id, forms in surface_forms_by_entity.items():
        if entity_id in times_meta:
            times_meta[entity_id]["surfaceForms"] = sorted(forms, key=len, reverse=True)
    for entity_id, meta in times_meta.items():
        meta.setdefault("surfaceForms", [])

    # count je Entity nachtragen
    for entity_id, meta in times_meta.items():
        meta["count"] = len(verses_by_time.get(entity_id, []))

    # Leere Entities (sollte nicht vorkommen) aussortieren
    times_meta = {k: v for k, v in times_meta.items() if v["count"] > 0}
    verses_by_time = {k: v for k, v in verses_by_time.items() if k in times_meta}

    print()
    print(f"Quantitative Treffer (roh): {quant_count}")
    print(f"Calendar Treffer (roh): {cal_count}")
    print(f"Cyclical Treffer (roh): {cyc_count}")
    print(f"Eternal Treffer (roh): {eternal_count}")
    print(f"Prophetic Entities (hand-kuratiert): {len(PROPHETIC_ENTRIES)}")
    print(f"Eindeutige Zeit-Entities gesamt: {len(times_meta)}")

    by_category = Counter(m["category"] for m in times_meta.values())
    print(f"Nach Kategorie: {dict(by_category)}")

    symbolic_count = sum(1 for m in times_meta.values() if m["isSymbolic"])
    print(f"Als symbolisch markiert: {symbolic_count}")

    # Top 15 nach Haeufigkeit, zur Stichprobenkontrolle
    top = sorted(times_meta.items(), key=lambda kv: -kv[1]["count"])[:15]
    print("\nTop 15 haeufigste Zeit-Entities:")
    for entity_id, meta in top:
        print(f"   {meta['displayName']!r:30s} ({meta['category']:12s}) count={meta['count']}")

    output = {
        "meta": {
            "totalEntities": len(times_meta),
            "byCategory": dict(by_category),
            "symbolicCount": symbolic_count,
        },
        "versesByTime": verses_by_time,
        "times": times_meta,
    }

    import os
    os.makedirs(os.path.dirname(OUTPUT_PATH), exist_ok=True)
    with open(OUTPUT_PATH, "w", encoding="utf-8") as f:
        json.dump(output, f, ensure_ascii=False, separators=(",", ":"))

    size_kb = os.path.getsize(OUTPUT_PATH) / 1024
    print(f"\nGeschrieben: {OUTPUT_PATH} ({size_kb:.0f} KB)")


if __name__ == "__main__":
    main()
