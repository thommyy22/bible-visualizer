#!/usr/bin/env python3
"""
build_world_borders.py — wandelt Natural-Earth-Laendergrenzen (GeoJSON)
in ein kompaktes Polylinien-Format fuer die 3D-Globe um.

Quelle: Natural Earth (ne_110m_admin_0_countries), Public Domain
(https://www.naturalearthdata.com/about/terms-of-use/) - via
https://github.com/nvkelso/natural-earth-vector.

WARUM VORVERARBEITEN statt das GeoJSON direkt im Browser zu laden:
- Das Original ist ~840 KB, enthaelt aber fuer unseren Zweck nur Ballast:
  ~90 Attributfelder pro Land (Bevoelkerung, ISO-Codes, Wikidata-IDs...),
  die die Globe nie anfasst - sie zeichnet ausschliesslich die Umrisse.
- Die Koordinaten liegen mit bis zu 14 Nachkommastellen vor. Bei einer
  Kugel von wenigen hundert Bildschirmpixeln Durchmesser sind schon 2
  Nachkommastellen (~1 km Genauigkeit am Aequator) weit unterhalb der
  Sichtbarkeitsschwelle - der Rest ist reine Dateigroesse.
- Ergebnis: ein flaches Array von Polylinien (jede eine Liste von
  [lon, lat]-Paaren), das die Globe direkt in Three.js-Liniengeometrie
  ueberfuehren kann, ohne GeoJSON-Struktur (Feature/Geometry/Polygon/
  Ring-Verschachtelung) zur Laufzeit aufloesen zu muessen.

Polygon vs. MultiPolygon: Natural Earth liefert beides (Inselstaaten als
MultiPolygon). Beide werden zu derselben flachen Ring-Liste normalisiert -
fuer eine reine UMRISS-Darstellung ist die Unterscheidung "aeusserer Ring
vs. Loch" irrelevant (ein Loch, z. B. Lesotho in Suedafrika, soll als
Linie ohnehin genauso gezeichnet werden wie eine Aussengrenze).
"""

import json

INPUT_PATH = "ne_countries.geojson"
OUTPUT_PATH = "borders.json"
COORD_PRECISION = 2


def rings_from_geometry(geometry):
    """Normalisiert Polygon UND MultiPolygon zu einer flachen Ring-Liste."""
    gtype = geometry["type"]
    if gtype == "Polygon":
        return geometry["coordinates"]
    if gtype == "MultiPolygon":
        rings = []
        for polygon in geometry["coordinates"]:
            rings.extend(polygon)
        return rings
    return []


def main():
    data = json.load(open(INPUT_PATH, encoding="utf-8"))

    polylines = []
    for feature in data["features"]:
        for ring in rings_from_geometry(feature["geometry"]):
            # Auf COORD_PRECISION runden und direkt aufeinanderfolgende
            # Duplikate entfernen, die durch das Runden entstehen koennen
            # (zwei urspruenglich minimal verschiedene Punkte fallen auf
            # dieselbe gerundete Koordinate zusammen) - sie wuerden sonst
            # Null-Laengen-Segmente erzeugen.
            simplified = []
            for lon, lat in ring:
                point = [round(lon, COORD_PRECISION), round(lat, COORD_PRECISION)]
                if simplified and simplified[-1] == point:
                    continue
                simplified.append(point)
            # Ein Ring mit weniger als 2 verbleibenden Punkten ergibt keine
            # zeichenbare Linie.
            if len(simplified) >= 2:
                polylines.append(simplified)

    total_points = sum(len(p) for p in polylines)

    # Bewusst ein FLACHES Array von Ringen (kein {meta, polylines}-Wrapper):
    # die Globe braucht zur Laufzeit ausschliesslich die Geometrie, und
    # buildBorderLines() in script.js erwartet genau diese Form. Die
    # Herkunfts-/Lizenzangabe (Natural Earth, Public Domain) steht im
    # Modulkommentar oben sowie im PROJEKTSTAND - sie in JEDE geladene
    # Datei zu schreiben waere hier nur Ballast im Netzwerk-Payload.
    # [lon, lat]-Reihenfolge beibehalten (GeoJSON-Konvention) - die Globe
    # rechnet per latLonToVector3(lat, lon) um und liest die Paare
    # entsprechend.
    with open(OUTPUT_PATH, "w", encoding="utf-8") as f:
        json.dump(polylines, f, separators=(",", ":"))

    print(f"Polylinien: {len(polylines)}, Punkte gesamt: {total_points}")
    print(f"Geschrieben: {OUTPUT_PATH}")


if __name__ == "__main__":
    main()
