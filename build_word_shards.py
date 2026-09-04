#!/usr/bin/env python3
"""
build_word_shards.py — teilt wordReferenceIndex.json (~27 MB) in
  * wordIndex.json      - nur Lemma/Wortart/Haeufigkeit (fuer die Liste)
  * wordVerses/NN.json  - Versreferenzen + surfaceForms, in Schnipseln
auf.

WARUM: Die Wortliste in der Sidebar braucht pro Eintrag nur drei Angaben
(displayName, pos, count). Die Vers-Referenzen - mit Abstand der groesste
Teil der Datei - werden dagegen nur fuer die HOECHSTENS VIER gleichzeitig
angepinnten bzw. aufgeklappten Eintraege gebraucht. Bisher wurden fuer
diese vier Eintraege die Verse ALLER ~26.000 Woerter geladen.

SHARDING statt einer Datei pro Wort: 26.000 Einzeldateien waeren fuer
Server und Browser-Cache unangenehm (und jeder Pin ein eigener Request mit
vollem Latenz-Overhead). Stattdessen SHARD_COUNT feste Schnipsel; beim
Anpinnen wird genau der eine Schnipsel geladen, der das Wort enthaelt.
Nebeneffekt: wer mehrere Woerter anpinnt, trifft haeufig einen schon
geladenen Schnipsel.

Die Zuordnung Wort -> Schnipsel MUSS im Frontend identisch nachgebildet
werden (s. wordShardFor() in script.js) - deshalb bewusst eine denkbar
simple, sprach-unabhaengige Hashfunktion (Summe der UTF-16-Code-Units
modulo SHARD_COUNT) statt etwas Ausgefeilterem: sie ist in Python und
JavaScript trivial identisch zu halten. Wichtig ist nur gleichmaessige
Verteilung, nicht kryptografische Qualitaet.
"""

import json
import os

INPUT_PATH = "wordReferenceIndex.json"
INDEX_PATH = "wordIndex.json"
SHARD_DIR = "wordVerses"
SHARD_COUNT = 64


def shard_for(word_id):
    """MUSS identisch zu wordShardFor() in script.js sein.

    Python-`ord` liefert Unicode-Codepoints, JavaScripts `charCodeAt`
    UTF-16-Code-Units. Fuer alle hier vorkommenden Zeichen (deutsche
    Lemmata inkl. Umlauten, ASCII-Wortarten) sind beide identisch, da
    nichts ausserhalb der BMP vorkommt.
    """
    total = 0
    for ch in word_id:
        total = (total + ord(ch)) % SHARD_COUNT
    return total


def main():
    data = json.load(open(INPUT_PATH, encoding="utf-8"))
    words = data["words"]
    verses_by_word = data["versesByWord"]
    print(f"Gelesen: {len(words)} Entities aus {INPUT_PATH}")

    # ---- schlanke Liste ------------------------------------------------
    slim = {}
    for word_id, meta in words.items():
        slim[word_id] = {
            "displayName": meta["displayName"],
            "pos": meta["pos"],
            "count": meta["count"],
        }

    index_output = {
        "meta": {
            **data.get("meta", {}),
            "shardCount": SHARD_COUNT,
            "shardDir": SHARD_DIR,
            "note": "Nur Listendaten. Verse/surfaceForms liegen in wordVerses/NN.json.",
        },
        "words": slim,
    }
    with open(INDEX_PATH, "w", encoding="utf-8") as f:
        json.dump(index_output, f, ensure_ascii=False, separators=(",", ":"))

    # ---- Vers-Schnipsel -------------------------------------------------
    os.makedirs(SHARD_DIR, exist_ok=True)
    shards = {i: {} for i in range(SHARD_COUNT)}
    for word_id, meta in words.items():
        shards[shard_for(word_id)][word_id] = {
            # surfaceForms gehoeren zu den Detaildaten: gebraucht werden sie
            # nur fuer die Namens-Pille im Kapiteltext, also erst wenn das
            # Wort tatsaechlich angepinnt ist.
            "surfaceForms": meta.get("surfaceForms", []),
            "verses": verses_by_word.get(word_id, []),
        }

    for shard_id, content in shards.items():
        path = os.path.join(SHARD_DIR, f"{shard_id}.json")
        with open(path, "w", encoding="utf-8") as f:
            json.dump(content, f, ensure_ascii=False, separators=(",", ":"))

    index_mb = os.path.getsize(INDEX_PATH) / 1048576
    shard_sizes = [
        os.path.getsize(os.path.join(SHARD_DIR, f"{i}.json")) for i in range(SHARD_COUNT)
    ]
    original_mb = os.path.getsize(INPUT_PATH) / 1048576

    print(f"{INDEX_PATH}: {index_mb:.2f} MB")
    print(
        f"{SHARD_DIR}/: {SHARD_COUNT} Dateien, "
        f"Ø {sum(shard_sizes)/len(shard_sizes)/1024:.0f} KB, "
        f"max {max(shard_sizes)/1024:.0f} KB"
    )
    print(f"Zum Vergleich - bisher beim Start geladen: {original_mb:.2f} MB")


if __name__ == "__main__":
    main()
