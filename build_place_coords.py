#!/usr/bin/env python3
"""
build_place_coords.py — ergaenzt placeReferenceIndex.json um Koordinaten,
fuer die neue "Karte"-Darstellung (dritter Modus neben Boegen/Grid).

Datenquelle: OpenBible.info "Bible-Geocoding-Data"
(https://github.com/openbibleinfo/Bible-Geocoding-Data), CC-BY-4.0,
Dateien ancient.jsonl / modern.jsonl / source.jsonl.

WARUM DIESE QUELLE UND WIE DAS MATCHING FUNKTIONIERT:
Unsere placeReferenceIndex.json wurde aus STEPBibles TIPNR-System
("Translators Individualised Proper Names with all References") gebaut -
jeder Schluessel hat die Form "<Name>@<ErsterBibelvers-...>", z. B.
"Abdon@Jos.19.28-1Ch". OpenBible.info verlinkt viele seiner "ancient
places" ebenfalls auf TIPNR (linked_data-Quelle "Translators
Individualised Proper Names with all References", s. source.jsonl) - mit
demselben "<Name>@<Vers>"-Namensschema, ABER nicht zwingend demselben
Referenzvers (Versifikationsunterschiede/andere ausgewaehlte
Erst-Erwaehnung). Der NAME-Teil (vor dem "@") ist trotzdem stabil genug
fuers Matching - empirisch verifiziert: von 947 eindeutigen Namen in
unserer Datei fanden sich 864 (91%) unter denselben Namen im TIPNR-
verlinkten Teil von OpenBible.info, davon wiederum 886/891 (99.4%) mit
tatsaechlich aufloesbaren Koordinaten.

AUSWAHL DER "BESTEN" KOORDINATE PRO ORT:
Ein "ancient place" kann mehrere `identifications` haben (verschiedene
vorgeschlagene moderne Identifikationen), jede mit mehreren `resolutions`
(verschiedene Aufloesungspfade zur selben oder verschiedenen Koordinate).
Wir waehlen die Aufloesung mit dem hoechsten kombinierten Score aus
identification.score.time_total (Vertrauen in die Identifikation) +
resolution.best_path_score (Vertrauen in den Aufloesungspfad) - beides
laut Datensatz-Dokumentation Werte auf einer Skala bis ~1000, ein Wert
von 500+ gilt dort als hohes Vertrauen. Das ist eine bewusst einfache
Heuristik (Summe statt z. B. gewichteter Multiplikation) - reicht aber
aus, um bei den ueberwiegend eindeutigen/unstrittigen Orten (Hauptstaedte,
grosse Fluesse etc.) zuverlaessig die Hauptidentifikation zu waehlen.

AUSGABE: placeCoordinates.json mit NUR den erfolgreich aufgeloesten
Koordinaten, referenziert ueber UNSERE placeReferenceIndex.json-IDs (nicht
ueber OpenBible.info-eigene IDs) - so bleibt die App-Seite denkbar
einfach: ein Lookup von unserer Orts-ID auf {lat, lon}, sonst nichts.
Orte ohne Koordinate (unresolvierbar/unbekannt/zu unsicher) tauchen im
Output schlicht nicht auf - die bestehende Listenansicht bleibt fuer sie
weiterhin die einzige Fundstelle.
"""

import json

PLACES_PATH = "placeReferenceIndex.json"
ANCIENT_PATH = "ancient.jsonl"
SOURCE_PATH = "source.jsonl"
OUTPUT_PATH = "placeCoordinates.json"

# Der friendly_id-Wert in source.jsonl, der zur TIPNR-Quelle gehoert -
# wird zur Laufzeit aus source.jsonl aufgeloest (die interne Quellen-ID
# wie "s3b25cf" ist nicht stabil garantiert, der Anzeigename schon eher).
TIPNR_SOURCE_DISPLAY_NAME = "Translators Individualised Proper Names with all References"


def load_tipnr_source_id():
    with open(SOURCE_PATH, encoding="utf-8") as f:
        for line in f:
            obj = json.loads(line)
            if obj.get("display_name") == TIPNR_SOURCE_DISPLAY_NAME:
                return obj["id"]
    raise RuntimeError("TIPNR-Quelle nicht in source.jsonl gefunden - Datensatz-Struktur geaendert?")


def best_resolution(ancient_obj):
    """
    Waehlt die Aufloesung (identification+resolution) mit dem hoechsten
    kombinierten Score, die tatsaechlich eine `lonlat` hat (s. Modul-
    kommentar). Gibt None zurueck, wenn keine Identification/Resolution
    eine Koordinate liefert (z. B. nur "special"-Aufloesungen wie
    unknown_place/multiple_locations).
    """
    best = None
    best_score = -1
    for ident in ancient_obj.get("identifications", []):
        ident_score = (ident.get("score") or {}).get("time_total", 0) or 0
        for res in ident.get("resolutions", []):
            lonlat = res.get("lonlat")
            if not lonlat:
                continue
            path_score = res.get("best_path_score", 0) or 0
            combined = ident_score + path_score
            if combined > best_score:
                best_score = combined
                lon_str, lat_str = lonlat.split(",")
                best = {
                    "lon": round(float(lon_str), 5),
                    "lat": round(float(lat_str), 5),
                    "precision": res.get("lonlat_type"),
                    "confidence": combined,
                }
    return best


def main():
    tipnr_source_id = load_tipnr_source_id()
    print(f"TIPNR-Quellen-ID in diesem Datensatz: {tipnr_source_id}")

    # OpenBible.info-Ortsname (TIPNR-Namensteil vor "@") -> beste Koordinate.
    # Bei mehreren OpenBible.info-Eintraegen mit demselben TIPNR-Namen
    # (sollte selten sein) gewinnt schlicht der zuerst gefundene - eine
    # Fein-Disambiguierung waere nur mit vollem Versabgleich moeglich, was
    # angesichts der Versifikationsunterschiede (s. Modulkommentar) ohnehin
    # nicht zuverlaessig waere.
    coords_by_name = {}
    total_tipnr_linked = 0
    with open(ANCIENT_PATH, encoding="utf-8") as f:
        for line in f:
            obj = json.loads(line)
            ld = obj.get("linked_data", {})
            tipnr = ld.get(tipnr_source_id)
            if not tipnr or "id" not in tipnr:
                continue
            total_tipnr_linked += 1
            name = tipnr["id"].split("@")[0]
            if name in coords_by_name:
                continue
            resolution = best_resolution(obj)
            if resolution:
                coords_by_name[name] = resolution

    print(f"OpenBible.info-Orte mit TIPNR-Verlinkung: {total_tipnr_linked}")
    print(f"...davon mit aufloesbarer Koordinate: {len(coords_by_name)}")

    places = json.load(open(PLACES_PATH, encoding="utf-8"))["places"]
    print(f"Unsere Orte insgesamt: {len(places)}")

    matched = {}
    for place_id, meta in places.items():
        tipnr_name = place_id.split("@")[0]
        coord = coords_by_name.get(tipnr_name)
        if coord:
            matched[place_id] = {
                "lat": coord["lat"],
                "lon": coord["lon"],
                "precision": coord["precision"],
            }

    print(f"Unsere Orte MIT zugeordneter Koordinate: {len(matched)} ({len(matched) / len(places):.0%})")

    output = {
        "meta": {
            "source": "OpenBible.info Bible-Geocoding-Data",
            "sourceUrl": "https://github.com/openbibleinfo/Bible-Geocoding-Data",
            "sourceLicense": "CC-BY-4.0",
            "matchedPlaces": len(matched),
            "totalPlaces": len(places),
        },
        "coordinates": matched,
    }

    with open(OUTPUT_PATH, "w", encoding="utf-8") as f:
        json.dump(output, f, ensure_ascii=False, separators=(",", ":"))

    print(f"Geschrieben: {OUTPUT_PATH}")


if __name__ == "__main__":
    main()
