// ========================================================================
// Hinweis zu Abhaengigkeiten: Die "Karte"-Ansicht nutzt MapLibre GL JS,
// das als klassisches UMD-Bundle VOR dieser Datei eingebunden wird (s.
// index.html) und dadurch als globales `maplibregl` bereitsteht - kein
// ES-Modul-Import noetig. Die frueheren Three.js-/OrbitControls-Imports
// sind entfallen, seit die selbst gebaute 3D-Kugel durch die echte
// Vektor-Karte ersetzt wurde (s. mapView.js-Abschnitt weiter unten).
// ========================================================================

// ========================================================================
// bookMap.js — reine Daten
// ========================================================================

const bookOrder = [
  "Genesis",
  "Exodus",
  "Leviticus",
  "Numbers",
  "Deuteronomy",
  "Joshua",
  "Judges",
  "Ruth",
  "1 Samuel",
  "2 Samuel",
  "1 Kings",
  "2 Kings",
  "1 Chronicles",
  "2 Chronicles",
  "Ezra",
  "Nehemiah",
  "Esther",
  "Job",
  "Psalm",
  "Proverbs",
  "Ecclesiastes",
  "Song of Solomon",
  "Isaiah",
  "Jeremiah",
  "Lamentations",
  "Ezekiel",
  "Daniel",
  "Hosea",
  "Joel",
  "Amos",
  "Obadiah",
  "Jonah",
  "Micah",
  "Nahum",
  "Habakkuk",
  "Zephaniah",
  "Haggai",
  "Zechariah",
  "Malachi",
  "Matthew",
  "Mark",
  "Luke",
  "John",
  "Acts",
  "Romans",
  "1 Corinthians",
  "2 Corinthians",
  "Galatians",
  "Ephesians",
  "Philippians",
  "Colossians",
  "1 Thessalonians",
  "2 Thessalonians",
  "1 Timothy",
  "2 Timothy",
  "Titus",
  "Philemon",
  "Hebrews",
  "James",
  "1 Peter",
  "2 Peter",
  "1 John",
  "2 John",
  "3 John",
  "Jude",
  "Revelation",
];

const shortToFull = {
  "1Mo": "Genesis",
  "1.Mo": "Genesis",
  "1M": "Genesis",
  "2Mo": "Exodus",
  "2.Mo": "Exodus",
  "2M": "Exodus",
  "3Mo": "Leviticus",
  "3.Mo": "Leviticus",
  "3M": "Leviticus",
  "4Mo": "Numbers",
  "4.Mo": "Numbers",
  "4M": "Numbers",
  "5Mo": "Deuteronomy",
  "5.Mo": "Deuteronomy",
  "5M": "Deuteronomy",
  Jos: "Joshua",
  Ri: "Judges",
  Jdg: "Judges",
  Rut: "Ruth",
  Ru: "Ruth",
  Rth: "Ruth",
  "1Sam": "1 Samuel",
  "1Sa": "1 Samuel",
  "1Sm": "1 Samuel",
  "2Sam": "2 Samuel",
  "2Sa": "2 Samuel",
  "2Sm": "2 Samuel",
  "1Kön": "1 Kings",
  "1Koe": "1 Kings",
  "1Kon": "1 Kings",
  "1Ki": "1 Kings",
  "1Kö": "1 Kings",
  "2Kön": "2 Kings",
  "2Koe": "2 Kings",
  "2Kon": "2 Kings",
  "2Ki": "2 Kings",
  "2Kö": "2 Kings",
  "1Chr": "1 Chronicles",
  "1Ch": "1 Chronicles",
  "2Chr": "2 Chronicles",
  "2Ch": "2 Chronicles",
  Esr: "Ezra",
  Ezr: "Ezra",
  Neh: "Nehemiah",
  Ne: "Nehemiah",
  Est: "Esther",
  Hi: "Job",
  Hiob: "Job",
  Ijob: "Job",
  Job: "Job",
  Ps: "Psalm",
  Psa: "Psalm",
  Spr: "Proverbs",
  Pr: "Proverbs",
  Pro: "Proverbs",
  Pred: "Ecclesiastes",
  Koh: "Ecclesiastes",
  Ecc: "Ecclesiastes",
  Hld: "Song of Solomon",
  Hoh: "Song of Solomon",
  Hhld: "Song of Solomon",
  Son: "Song of Solomon",
  Jes: "Isaiah",
  Isa: "Isaiah",
  Jer: "Jeremiah",
  Klgl: "Lamentations",
  Klg: "Lamentations",
  Lam: "Lamentations",
  Hes: "Ezekiel",
  Hesek: "Ezekiel",
  Ez: "Ezekiel",
  Eze: "Ezekiel",
  Dan: "Daniel",
  Da: "Daniel",
  Hos: "Hosea",
  Joe: "Joel",
  Joel: "Joel",
  Am: "Amos",
  Amo: "Amos",
  Obd: "Obadiah",
  Ob: "Obadiah",
  Oba: "Obadiah",
  Obadja: "Obadiah",
  Jon: "Jonah",
  Mi: "Micah",
  Mic: "Micah",
  Nah: "Nahum",
  Hab: "Habakkuk",
  Zef: "Zephaniah",
  Ze: "Zephaniah",
  Zep: "Zephaniah",
  Hag: "Haggai",
  Sach: "Zechariah",
  Zec: "Zechariah",
  Mal: "Malachi",
  Mt: "Matthew",
  Mat: "Matthew",
  Matth: "Matthew",
  Mk: "Mark",
  Mar: "Mark",
  Lk: "Luke",
  Luk: "Luke",
  Joh: "John",
  Apg: "Acts",
  Act: "Acts",
  Rö: "Romans",
  Roe: "Romans",
  Rom: "Romans",
  "1Kor": "1 Corinthians",
  "1Ko": "1 Corinthians",
  "1Co": "1 Corinthians",
  "2Kor": "2 Corinthians",
  "2Ko": "2 Corinthians",
  "2Co": "2 Corinthians",
  Gal: "Galatians",
  Eph: "Ephesians",
  Phil: "Philippians",
  Php: "Philippians",
  Kol: "Colossians",
  Col: "Colossians",
  "1Thess": "1 Thessalonians",
  "1Th": "1 Thessalonians",
  "2Thess": "2 Thessalonians",
  "2Th": "2 Thessalonians",
  "1Tim": "1 Timothy",
  "1Ti": "1 Timothy",
  "2Tim": "2 Timothy",
  "2Ti": "2 Timothy",
  Tit: "Titus",
  Phm: "Philemon",
  Phlm: "Philemon",
  Hebr: "Hebrews",
  Heb: "Hebrews",
  Jak: "James",
  Jas: "James",
  "1Petr": "1 Peter",
  "1Pe": "1 Peter",
  "1Pt": "1 Peter",
  "2Petr": "2 Peter",
  "2Pe": "2 Peter",
  "2Pt": "2 Peter",
  "1Joh": "1 John",
  "1Jo": "1 John",
  "1Jn": "1 John",
  "2Joh": "2 John",
  "2Jo": "2 John",
  "2Jn": "2 John",
  "3Joh": "3 John",
  "3Jo": "3 John",
  "3Jn": "3 John",
  Jud: "Jude",
  Offb: "Revelation",
  Off: "Revelation",
  Rev: "Revelation",
  Apk: "Revelation",

  // ---- Nachtrag: Kuerzel, die im Zuercher-Fussnotenapparat vorkommen,
  // hier aber fehlten. Sie liefen bisher in den Fallback
  // (resolveUnknownBookName) und blieben dort UNAUFGELOEST - sichtbar als
  // Konsolen-Warnung "Folgende Buchkuerzel ... konnten nicht zugeordnet
  // werden: Hio, Pre, Mr, Kla, Sac, Juda". Folge war nicht nur eine
  // haessliche Anzeige ("Pre 12:7" statt "Pred 12:7"), sondern ein
  // echter Datenverlust: ohne aufloesbares Zielbuch findet
  // verseIndex.getChapter() nichts, und der betreffende Querverweis
  // faellt aus der Bogen-Darstellung komplett heraus.
  Hio: "Job", // Hiob
  Pre: "Ecclesiastes", // Prediger
  Mr: "Mark", // Markus
  Kla: "Lamentations", // Klagelieder
  Sac: "Zechariah", // Sacharja
  Juda: "Jude", // Judasbrief (nicht der Stamm Juda - shortToFull
  // wird ausschliesslich fuer Buchreferenzen in
  // Fussnoten benutzt, nie fuer Personennamen)
};

// ========================================================================
// bookSearch.js — Freitext-Buchnamen-Erkennung fuer die Suchleiste
// ========================================================================
// shortToFull deckt nur ABKUERZUNGEN ab ("Jes", "1Mo") - fuer die Suche
// braucht es zusaetzlich die vollen deutschen Buchnamen ("Jesaja",
// "1. Mose"), da Nutzer meist so suchen, nicht abgekuerzt.

const germanFullNames = {
  Genesis: "Genesis",
  Exodus: "Exodus",
  Leviticus: "Leviticus",
  Numbers: "Numeri",
  Deuteronomy: "Deuteronomium",
  Joshua: "Josua",
  Judges: "Richter",
  Ruth: "Ruth",
  "1 Samuel": "1. Samuel",
  "2 Samuel": "2. Samuel",
  "1 Kings": "1. Könige",
  "2 Kings": "2. Könige",
  "1 Chronicles": "1. Chronik",
  "2 Chronicles": "2. Chronik",
  Ezra: "Esra",
  Nehemiah: "Nehemia",
  Esther: "Ester",
  Job: "Hiob",
  Psalm: "Psalmen",
  Proverbs: "Sprüche",
  Ecclesiastes: "Prediger",
  "Song of Solomon": "Hohelied",
  Isaiah: "Jesaja",
  Jeremiah: "Jeremia",
  Lamentations: "Klagelieder",
  Ezekiel: "Hesekiel",
  Daniel: "Daniel",
  Hosea: "Hosea",
  Joel: "Joel",
  Amos: "Amos",
  Obadiah: "Obadja",
  Jonah: "Jona",
  Micah: "Micha",
  Nahum: "Nahum",
  Habakkuk: "Habakuk",
  Zephaniah: "Zefanja",
  Haggai: "Haggai",
  Zechariah: "Sacharja",
  Malachi: "Maleachi",
  Matthew: "Matthäus",
  Mark: "Markus",
  Luke: "Lukas",
  John: "Johannes",
  Acts: "Apostelgeschichte",
  Romans: "Römer",
  "1 Corinthians": "1. Korinther",
  "2 Corinthians": "2. Korinther",
  Galatians: "Galater",
  Ephesians: "Epheser",
  Philippians: "Philipper",
  Colossians: "Kolosser",
  "1 Thessalonians": "1. Thessalonicher",
  "2 Thessalonians": "2. Thessalonicher",
  "1 Timothy": "1. Timotheus",
  "2 Timothy": "2. Timotheus",
  Titus: "Titus",
  Philemon: "Philemon",
  Hebrews: "Hebräer",
  James: "Jakobus",
  "1 Peter": "1. Petrus",
  "2 Peter": "2. Petrus",
  "1 John": "1. Johannes",
  "2 John": "2. Johannes",
  "3 John": "3. Johannes",
  Jude: "Judas",
  Revelation: "Offenbarung",
};

// ---- Deutsche Buch-ABKUERZUNGEN + Anzeige-Helfer -----------------------
// Intern heissen die Buecher durchgehend englisch ("Isaiah", "1 Samuel") -
// das ist der Schluessel aus der Zefania-XML und steckt in chapterKey,
// Entity-Referenzen und URL-Zustand. Fuer die ANZEIGE braucht es die
// deutsche Form; germanFullNames (oben) liefert die ausgeschriebene,
// diese Tabelle die kurze.
//
// Anlass: In den Querverweis-Chips prallten beide Welten in EINER Zeile
// aufeinander - links eine aus dem englischen Namen geschnittene
// Abkuerzung, rechts die deutsche aus der Fussnote: "Isa 60:3 → Off
// 21:24". Beide Seiten kommen jetzt aus dieser Tabelle.
//
// Die Kuerzel entsprechen den Schluesseln in shortToFull (s. oben), sind
// also mit den in den Fussnoten tatsaechlich vorkommenden Formen
// kompatibel - was aus der Datei kommt, laesst sich damit
// verlustfrei hin- und zurueckuebersetzen.
const germanBookAbbrevs = {
  // Pentateuch bewusst Gen/Ex/Lev/Num/Dtn statt 1Mo…5Mo: germanFullNames
  // zeigt diese fuenf Buecher als "Genesis"/"Exodus"/"Leviticus"/"Numeri"/
  // "Deuteronomium" an - "2Mo" als Kurzform daneben waere ein
  // Stilbruch ("Exodus – Kapitel 2" in der Ueberschrift, "2Mo 2:10" im
  // Chip direkt darunter). Die Mose-Zaehlung bleibt ueber shortToFull
  // weiterhin les- und suchbar, sie wird nur nicht mehr ausgegeben.
  Genesis: "Gen",
  Exodus: "Ex",
  Leviticus: "Lev",
  Numbers: "Num",
  Deuteronomy: "Dtn",
  Joshua: "Jos",
  Judges: "Ri",
  Ruth: "Rut",
  "1 Samuel": "1Sam",
  "2 Samuel": "2Sam",
  "1 Kings": "1Kön",
  "2 Kings": "2Kön",
  "1 Chronicles": "1Chr",
  "2 Chronicles": "2Chr",
  Ezra: "Esr",
  Nehemiah: "Neh",
  Esther: "Est",
  Job: "Hi",
  Psalm: "Ps",
  Proverbs: "Spr",
  Ecclesiastes: "Pred",
  "Song of Solomon": "Hld",
  Isaiah: "Jes",
  Jeremiah: "Jer",
  Lamentations: "Klgl",
  Ezekiel: "Hes",
  Daniel: "Dan",
  Hosea: "Hos",
  Joel: "Joel",
  Amos: "Am",
  Obadiah: "Obd",
  Jonah: "Jon",
  Micah: "Mi",
  Nahum: "Nah",
  Habakkuk: "Hab",
  Zephaniah: "Zef",
  Haggai: "Hag",
  Zechariah: "Sach",
  Malachi: "Mal",
  Matthew: "Mt",
  Mark: "Mk",
  Luke: "Lk",
  John: "Joh",
  Acts: "Apg",
  Romans: "Röm",
  "1 Corinthians": "1Kor",
  "2 Corinthians": "2Kor",
  Galatians: "Gal",
  Ephesians: "Eph",
  Philippians: "Phil",
  Colossians: "Kol",
  "1 Thessalonians": "1Thess",
  "2 Thessalonians": "2Thess",
  "1 Timothy": "1Tim",
  "2 Timothy": "2Tim",
  Titus: "Tit",
  Philemon: "Phlm",
  Hebrews: "Hebr",
  James: "Jak",
  "1 Peter": "1Petr",
  "2 Peter": "2Petr",
  "1 John": "1Joh",
  "2 John": "2Joh",
  "3 John": "3Joh",
  Jude: "Jud",
  Revelation: "Offb",
};

/** Ausgeschriebener deutscher Buchname fuer die Anzeige. Faellt auf den
 * internen (englischen) Namen zurueck, falls ein Buch fehlt - lieber ein
 * englischer Name als eine leere Ueberschrift. */
function germanBookName(bookFull) {
  return germanFullNames[bookFull] || bookFull;
}

/** Kurzform fuer enge Stellen (Chips, Dropdown-Zeilen). Fallback ist
 * bewusst der Anfang des DEUTSCHEN Namens, nicht des englischen. */
function germanBookAbbrev(bookFull) {
  return germanBookAbbrevs[bookFull] || germanBookName(bookFull).slice(0, 3);
}

// Zusaetzliche, gaengige Alternativ-Schreibweisen, die zu weit von ihrem
// jeweiligen germanFullNames-Eintrag abweichen, um die unscharfe Suche
// unten noch zuverlaessig zu treffen (z. B. "1. Mose" vs. "Genesis" -
// komplett andere Woerter, keine Tippfehler-Distanz).
const bookNameExtraAliases = {
  Genesis: ["1. Mose", "1 Mose"],
  Exodus: ["2. Mose", "2 Mose"],
  Leviticus: ["3. Mose", "3 Mose"],
  Numbers: ["4. Mose", "4 Mose"],
  Deuteronomy: ["5. Mose", "5 Mose"],
  Psalm: ["Psalm"], // Singular ist mindestens so gebraeuchlich wie Plural
  Ecclesiastes: ["Kohelet"],
};

// ========================================================================
// personNameAliases.js — bekannte deutsche Namensformen & Beinamen fuer
// die Personen-Namens-Pille im Kapiteltext (s. highlightPersonName)
// ========================================================================
// personReferenceIndex.json liefert nur EINEN Anzeigenamen pro Person -
// den englischen ESV-Namen aus STEPBible (baseNameFromUnifiedName, s.
// build_persons_index.py), z. B. "Moses" statt "Mose". Fuer die reine
// TEXT-Markierung im (deutschen) Zuercher-Vers reicht dieser eine Name oft
// nicht: entweder weicht die deutsche Namensform ab (Moses/Mose,
// Solomon/Salomo), oder der Vers nennt die Person unter einem ganz
// ANDEREN, etablierten Beinamen (z. B. "Immanuel" fuer Jesus in Jes 7:14 /
// Mt 1:23, oder "Israel" fuer Jakob nach seiner Umbenennung).
//
// Diese Tabelle ist eine MANUELL kuratierte Ergaenzungsliste fuer die
// haeufigsten/bekanntesten Faelle - kein vollstaendiger, automatisch
// hergeleiteter Datensatz fuer alle 3040 Personen. Jeder Eintrag ergaenzt
// (nicht ersetzt) den vorhandenen displayName um weitere Suchbegriffe, s.
// buildPersonNameHighlightInfo (main.js) und highlightPersonName
// (chapterText.js).
//
// Fuer eine systematische statt manuelle Loesung (bessere Abdeckung ueber
// alle 3040 Personen) muesste build_persons_index.py pruefen, ob
// peopleProperNouns.json bereits alternative Namensformen/Beinamen pro
// Person mitliefert (STEPBible-Personendatensaetze haben dafuer haeufig
// eigene Felder) - die Datei liegt in diesem Chat nicht vor, daher hier
// zunaechst diese kuratierte Liste als praktische Sofortloesung.
const GERMAN_PERSON_NAME_ALIASES = {
  // ---- Urgeschichte / Erzväter (1. Mose) ----
  Cain: ["Kain"],
  Enoch: ["Henoch"],
  Methuselah: ["Methusalah", "Methusalem"],
  Shem: ["Sem"],
  Japheth: ["Japhet"],
  Sarah: ["Sara"],
  Isaac: ["Isaak"],
  Rebekah: ["Rebekka"],
  Ishmael: ["Ismael"],
  Jacob: ["Jakob", "Israel"],
  Leah: ["Lea"],
  Rachel: ["Rahel"],
  Reuben: ["Ruben"],
  Judah: ["Juda"],
  Asher: ["Asser"],
  Issachar: ["Issaschar"],
  Zebulun: ["Sebulon"],
  Joseph: ["Josef"],
  Dinah: ["Dina"],

  // ---- Exodus / Wüstenzeit ----
  Moses: ["Mose"],
  Miriam: ["Mirjam"],
  Joshua: ["Josua"],
  Caleb: ["Kaleb"],
  Balaam: ["Bileam"],
  Bezalel: ["Bezaleel"],

  // ---- Richter / Könige ----
  Deborah: ["Debora"],
  Samson: ["Simson"],
  Delilah: ["Delila"],
  Naomi: ["Noomi"],
  Bathsheba: ["Bathseba", "Batseba"],
  Solomon: ["Salomo"],
  Rehoboam: ["Rehabeam"],
  Jeroboam: ["Jerobeam"],
  Elijah: ["Elia"],
  Elisha: ["Elisa"],
  Jezebel: ["Isebel"],
  Hezekiah: ["Hiskia"],
  Josiah: ["Josia"],
  Nebuchadnezzar: ["Nebukadnezar"],
  Cyrus: ["Kyrus", "Kores"],

  // ---- Propheten / Schriften ----
  Isaiah: ["Jesaja"],
  Jeremiah: ["Jeremia"],
  Ezekiel: ["Hesekiel"],
  Obadiah: ["Obadja"],
  Jonah: ["Jona"],
  Micah: ["Micha"],
  Habakkuk: ["Habakuk"],
  Zephaniah: ["Zefanja"],
  Zechariah: ["Sacharja", "Zacharias"],
  Malachi: ["Maleachi"],
  Job: ["Hiob"],
  Ezra: ["Esra"],
  Nehemiah: ["Nehemia"],
  Esther: ["Ester"],
  Mordecai: ["Mardochai"],

  // ---- Neues Testament ----
  // Jesus: der prominenteste Fall fuer "Beiname statt Uebersetzung" -
  // "Immanuel" (Jes 7:14 / Mt 1:23) ist keine andere Sprache desselben
  // Namens, sondern ein eigener, im Text verwendeter Titel/Name.
  Jesus: ["Immanuel", "Christus", "Messias"],
  Peter: ["Petrus", "Kephas"],
  Andrew: ["Andreas"],
  James: ["Jakobus"],
  John: ["Johannes"],
  Philip: ["Philippus"],
  Bartholomew: ["Bartholomäus"],
  Matthew: ["Matthäus"],
  Thaddaeus: ["Thaddäus"],
  Mary: ["Maria"],
  Elizabeth: ["Elisabeth"],
  Herod: ["Herodes"],
  Pilate: ["Pilatus"],
  Paul: ["Paulus", "Saulus"],
  Timothy: ["Timotheus"],
  Luke: ["Lukas"],
  Mark: ["Markus"],
  Stephen: ["Stephanus"],
};

// ========================================================================
// germanPlaceNameAliases.js — bekannte deutsche Namensformen fuer die
// Orts-Namens-Pille im Kapiteltext (s. highlightPersonName) - dasselbe
// Prinzip wie GERMAN_PERSON_NAME_ALIASES oben, hier fuer Orte statt
// Personen. Gleiche Einschraenkung: manuell kuratiert fuer die
// haeufigsten/bekanntesten der 1014 Orte, kein vollstaendiger,
// automatisch hergeleiteter Datensatz. Bei Orten ist der Englisch/Deutsch-
// Unterschied seltener ein eigener Beiname (wie "Immanuel" bei Jesus) und
// meist eine reine Transliterationsfrage (Damascus/Damaskus).
const GERMAN_PLACE_NAME_ALIASES = {
  Egypt: ["Ägypten"],
  Damascus: ["Damaskus"],
  Nineveh: ["Ninive"],
  Babylon: ["Babel"],
  Ethiopia: ["Äthiopien", "Kusch"],
  Cyprus: ["Zypern"],
  Crete: ["Kreta"],
  Athens: ["Athen"],
  Corinth: ["Korinth"],
  Thessalonica: ["Thessalonich"],
  Macedonia: ["Mazedonien"],
  Cyrene: ["Kyrene"],
  Antioch: ["Antiochia"],
  Galatia: ["Galatien"],
  Cappadocia: ["Kappadozien"],
  Phrygia: ["Phrygien"],
  Pamphylia: ["Pamphylien"],
  Mesopotamia: ["Mesopotamien"],
  Persia: ["Persien"],
  Media: ["Medien"],
  Assyria: ["Assyrien", "Assur"],
  Chaldea: ["Chaldäa"],
  Canaan: ["Kanaan"],
  Philistia: ["Philisterland"],
  Galilee: ["Galiläa"],
  Judea: ["Judäa"],
  Euphrates: ["Euphrat"],
  Nile: ["Nil"],
  Tyre: ["Tyrus"],
  Ashkelon: ["Askalon"],
  Shechem: ["Sichem"],
  Shiloh: ["Silo"],
  Beersheba: ["Beerseba"],
  Gomorrah: ["Gomorra"],
  Iconium: ["Ikonium"],
  Colossae: ["Kolossä"],
  Laodicea: ["Laodizea"],
};

// ========================================================================
// germanDisplayNames.js — deutsche ANZEIGENAMEN fuer die Sidebar-Liste
// ========================================================================
// Die STEPBible-Quelldaten liefern ausschliesslich englische Namen
// ("Moses", "Solomon", "Isaiah"). In der Sidebar stand deshalb bisher der
// englische Name, waehrend direkt daneben im Kapiteltext die deutsche Form
// markiert war ("Mose", "Salomo", "Jesaja") - die auffaelligste
// Inkonsistenz der Oberflaeche.
//
// Diese Tabellen liefern den deutschen ANZEIGENAMEN. Sie sind bewusst
// EIGENSTAENDIG und nicht aus GERMAN_PERSON_NAME_ALIASES abgeleitet,
// obwohl die Werte sich weitgehend decken: die Alias-Listen enthalten
// zusaetzlich BEINAMEN, die als Anzeigename falsch waeren. Prominentes
// Beispiel: Jesus hat die Aliase ["Immanuel", "Christus", "Messias"] - der
// erste Eintrag ist ein Titel aus Jes 7:14 / Mt 1:23, nicht die deutsche
// Form des Namens. Eine automatische "nimm den ersten Alias"-Regel wuerde
// den Eintrag zu "Immanuel" umbenennen.
//
// WICHTIG: Der englische Name bleibt intern der SCHLUESSEL (Entity-IDs,
// Alias-Nachschlagen fuer die Namens-Pillen, s. getEntityHighlightNames).
// Hier wird ausschliesslich die ANZEIGE veraendert. Beide Schreibweisen
// bleiben durchsuchbar (s. searchName in main.js) - wer "Moses" tippt,
// findet "Mose" weiterhin.
const GERMAN_PERSON_DISPLAY_NAMES = {
  Cain: "Kain",
  Enoch: "Henoch",
  Methuselah: "Methusalah",
  Shem: "Sem",
  Japheth: "Japhet",
  Sarah: "Sara",
  Isaac: "Isaak",
  Rebekah: "Rebekka",
  Ishmael: "Ismael",
  Jacob: "Jakob",
  Leah: "Lea",
  Rachel: "Rahel",
  Reuben: "Ruben",
  Judah: "Juda",
  Asher: "Asser",
  Issachar: "Issaschar",
  Zebulun: "Sebulon",
  Joseph: "Josef",
  Dinah: "Dina",
  Moses: "Mose",
  Miriam: "Mirjam",
  Joshua: "Josua",
  Caleb: "Kaleb",
  Balaam: "Bileam",
  Bezalel: "Bezaleel",
  Deborah: "Debora",
  Samson: "Simson",
  Delilah: "Delila",
  Naomi: "Noomi",
  Bathsheba: "Bathseba",
  Solomon: "Salomo",
  Rehoboam: "Rehabeam",
  Jeroboam: "Jerobeam",
  Elijah: "Elia",
  Elisha: "Elisa",
  Jezebel: "Isebel",
  Hezekiah: "Hiskia",
  Josiah: "Josia",
  Nebuchadnezzar: "Nebukadnezar",
  Cyrus: "Kyrus",
  Isaiah: "Jesaja",
  Jeremiah: "Jeremia",
  Ezekiel: "Hesekiel",
  Obadiah: "Obadja",
  Jonah: "Jona",
  Micah: "Micha",
  Habakkuk: "Habakuk",
  Zephaniah: "Zefanja",
  Zechariah: "Sacharja",
  Malachi: "Maleachi",
  Job: "Hiob",
  Ezra: "Esra",
  Nehemiah: "Nehemia",
  Esther: "Ester",
  Mordecai: "Mardochai",
  Jesus: "Jesus",
  // ---- Nachtrag: haeufige Namen, fuer die es in den Alias-Tabellen
  // (die nur die Namens-PILLEN speisen) bisher keinen Eintrag gab, die in
  // der Sidebar aber prominent auftauchen. Bewusst nur Faelle mit
  // eindeutiger deutscher Form - unsichere Transliterationen bleiben
  // lieber englisch stehen, als eine erfundene Schreibweise anzuzeigen.
  // Die Tabelle ist jederzeit erweiterbar: fehlt ein Eintrag, wird
  // schlicht der englische Name angezeigt (kein Fehlerfall).
  Manasseh: "Manasse",
  Pharaoh: "Pharao",
  Jehoshaphat: "Josaphat",
  Zedekiah: "Zedekia",
  Jesse: "Isai",
  Eleazar: "Eleasar",
  Uriah: "Uria",
  Ahaz: "Ahas",
  Uzziah: "Usija",
  Amaziah: "Amazja",
  Jehoiakim: "Jojakim",
  Jehoiachin: "Jojachin",
  Athaliah: "Athalja",
  Zerubbabel: "Serubbabel",
  Boaz: "Boas",
  Jethro: "Jitro",
  Sennacherib: "Sanherib",
  Nathanael: "Nathanael",
  Barnabas: "Barnabas",
  Peter: "Petrus",
  Andrew: "Andreas",
  James: "Jakobus",
  John: "Johannes",
  Philip: "Philippus",
  Bartholomew: "Bartholomäus",
  Matthew: "Matthäus",
  Thaddaeus: "Thaddäus",
  Mary: "Maria",
  Elizabeth: "Elisabeth",
  Herod: "Herodes",
  Pilate: "Pilatus",
  Paul: "Paulus",
  Timothy: "Timotheus",
  Luke: "Lukas",
  Mark: "Markus",
  Stephen: "Stephanus",
};

const GERMAN_PLACE_DISPLAY_NAMES = {
  Egypt: "Ägypten",
  Damascus: "Damaskus",
  Nineveh: "Ninive",
  Babylon: "Babel",
  Ethiopia: "Äthiopien",
  Cyprus: "Zypern",
  Crete: "Kreta",
  Athens: "Athen",
  Corinth: "Korinth",
  Thessalonica: "Thessalonich",
  Macedonia: "Mazedonien",
  Cyrene: "Kyrene",
  Antioch: "Antiochia",
  Galatia: "Galatien",
  Cappadocia: "Kappadozien",
  Phrygia: "Phrygien",
  Pamphylia: "Pamphylien",
  Mesopotamia: "Mesopotamien",
  Persia: "Persien",
  Media: "Medien",
  Assyria: "Assyrien",
  Chaldea: "Chaldäa",
  Canaan: "Kanaan",
  Philistia: "Philisterland",
  Galilee: "Galiläa",
  Judea: "Judäa",
  Euphrates: "Euphrat",
  Nile: "Nil",
  Tyre: "Tyrus",
  Ashkelon: "Askalon",
  Shechem: "Sichem",
  Shiloh: "Silo",
  Beersheba: "Beerseba",
  Gomorrah: "Gomorra",
  Iconium: "Ikonium",
  Colossae: "Kolossä",
  Laodicea: "Laodizea",
  // ---- Nachtrag: haeufige Orte, die in der Alias-Tabelle fehlten.
  // Wieder nur eindeutige Faelle; wo die deutsche Form mit der englischen
  // identisch ist (Jerusalem, Moab, Edom, Bethel, Jericho, Hebron,
  // Nazareth, Sinai, Gaza …), braucht es ohnehin keinen Eintrag.
  Rome: "Rom",
  Syria: "Syrien",
  Lebanon: "Libanon",
  Bashan: "Basan",
  Cush: "Kusch",
  Carmel: "Karmel",
  Jezreel: "Jesreel",
  Heshbon: "Hesbon",
  Kadesh: "Kades",
  Lachish: "Lachis",
  Ashdod: "Asdod",
  Asia: "Asien",
  Arabia: "Arabien",
  Arabah: "Araba",
  Gibeah: "Gibea",
  Mizpah: "Mizpa",
  Susa: "Susa",
  Sidon: "Sidon",
  // Eintraege, deren Rohname einen Unterstrich traegt (Bestandteil der
  // STEPBible-Kennung, kein Bestandteil des Namens) - hier gleich in
  // lesbare deutsche Form gebracht:
  Red_Sea: "Schilfmeer",
  Hermon_Mount: "Hermon",
  Holy_Place: "Heiligtum",
  Sinai_Mount: "Sinai",
  Olives_Mount: "Ölberg",
  Zion_Mount: "Zion",
};

/**
 * Normalisiert einen Buchnamen-Text fuer den Vergleich: Kleinschreibung,
 * Umlaute aufgeloest (fuer Tippfehler wie "Koenige" statt "Könige"),
 * Punkte und JEGLICHE Leerzeichen entfernt (fuer "1. Mose"/"1 Mose"/
 * "1Mose" - alle sollen aufs Gleiche normalisieren).
 */
function normalizeBookQuery(s) {
  return s
    .toLowerCase()
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .replace(/ß/g, "ss")
    .replace(/[.\s]/g, "");
}

// Einmalig aufgebaute, normalisierte Kandidatenliste aus allen drei
// Quellen (volle deutsche Namen, bestehende Abkuerzungen, Zusatz-Alias) -
// jeder Kandidat verweist auf denselben internen bookName-Wert wie im
// Rest der App (chapters[i].bookName, bookOrder etc.).
const bookNameCandidates = (() => {
  const list = [];
  Object.entries(germanFullNames).forEach(([target, display]) => {
    list.push({ target, display, norm: normalizeBookQuery(display) });
  });
  Object.entries(shortToFull).forEach(([display, target]) => {
    list.push({ target, display, norm: normalizeBookQuery(display) });
  });
  Object.entries(bookNameExtraAliases).forEach(([target, aliases]) => {
    aliases.forEach((display) =>
      list.push({ target, display, norm: normalizeBookQuery(display) })
    );
  });
  return list;
})();

/**
 * Klassische Levenshtein-Distanz (Anzahl Einfuegen/Loeschen/Ersetzen, um
 * a in b zu verwandeln) - Standardmass fuer Tippfehler-Toleranz.
 */
function levenshteinDistance(a, b) {
  const m = a.length;
  const n = b.length;
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + cost
      );
    }
  }
  return dp[m][n];
}

/**
 * Findet den am besten passenden Buchnamen zu einem rohen Sucheingabe-
 * Textstueck. Erst ein exakter Treffer (nach Normalisierung), sonst die
 * kleinste Levenshtein-Distanz ueber alle Kandidaten - toleriert dabei
 * Tippfehler wie "Jesaia" statt "Jesaja". Die Toleranzschwelle skaliert
 * mit der Wortlaenge (25%, mindestens 1), damit kurze Namen nicht zu
 * grosszuegig, lange nicht zu streng behandelt werden. Getestet gegen
 * u. a. "jesaja45", "Jesaia 45", "1. Mose 1", "Koenige" - s. Chat.
 */
function findBookNameMatch(rawBookQuery) {
  const query = normalizeBookQuery(rawBookQuery);
  if (!query) return null;

  const exact = bookNameCandidates.find((c) => c.norm === query);
  if (exact) return { bookFull: exact.target, distance: 0 };

  let best = null;
  for (const candidate of bookNameCandidates) {
    const distance = levenshteinDistance(query, candidate.norm);
    const threshold = Math.max(
      1,
      Math.floor(Math.max(query.length, candidate.norm.length) * 0.25)
    );
    if (distance <= threshold && (!best || distance < best.distance)) {
      best = { bookFull: candidate.target, distance };
    }
  }
  return best;
}

/**
 * Zerlegt eine rohe Sucheingabe wie "Jesaja 45:7" / "jesaja45" /
 * "Jesaia 45" in Buch, Kapitel und (optional) Vers. Die Kapitelzahl wird
 * bewusst NICHT-GIERIG vom ENDE der Eingabe abgetrennt - dadurch landet
 * eine fuehrende Ordnungszahl wie bei "1Mo 5" korrekt im Buchteil ("1Mo"),
 * nicht im Kapitelteil, da "Mo 5" (mit Buchstaben) nicht rein numerisch
 * ist und die Regex deshalb weiter nach links backtrackt, bis der ganze
 * numerische Rest ("5") sauber abgetrennt werden kann.
 */
function parseReferenceQuery(rawQuery) {
  const trimmed = rawQuery.trim();
  if (!trimmed) return null;

  const match = trimmed.match(/^(.+?)\s*(\d+)(?:\s*[:.,]\s*(\d+))?\s*$/);
  if (!match) return null;

  const [, bookPart, chapterStr, verseStr] = match;
  // Buchteil muss mindestens einen Buchstaben enthalten - verhindert,
  // dass reine Zahleneingaben ("45") als (unsinniger) Buchname behandelt
  // werden.
  if (!/[a-zA-ZäöüÄÖÜ]/.test(bookPart)) return null;

  const bookMatch = findBookNameMatch(bookPart);
  if (!bookMatch) return null;

  return {
    bookFull: bookMatch.bookFull,
    chapter: parseInt(chapterStr, 10),
    verse: verseStr ? parseInt(verseStr, 10) : null,
  };
}

// ========================================================================
// wordExplorer.js — Personen/Orte/Zeiten/Woerter-Explorer in der Sidebar
// ========================================================================
// Datenquellen: personReferenceIndex.json und placeReferenceIndex.json -
// beide einmalig offline aus STEPBibles Rohdaten (peopleProperNouns.json
// bzw. placesProperNouns.json) + der Zuercher-XML aufgebaut, EXAKT
// dieselbe Referenz-statt-Text-Pipeline (s. build_persons_index.py /
// build_places_index.py sowie die Architektur-Konsultation im Chat).
// timeReferenceIndex.json ist ANDERS aufgebaut (s. build_time_index.py):
// es gibt keine STEPBible-Referenzliste fuer Zeitausdruecke, deshalb
// Muster-Erkennung DIREKT auf dem deutschen Zuercher-Text statt Referenz-
// Lookup - Personen/Orte bleiben aber weiterhin referenzbasiert.
// wordReferenceIndex.json (vierte Kategorie "Woerter") ist WIEDER anders:
// offenes Vokabular per spaCy (de_core_news_md) direkt aus dem deutschen
// Zuercher-Text lemmatisiert und wortart-getaggt (s. build_word_index.py)
// - jede Entity-ID ist Lemma+Wortart kombiniert (z. B. "gehen__VERB"), da
// dasselbe Lemma in mehreren Wortarten auftreten kann (z. B. "gut" als
// ADJ vs. ADV) und dann als ZWEI separate Eintraege gefuehrt wird.
//
// Ab hier ist die Sidebar bewusst KATEGORIE-AGNOSTISCH: alle Funktionen
// arbeiten mit einem generischen "Entity"-Begriff (category + id), nicht
// mehr speziell mit "Person". Der EINZIGE Ort, an dem noch zwischen
// "persons"/"places"/"times"/"words" unterschieden wird, ist main.js, das
// ueber den `getVersesForEntity(category, id)`-Callback die passende
// Rohdaten-Quelle (versesByPerson/versesByPlace/versesByTime/versesByWord)
// heraussucht - der Word-Explorer selbst muss diese Unterscheidung nicht
// kennen. Das ist auch der Grund, warum sich Personen, Orte, Zeiten UND
// Woerter gleichzeitig anpinnen lassen (s. Anfrage): angepinnte Eintraege
// sind {id, category}-Paare in EINEM gemeinsamen, kategorieuebergreifenden
// Array - ein Tab-Wechsel filtert nur, was in der UNGEPINNTEN Liste
// durchsucht/durchblaettert wird, laesst die Pins selbst aber unangetastet.

/**
 * Laedt eine vorab aufbereitete Referenzdatei (Personen/Orte/Zeiten/
 * Woerter, je nach `path`/`metaKey`) und wandelt sie in die {name, count,
 * id, pos}-Form um, die renderWordList()/wireWordExplorer() erwarten -
 * absteigend nach Haeufigkeit sortiert. Gibt zusaetzlich die ROHEN Daten
 * (raw) zurueck: init() braucht raw[versesKey] fuer das Highlighting/den
 * Vers-Dropdown. `metaKey`/`versesKey` unterscheiden sich zwischen den
 * Dateien nur im Namen (personReferenceIndex.json: "persons"/
 * "versesByPerson", placeReferenceIndex.json: "places"/"versesByPlace",
 * timeReferenceIndex.json: "times"/"versesByTime",
 * wordReferenceIndex.json: "words"/"versesByWord") - dieselbe Funktion
 * bedient alle vier. `entry.pos` ist nur bei Woertern gesetzt (aus
 * meta.pos) - bei den anderen drei Kategorien bleibt es undefined und
 * wird schlicht nicht verwendet.
 */
async function loadEntityIndex(path, metaKey, versesKey) {
  const data = await fetch(path).then((r) => r.json());
  const entries = Object.entries(data[metaKey]).map(([id, meta]) => ({
    id,
    name: meta.displayName,
    count: meta.count,
    pos: meta.pos,
  }));
  entries.sort((a, b) => b.count - a.count);
  return { entries, raw: data, versesKey };
}

/**
 * Liefert fuer eine Entity (Person, Ort, Zeit ODER Wort) ALLE Zeilen, die
 * im Dropdown auftauchen sollen - eine pro Vers, in Buch-/Kapitel-/Vers-
 * reihenfolge. Ein Vers, der laut `crossRefSourceMap` selbst eine
 * Fussnoten-Querverweis-QUELLE ist, erzeugt statt einer einfachen
 * Vers-Zeile eine EIGENE Crossref-Zeile PRO Ziel (bei mehreren Zielen
 * entsprechend mehrere Zeilen) - s. Anfrage: "sollen die Verse ... auch
 * als crossref aufgelistet sein". Kein Vers erzeugt beides gleichzeitig
 * (Dopplung vermieden).
 *
 * `getVersesForEntity(category, id)`: von main.js uebergebener Callback,
 * der die richtige Rohdaten-Quelle (versesByPerson/versesByPlace/
 * versesByTime/versesByWord) heraussucht - der Word-Explorer selbst kennt
 * diese Quellen nicht (s. Modulkommentar oben).
 * `crossRefSourceMap`: Map<verseKey, targets[]>, einmalig in init()
 * gebaut (s. main.js) - vermeidet, bei JEDER Zeile erneut das komplette
 * crossRefs-Array zu durchsuchen.
 */
function getEntityEntryRows(
  getVersesForEntity,
  crossRefSourceMap,
  category,
  id
) {
  const verses = (getVersesForEntity(category, id) || [])
    .slice()
    .sort((a, b) => {
      const bookDiff = bookOrder.indexOf(a.book) - bookOrder.indexOf(b.book);
      if (bookDiff !== 0) return bookDiff;
      if (a.chapter !== b.chapter) return a.chapter - b.chapter;
      return a.verse - b.verse;
    });

  const rows = [];
  verses.forEach((v) => {
    const key = makeVerseKey(v.book, v.chapter, v.verse);
    const targets = crossRefSourceMap.get(key);
    if (targets && targets.length > 0) {
      targets.forEach((target) => {
        rows.push({
          type: "crossref",
          book: v.book,
          chapter: v.chapter,
          verse: v.verse,
          target,
        });
      });
    } else {
      rows.push({
        type: "verse",
        book: v.book,
        chapter: v.chapter,
        verse: v.verse,
      });
    }
  });
  return rows;
}

/**
 * Reichert `rows` (s. getEntityEntryRows) um die Ueberlappung mit ALLEN
 * angepinnten Entities an - UNABHAENGIG von deren Kategorie: ein Vers, in
 * dem sowohl eine angepinnte Person ALS AUCH ein angepinnter Ort
 * vorkommen, zaehlt genauso als Ueberlappung wie zwei Personen (s. Anfrage
 * "Personen und Orte gleichzeitig"). `overlapCount` (wie viele der
 * angepinnten Entities betrifft dieser Vers, inkl. der Entity selbst - sie
 * ist ja per Definition immer eine davon) und `overlapColorIndexes` (deren
 * Pin-Slot-Indizes, fuer die gemischte Badge-Farbe, s.
 * multiplyBlendColors). NUR fuer angepinnte Entities aufgerufen (s.
 * wireWordExplorer) - bei blossen Hover-Vorschauen (noch nicht angepinnt)
 * waere "Ueberlappung mit den eigenen Versen" nicht aussagekraeftig genug,
 * um den Zusatzaufwand zu rechtfertigen.
 */
function annotateRowOverlaps(rows, pinnedEntries, getVersesForEntity) {
  const colorSets = pinnedEntries.map((entry, colorIndex) => ({
    colorIndex,
    verseSet: new Set(
      (getVersesForEntity(entry.category, entry.id) || []).map((v) =>
        makeVerseKey(v.book, v.chapter, v.verse)
      )
    ),
  }));

  rows.forEach((row) => {
    const key = makeVerseKey(row.book, row.chapter, row.verse);
    const matches = colorSets.filter(({ verseSet }) => verseSet.has(key));
    row.overlapCount = matches.length;
    row.overlapColorIndexes = matches.map((m) => m.colorIndex);
  });
}

/**
 * Sortiert Zeilen mit Ueberlappung (overlapCount > 1) an den Anfang, hoehere
 * Ueberlappung zuerst - sonst bleibt die urspruengliche Buch-/Kapitel-/
 * Versreihenfolge erhalten (stabile Sortierung ueber den urspruenglichen
 * Index, nicht Array.prototype.sort allein, dessen Stabilitaet bei sehr
 * alten Engines nicht garantiert war).
 */
function sortRowsByOverlap(rows) {
  return rows
    .map((row, index) => ({ row, index }))
    .sort((a, b) => {
      if (b.row.overlapCount !== a.row.overlapCount) {
        return b.row.overlapCount - a.row.overlapCount;
      }
      return a.index - b.index;
    })
    .map(({ row }) => row);
}

function buildOverlapAnnotatedRows(
  category,
  id,
  pinnedEntries,
  getVersesForEntity,
  crossRefSourceMap
) {
  const rows = getEntityEntryRows(
    getVersesForEntity,
    crossRefSourceMap,
    category,
    id
  );
  annotateRowOverlaps(rows, pinnedEntries, getVersesForEntity);
  return sortRowsByOverlap(rows);
}

/**
 * Fuellt `chaptersEl` mit den eigentlichen Zeilen-Buttons - fuer Vers- UND
 * Crossref-Zeilen (letztere mit Pfeil, exakt wie die Chips in der
 * Referenz-Leiste ueber dem Kapiteltext). `row.overlapCount`/
 * `.overlapColorIndexes` sind optional (nur bei angepinnten Entities
 * gesetzt, s. buildOverlapAnnotatedRows) - ist `overlapCount` > 1, wird
 * zusaetzlich das gemischte Ueberlappungs-Badge vorangestellt.
 */
function populateEntryRows(chaptersEl, rows) {
  chaptersEl.innerHTML = "";
  const fragment = document.createDocumentFragment();

  rows.forEach((row) => {
    const el = document.createElement("button");
    el.type = "button";
    el.dataset.book = row.book;
    el.dataset.chapter = row.chapter;
    el.dataset.verse = row.verse;

    if (row.type === "crossref") {
      el.className = "word-list-chapter word-list-chapter-crossref";
      el.dataset.role = "crossref";
      el.dataset.targetBook = row.target.bookFull;
      if (row.target.bookShort)
        el.dataset.targetBookShort = row.target.bookShort;
      el.dataset.targetChapter = row.target.chapter;
      el.dataset.targetVerse = row.target.verse;
      // Beide Seiten aus derselben Tabelle - frueher stand links eine aus
      // dem englischen Namen geschnittene Abkuerzung und rechts die
      // (deutsche) Fussnoten-Abkuerzung des Ziels.
      el.innerHTML = `${germanBookAbbrev(row.book)} ${row.chapter}:${
        row.verse
      } <span class="arrow">→</span> ${germanBookAbbrev(row.target.bookFull)} ${
        row.target.chapter
      }:${row.target.verse}`;
    } else {
      el.className = "word-list-chapter";
      el.dataset.role = "verse";
      const displayBook = germanBookName(row.book);
      el.textContent = `${displayBook} ${row.chapter}:${row.verse}`;
    }

    if (row.overlapCount != null && row.overlapCount > 1) {
      el.classList.add("has-overlap");
      const badge = document.createElement("span");
      badge.className = "word-list-overlap-badge";
      badge.textContent = String(row.overlapCount);
      badge.style.background = multiplyBlendColors(
        row.overlapColorIndexes.map(readPersonColor)
      );
      el.prepend(badge);
    }

    fragment.appendChild(el);
  });

  chaptersEl.appendChild(fragment);
}

// Deutsche Kurzbeschriftungen fuer spaCy-POS-Tags (Universal Dependencies
// Tagset) - genutzt sowohl fuer die Wortart-Filter-Chips als auch fuer das
// kleine Wortart-Kuerzel neben jedem Wort-Eintrag (s. createWordListEntry).
// Bewusst die englischen UD-Kuerzel als Schluessel (kommen so aus
// wordReferenceIndex.json/token.pos_ in spaCy) - nur die ANZEIGE ist
// deutsch.
const GERMAN_POS_LABELS = {
  NOUN: "Nomen",
  VERB: "Verben",
  ADJ: "Adjektive",
  ADV: "Adverbien",
  PROPN: "Eigennamen",
  PRON: "Pronomen",
  NUM: "Zahlwörter",
  DET: "Artikel",
  ADP: "Präpositionen",
  AUX: "Hilfsverben",
  CCONJ: "Konjunktionen",
  SCONJ: "Konjunktionen",
  PART: "Partikeln",
  INTJ: "Interjektionen",
  X: "Sonstige",
};

// Standardmaessig aktive Wortarten in der "Woerter"-Kategorie (s. Anfrage:
// "nur NOUN/ADJ/VERB, mit Option mehr einzublenden"). Alle anderen in
// wordReferenceIndex.json vorkommenden Wortarten sind beim ersten Laden
// abgewaehlt, aber ueber die Filter-Chips jederzeit zuschaltbar.
const DEFAULT_ACTIVE_WORD_POS = new Set(["NOUN", "ADJ", "VERB"]);

/**
 * Baut EINEN Eintrag (Haupt-Zeile + Chevron + Vers-/Crossref-Dropdown) fuer
 * die Wortliste. `category` ("persons"/"places"/"times"/"words") wird als
 * data-Attribut auf Haupt-Zeile UND Chevron mitgegeben - noetig, weil
 * angepinnte Eintraege in der Pin-Sektion aus einer ANDEREN Kategorie
 * stammen koennen als der gerade aktiven Tab-Auswahl (s. Anfrage
 * "gleichzeitig"); der Klick-Handler in wireWordExplorer muss deshalb pro
 * Zeile wissen, zu welcher Kategorie sie gehoert, statt sich auf den
 * aktuellen Tab zu verlassen. `colorIndex` (0-3) nur bei angepinnten
 * Entities gesetzt - faerbt die Haupt-Zeile im entsprechenden Pin-Slot ein.
 * `isExpanded` (unabhaengig vom Pin-Status, s. expandedKeys in
 * wireWordExplorer) bestimmt, ob das Dropdown gerade offen ist - `rows`
 * wird dementsprechend nur dann tatsaechlich gebaut (nie fuer alle
 * Eintraege im Voraus, sondern nur fuer die paar, die der Nutzer
 * tatsaechlich geoeffnet hat). Der Chevron selbst ist per CSS nur bei
 * :hover ueber dem Eintrag sichtbar (s. style.css) - unabhaengig davon, ob
 * das Dropdown gerade offen ist: erneutes Hovern zeigt ihn auch zum
 * Wieder-Zuklappen.
 *
 * `entry.pos` ist nur bei der Kategorie "words" gesetzt (s.
 * loadEntityIndex) - in dem Fall wird ein kleines Wortart-Kuerzel
 * (.word-list-pos) hinter dem Namen angezeigt, da dasselbe Lemma in
 * mehreren Wortarten separat auftauchen kann (z. B. "gut" als ADJ UND
 * ADV) und sonst nicht unterscheidbar waere.
 */
function createWordListEntry({
  entry,
  category,
  colorIndex,
  isExpanded,
  rows,
}) {
  const container = document.createElement("div");
  container.className = "word-list-entry";
  container.dataset.id = entry.id;
  container.dataset.category = category;
  if (colorIndex != null) container.classList.add("is-pinned");

  const row = document.createElement("div");
  row.className = "word-list-row";

  const item = document.createElement("button");
  item.type = "button";
  item.className = "word-list-item";
  item.dataset.id = entry.id;
  item.dataset.category = category;
  item.dataset.role = "select";
  if (colorIndex != null) {
    item.classList.add("is-pinned", `is-pin-color-${colorIndex + 1}`);
  }

  const nameEl = document.createElement("span");
  nameEl.className = "word-list-name";
  nameEl.textContent = entry.name;
  item.appendChild(nameEl);

  if (category === "words" && entry.pos) {
    const posEl = document.createElement("span");
    posEl.className = "word-list-pos";
    posEl.textContent = entry.pos;
    item.appendChild(posEl);
  }

  const countEl = document.createElement("span");
  countEl.className = "word-list-count";
  countEl.textContent = entry.count;
  item.appendChild(countEl);

  row.appendChild(item);

  const expandToggle = document.createElement("button");
  expandToggle.type = "button";
  expandToggle.className = "word-list-expand-toggle";
  if (isExpanded) expandToggle.classList.add("is-open");
  expandToggle.dataset.id = entry.id;
  expandToggle.dataset.category = category;
  expandToggle.dataset.role = "expand";
  expandToggle.title = isExpanded ? "Liste zuklappen" : "Verse anzeigen";
  expandToggle.innerHTML =
    '<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  row.appendChild(expandToggle);

  container.appendChild(row);

  const chaptersEl = document.createElement("div");
  chaptersEl.className = "word-list-chapters";
  chaptersEl.hidden = !isExpanded;
  if (rows) populateEntryRows(chaptersEl, rows);
  container.appendChild(chaptersEl);

  return container;
}

/**
 * Rendert die Wortliste in zwei Bloecken: oben ALLE angepinnten Entities
 * (in Pin-Reihenfolge = Farb-Slot-Reihenfolge) - UNABHAENGIG von der
 * aktuell aktiven Kategorie, das ist genau der Punkt: Personen-, Orts-,
 * Zeit- UND Wort-Pins bleiben gemeinsam sichtbar, auch waehrend man z. B.
 * im "Orte"-Tab nach einem weiteren Ort blaettert (s. Anfrage
 * "gleichzeitig angezeigt"). Darunter die uebliche nach Haeufigkeit
 * sortierte (und per Suchbegriff gefilterte) Liste der GERADE AKTIVEN
 * Kategorie - OHNE die bereits angepinnten Eintraege dieser Kategorie
 * (keine Dopplung).
 *
 * Ob das Vers-/Crossref-Dropdown eines Eintrags offen ist, entscheidet
 * EINZIG `expandedKeys` (Set aus "category:id"-Schluesseln, unabhaengig
 * vom Pin-Status, s. wireWordExplorer) - frisch angepinnte Entities werden
 * automatisch hineingelegt (sinnvoller Default), koennen von dort aber
 * jederzeit per Chevron-Klick wieder entfernt (zugeklappt) werden.
 */
function renderWordList(
  listEl,
  categories,
  activeCategory,
  searchQuery,
  pinnedEntries,
  expandedKeys,
  getVersesForEntity,
  crossRefSourceMap
) {
  listEl.innerHTML = "";

  const entries = categories[activeCategory] || [];

  if (entries.length === 0 && pinnedEntries.length === 0) {
    const empty = document.createElement("p");
    empty.className = "word-list-empty";
    empty.textContent = "Für diese Kategorie sind noch keine Daten hinterlegt.";
    listEl.appendChild(empty);
    return;
  }

  const query = searchQuery.trim().toLowerCase();
  const filtered = query
    ? entries.filter((entry) =>
        // `searchName` enthaelt deutsche UND englische Schreibweise (s.
        // applyGermanDisplayNames in main.js) - wer "Moses" tippt, findet
        // den jetzt als "Mose" angezeigten Eintrag weiterhin. Faellt auf
        // `name` zurueck, wo es kein searchName gibt (Zeiten/Woerter).
        (entry.searchName || entry.name.toLowerCase()).includes(query)
      )
    : entries;

  const pinnedInActiveCategory = new Set(
    pinnedEntries.filter((p) => p.category === activeCategory).map((p) => p.id)
  );
  const unpinnedFiltered = filtered.filter(
    (entry) => !pinnedInActiveCategory.has(entry.id)
  );

  if (pinnedEntries.length === 0 && unpinnedFiltered.length === 0) {
    const empty = document.createElement("p");
    empty.className = "word-list-empty";
    empty.textContent = `Kein Treffer für „${searchQuery}“`;
    listEl.appendChild(empty);
    return;
  }

  const fragment = document.createDocumentFragment();

  if (pinnedEntries.length > 0) {
    const pinnedSection = document.createElement("div");
    pinnedSection.className = "word-list-pinned";

    // "Filter löschen" - entfernt ALLE Pins auf einen Schlag, egal aus
    // welcher Kategorie. Bisher musste man jeden Eintrag einzeln
    // anklicken, was bei vier Pins aus vier Kategorien ein Suchspiel war
    // (die ungepinnten Listen wechseln ja mit dem Tab).
    const pinnedHeader = document.createElement("div");
    pinnedHeader.className = "word-list-pinned-header";
    const clearPinsBtn = document.createElement("button");
    clearPinsBtn.type = "button";
    clearPinsBtn.className = "word-pins-clear";
    clearPinsBtn.dataset.role = "clear-pins";
    clearPinsBtn.textContent = "Filter löschen";
    clearPinsBtn.title = "Alle angepinnten Einträge entfernen";
    pinnedHeader.appendChild(clearPinsBtn);
    pinnedSection.appendChild(pinnedHeader);
    pinnedEntries.forEach((pinnedEntry, colorIndex) => {
      // Anzeige-Metadaten (Name/Zaehler/POS) kommen aus DER Kategorie-
      // Liste, zu der dieser Pin gehoert - NICHT zwingend `entries` (das
      // ist nur die gerade aktive Kategorie), UND ungefiltert von der
      // aktuellen Wortart-Filterung (ein angepinntes Wort bleibt
      // angepinnt, auch wenn seine Wortart gerade ausgeblendet ist).
      const list = categories[pinnedEntry.category] || [];
      const entry = list.find((e) => e.id === pinnedEntry.id);
      if (!entry) return; // sollte nicht vorkommen, Sicherheitsnetz
      const key = `${pinnedEntry.category}:${pinnedEntry.id}`;
      const isExpanded = expandedKeys.has(key);
      const rows = isExpanded
        ? buildOverlapAnnotatedRows(
            pinnedEntry.category,
            pinnedEntry.id,
            pinnedEntries,
            getVersesForEntity,
            crossRefSourceMap
          )
        : null;
      pinnedSection.appendChild(
        createWordListEntry({
          entry,
          category: pinnedEntry.category,
          colorIndex,
          isExpanded,
          rows,
        })
      );
    });
    fragment.appendChild(pinnedSection);
  }

  if (unpinnedFiltered.length > 0) {
    const mainSection = document.createElement("div");
    mainSection.className = "word-list-main";
    unpinnedFiltered.forEach((entry) => {
      const key = `${activeCategory}:${entry.id}`;
      const isExpanded = expandedKeys.has(key);
      const rows = isExpanded
        ? getEntityEntryRows(
            getVersesForEntity,
            crossRefSourceMap,
            activeCategory,
            entry.id
          )
        : null;
      mainSection.appendChild(
        createWordListEntry({
          entry,
          category: activeCategory,
          colorIndex: null,
          isExpanded,
          rows,
        })
      );
    });
    fragment.appendChild(mainSection);
  } else if (query) {
    const empty = document.createElement("p");
    empty.className = "word-list-empty";
    empty.textContent = `Kein Treffer für „${searchQuery}“`;
    fragment.appendChild(empty);
  }

  listEl.appendChild(fragment);
}

/**
 * Verdrahtet den Pill-Segmented-Control (Personen/Orte/Zeiten/Woerter),
 * die Wortart-Filter-Chips (nur bei "Woerter" sichtbar), die
 * Wortsuchleiste darunter und die Ergebnisliste.
 *
 * Klick auf eine Entity (Haupt-Zeile): pinnt sie an (bis zu
 * MAX_PINNED_PERSONS gleichzeitig INSGESAMT, kategorieuebergreifend -
 * weitere Klicks bei vollen Slots werden ignoriert) bzw. entfernt sie
 * wieder, falls sie bereits angepinnt ist - `onPinsChange(pinnedEntries)`
 * wird bei JEDER Aenderung mit der kompletten, aktuellen Liste (Array aus
 * {id, category}) aufgerufen (main.js baut daraus Farb-/Highlight-State
 * neu auf). EIN TAB-WECHSEL AENDERT DIE PINS NICHT MEHR (fruehere Version
 * leerte sie beim Kategoriewechsel) - genau das ermoeglicht "Personen und
 * Orte gleichzeitig" (s. Anfrage): die Pin-Sektion bleibt kategorie-
 * uebergreifend bestehen, nur die durchsuchbare Liste darunter wechselt.
 * Neu angepinnte Entities werden automatisch in `expandedKeys`
 * aufgenommen (sinnvoller Default, sofort sichtbare Liste), lassen sich
 * von dort aber jederzeit per Chevron-Klick wieder zuklappen - Pin-Status
 * und Dropdown-offen-Status sind bewusst ZWEI GETRENNTE Zustaende.
 *
 * Klick auf eine Vers-Zeile im Dropdown ruft `onVerseSelect(book, chapter,
 * verse)`, Klick auf eine Crossref-Zeile `onCrossRefSelect(source,
 * target)` - beide von main.js uebergeben, kategorie-unabhaengig (Vers-
 * Navigation braucht nur Buch/Kapitel/Vers). Hover ueber eine Vers-/
 * Crossref-Zeile (NICHT ueber die Haupt-Zeile) loest zusaetzlich
 * `onVerseHover`/`onCrossRefHover` (und beim Verlassen deren -End-
 * Pendants) aus - main.js nutzt das, um denselben visuellen Effekt wie
 * ein echter Hover auf den Kapitel-Balken bzw. Bogen in der
 * Visualisierung zu erzeugen.
 *
 * Wortart-Filter (nur Kategorie "words"): `wordPosFilter` (Set aktiver
 * POS-Tags, Standard s. DEFAULT_ACTIVE_WORD_POS) wird EINMALIG aus den in
 * `categories.words` tatsaechlich vorkommenden Wortarten aufgebaut (die
 * Chips selbst, s. renderPosFilterChips) und filtert die "words"-Liste
 * VOR jedem renderWordList()-Aufruf - Pins bleiben davon unberuehrt
 * (s. Kommentar in renderWordList).
 */
function wireWordExplorer({
  categories,
  // Wird beim Wechsel auf eine Kategorie aufgerufen, deren Daten noch
  // nicht geladen sind (aktuell nur "words"), und liefert ein Promise.
  // main.js laedt darin die Datei nach und traegt sie in `categories` ein
  // - der Explorer selbst weiss nicht, WOHER die Daten kommen, nur DASS
  // er danach neu rendern muss. Optional: fehlt der Callback, verhaelt
  // sich alles wie bisher.
  loadCategoryData,
  // Wird aufgerufen, BEVOR eine Entity angepinnt oder ihr Dropdown
  // aufgeklappt wird, und liefert ein Promise. main.js laedt darin bei
  // Bedarf die Detaildaten (Verse/surfaceForms) nach - erst danach
  // duerfen die synchronen getVersesForEntity-Aufrufe laufen.
  ensureEntityData,
  // Wird bei jedem Tab-Wechsel aufgerufen - main.js spiegelt die aktive
  // Kategorie damit in die URL (s. writeUrlState).
  onCategoryChange,
  getVersesForEntity,
  crossRefSourceMap,
  onPinsChange,
  onVerseSelect,
  onCrossRefSelect,
  onVerseHover,
  onVerseHoverEnd,
  onCrossRefHover,
  onCrossRefHoverEnd,
}) {
  const categoryControl = document.getElementById("word-category-control");
  const categoryOptions = Array.from(
    categoryControl.querySelectorAll(".word-category-option")
  );
  const posFilterEl = document.getElementById("word-pos-filter");
  const searchInput = document.getElementById("word-search-input");
  const listEl = document.getElementById("word-list");

  let activeCategory = "persons";
  // Kategorieuebergreifend: [{id, category}], Reihenfolge = Farb-Slot.
  let pinnedEntries = [];
  // Welche Entities (unabhaengig vom Pin-Status) ihr Vers-/Crossref-
  // Dropdown gerade aufgeklappt haben - Schluessel "category:id", damit
  // sich IDs verschiedener Kategorien nie versehentlich ueberschneiden
  // koennten (selbst wenn das bei den aktuellen Datenquellen praktisch
  // nicht vorkommt).
  let expandedKeys = new Set();

  // Wortart-Filter fuer die "words"-Kategorie - welche POS-Tags gerade
  // eingeblendet sind. Wird LAZY befuellt, sobald die Wortdaten
  // tatsaechlich vorliegen (sie werden erst beim ersten Oeffnen des
  // Wörter-Tabs geladen, s. loadCategoryData) - zum Zeitpunkt des
  // Verdrahtens ist categories.words normalerweise noch leer.
  let availablePos = [];
  let wordPosFilter = new Set();
  let posFilterInitialized = false;

  function ensurePosFilter() {
    if (posFilterInitialized) return;
    const words = categories.words || [];
    if (words.length === 0) return; // noch nichts zu filtern
    availablePos = Array.from(
      new Set(words.map((e) => e.pos).filter(Boolean))
    ).sort((a, b) => {
      // Standardmaessig aktive Wortarten zuerst (NOUN/ADJ/VERB), Rest
      // alphabetisch danach - macht die haeufigsten/relevantesten Chips
      // leichter auffindbar, statt rein alphabetisch verstreut.
      const aDefault = DEFAULT_ACTIVE_WORD_POS.has(a) ? 0 : 1;
      const bDefault = DEFAULT_ACTIVE_WORD_POS.has(b) ? 0 : 1;
      if (aDefault !== bDefault) return aDefault - bDefault;
      return a.localeCompare(b);
    });
    wordPosFilter = new Set(
      availablePos.filter((pos) => DEFAULT_ACTIVE_WORD_POS.has(pos))
    );
    posFilterInitialized = true;
  }

  // Kategorien, deren Daten gerade nachgeladen werden bzw. schon da sind.
  const loadingCategories = new Set();

  function entryKey(category, id) {
    return `${category}:${id}`;
  }

  function renderPosFilterChips() {
    posFilterEl.hidden = activeCategory !== "words";
    if (activeCategory !== "words") return;

    posFilterEl.innerHTML = "";
    const fragment = document.createDocumentFragment();
    availablePos.forEach((pos) => {
      const chip = document.createElement("button");
      chip.type = "button";
      chip.className = "word-pos-chip";
      if (wordPosFilter.has(pos)) chip.classList.add("is-active");
      chip.dataset.pos = pos;
      chip.textContent = GERMAN_POS_LABELS[pos] || pos;
      chip.setAttribute(
        "aria-pressed",
        wordPosFilter.has(pos) ? "true" : "false"
      );
      fragment.appendChild(chip);
    });
    posFilterEl.appendChild(fragment);
  }

  // Liefert `categories`, ggf. mit der "words"-Liste auf die aktuell
  // aktiven Wortarten eingeschraenkt - so bleibt renderWordList() selbst
  // unveraendert (kennt keine Wortart-Filterung), nur der hier
  // uebergebene Ausschnitt ist bereits gefiltert. Bei jeder anderen
  // Kategorie identisch zu `categories` (keine Kopie noetig).
  function getFilteredCategories() {
    if (!categories.words) return categories;
    return {
      ...categories,
      words: categories.words.filter((e) => wordPosFilter.has(e.pos)),
    };
  }

  function render() {
    ensurePosFilter();
    // Ladezustand: Daten dieser Kategorie sind unterwegs, aber noch nicht
    // da - eine kurze Meldung statt einer leeren Liste (die faelschlich
    // wie "keine Treffer" aussaehe).
    if (
      loadingCategories.has(activeCategory) &&
      (categories[activeCategory] || []).length === 0
    ) {
      posFilterEl.hidden = true;
      listEl.innerHTML = "";
      const info = document.createElement("p");
      info.className = "word-list-empty";
      info.textContent = "Wortschatz wird geladen…";
      listEl.appendChild(info);
      return;
    }
    renderPosFilterChips();
    renderWordList(
      listEl,
      getFilteredCategories(),
      activeCategory,
      searchInput.value,
      pinnedEntries,
      expandedKeys,
      getVersesForEntity,
      crossRefSourceMap
    );
  }

  function notifyPinsChange() {
    if (onPinsChange) onPinsChange(pinnedEntries.slice());
  }

  /**
   * Stellt sicher, dass die DETAILdaten einer Entity (Verse,
   * surfaceForms) geladen sind, bevor damit gearbeitet wird. Bei
   * Personen/Orten/Zeiten liegt alles ohnehin vor, bei Woertern wird der
   * passende Schnipsel nachgeladen (s. ensureEntityData in main.js).
   * Gibt ein Promise zurueck - alle Aufrufer warten es ab, weil
   * getVersesForEntity danach SYNCHRON funktionieren muss.
   */
  function withEntityData(category, id, action) {
    if (!ensureEntityData) {
      action();
      return;
    }
    Promise.resolve(ensureEntityData(category, id))
      .catch((err) => {
        console.warn(
          `Detaildaten für "${id}" konnten nicht geladen werden:`,
          err
        );
      })
      .then(action);
  }

  function togglePin(category, id) {
    const idx = pinnedEntries.findIndex(
      (p) => p.category === category && p.id === id
    );
    if (idx !== -1) {
      // Entpinnen braucht keine Daten.
      pinnedEntries.splice(idx, 1);
      expandedKeys.delete(entryKey(category, id));
      notifyPinsChange();
      render();
      return;
    }
    if (pinnedEntries.length >= MAX_PINNED_PERSONS) return; // alle 4 Slots belegt
    withEntityData(category, id, () => {
      // Nach dem Warten erneut pruefen: der Nutzer koennte zwischenzeitlich
      // andere Eintraege angepinnt haben.
      if (pinnedEntries.some((p) => p.category === category && p.id === id))
        return;
      if (pinnedEntries.length >= MAX_PINNED_PERSONS) return;
      pinnedEntries.push({ category, id });
      // Bewusst NICHT automatisch aufklappen: bei mehreren Pins wurde die
      // Sidebar sonst sofort von Vers-Listen geflutet und unuebersichtlich.
      // Das Dropdown oeffnet der Nutzer bei Bedarf ueber den Chevron.
      notifyPinsChange();
      render();
    });
  }

  /** Entfernt alle Pins - genutzt vom "Filter löschen"-Button und von
   * api.clearPins() (Home-/Reset-Button in main.js). */
  function clearAllPins() {
    if (pinnedEntries.length === 0) return;
    pinnedEntries = [];
    expandedKeys = new Set();
    notifyPinsChange();
    render();
  }

  function toggleExpanded(category, id) {
    const key = entryKey(category, id);
    if (expandedKeys.has(key)) {
      expandedKeys.delete(key);
      render();
      return;
    }
    // Aufklappen zeigt die Vers-Liste - dafuer muessen die Verse da sein.
    withEntityData(category, id, () => {
      expandedKeys.add(key);
      render();
    });
  }

  categoryOptions.forEach((option) => {
    option.addEventListener("click", () => {
      const category = option.dataset.category;
      if (category === activeCategory) return;
      activeCategory = category;
      searchInput.value = "";
      syncSearchClear();

      // Daten dieser Kategorie noch nicht da? Nachladen und danach erneut
      // rendern. Ein zweiter Klick waehrend des Ladens loest KEINEN
      // zweiten Fetch aus (loadingCategories-Merker).
      const needsData =
        (categories[category] || []).length === 0 &&
        loadCategoryData &&
        !loadingCategories.has(category);
      if (needsData) {
        loadingCategories.add(category);
        Promise.resolve(loadCategoryData(category))
          .catch((err) => {
            console.warn(
              `Daten für Kategorie "${category}" konnten nicht geladen werden:`,
              err
            );
          })
          .finally(() => {
            loadingCategories.delete(category);
            render();
          });
      }
      categoryOptions.forEach((o) => {
        const isActive = o === option;
        o.classList.toggle("is-active", isActive);
        o.setAttribute("aria-selected", isActive ? "true" : "false");
      });
      // Bewusst KEIN notifyPinsChange()/Pins-Reset hier - ein Tab-Wechsel
      // aendert nur, was in der ungepinnten Liste durchsucht wird, nicht
      // die (kategorieuebergreifenden) Pins selbst, s. Modulkommentar.
      if (onCategoryChange) onCategoryChange(activeCategory);
      render();
    });
  });

  posFilterEl.addEventListener("click", (e) => {
    const chip = e.target.closest(".word-pos-chip");
    if (!chip) return;
    const pos = chip.dataset.pos;
    if (wordPosFilter.has(pos)) wordPosFilter.delete(pos);
    else wordPosFilter.add(pos);
    render();
  });

  const searchClearBtn = document.getElementById("word-search-clear");

  function syncSearchClear() {
    searchClearBtn.hidden = searchInput.value.length === 0;
  }

  searchInput.addEventListener("input", () => {
    syncSearchClear();
    render();
  });

  searchClearBtn.addEventListener("click", () => {
    searchInput.value = "";
    syncSearchClear();
    render();
    searchInput.focus(); // Fokus bleibt im Feld - direkt weitertippen
  });

  // Auch beim Tab-Wechsel wird der Suchtext geleert (s. dort) - der
  // Button muss dann ebenfalls verschwinden.
  syncSearchClear();

  listEl.addEventListener("click", (e) => {
    if (e.target.closest('[data-role="clear-pins"]')) {
      clearAllPins();
      return;
    }

    const crossrefBtn = e.target.closest('[data-role="crossref"]');
    if (crossrefBtn) {
      if (onCrossRefSelect) {
        onCrossRefSelect(
          {
            book: crossrefBtn.dataset.book,
            chapter: parseInt(crossrefBtn.dataset.chapter, 10),
            verse: parseInt(crossrefBtn.dataset.verse, 10),
          },
          {
            bookFull: crossrefBtn.dataset.targetBook,
            bookShort: crossrefBtn.dataset.targetBookShort || undefined,
            chapter: parseInt(crossrefBtn.dataset.targetChapter, 10),
            verse: parseInt(crossrefBtn.dataset.targetVerse, 10),
          }
        );
      }
      return;
    }

    const verseBtn = e.target.closest('[data-role="verse"]');
    if (verseBtn) {
      if (onVerseSelect) {
        onVerseSelect(
          verseBtn.dataset.book,
          parseInt(verseBtn.dataset.chapter, 10),
          parseInt(verseBtn.dataset.verse, 10)
        );
      }
      return;
    }

    const expandBtn = e.target.closest('[data-role="expand"]');
    if (expandBtn) {
      toggleExpanded(expandBtn.dataset.category, expandBtn.dataset.id);
      return;
    }

    const item = e.target.closest('[data-role="select"]');
    if (!item) return;
    togglePin(item.dataset.category, item.dataset.id);
  });

  // Hover-Simulation fuer Vers-/Crossref-Zeilen im Dropdown (s.
  // Modulkommentar) - bewusst NUR auf diesen Zeilen, NICHT auf der
  // Haupt-Zeile oder dem gesamten Eintrag (das Dropdown selbst oeffnet
  // sich nicht mehr per Hover). mouseover/mouseout statt mouseenter/
  // mouseleave, weil Letztere nicht bubblen und deshalb keine Event-
  // Delegation auf listEl erlauben wuerden - die relatedTarget-Pruefung
  // gegen rowEl.contains(...) simuliert das Nicht-Bubble-Verhalten
  // manuell (kein Ausloesen beim Wechsel zwischen Kindelementen DERSELBEN
  // Zeile, z. B. dem Pfeil-Span in einer Crossref-Zeile).
  listEl.addEventListener("mouseover", (e) => {
    const rowEl = e.target.closest(
      '[data-role="verse"], [data-role="crossref"]'
    );
    if (!rowEl) return;
    if (rowEl.contains(e.relatedTarget)) return;

    if (rowEl.dataset.role === "verse") {
      if (onVerseHover) {
        onVerseHover(rowEl.dataset.book, parseInt(rowEl.dataset.chapter, 10));
      }
    } else if (onCrossRefHover) {
      onCrossRefHover(
        {
          book: rowEl.dataset.book,
          chapter: parseInt(rowEl.dataset.chapter, 10),
          verse: parseInt(rowEl.dataset.verse, 10),
        },
        {
          bookFull: rowEl.dataset.targetBook,
          bookShort: rowEl.dataset.targetBookShort || undefined,
          chapter: parseInt(rowEl.dataset.targetChapter, 10),
          verse: parseInt(rowEl.dataset.targetVerse, 10),
        }
      );
    }
  });

  listEl.addEventListener("mouseout", (e) => {
    const rowEl = e.target.closest(
      '[data-role="verse"], [data-role="crossref"]'
    );
    if (!rowEl) return;
    if (rowEl.contains(e.relatedTarget)) return;

    if (rowEl.dataset.role === "verse") {
      if (onVerseHoverEnd) {
        onVerseHoverEnd(
          rowEl.dataset.book,
          parseInt(rowEl.dataset.chapter, 10)
        );
      }
    } else if (onCrossRefHoverEnd) {
      onCrossRefHoverEnd();
    }
  });

  render();

  return {
    /** Entfernt alle Pins (z. B. beim Home-/Reset-Button, s. main.js). */
    clearPins: clearAllPins,
    /** Aktiver Tab + Pin-Reihenfolge - fuer die URL-Spiegelung. */
    getState() {
      return { category: activeCategory, pins: pinnedEntries.slice() };
    },
    /**
     * Stellt einen aus der URL gelesenen Zustand her (s. applyUrlState in
     * main.js): aktiver Tab und Pin-Liste IN DER GEGEBENEN REIHENFOLGE -
     * die bestimmt ja die Farb-Slots. Laedt fuer jeden Pin vorher die
     * noetigen Detaildaten (bei Woertern der passende Vers-Schnipsel),
     * damit die anschliessenden synchronen getVersesForEntity-Aufrufe
     * funktionieren. Unbekannte Eintraege (z. B. aus einer alten URL nach
     * einem Daten-Update) werden still uebersprungen, statt die
     * Wiederherstellung ganz scheitern zu lassen.
     */
    async restoreState({ category, pins }) {
      if (category) {
        activeCategory = category;
        categoryOptions.forEach((o) => {
          const isActive = o.dataset.category === category;
          o.classList.toggle("is-active", isActive);
          o.setAttribute("aria-selected", isActive ? "true" : "false");
        });
        // Kategorie-Daten ggf. nachladen (Woerter), sonst bliebe die Liste leer.
        if ((categories[category] || []).length === 0 && loadCategoryData) {
          loadingCategories.add(category);
          render();
          try {
            await loadCategoryData(category);
          } catch (err) {
            console.warn(
              `Daten für Kategorie "${category}" konnten nicht geladen werden:`,
              err
            );
          }
          loadingCategories.delete(category);
        }
      }

      if (pins && pins.length > 0) {
        for (const pin of pins.slice(0, MAX_PINNED_PERSONS)) {
          if (ensureEntityData) {
            try {
              await ensureEntityData(pin.category, pin.id);
            } catch (err) {
              console.warn(`Detaildaten für "${pin.id}" nicht ladbar:`, err);
              continue;
            }
          }
          pinnedEntries.push({ category: pin.category, id: pin.id });
          expandedKeys.add(entryKey(pin.category, pin.id));
        }
        notifyPinsChange();
      }
      render();
    },
    /**
     * Pinnt/entpinnt eine Entity von AUSSERHALB der Sidebar-Liste selbst -
     * ruft exakt dieselbe interne togglePin()-Funktion auf wie ein Klick
     * auf die Haupt-Zeile eines Sidebar-Eintrags (gleiche 4-Slot-Kappung,
     * gleiches expandedKeys-Verhalten, gleicher onPinsChange-Callback).
     * Genutzt von der Globe-Ansicht (s. main.js): ein Klick auf einen
     * Orts-Marker soll sich exakt so verhalten wie ein Klick auf denselben
     * Ort in der Liste - eine zweite, separat gepflegte Pin-Logik waere
     * hier ein unnoetiges Duplikat.
     */
    pinEntity(category, id) {
      togglePin(category, id);
    },
  };
}

// ========================================================================
// parser.js — Zefania-XML -> { chapters, crossRefs }
// ========================================================================

function extractCrossRefTargets(text) {
  const crossRefRegex = /\(([a-z])\)\s*([^()]+)/gi;
  const targets = [];
  for (const match of text.matchAll(crossRefRegex)) {
    const refs = match[2].split(";").map((r) => r.trim());
    for (const r of refs) {
      const parts = r.match(/^([A-Za-z0-9]+)\s+(\d+):(\d+)$/);
      if (!parts) continue;
      targets.push({
        bookShort: parts[1],
        bookFull: shortToFull[parts[1]] || parts[1],
        chapter: parseInt(parts[2], 10),
        verse: parseInt(parts[3], 10),
      });
    }
  }
  return targets;
}

function parseBible(xmlText) {
  const xml = new DOMParser().parseFromString(xmlText, "application/xml");

  const crossRefs = [];
  const chapters = [];

  const books = Array.from(xml.querySelectorAll("BIBLEBOOK")).sort(
    (a, b) =>
      bookOrder.indexOf(a.getAttribute("bname")) -
      bookOrder.indexOf(b.getAttribute("bname"))
  );

  books.forEach((book, sortedIndex) => {
    const bookName = book.getAttribute("bname");
    const colorClass = sortedIndex % 2 === 0 ? "color-a" : "color-b";

    const chapterEls = Array.from(book.querySelectorAll("CHAPTER")).sort(
      (a, b) =>
        parseInt(a.getAttribute("cnumber"), 10) -
        parseInt(b.getAttribute("cnumber"), 10)
    );

    chapterEls.forEach((chapterEl) => {
      const chapterNumber = parseInt(chapterEl.getAttribute("cnumber"), 10);
      const verseEls = Array.from(chapterEl.querySelectorAll("VERS"));

      const verseList = verseEls.map((v) => ({
        number: parseInt(v.getAttribute("vnumber"), 10),
        text: v.textContent.trim(),
      }));

      verseEls.forEach((v) => {
        const verseNumber = parseInt(v.getAttribute("vnumber"), 10);
        const targets = extractCrossRefTargets(v.textContent);
        if (targets.length === 0) return;

        crossRefs.push({
          source: {
            book: bookName,
            chapter: chapterNumber,
            verse: verseNumber,
          },
          targets,
        });
      });

      chapters.push({
        bookName,
        chapterNumber,
        colorClass,
        verseCount: verseList.length,
        verseList,
      });
    });
  });

  return { chapters, crossRefs };
}

// ========================================================================
// verseIndex.js — schnelle Lookups
// ========================================================================

function buildVerseIndex(chapters) {
  const chapterByKey = new Map();
  const verseByKey = new Map();
  const knownBookNames = new Set();

  chapters.forEach((chapter, chapterPosition) => {
    knownBookNames.add(chapter.bookName);
    const chapterKey = makeChapterKey(chapter.bookName, chapter.chapterNumber);
    chapterByKey.set(chapterKey, { ...chapter, position: chapterPosition });

    chapter.verseList.forEach((verse) => {
      const verseKey = makeVerseKey(
        chapter.bookName,
        chapter.chapterNumber,
        verse.number
      );
      verseByKey.set(verseKey, { verse, chapter, chapterPosition });
    });
  });

  return {
    chapterByKey,
    verseByKey,
    chapterList: chapters,
    knownBookNames,
    getChapter(bookName, chapterNumber) {
      return chapterByKey.get(makeChapterKey(bookName, chapterNumber));
    },
    getVerse(bookName, chapterNumber, verseNumber) {
      return verseByKey.get(makeVerseKey(bookName, chapterNumber, verseNumber));
    },
  };
}

function makeChapterKey(bookName, chapterNumber) {
  return `${bookName}|${chapterNumber}`;
}

function makeVerseKey(bookName, chapterNumber, verseNumber) {
  return `${bookName}|${chapterNumber}|${verseNumber}`;
}

function resolveUnknownBookName(rawShort, knownBookNames) {
  const normalize = (s) => s.toLowerCase().replace(/[.\s]/g, "");
  const normalizedShort = normalize(rawShort);

  for (const fullName of knownBookNames) {
    const normalizedFull = normalize(fullName);
    if (
      normalizedFull.startsWith(normalizedShort) ||
      normalizedShort.startsWith(normalizedFull)
    ) {
      return fullName;
    }
  }
  return null;
}

function resolveCrossRefTargets(crossRefs, knownBookNames) {
  let resolvedCount = 0;
  const unresolvedShorts = new Set();

  crossRefs.forEach((ref) => {
    ref.targets.forEach((target) => {
      if (knownBookNames.has(target.bookFull)) return;
      const resolved = resolveUnknownBookName(target.bookShort, knownBookNames);
      if (resolved) {
        target.bookFull = resolved;
        resolvedCount += 1;
      } else {
        unresolvedShorts.add(target.bookShort);
      }
    });
  });

  return { resolvedCount, unresolvedShorts };
}

// ========================================================================
// tooltip.js
// ========================================================================

function createTooltip() {
  const el = document.createElement("div");
  Object.assign(el.style, {
    position: "absolute",
    background: "rgba(0,0,0,0.75)",
    color: "#fff",
    padding: "4px 8px",
    borderRadius: "4px",
    pointerEvents: "none",
    fontSize: "12px",
    display: "none",
    zIndex: 9999,
  });
  document.body.appendChild(el);

  return {
    show(text, x, y) {
      el.innerText = text;
      el.style.display = "block";
      el.style.left = `${x + 10}px`;
      el.style.top = `${y + 10}px`;
    },
    move(x, y) {
      el.style.left = `${x + 10}px`;
      el.style.top = `${y + 10}px`;
    },
    hide() {
      el.style.display = "none";
    },
  };
}

// ========================================================================
// chapterBars.js — rendert INNERHALB von #bible-container
// ========================================================================

function renderChapterBars(container, viewportEl, chapters) {
  const fragment = document.createDocumentFragment();
  const bars = [];

  chapters.forEach((chapter) => {
    const bar = document.createElement("div");
    bar.classList.add("chapter-bar", chapter.colorClass);
    bar.style.height = `${chapter.verseCount}px`;
    bar.dataset.book = chapter.bookName;
    bar.dataset.chapter = chapter.chapterNumber;
    bar.dataset.verses = chapter.verseCount;

    fragment.appendChild(bar);
    bars.push(bar);
  });

  container.appendChild(fragment);
  layoutChapterBars(container, viewportEl, bars);
  return bars;
}

/**
 * Positioniert die (bereits vorhandenen) Balken neu: Container-Breite/
 * -Hoehe sowie jeder einzelne margin-right. Im Unterschied zu
 * renderChapterBars() (das die Balken-ELEMENTE nur einmalig erzeugt) ist
 * das hier bewusst wiederverwendbar - wird sowohl initial (aus
 * renderChapterBars) als auch bei jeder Aenderung der verfuegbaren Breite
 * erneut aufgerufen (Sidebar auf-/zuklappen, Fenster-Resize), damit sich
 * die Balkenreihe wieder wie gewohnt anpasst.
 *
 * Misst dafuer ABSICHTLICH viewportEl (.zoom-viewport), NICHT container
 * (#bible-container) selbst: letzterer hat seit dem Zoom-Fix eine FESTE,
 * von hier aus gesetzte Pixelbreite (s.u.) - eine erneute Messung an ihm
 * selbst wuerde also immer nur seinen eigenen letzten Wert zurueckgeben,
 * nie die tatsaechlich (durch Sidebar/Fenster) verfuegbare Breite.
 */
function layoutChapterBars(container, viewportEl, bars) {
  const containerWidth = viewportEl.clientWidth;
  const containerHeight = viewportEl.clientHeight;
  // Explizite Pixelwerte statt der ererbten width:100%/height:100% aus
  // style.css: CSS zoom (s. createZoomController) veraendert unerwartet,
  // wie PROZENT-Angaben auf dem gezoomten Element selbst aufgeloest
  // werden (empirisch verifiziert: width:100% wurde unter zoom:8 zu
  // 158px statt der korrekten 1264px). Mit einer fest gesetzten
  // Pixelbreite tritt dieser Effekt nicht auf.
  container.style.width = `${containerWidth}px`;
  container.style.height = `${containerHeight}px`;

  const barWidth = parseFloat(
    getComputedStyle(document.documentElement).getPropertyValue("--bar-width")
  );
  // clientWidth SCHLIESST das horizontale Padding (links/rechts 30px, s.
  // #bible-container in style.css) mit ein - die Balken werden aber als
  // Flex-Kinder INNERHALB der Content-Box angeordnet, also NACH Abzug
  // dieses Paddings.
  const containerStyle = getComputedStyle(container);
  const paddingLeft = parseFloat(containerStyle.paddingLeft) || 0;
  const paddingRight = parseFloat(containerStyle.paddingRight) || 0;
  const availableWidth = containerWidth - paddingLeft - paddingRight;

  const totalBars = bars.length;
  const rawGap = (availableWidth - totalBars * barWidth) / (totalBars - 1);
  const unitStep = barWidth + rawGap;

  // Jede Balken-STARTPOSITION (i * unitStep) wird einzeln auf 1/64px
  // gerundet (statt einen einzigen ungerundeten gap-Wert zu wiederholen)
  // - verhindert die beim Zoomen sichtbare Rundungsdrift zwischen
  // benachbarten Balken (ausfuehrlich hergeleitet und per Pixel-Analyse
  // verifiziert, s. Chat-Verlauf). 1/64px statt ganzer Pixel, damit auch
  // nach starkem Zoom (bis 8x) kein sichtbarer Restfehler bleibt.
  const ROUND_RESOLUTION = 64;

  let previousRoundedPos = 0;
  bars.forEach((bar, index) => {
    if (index < totalBars - 1) {
      const nextRoundedPos =
        Math.round((index + 1) * unitStep * ROUND_RESOLUTION) /
        ROUND_RESOLUTION;
      bar.style.marginRight = `${
        nextRoundedPos - previousRoundedPos - barWidth
      }px`;
      previousRoundedPos = nextRoundedPos;
    } else {
      bar.style.marginRight = "0";
    }
  });
}

function getBarPositions(bars) {
  return bars.map((bar) => {
    const rect = bar.getBoundingClientRect();
    return { x: rect.left + rect.width / 2, y: rect.top };
  });
}

// ========================================================================
// chapterGrid.js — Alternative Darstellung: alle Kapitel als gleich
// grosse Quadrate (Gen 1 oben links, letztes Offenbarung-Kapitel unten
// rechts), s. vis-mode-picker. Bewusst KEIN Zoom/Pan (anders als die
// Bogen-Ansicht) - die Quadrate sind gross genug, um ohne Zoom bequem
// klickbar zu sein.
// ========================================================================

// Abstand zwischen den Quadraten - klein genug, um bei ueber 1000
// Kapiteln (komplette Bibel) noch spuerbar Platz fuer die Quadrate selbst
// zu lassen, aber gross genug, um Buchgrenzen optisch erkennbar zu halten.
const GRID_GAP = 2;
// Nur eine OBERE Grenze fuer die Kantenlaenge eines Quadrats (verhindert
// bei SEHR wenigen Kapiteln unrealistisch riesige Quadrate) - bewusst
// KEINE untere Grenze mehr (s. computeGridLayout, warum eine Untergrenze
// dort zu einem Overflow-Bug fuehrte).
const GRID_CELL_MAX = 64;

/**
 * Sucht die Spaltenzahl, die die verfuegbare Flaeche (availableWidth x
 * availableHeight) mit MOEGLICHST GROSSEN, aber weiterhin exakt
 * quadratischen Zellen fuellt - reine Suche ueber alle moeglichen
 * Spaltenzahlen (1..count), bei ueblichen Kapitelzahlen (max. ca. 1200,
 * komplette Bibel) voellig unproblematisch performant (ein Durchlauf mit
 * simpler Arithmetik, keine DOM-Zugriffe).
 *
 * WICHTIG (Bug 1): pro Spalte/Zeile wird der Platzbedarf der GRID_GAP-
 * Abstaende ZWISCHEN den Zellen explizit abgezogen, BEVOR durch die
 * Spalten-/Zeilenzahl geteilt wird - (columns-1) Luecken bei `columns`
 * Zellen, analog fuer Zeilen. Eine fruehere Version teilte die volle
 * verfuegbare Breite/Hoehe direkt durch die Spalten-/Zeilenzahl, OHNE die
 * Luecken zu beruecksichtigen - bei vielen Spalten (z. B. 47 bei der
 * vollstaendigen Bibel) summierten sich die (columns-1) uebersehenen
 * 2px-Luecken zu einem deutlichen Overflow auf (46 * 2px = 92px bei 47
 * Spalten, empirisch verifiziert) - das Grid ragte seitlich ueber die
 * Visbox hinaus.
 *
 * WICHTIG (Bug 2): cellSize wird NUR NACH OBEN geklemmt (GRID_CELL_MAX),
 * NIEMALS nach unten. Eine fruehere Version klemmte zusaetzlich nach UNTEN
 * (GRID_CELL_MIN) - das war ein Bug: `bestColumns` wurde fuer das
 * UNGEKLEMMTE `bestSize` ermittelt; wurde `bestSize` danach auf ein
 * groesseres Minimum hochgeklemmt, blieb die Spaltenzahl UNVERAENDERT,
 * wodurch `columns * clampedCellSize` die verfuegbare Breite/Hoehe
 * ueberschritt. Eine reine Nach-oben-Klemmung kann das NIE verursachen:
 * sie macht `cellSize` hoechstens KLEINER als der fuer `bestColumns`
 * errechnete Wert, wodurch der Grid nur schrumpft, nie waechst.
 */
function computeGridLayout(count, availableWidth, availableHeight) {
  let bestColumns = 1;
  let bestSize = 0;
  for (let columns = 1; columns <= count; columns++) {
    const rows = Math.ceil(count / columns);
    const widthForCells = availableWidth - (columns - 1) * GRID_GAP;
    const heightForCells = availableHeight - (rows - 1) * GRID_GAP;
    // Bei SEHR vielen Spalten/Zeilen relativ zur verfuegbaren Flaeche
    // koennten allein schon die Luecken mehr Platz beanspruchen als
    // vorhanden ist - dieser Kandidat ist dann schlicht nicht umsetzbar,
    // wird uebersprungen statt mit einer negativen Groesse weiterzurechnen.
    if (widthForCells <= 0 || heightForCells <= 0) continue;
    const size = Math.min(widthForCells / columns, heightForCells / rows);
    if (size > bestSize) {
      bestSize = size;
      bestColumns = columns;
    }
  }
  const cellSize = Math.min(GRID_CELL_MAX, bestSize);
  return { columns: bestColumns, cellSize };
}

/**
 * Erzeugt EINMALIG die Quadrat-Elemente (analog zu renderChapterBars) -
 * `chapters` liegt bereits in kanonischer Bibel-Reihenfolge vor (s.
 * parseBible: Buchreihenfolge + aufsteigende Kapitelnummer je Buch), CSS
 * Grid fuellt von links nach rechts, oben nach unten - Gen 1 landet
 * dadurch automatisch oben links, das letzte Offenbarung-Kapitel unten
 * rechts, ohne dass hier zusaetzliche Sortierung noetig waere.
 */
function renderChapterGrid(container, chapters) {
  const fragment = document.createDocumentFragment();
  const squares = [];

  chapters.forEach((chapter) => {
    const square = document.createElement("div");
    square.classList.add("chapter-square", chapter.colorClass);
    square.dataset.book = chapter.bookName;
    square.dataset.chapter = chapter.chapterNumber;
    square.title = `${germanBookName(chapter.bookName)} ${
      chapter.chapterNumber
    }`;

    fragment.appendChild(square);
    squares.push(square);
  });

  container.appendChild(fragment);
  return squares;
}

/**
 * Positioniert die Zellen neu (analog zu layoutChapterBars) - berechnet
 * Spaltenzahl/Zellgroesse fuer die aktuell verfuegbare Flaeche und setzt
 * sie als CSS-Grid-Eigenschaften auf `container`. Wird sowohl initial als
 * auch bei jeder Aenderung der verfuegbaren Flaeche erneut aufgerufen
 * (Sidebar-Toggle, Fenster-Resize, Wechsel IN die Grid-Ansicht).
 *
 * WICHTIG: `viewportEl.clientWidth`/`clientHeight` schliessen dessen
 * EIGENES Padding mit ein (das ist die "genuegend Padding um das Grid"-
 * Flaeche, s. .grid-viewport in style.css) - werden sie unveraendert als
 * verfuegbare Breite/Hoehe fuer das Grid selbst verwendet, wird das
 * Padding effektiv IGNORIERT und das Grid faellt genau um die Padding-
 * Summe zu gross aus (ragt in bzw. ueber das Padding hinaus). Deshalb
 * hier explizit das tatsaechliche CSS-Padding abziehen, bevor
 * computeGridLayout aufgerufen wird.
 */
function layoutChapterGrid(container, viewportEl, count) {
  const viewportStyle = getComputedStyle(viewportEl);
  const paddingX =
    parseFloat(viewportStyle.paddingLeft) +
    parseFloat(viewportStyle.paddingRight);
  const paddingY =
    parseFloat(viewportStyle.paddingTop) +
    parseFloat(viewportStyle.paddingBottom);
  const availableWidth = viewportEl.clientWidth - paddingX;
  const availableHeight = viewportEl.clientHeight - paddingY;

  const { columns, cellSize } = computeGridLayout(
    count,
    availableWidth,
    availableHeight
  );
  const rows = Math.ceil(count / columns);

  container.style.gridTemplateColumns = `repeat(${columns}, ${cellSize}px)`;
  container.style.gridAutoRows = `${cellSize}px`;
  container.style.gap = `${GRID_GAP}px`;
  // Explizite Breite/Hoehe, damit .grid-viewport (flex, s. style.css) das
  // Grid zuverlaessig zentriert, statt es (mangels intrinsischer Groesse
  // eines CSS-Grid-Containers in manchen Faellen) zu strecken.
  container.style.width = `${columns * cellSize + (columns - 1) * GRID_GAP}px`;
  container.style.height = `${rows * cellSize + (rows - 1) * GRID_GAP}px`;
}

/**
 * Markiert/entmarkiert ein Kapitel-Element (Balken ODER Quadrat) als
 * "aktiv" (aktuell geoeffnetes Kapitel bzw. Quelle/Ziel des aktiven
 * Querverweises) - reine DOM-Klassen-Zuweisung, von updateActiveBars in
 * main.js fuer BEIDE Darstellungen (bars[i]/squares[i]) gleichermassen
 * genutzt, damit is-active in Boegen- UND Grid-Ansicht konsistent
 * funktioniert, auch wenn die jeweils andere gerade unsichtbar ist.
 */
function applyChapterActiveClass(el, isActive) {
  el.classList.toggle("is-active", isActive);
}

/**
 * Setzt/entfernt die Personen-Faerbung eines Kapitel-Elements (Balken
 * ODER Quadrat) - `matchingColorIndexes` sind die Pin-Slot-Indizes ALLER
 * angepinnten Personen, die dieses Kapitel betreffen (leer = keine
 * Ueberschneidung -> ausgegraut, ein Eintrag = einzelne Slot-Farbe,
 * mehrere -> per multiplyBlendColors() gemischt). Von updatePersonHighlight
 * in main.js fuer BEIDE Darstellungen genutzt - exakt derselbe Grund wie
 * bei applyChapterActiveClass oben.
 */
function applyChapterPersonState(el, matchingColorIndexes) {
  if (matchingColorIndexes.length === 0) {
    el.classList.remove("is-person-active");
    el.classList.add("is-person-dimmed");
    el.style.removeProperty("--person-bg");
  } else {
    el.classList.remove("is-person-dimmed");
    el.classList.add("is-person-active");
    const colors = matchingColorIndexes.map(readPersonColor);
    el.style.setProperty("--person-bg", multiplyBlendColors(colors));
  }
}

function clearChapterPersonState(el) {
  el.classList.remove("is-person-active", "is-person-dimmed");
  el.style.removeProperty("--person-bg");
}

// ========================================================================
// mapView.js — dritte Darstellung: echte Vektor-Karte mit Orts-Markern
// und Querverweis-Boegen, s. vis-mode-picker ("Karte" neben "Bögen"/
// "Grid").
// ========================================================================
// ARCHITEKTUR-WECHSEL (s. Chat): Diese Ansicht war zuvor eine selbst
// gebaute Three.js-Kugel mit Natural-Earth-Umrisslinien. Das sah zwar
// passend monochrom aus, hatte aber zwei prinzipielle Grenzen: es gab
// keine Staedte/Gewaesser/Relief, und - schlimmer - der Detailgrad war
// KONSTANT, d. h. Reinzoomen brachte keine zusaetzliche Information
// (empirisch: bei starkem Zoom eine praktisch leere Flaeche).
//
// Jetzt: MapLibre GL JS (Open-Source-Fork von Mapbox GL JS, BSD-Lizenz)
// mit Vektor-Tiles von OpenFreeMap. Das ist derselbe Ansatz, den auch die
// vom Nutzer als Vorbild genannte Referenzseite verwendet (dort Mapbox GL
// mit mapbox-streets/-terrain, s. Chat-Analyse) - nur mit einem
// kostenlosen, schluessellosen Tile-Server statt eines kostenpflichtigen
// Anbieters. Dadurch:
// - echte Basiskarte mit Staedten, Gewaessern, Grenzen, Beschriftungen,
//   mit ZOOMABHAENGIGEM Detailgrad (das eigentliche Ziel)
// - Globus-Projektion weiterhin moeglich (MapLibre v5 "globe") - die
//   bisherige Kugel-Optik bleibt also erhalten
// - Marker/Beschriftungen werden in BILDSCHIRM-Pixeln bemessen, nicht in
//   Weltgroessen: das frueher gemeldete "Bubbles/Ortsnamen werden beim
//   Zoom extrem gross" kann strukturell nicht mehr auftreten
// - Beschriftungs-Entzerrung uebernimmt MapLibres eingebaute Kollisions-
//   erkennung; die frueher noetige eigene Greedy-Winkelabstand-Heuristik
//   (GLOBE_LABEL_MIN_ANGLE) entfaellt ersatzlos
//
// MONOCHROM (ausdruecklicher Wunsch, s. Chat): OpenFreeMap bietet
// "positron" (hell, graustufig) und "dark" - beide von Haus aus
// monochrom und damit exakt passend zum Light-/Dark-Theme der App. Es
// braucht also keinen handgepflegten eigenen Style.
//
// TRADE-OFF (bewusst, mit dem Nutzer abgestimmt): Die Kacheln kommen zur
// Laufzeit von tiles.openfreemap.org. Das bricht mit dem sonstigen
// "alles lokal"-Prinzip der App (Three.js/MapLibre selbst liegen
// weiterhin lokal, s. index.html) - ohne Netzwerk bleibt die Basiskarte
// grau, Marker/Boegen/Interaktion funktionieren aber weiterhin.

// Kartenstile je Theme (s. o.) - beide monochrom.
const MAP_STYLE_LIGHT = "https://tiles.openfreemap.org/styles/positron";
const MAP_STYLE_DARK = "https://tiles.openfreemap.org/styles/dark";

// Startausschnitt: Naher Osten (grober Schwerpunkt der biblischen Orte) -
// gleiche Begruendung wie zuvor bei der Three.js-Kugel, nur jetzt als
// Karten-Center/Zoom statt als Kameraposition.
const MAP_INITIAL_CENTER = [35, 31];
// Startzoom so gewaehlt, dass die Erde als GANZE KUGEL formatfuellend im
// Bild steht (Rand ringsum sichtbar), zentriert auf den Nahost-Schwerpunkt
// der biblischen Orte. Deutlich groesser und der Globus fuellt den
// Container randlos - die Projektion bleibt dann zwar spaerisch, die
// Kugelform ist aber nicht mehr erkennbar; deutlich kleiner und die Kugel
// verliert sich als Murmel in einer leeren Flaeche.
const MAP_INITIAL_ZOOM = 1.9;

// Marker-Radien in BILDSCHIRM-PIXELN (nicht Weltgroessen, s. o.) - der
// Wertebereich wird per Interpolation auf die Wurzel der Vers-Haeufigkeit
// abgebildet (Spannweite 1-888 Vorkommen; Wurzel statt linear, damit
// Ausreisser wie Jerusalem die uebrigen Marker nicht zu Punkten
// degradieren - dieselbe Ueberlegung wie in der frueheren Kugel-Version).
const MAP_MARKER_MIN_RADIUS = 3;
const MAP_MARKER_MAX_RADIUS = 14;

// Orts-zu-Orts-Querverweis-Boegen: einheitliche, dezente Akzentfarbe
// (Nutzer-Entscheidung, s. Chat) statt distanzbasierter Farbskala.
const MAP_ARC_OPACITY = 0.35;
const MAP_ARC_WIDTH = 1;
const MAP_ARC_HOVER_WIDTH = 2.5;
// Stuetzpunkte pro Bogen. Ein Grosskreis-Bogen muss auf der Karte als
// Polylinie approximiert werden; 48 Segmente sind auch bei sehr weiten
// Verbindungen (z. B. Tarschisch <-> Midian) noch sichtbar glatt.
const MAP_ARC_SEGMENTS = 48;
// Woelbung der Boegen, als Anteil der Distanz zwischen den Endpunkten.
// Anders als bei der 3D-Kugel (wo die Woelbung RADIAL nach aussen ging)
// ist das hier ein seitlicher Versatz in der Kartenebene - dadurch bleiben
// mehrere Verbindungen zwischen denselben Regionen unterscheidbar, statt
// als eine einzige Linie zu verschmelzen.
const MAP_ARC_CURVATURE = 0.22;

/**
 * Interpoliert einen leicht gewoelbten Bogen zwischen zwei Orten als
 * Liste von [lon, lat]-Stuetzpunkten (GeoJSON-Konvention).
 *
 * Die Woelbung entsteht durch einen quadratischen Bezier-Kontrollpunkt,
 * der senkrecht zur Verbindungslinie versetzt liegt (Betrag: Distanz *
 * MAP_ARC_CURVATURE). Bewusst in Lon/Lat-Ebene gerechnet und NICHT als
 * echter Grosskreis: MapLibre zeichnet LineStrings ohnehin geodaetisch
 * interpoliert, und ein zusaetzlicher Grosskreis-Umweg wuerde die
 * gewuenschte, gleichmaessige Bogenoptik eher stoeren als verbessern.
 *
 * Die Wahl der Versatzrichtung (immer dieselbe Seite relativ zur
 * Richtung A->B) ist bewusst deterministisch: dadurch woelben sich alle
 * Boegen konsistent in dieselbe Richtung, was ein ruhigeres Gesamtbild
 * ergibt als zufaellig oder alternierend gewoelbte Linien.
 */
function buildArcCoordinates(lonA, latA, lonB, latB) {
  const midLon = (lonA + lonB) / 2;
  const midLat = (latA + latB) / 2;
  const dLon = lonB - lonA;
  const dLat = latB - latA;
  const distance = Math.sqrt(dLon * dLon + dLat * dLat);
  // Normale (senkrecht) zur Verbindungsrichtung, auf die gewuenschte
  // Woelbungshoehe skaliert.
  const controlLon = midLon - dLat * MAP_ARC_CURVATURE;
  const controlLat = midLat + dLon * MAP_ARC_CURVATURE;

  const coordinates = [];
  for (let i = 0; i <= MAP_ARC_SEGMENTS; i++) {
    const t = i / MAP_ARC_SEGMENTS;
    const inv = 1 - t;
    // Quadratische Bezierkurve: (1-t)^2*A + 2(1-t)t*C + t^2*B
    const lon = inv * inv * lonA + 2 * inv * t * controlLon + t * t * lonB;
    const lat = inv * inv * latA + 2 * inv * t * controlLat + t * t * latB;
    coordinates.push([lon, lat]);
  }
  return coordinates;
}

/**
 * Baut EINE gemeinsame FeatureCollection aus Boegen (LineString) UND
 * Orten (Point).
 *
 * WARUM ZUSAMMEN und nicht zwei getrennte Quellen (wie zunaechst gebaut):
 * Zwei GeoJSON-Quellen, im selben Aufruf angelegt, verhielten sich
 * reproduzierbar unterschiedlich - die zuerst angelegte (Boegen) erzeugte
 * normal ihre Kacheln, die zweite (Orte) nahm ihre Daten zwar an
 * (_data enthielt alle 926 Features, setData funktionierte, kein Fehler,
 * keine Exception), lieferte aber dauerhaft KEINE Kacheln:
 * querySourceFeatures() blieb bei 0, Marker und Beschriftungen daher
 * unsichtbar. Weder eine andere Quellen-ID, noch spaeteres Anlegen (erst
 * nach "load", dann zusaetzlich einen Frame spaeter), noch numerische
 * Feature-IDs, noch das verzoegerte Erzeugen der gesamten Karte haben das
 * behoben. Eine einzelne Quelle umgeht das Problem vollstaendig - und ist
 * ohnehin sparsamer: ein Tile-Index statt zwei.
 *
 * Die Trennung passiert stattdessen auf LAYER-Ebene ueber das Property
 * `kind` ("arc"/"place") als Filter - der uebliche Weg in MapLibre, wenn
 * mehrere Darstellungen aus derselben Datenquelle gespeist werden.
 * Feature-IDs sind ueber BEIDE Gruppen hinweg eindeutig durchnummeriert,
 * damit setFeatureState (Bogen-Hover) eindeutig bleibt.
 */
function buildMapGeoJson(places, placeArcs, pinColorFor, defaultColor) {
  const features = placeArcs.map((arc, index) => ({
    type: "Feature",
    id: index,
    geometry: {
      type: "LineString",
      coordinates: buildArcCoordinates(arc.aLon, arc.aLat, arc.bLon, arc.bLat),
    },
    properties: {
      kind: "arc",
      aName: arc.aName,
      bName: arc.bName,
      weight: arc.weight,
      // Verschachtelte Objekte ueberleben die Serialisierung in
      // MapLibre-Feature-Properties nicht zuverlaessig - deshalb der
      // Beleg-Vers flach als JSON-String (s. onArcClick).
      exampleVerse: JSON.stringify(arc.exampleVerse),
    },
  }));

  places.forEach((place, i) => {
    const pinColor = pinColorFor(place.id);
    features.push({
      type: "Feature",
      id: placeArcs.length + i,
      geometry: { type: "Point", coordinates: [place.lon, place.lat] },
      properties: {
        kind: "place",
        placeId: place.id,
        name: place.name,
        count: place.count,
        sqrtCount: Math.sqrt(place.count),
        color: pinColor || defaultColor,
        pinned: pinColor ? 1 : 0,
      },
    });
  });

  return { type: "FeatureCollection", features };
}

/**
 * Baut die Kartenansicht EINMALIG auf und gibt dieselben Steuerfunktionen
 * zurueck wie die vorherige Kugel-Implementierung (refreshTheme,
 * refreshColors, resize, setActive) - main.js muss dadurch an seinen
 * Aufrufstellen nichts aendern.
 *
 * Parameter identisch zur frueheren createGlobeView, MIT EINER AUSNAHME:
 * `borderRings` entfaellt (Grenzen liefert jetzt die Basiskarte selbst,
 * borders.json wird nicht mehr gebraucht).
 */
function createMapView({
  container,
  places,
  placeArcs,
  getColorForPlace,
  onMarkerClick,
  onMarkerHover,
  onMarkerHoverEnd,
  onArcClick,
  onArcHover,
  onArcHoverEnd,
}) {
  const readVar = (name) =>
    getComputedStyle(document.documentElement).getPropertyValue(name).trim();

  function currentStyleUrl() {
    return document.documentElement.dataset.theme === "dark"
      ? MAP_STYLE_DARK
      : MAP_STYLE_LIGHT;
  }

  // `map` wird BEWUSST NICHT sofort erzeugt, sondern erst beim ersten
  // tatsaechlichen Anzeigen der Karte (s. ensureMap/setActive unten).
  //
  // GRUND (empirisch hart erarbeitet, s. Chat): Beim Seitenaufbau ist
  // #map-viewport noch [hidden], der Kartencontainer hat also 0x0 Pixel.
  // Eine in diesem Zustand konstruierte MapLibre-Karte startet zwar und
  // laedt sogar die Basiskarte, ihre danach angelegten GeoJSON-Quellen
  // bleiben aber teilweise unbrauchbar: sie nehmen Daten an (setData
  // funktioniert, _data enthaelt alle Features), erzeugen daraus jedoch
  // nie Kacheln - der zugehoerige Layer bleibt dauerhaft leer.
  // Beobachtetes Symptom: die 594 Bogen-Linien wurden gezeichnet, die 926
  // Marker/Beschriftungen NICHT, obwohl beide im selben Aufruf mit
  // nachweislich gueltigen Daten angelegt wurden (querySourceFeatures
  // lieferte 0 bei 926 vorhandenen Features). Eine identische Quelle, die
  // spaeter - bei sichtbarem Container - hinzugefuegt wurde, funktionierte
  // dagegen sofort.
  //
  // Die Karte erst bei sichtbarem, korrekt bemessenem Container zu bauen,
  // umgeht diese Klasse von Initialisierungsproblemen vollstaendig und
  // spart nebenbei Arbeit/Netzwerk, solange der Nutzer die Karte gar nicht
  // oeffnet (Standard-Ansicht ist ja "Bögen").
  let map = null;

  function createMap() {
    map = new maplibregl.Map({
      container,
      style: currentStyleUrl(),
      center: MAP_INITIAL_CENTER,
      zoom: MAP_INITIAL_ZOOM,
      // ECHTE Kugel auf ALLEN Zoomstufen.
      //
      // Wichtige Unterscheidung: MapLibres "globe" ist KEINE reine
      // Kugelprojektion, sondern ein Hybrid - es interpoliert
      // zoomabhaengig zwischen Kugel ("vertical-perspective") und
      // "mercator" und ist ab etwa Zoom 6 faktisch eine flache
      // Mercator-Karte. Genau deshalb wirkte die Karte trotz "globe"
      // beim Hineinzoomen flach und in hohen Breiten verzerrt.
      //
      // "vertical-perspective" ist die Kugelprojektion selbst, ohne
      // Mercator-Anteil: die Erde bleibt auf jeder Zoomstufe eine Kugel,
      // der Horizont bleibt gekruemmt und Flaechen behalten auch in hohen
      // Breiten ihre echten Groessenverhaeltnisse.
      attributionControl: { compact: true },
    });

    map.addControl(
      new maplibregl.NavigationControl({ showCompass: false }),
      "bottom-right"
    );
    // Scroll-Zoom bewusst etwas gedaempft: der Standardwert fuehlt sich in
    // einem eingebetteten Panel (statt einer bildschirmfuellenden Karte)
    // schnell zu ruckartig an - dieselbe Beobachtung wie beim frueheren
    // Kugel-Zoom, s. Chat ("Zoom nicht benutzerfreundlich").
    map.scrollZoom.setZoomRate(1 / 200);
    map.scrollZoom.setWheelZoomRate(1 / 200);

    appliedStyleUrl = currentStyleUrl();
    wireMapEvents();
  }

  /**
   * Setzt die ECHTE Kugelprojektion. Bewusst "vertical-perspective" und
   * NICHT "globe": MapLibres "globe" ist ein Hybrid, das zoomabhaengig
   * zwischen Kugel und Mercator interpoliert und ab etwa Zoom 6 faktisch
   * eine flache Mercator-Karte ist - genau deshalb wirkte die Karte beim
   * Hineinzoomen flach und in hohen Breiten verzerrt.
   * "vertical-perspective" bleibt auf JEDER Zoomstufe eine Kugel.
   * Muss nach jedem Style-Wechsel erneut gesetzt werden (setStyle setzt
   * die Projektion mit zurueck).
   */
  function applyProjection() {
    map.setProjection({ type: "vertical-perspective" });
  }

  /** Baut die Karte beim ERSTEN Sichtbarwerden - danach ein No-op. */
  function ensureMap() {
    if (map) return;
    createMap();
  }

  let styleReady = false;
  let hoveredArcId = null;
  // Welcher Style gerade tatsaechlich geladen ist - s. refreshTheme().
  let appliedStyleUrl = null;

  /**
   * Legt Quellen + Layer an. Muss nach JEDEM Style-Wechsel erneut
   * laufen: setStyle() verwirft alle eigenen Quellen/Layer zusammen mit
   * dem alten Style - ein in der Praxis leicht zu uebersehender
   * MapLibre-Fallstrick, deshalb explizit an das "style.load"-Event
   * gehaengt (nicht nur einmalig beim Aufbau).
   */
  function addDataLayers() {
    const accent = readVar("--accent");
    // Grundfarbe NICHT angepinnter Marker: bewusst --text-body statt des
    // blasseren --text-muted. Die Basiskarte ist selbst hellgrau (Style
    // "positron"), ein hellgrauer Marker darauf ist praktisch unsichtbar
    // (empirisch im ersten Rendering verifiziert) - --text-body traegt in
    // beiden Themes genug Kontrast gegen die Kartenflaeche.
    const markerBaseColor = readVar("--text-body");
    const textColor = readVar("--text-heading");
    const haloColor = readVar("--bg-surface");

    // Erst ALLES Eigene abraeumen, dann frisch anlegen - idempotent, da
    // diese Funktion nach jedem Style-Wechsel erneut laeuft (setStyle()
    // verwirft eigene Quellen/Layer zusammen mit dem alten Style).
    ["place-labels", "place-markers", "place-arcs-line"].forEach((id) => {
      if (map.getLayer(id)) map.removeLayer(id);
    });
    if (map.getSource("bible-data")) map.removeSource("bible-data");

    // EINE gemeinsame Quelle fuer Boegen UND Orte - s. ausfuehrliche
    // Begruendung bei buildMapGeoJson.
    map.addSource("bible-data", {
      type: "geojson",
      data: buildMapGeoJson(
        places,
        placeArcs,
        getColorForPlace,
        markerBaseColor
      ),
    });

    // Boegen ZUERST (liegen damit unter den Markern) - ein Marker soll nie
    // von einer Bogenlinie verdeckt werden.
    map.addLayer({
      id: "place-arcs-line",
      type: "line",
      source: "bible-data",
      filter: ["==", ["get", "kind"], "arc"],
      layout: { "line-cap": "round", "line-join": "round" },
      paint: {
        "line-color": accent,
        "line-opacity": [
          "case",
          ["boolean", ["feature-state", "hover"], false],
          0.95,
          MAP_ARC_OPACITY,
        ],
        "line-width": [
          "case",
          ["boolean", ["feature-state", "hover"], false],
          MAP_ARC_HOVER_WIDTH,
          MAP_ARC_WIDTH,
        ],
      },
    });

    map.addLayer({
      id: "place-markers",
      type: "circle",
      source: "bible-data",
      filter: ["==", ["get", "kind"], "place"],
      paint: {
        // Radius in Pixeln, interpoliert ueber die Wurzel-Haeufigkeit -
        // KONSTANT ueber alle Zoomstufen (das ist der strukturelle Fix
        // fuer die frueher mitwachsenden "Bubbles").
        "circle-radius": [
          "interpolate",
          ["linear"],
          ["get", "sqrtCount"],
          1,
          MAP_MARKER_MIN_RADIUS,
          Math.sqrt(Math.max(...places.map((p) => p.count), 1)),
          MAP_MARKER_MAX_RADIUS,
        ],
        "circle-color": ["get", "color"],
        "circle-opacity": ["case", ["==", ["get", "pinned"], 1], 0.95, 0.75],
        "circle-stroke-width": ["case", ["==", ["get", "pinned"], 1], 2, 0.5],
        "circle-stroke-color": haloColor,
      },
    });

    // Eigene Orts-Beschriftungen ZUSAETZLICH zu denen der Basiskarte -
    // die Basiskarte kennt moderne Staedte, nicht die biblischen
    // Ortsnamen. Kollisionserkennung/Entzerrung uebernimmt MapLibre
    // automatisch (s. Modulkommentar), inkl. Ausblenden bei Platzmangel;
    // eine eigene Heuristik wie frueher ist nicht mehr noetig.
    map.addLayer({
      id: "place-labels",
      type: "symbol",
      source: "bible-data",
      filter: ["==", ["get", "kind"], "place"],
      layout: {
        // MUSS explizit gesetzt werden. MapLibres Default-Fontstack ist
        // ["Open Sans Regular", "Arial Unicode MS Regular"] - den liefert
        // der Glyphen-Server von OpenFreeMap NICHT (verifiziert: 404 fuer
        // "Open Sans Regular", 200 fuer "Noto Sans Regular").
        //
        // Die Folge eines fehlenden Fontstacks ist drastischer als man
        // erwartet: der fehlgeschlagene Glyphen-Request laesst nicht nur
        // die Beschriftungen weg, er bricht das Parsen der GESAMTEN
        // Kachel - und damit liefert die komplette Quelle keine Features
        // mehr, also auch keine Marker und keine Boegen. Genau das war
        // die Ursache der lange gesuchten "Quelle hat Daten, rendert aber
        // nichts"-Symptomatik (querySourceFeatures() == 0 bei 926
        // vorhandenen Features, ohne Exception und ohne MapLibre-Fehler).
        // Isoliert nachgestellt in repro2.html: dieselben Daten rendern
        // mit falschem Fontstack 0 Features, mit diesem hier 926 Marker,
        // 620 Boegen und 50 Beschriftungen.
        "text-font": ["Noto Sans Regular"],
        "text-field": ["get", "name"],
        "text-size": 12,
        "text-offset": [0, 1.1],
        "text-anchor": "top",
        // Haeufigere Orte gewinnen bei Platzkonkurrenz - MapLibre
        // sortiert aufsteigend nach diesem Wert und platziert kleine
        // Werte zuerst, deshalb der negierte Zaehler.
        "symbol-sort-key": ["-", 0, ["get", "count"]],
        "text-allow-overlap": false,
      },
      paint: {
        "text-color": textColor,
        "text-halo-color": haloColor,
        "text-halo-width": 1.5,
      },
    });

    styleReady = true;
  }

  // MapLibre meldet Style-/Tile-/Layer-Fehler ausschliesslich ueber dieses
  // Event - ohne Handler scheitern fehlerhafte Layer-Definitionen STILL
  // (die Karte rendert weiter, die eigenen Layer fehlen aber kommentarlos).
  /** Haengt alle Karten-Event-Handler an - erst nach createMap()
   * aufrufbar, da sie alle `map` voraussetzen. */
  function wireMapEvents() {
    map.on("error", (e) => {
      console.warn("Karte (MapLibre):", (e && e.error && e.error.message) || e);
    });

    // WANN die eigenen Quellen/Layer angelegt werden, ist hier heikler als
    // es aussieht - zwei Fallstricke, beide empirisch aufgetreten:
    //
    // 1) NICHT auf "styledata": das feuert bereits waehrend der Style noch
    //    initialisiert wird. Eine in diesem Moment angelegte GeoJSON-Quelle
    //    wird zwar akzeptiert (setData funktioniert, die Daten liegen an),
    //    ist aber nicht sauber an den fertigen Style gebunden - sie
    //    erzeugt nie Kacheln. Symptom: die Quelle meldet ihre Features,
    //    querySourceFeatures()/der Layer liefern aber dauerhaft 0 (genau so
    //    beobachtet: Boegen sichtbar, Marker nicht - obwohl beide im selben
    //    Aufruf angelegt wurden).
    // 2) NICHT nur einmalig: ein Theme-Wechsel ruft setStyle() auf, was
    //    alle eigenen Quellen/Layer mit dem alten Style verwirft. Sie
    //    muessen danach neu angelegt werden.
    //
    // Deshalb: erstmalig auf "load" (Style UND erste Kacheln bereit), danach
    // bei jedem echten Style-Wechsel erneut auf "style.load".
    let initialLoadDone = false;
    map.on("load", () => {
      initialLoadDone = true;
      // Projektion erst HIER setzen: die gleichnamige Konstruktor-Option
      // wurde in dieser MapLibre-Version stillschweigend ignoriert (die
      // Karte blieb Mercator, inkl. horizontal wiederholter Weltkopien),
      // und ein setProjection() direkt nach der Konstruktion wirft
      // "Style is not done loading."
      applyProjection();
      // Einen Frame warten, bevor eigene Quellen/Layer angelegt werden:
      // "load" feuert zwar, sobald Style und erste Kacheln bereit sind,
      // MapLibre ist danach aber noch einen Tick mit dem Einrichten seiner
      // internen Source-Caches beschaeftigt. Wurden in genau diesem Tick
      // MEHRERE GeoJSON-Quellen nacheinander angelegt, blieb die zweite
      // funktionsunfaehig (nahm Daten an, erzeugte aber nie Kacheln) -
      // deshalb liefen die Boegen, die Marker nicht.
      addDataLayers();
    });
    // Nach einem Theme-Wechsel (setStyle) muessen die eigenen Quellen/Layer
    // neu angelegt werden - sie werden zusammen mit dem alten Style
    // verworfen. Bewusst "styledata" statt "style.load": bei aehnlichen
    // Styles aktualisiert MapLibre per DIFF, wobei zwar unsere Layer
    // entfernt werden, ein "style.load" aber NICHT mehr feuert - die
    // Karte blieb dann dauerhaft ohne Marker/Boegen (beobachtet beim
    // Umschalten auf Dark Mode). "styledata" feuert bei jeder
    // Style-Aenderung; die Layer-Existenzpruefung macht das Wiederanlegen
    // idempotent und guenstig.
    map.on("styledata", () => {
      if (!initialLoadDone) return; // der erste Durchlauf laeuft ueber "load"
      // "styledata" feuert auch MITTEN im Style-Wechsel, wenn der neue
      // Style noch nicht vollstaendig steht. Quellen/Layer dort anzulegen
      // warf "Cannot read properties of undefined" - erst abwarten, bis
      // der Style wirklich geladen ist.
      if (!map.isStyleLoaded()) return;
      if (map.getLayer("place-markers")) return;
      addDataLayers();
    });

    // ---- Hover/Klick -----------------------------------------------------
    map.on("mousemove", "place-markers", (e) => {
      if (!e.features || e.features.length === 0) return;
      map.getCanvas().style.cursor = "pointer";
      const f = e.features[0];
      if (onMarkerHover)
        onMarkerHover(
          f.properties.placeId,
          e.originalEvent.clientX,
          e.originalEvent.clientY
        );
    });

    map.on("mouseleave", "place-markers", () => {
      map.getCanvas().style.cursor = "";
      if (onMarkerHoverEnd) onMarkerHoverEnd();
    });

    map.on("click", "place-markers", (e) => {
      if (!e.features || e.features.length === 0) return;
      if (onMarkerClick) onMarkerClick(e.features[0].properties.placeId);
    });

    map.on("mousemove", "place-arcs-line", (e) => {
      if (!e.features || e.features.length === 0) return;
      map.getCanvas().style.cursor = "pointer";
      const f = e.features[0];
      // Nur der zuletzt gehoverte Bogen traegt den hover-Feature-State -
      // vorherigen zuruecksetzen, sonst blieben mehrere gleichzeitig
      // hervorgehoben.
      if (hoveredArcId !== null && hoveredArcId !== f.id) {
        map.setFeatureState(
          { source: "bible-data", id: hoveredArcId },
          { hover: false }
        );
      }
      hoveredArcId = f.id;
      map.setFeatureState(
        { source: "bible-data", id: hoveredArcId },
        { hover: true }
      );
      if (onArcHover) {
        onArcHover(
          f.properties.aName,
          f.properties.bName,
          e.originalEvent.clientX,
          e.originalEvent.clientY
        );
      }
    });

    map.on("mouseleave", "place-arcs-line", () => {
      map.getCanvas().style.cursor = "";
      if (hoveredArcId !== null) {
        map.setFeatureState(
          { source: "bible-data", id: hoveredArcId },
          { hover: false }
        );
        hoveredArcId = null;
      }
      if (onArcHoverEnd) onArcHoverEnd();
    });

    map.on("click", "place-arcs-line", (e) => {
      if (!e.features || e.features.length === 0) return;
      // Marker haben Vorrang: liegt an derselben Stelle auch ein Marker,
      // soll dessen Pin-Aktion greifen, nicht der Bogen darunter.
      const markerHits = map.queryRenderedFeatures(e.point, {
        layers: ["place-markers"],
      });
      if (markerHits.length > 0) return;
      if (!onArcClick) return;
      try {
        onArcClick(JSON.parse(e.features[0].properties.exampleVerse));
      } catch (err) {
        // Defekte/fehlende Beleg-Angabe soll nie die Karte lahmlegen.
        console.warn("Karte: Beleg-Vers eines Bogens nicht lesbar", err);
      }
    });
  }

  return {
    /**
     * Theme-Wechsel: kompletter Style-Austausch (positron <-> dark). Die
     * eigenen Quellen/Layer werden dabei mit verworfen und ueber das
     * "style.load"-Event automatisch neu angelegt (s. addDataLayers).
     * No-op, solange die Karte noch nie geoeffnet wurde - sie liest den
     * dann aktuellen Style ohnehin beim spaeteren Aufbau selbst aus.
     */
    refreshTheme() {
      if (!map) return;
      const url = currentStyleUrl();
      // Nur bei tatsaechlichem Wechsel neu laden - ein setStyle() auf
      // denselben Style ist nicht kostenlos (Diff-Durchlauf, der u. a.
      // die eigenen Layer abraeumt).
      if (url === appliedStyleUrl) return;
      appliedStyleUrl = url;
      styleReady = false;
      map.setStyle(url);
      // Deterministisch nach dem Style-Wechsel wieder anlegen: der
      // "styledata"-Handler allein reicht nicht, weil er beim Style-Diff
      // teils NUR feuert, solange isStyleLoaded() noch false ist - dann
      // wurde nichts angelegt und es kam kein weiteres Event mehr nach
      // (Symptom: nach dem Zurueckschalten auf Light Mode fehlten Marker
      // und Boegen). "idle" feuert garantiert, sobald der neue Style samt
      // erster Kachelrunde steht.
      map.once("idle", () => {
        applyProjection();
        if (!map.getLayer("place-markers")) addDataLayers();
      });
    },
    /** Aktualisiert NUR die Marker-Farben (Pin-Status) - kein Layer-
     * Rebuild, nur neue Quelldaten, analog zu arcOverlay.updateStyle(). */
    refreshColors() {
      if (!map || !styleReady) return;
      // Waehrend eines Theme-Wechsels ist der Style kurzzeitig in einem
      // Zwischenzustand: die Quelle kann bereits existieren, ihr interner
      // Tile-Index aber noch nicht - ein setData() dort hinein warf
      // "Cannot read properties of undefined". isStyleLoaded() schliesst
      // genau dieses Fenster aus; die Farben werden ohnehin direkt danach
      // ueber addDataLayers() mit den aktuellen Pin-Farben neu aufgebaut.
      if (!map.isStyleLoaded()) return;
      const source = map.getSource("bible-data");
      if (!source) return;
      source.setData(
        buildMapGeoJson(
          places,
          placeArcs,
          getColorForPlace,
          readVar("--text-body")
        )
      );
    },
    resize() {
      if (map) map.resize();
    },
    /**
     * Erster Aufruf mit `true` baut die Karte ueberhaupt erst auf (s.
     * ensureMap/createMap - der Container hat jetzt garantiert eine echte
     * Groesse). Danach genuegt ein resize(), damit die Karte eine
     * zwischenzeitlich geaenderte Containergroesse uebernimmt (ein per
     * [hidden] verstecktes Element meldet 0x0). MapLibre rendert von sich
     * aus nur bei Bedarf - ein manuelles Starten/Stoppen einer Render-
     * Schleife wie frueher bei Three.js ist nicht noetig.
     */
    setActive(active) {
      if (!active) return;
      ensureMap();
      requestAnimationFrame(() => {
        if (map) map.resize();
      });
    },
  };
}

// ========================================================================
// arcs.js — SVG-Boegen als Overlay ueber #bible-container
// ========================================================================

const SVG_NS = "http://www.w3.org/2000/svg";

// Verhaeltnis kurzer zu langer Boegen. ARC_CURVE_EXPONENT < 1 (wurzelartige
// statt lineare Kurve) hebt kurze/mittlere Distanzen ueberproportional an.
// Grund: in echten Bibel-Querverweisen liegt die grosse Mehrheit der Ziele
// nur wenige Kapitel auseinander, nur eine Minderheit spannt wirklich weit
// (z. B. AT <-> NT). Bei linearer Kurve (Exponent 1) blieb dadurch selbst
// nach der maxDistanceX-Normalisierung (s. renderCrossReferenceArcs) die
// grosse Masse der Boegen nah am MIN_ARC_HEIGHT_RATIO-Sockel haengen und
// wirkte in der Summe "flach" - obwohl der eine laengste Bogen (t=1)
// bereits korrekt die volle maxArcHeight erreichte. Mit Exponent 0.5
// erreicht schon t=0.1 rund 36% der Maximalhoehe statt nur 16%. Die beiden
// Enden (t=0 -> MIN_ARC_HEIGHT_RATIO, t=1 -> 100%) bleiben dabei exakt
// gleich, nur die Kurve dazwischen aendert sich - die Reihenfolge (weiter
// entfernte Verweise bleiben hoeher) ist also weiterhin erhalten.
const MIN_ARC_HEIGHT_RATIO = 0.01;
const ARC_CURVE_EXPONENT = 0.65;

// Deckkraft eines Bogens, wenn ein Personen-Filter aktiv ist und dieser
// Bogen NICHT zur ausgewaehlten Person gehoert (weder Quell- noch
// Zielvers). Bewusst nicht 0: der Gesamtverlauf der Querverweise soll als
// Kontext schwach sichtbar bleiben, s. Modulkommentar bei
// renderCrossReferenceArcs. Wirkt zusammen mit ARC_PERSON_DIMMED_COLOR (s.
// dort): erst die graue statt bunte Farbe, DANN diese niedrige Deckkraft
// ergeben das "sehr schwach ausgegraut" - nur die Deckkraft zu senken
// waere nicht genug gewesen, weil die bunten Verlaufsfarben (Neon/Pastell)
// auch bei niedriger Deckkraft noch farbig wirken und sich dadurch zu
// wenig von den vollfarbig roten Treffer-Boegen absetzen.
const ARC_PERSON_DIMMED_OPACITY = 0.1;

// ---- Canvas-Hoehe: in allen drei Ansichtszustaenden identisch --------
// Frueher bekam die Kapitel-/Split-Ansicht einen kleineren Anteil der
// Panel-Hoehe als die Idle-Ansicht (die Canvas wurde "gestaucht"), weil
// der Info-Bereich damals noch additiv Platz beanspruchte. Seit der
// Info-Bereich ein eigenstaendiges Overlay UEBER dem Canvas ist (siehe
// .lower-pane in style.css), braucht es diese Stauchung nicht mehr - die
// Visualisierung bleibt in JEDEM Zustand gleich gross, und wer sie
// waehrend Kapitel-/Split-Ansicht sehen will, zieht einfach den Trenner
// nach unten. Ein Anteil der Panel-Hoehe, geklemmt zwischen einer harten
// Unter- und Obergrenze; die Klemmung auf panelHeight selbst ist das
// letzte Sicherheitsnetz fuer extrem kurze Fenster.
const CANVAS_HEIGHT_FRACTION = 1.0;
const CANVAS_HEIGHT_MIN = 380;
const CANVAS_HEIGHT_MAX = 1200;

// Bogenhoehe leitet sich jetzt DIREKT aus der (bereits feststehenden)
// Canvas-Hoehe ab (umgekehrte Kausalitaet gegenueber frueher, wo die
// Bogenhoehe zuerst feststand und die Canvas-Hoehe sich danach richtete) -
// deshalb reicht ein einfacher Clamp, keine Fallunterscheidung mehr noetig.
// ARC_HEIGHT_MAX liegt bewusst grosszuegig ueber dem theoretisch je
// erreichbaren Wert (bei CANVAS_HEIGHT_MAX=1200 max. ca. 918px verfuegbar,
// s. computeArcHeightForCanvas) - die Klammer soll nur ein Sicherheitsnetz
// sein, keine tatsaechlich spuerbare Decke fuer den verfuegbaren Platz.
const ARC_HEIGHT_MIN = 1;
const ARC_HEIGHT_MAX = 1000;

const ARC_PADDING_BUFFER = 24;
const CANVAS_EXTRA_BUFFER = 12;
const DASHBOARD_BOTTOM_PADDING = 24;
const DIVIDER_HEIGHT = 13;
const PANEL_BORDER_TOTAL = 2;

// ---- Info-Bereich (Overlay UEBER dem Canvas, kein Flex-Nachbar mehr) ----
// LOWER_PANE_HEIGHT_MIN ist NUR noch eine untere Klemme fuer den Fall
// negativer/kaputter Werte - keine gewollte Mindesthoehe mehr. Bei 200
// konnte der Info-Bereich per Drag nie unter 200px schrumpfen, wodurch der
// unterste Streifen der Visualisierung (samt der dort liegenden
// Kapitel-Balken) in Kapitel-/Split-Ansicht IMMER verdeckt und damit nicht
// anklickbar war. Mit 0 laesst sich der Trenner bis ganz an die
// Panel-Unterkante ziehen und komplett zur Visualisierung "zurueckklappen"
// - der Balken (Handgriff) selbst bleibt dabei sichtbar und bedienbar. Die
// STANDARD-Hoehe beim ersten Oeffnen bleibt unveraendert bei 50%
// (LOWER_PANE_HEIGHT_FRACTION), dieser Wert betrifft nur die manuelle
// Zieh-Untergrenze.
const LOWER_PANE_HEIGHT_FRACTION = 0.5;
const LOWER_PANE_HEIGHT_MIN = 0;
const LOWER_PANE_HEIGHT_MAX_RATIO = 0.85;

function computeChromeHeight(navbarEl) {
  return navbarEl.offsetHeight + DASHBOARD_BOTTOM_PADDING;
}

function computePanelHeight(chromeHeight) {
  const panelOuterHeight = window.innerHeight - chromeHeight;
  return panelOuterHeight - PANEL_BORDER_TOTAL;
}

/**
 * Canvas-Hoehe: ein fester Anteil der Panel-Hoehe (identisch in allen
 * Ansichtszustaenden, s.o.), geklemmt zwischen CANVAS_HEIGHT_MIN und
 * CANVAS_HEIGHT_MAX. Die letzte Klemmung auf panelHeight ist ein
 * Sicherheitsnetz fuer extrem kurze Fenster, auf denen sogar
 * CANVAS_HEIGHT_MIN nicht mehr passen wuerde - dort wird der Canvas
 * maximal so hoch wie das Panel selbst.
 */
function computeCanvasHeight(panelHeight) {
  const raw = panelHeight * CANVAS_HEIGHT_FRACTION;
  const clamped = Math.min(CANVAS_HEIGHT_MAX, Math.max(CANVAS_HEIGHT_MIN, raw));
  return Math.round(Math.min(clamped, panelHeight));
}

/**
 * Bogenhoehe leitet sich direkt aus der (schon feststehenden) Canvas-Hoehe
 * ab: was nach Balken, Fusszeile und Puffern uebrig bleibt, geht in die
 * Bogenwoelbung - geklemmt zwischen ARC_HEIGHT_MIN und ARC_HEIGHT_MAX.
 */
function computeArcHeightForCanvas(canvasHeight, maxBarHeight, footerHeight) {
  const available =
    canvasHeight -
    ARC_PADDING_BUFFER -
    maxBarHeight -
    footerHeight -
    CANVAS_EXTRA_BUFFER;
  return Math.round(
    Math.max(ARC_HEIGHT_MIN, Math.min(ARC_HEIGHT_MAX, available))
  );
}

/**
 * Info-Bereich-Hoehe (Overlay): ebenfalls ein fester Anteil der
 * Panel-Hoehe, aber UNABHAENGIG von der Canvas-Hoehe berechnet - genau
 * das macht die gewuenschte Ueberlappung moeglich (beide Hoehen muessen
 * sich nicht mehr addiert in die Panel-Hoehe hineinquetschen).
 * LOWER_PANE_HEIGHT_MAX_RATIO stellt sicher, dass immer ein Rest
 * Visualisierung sichtbar/erreichbar bleibt.
 */
function computeLowerPaneHeight(panelHeight) {
  const raw = panelHeight * LOWER_PANE_HEIGHT_FRACTION;
  const max = panelHeight * LOWER_PANE_HEIGHT_MAX_RATIO;
  const clamped = Math.min(max, Math.max(LOWER_PANE_HEIGHT_MIN, raw));
  return Math.round(Math.min(clamped, panelHeight));
}

/**
 * Einzige Quelle der Wahrheit fuer Chrome-, Panel-, Canvas- und
 * Bogenhoehe - wird sowohl beim Setzen der CSS-Variablen/Inline-Styles
 * als auch beim Zeichnen der Boegen verwendet. Anders als frueher haengt
 * das Ergebnis nicht mehr vom Ansichtszustand ab (s. Kommentar bei
 * CANVAS_HEIGHT_FRACTION).
 */
function computeCurrentCanvasLayout(navbarEl, maxBarHeight, footerEl) {
  const chromeHeight = computeChromeHeight(navbarEl);
  const panelHeight = computePanelHeight(chromeHeight);
  const canvasHeight = computeCanvasHeight(panelHeight);
  const footerHeight = footerEl.offsetHeight || 70;
  const arcHeight = computeArcHeightForCanvas(
    canvasHeight,
    maxBarHeight,
    footerHeight
  );
  return { chromeHeight, panelHeight, canvasHeight, arcHeight };
}

// ---- Farbverlauf der Boegen: 6 Stopps statt 2 ---------------------------
// Frueher: eine einzige Interpolation zwischen --arc-color-min und
// --arc-color-max. Jetzt: 4 zusaetzliche Zwischenfarben, macht 6 Stopps
// gesamt, die per t (0..1, Distanz-Anteil) durchlaufen werden. Reihenfolge
// entspricht der bisherigen min->max-Richtung: Index 0 = kurze Distanzen
// (frueher "min"), Index 5 = lange Distanzen (frueher "max").
//
// hexToRgba() ersetzt das alte hexToRgb(): das alte hexToRgb() ging fest
// von 6-stelligem Hex (RRGGBB) aus. Seit --arc-color-min/-max auf
// 8-stelliges Hex mit Alpha (RRGGBBAA) umgestellt wurden, lieferte es
// dadurch falsche Werte - die Bit-Shifts (>>16 / >>8 / &255) waren fuer
// die kuerzere Bitbreite kalibriert und lasen bei 8 Stellen effektiv
// G/B/A statt R/G/B aus, der tatsaechliche Rot-Kanal ging komplett
// verloren (verifiziert: #f5aaf62f wurde zu [170,246,47] statt
// [245,170,246] mit Alpha 47/255). hexToRgba() erkennt die Laenge und
// gibt bei 8-stelligem Hex zusaetzlich den Alpha-Kanal (0..1) zurueck, bei
// 6-stelligem Hex Alpha=1 (voll deckend) als Rueckwaertskompatibilitaet.
const ARC_COLOR_STOP_VARS = [
  "--arc-color-1",
  "--arc-color-2",
  "--arc-color-3",
  "--arc-color-4",
  "--arc-color-5",
  "--arc-color-6",
];

function hexToRgba(hex) {
  const clean = hex.trim().replace("#", "");
  const bigint = parseInt(clean, 16);
  if (clean.length === 8) {
    return [
      (bigint >>> 24) & 255,
      (bigint >>> 16) & 255,
      (bigint >>> 8) & 255,
      (bigint & 255) / 255,
    ];
  }
  return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255, 1];
}

/**
 * Baut aus einem Hex-Farbwert (z. B. aus einer CSS-Variable wie
 * --text-muted) einen rgba()-String mit einer selbst vorgegebenen
 * Deckkraft - unabhaengig vom evtl. im Hex selbst schon codierten
 * Alpha-Kanal (der wird hier bewusst ignoriert, s.u.).
 *
 * Genutzt, um die Deckkraft der zurueckgeblendeten Boegen im Personen-
 * Filter DIREKT in die Stroke-Farbe zu backen, statt sie per CSS
 * `opacity` auf dem Element zu setzen: `opacity` auf einem SVG-Pfad
 * erzwingt in Chromium eine eigene Compositing-Ebene (Group-Isolation),
 * damit Ueberlappungen korrekt gemischt werden - bei mehreren zehntausend
 * gleichzeitig sichtbaren Boegen war genau das (nicht das blosse Zeichnen)
 * ein messbarer Teil der Traegheit. Eine Stroke-Farbe mit eigenem
 * Alpha-Kanal braucht diese Isolation nicht und wird direkt gemalt.
 */
function colorWithAlpha(hex, alpha) {
  const [r, g, b] = hexToRgba(hex);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/**
 * Liest die 6 Farbstopps aus den CSS-Variablen (einmal pro Renderdurchgang,
 * nicht pro Bogen - die Werte aendern sich ja nicht innerhalb eines
 * Durchgangs).
 */
function readArcColorStops() {
  const rootStyle = getComputedStyle(document.documentElement);
  return ARC_COLOR_STOP_VARS.map((varName) =>
    hexToRgba(rootStyle.getPropertyValue(varName))
  );
}

/**
 * Liest die aktuelle Akzentfarbe (--accent) aus den CSS-Variablen - genau
 * wie readArcColorStops() bei JEDEM Renderdurchgang frisch, nicht einmalig
 * gecacht. Ersetzt das vorherige hartkodierte "red" fuer Hover-Highlight
 * und aktiven Bogen. Der Grund, das ueber CSS statt einer JS-Konstante zu
 * loesen: dadurch wirkt sich ein Theme-Wechsel (der ueber onThemeChange in
 * wireThemeToggle() einen redrawArcsRef()-Durchlauf antriggert) sofort
 * auch auf die Bogen-Akzentfarbe aus, genau wie bei Balken/Chips, die rein
 * CSS-basiert sind und sich automatisch mit der Kaskade aktualisieren -
 * ohne dass zwei getrennt gepflegte Rot-Werte (einer in CSS, einer in JS)
 * auseinanderlaufen koennten.
 */
function readAccentColor() {
  return getComputedStyle(document.documentElement)
    .getPropertyValue("--accent")
    .trim();
}

/**
 * Liest die neutrale "gedaempft"-Farbe (--text-muted) fuer Boegen, die bei
 * aktivem Personen-Filter NICHT zur ausgewaehlten Person gehoeren. Genau
 * wie readAccentColor() bei jedem Renderdurchgang frisch gelesen (nicht
 * gecacht), damit ein Theme-Wechsel sofort die richtige (helle/dunkle)
 * Variante liefert. Bewusst KEINE der bunten Verlaufsfarben (Neon/Pastell/
 * Monochrome) mehr fuer den "inaktiv"-Fall: die sollen bei aktivem Filter
 * komplett von "farbig nach Distanz" auf "neutral grau, zurueckgeblendet"
 * wechseln, damit sich die vollfarbig roten Treffer-Boegen (s.
 * renderCrossReferenceArcs) klar davon abheben.
 */
function readMutedColor() {
  return getComputedStyle(document.documentElement)
    .getPropertyValue("--text-muted")
    .trim();
}

// ========================================================================
// personColors.js — Farbsystem fuer bis zu 4 gleichzeitig angepinnte
// Personen UND Orte (Sidebar-Pins, Kapitel-Balken, Boegen, Namens-Pillen)
// ========================================================================
// Eine feste Palette von 4 Farb-"Slots" (Reihenfolge = Pin-Reihenfolge,
// NICHT an eine bestimmte Entity ODER Kategorie gebunden - wird Eintrag 1
// entpinnt, ruecken die uebrigen nach vorn und Eintrag 2 wird zu Slot
// 1/Rot, s. pinnedEntities in main.js). Slot 1 ist bewusst identisch mit
// --accent (dieselbe Rot-Farbe, die die App schon fuer "aktiv" nutzt).

const MAX_PINNED_PERSONS = 4;
const PERSON_COLOR_VARS = [
  "--person-color-1",
  "--person-color-2",
  "--person-color-3",
  "--person-color-4",
];

/** Liest die aktuelle Farbe eines Pin-Slots (0-basiert) aus den CSS-
 * Variablen - wie readAccentColor() bei jedem Aufruf frisch, damit ein
 * Theme-Wechsel sich sofort auswirkt. */
function readPersonColor(colorIndex) {
  return getComputedStyle(document.documentElement)
    .getPropertyValue(PERSON_COLOR_VARS[colorIndex])
    .trim();
}

/**
 * Klassischer "Multiply"-Blend-Modus fuer zwei oder mehr Hex-Farben: jeder
 * Farbkanal wird auf 0..1 normalisiert, die Werte ALLER Farben werden
 * MITEINANDER MULTIPLIZIERT (nicht gemittelt/addiert) und zurueck auf
 * 0..255 skaliert. Bei genau einer Farbe ist das Ergebnis exakt diese
 * Farbe (neutral, kein Blend noetig). Multiply wurde bewusst gewaehlt
 * (statt z. B. eines einfachen Mittelwerts): zwei/drei/vier gesaettigte
 * Farben multipliziert ergeben ein deutlich DUNKLERES, von jeder der
 * Einzelfarben klar unterscheidbares Ergebnis - genau das gewuenschte
 * "hebt sich von den anderen ab" bei ueberlappenden Personen-Treffern
 * (s. updatePersonHighlight/arcOverlay.updateStyle in main.js sowie
 * sortRowsByOverlap im Word-Explorer-Teil).
 */
function multiplyBlendColors(hexColors) {
  if (hexColors.length === 1) return hexColors[0];
  let r = 1;
  let g = 1;
  let b = 1;
  hexColors.forEach((hex) => {
    const [rr, gg, bb] = hexToRgba(hex);
    r *= rr / 255;
    g *= gg / 255;
    b *= bb / 255;
  });
  return `rgb(${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(
    b * 255
  )})`;
}

/**
 * Interpoliert Farbe (inkl. Alpha) ueber MEHRERE Stopps statt nur zwei:
 * t=0..1 wird zunaechst auf das passende Segment zwischen zwei
 * benachbarten Stopps abgebildet (z. B. bei 6 Stopps -> 5 Segmente), dann
 * innerhalb dieses Segments wie gehabt linear interpoliert. t=0 liefert
 * exakt den ersten, t=1 exakt den letzten Stopp.
 */
function interpolateMultiStopColor(stops, t) {
  const clampedT = Math.max(0, Math.min(1, t));
  const segmentCount = stops.length - 1;
  const scaled = clampedT * segmentCount;
  const segmentIndex = Math.min(Math.floor(scaled), segmentCount - 1);
  const localT = scaled - segmentIndex;

  const [r1, g1, b1, a1] = stops[segmentIndex];
  const [r2, g2, b2, a2] = stops[segmentIndex + 1];

  const r = Math.round(r1 * (1 - localT) + r2 * localT);
  const g = Math.round(g1 * (1 - localT) + g2 * localT);
  const b = Math.round(b1 * (1 - localT) + b2 * localT);
  const a = a1 * (1 - localT) + a2 * localT;

  return `rgba(${r},${g},${b},${a.toFixed(3)})`;
}

/**
 * Vergleicht zwei Quelle/Ziel-Referenzen (wie sie sowohl von Bogen- als
 * auch von Chip-Klicks erzeugt werden) auf inhaltliche Gleichheit - dient
 * dazu, die "aktive" (zuletzt angeklickte) Referenz sowohl im Bogen- als
 * auch im Chip-Rendering wiederzuerkennen und rot zu markieren.
 */
function referencesMatch(a, b) {
  if (!a || !b) return false;
  return (
    a.source.book === b.source.book &&
    a.source.chapter === b.source.chapter &&
    a.source.verse === b.source.verse &&
    a.target.bookFull === b.target.bookFull &&
    a.target.chapter === b.target.chapter &&
    a.target.verse === b.target.verse
  );
}

/**
 * Baut das Boegen-SVG-Overlay ueber `anchorEl` EINMALIG auf (Pfad-Element
 * + alle Event-Listener pro Bogen) und gibt zwei Update-Funktionen zurueck,
 * die diese Elemente danach nur noch per Attribut aktualisieren:
 *
 * - updateGeometry({chapterPositions, maxArcHeight}): setzt nur `d`
 *   (Position/Woelbung) - noetig bei Zoom/Pan/Resize.
 * - updateStyle({activeReference, pinnedEntities}): setzt nur Farbe/
 *   Strichbreite - noetig bei Theme-/Paletten-Wechsel, Klick auf einen
 *   Querverweis oder Auswahl/Abwahl einer Person bzw. eines Orts.
 *
 * WARUM diese Aufteilung (Performance-Fix): vorher baute JEDER Redraw -
 * auch ein blosser Personen-Filter-Klick, der an den BILDSCHIRM-
 * Positionen der Boegen gar nichts aendert - das komplette SVG samt ALLEN
 * Pfaden neu: bei mehreren zehntausend Querverweisen (typisch fuer eine
 * vollstaendige Bibel mit Fussnoten-Querverweisen) heisst das zehntausende
 * neu erzeugte DOM-Knoten UND zehntausende neu registrierte Event-
 * Listener (mouseenter/mousemove/mouseleave/click) - bei JEDEM Klick.
 * Dieser synchrone Hauptthread-Block war spuerbar (verzoegerte Hover-
 * Reaktion, insgesamt "traege" Seite), gerade weil der Personen-Filter
 * genau diese teure Rebuild-Operation bei jeder Auswahl erneut ausloeste.
 * Jetzt werden Elemente + Listener nur EIN EINZIGES Mal erzeugt (hier);
 * jede spaetere Aenderung ist nur noch ein `setAttribute`-Durchlauf ueber
 * bereits vorhandene Knoten - keine Neuallokation, keine Listener-
 * Neuregistrierung. Ein Personen-Klick loest jetzt NUR NOCH
 * updateStyle() aus (s. updatePersonHighlight in main.js), nicht mehr
 * updateGeometry() - das allein macht den haeufigsten Fall (Personen-
 * Filter an/aus) um eine Groessenordnung billiger.
 *
 * Zusaetzlicher Effekt derselben Aufteilung: die per-Bogen "Distanz", die
 * sowohl die Bogenhoehe als auch die distanzbasierte Standardfarbe steuert
 * (s. `t` unten), wird aus der KAPITEL-INDEX-Differenz berechnet, nicht
 * aus Bildschirm-Pixeln - da die Kapitel-Balken immer gleichmaessig verteilt
 * sind (s. layoutChapterBars: konstanter unitStep), ist das Verhaeltnis
 * identisch, aber die Index-Differenz aendert sich (anders als die Pixel-
 * Distanz) NIE waehrend der Sitzung. `t` wird deshalb ebenfalls nur EIN
 * EINZIGES Mal berechnet, nicht bei jedem Zoom/Pan-Frame neu.
 *
 * Layering (Zeichenreihenfolge): In SVG bestimmt die DOM-Reihenfolge die
 * Zeichenreihenfolge - spaeter angehaengte Elemente liegen ueber frueher
 * angehaengten. Ohne Sortierung wuerden lange, hohe Boegen kurze, tiefe
 * Boegen komplett verdecken. Deshalb werden die Bogen-Datensaetze VOR dem
 * Erzeugen der Pfad-Elemente nach (Index-)Distanz absteigend sortiert:
 * lange Boegen zuerst angehaengt (-> liegen hinten), kurze zuletzt (->
 * liegen vorne). Diese Reihenfolge steht ab dem einmaligen Aufbau fest
 * und wird NIE MEHR per DOM-Verschiebung veraendert - auch nicht fuer
 * Personen-Treffer oder eine aktive Referenz, die heben sich ausschliesslich
 * durch Farbe/Strichbreite hervor (s. updateStyle), nicht durch Neu-
 * Sortierung. Das vermeidet zugleich dauerhaft das folgende Hover-Problem:
 *
 * Ein per Hover markierter Bogen soll trotzdem ueber ALLEN anderen liegen.
 * FRUEHERE/verworfene Variante: den gehoverten Pfad selbst per
 * appendChild/insertBefore verschieben. Das ist bei ECHTER Mausbewegung
 * unsicher: ein DOM-Move (auch appendChild eines bereits vorhandenen
 * Kindes) kann vom Browser als "Element verlassen" gewertet werden und
 * synthetisch ein mouseleave ausloesen - das fuehrt in eine Endlosschleife
 * (mouseenter -> verschieben -> synthetisches mouseleave -> zurueck-
 * verschieben -> synthetisches mouseenter -> ...), sichtbar als "Bogen
 * bleibt rot" bzw. Klicks, die nicht mehr ankommen (das Klickziel
 * verschiebt sich zwischen Mousedown und Mouseup).
 *
 * Robuste Loesung: die echten, interaktiven Pfade werden NIE verschoben.
 * Stattdessen gibt es eine einzige, rein dekorative "Highlight-Kopie"
 * (pointer-events:none), die immer als LETZTES Kind existiert (also
 * strukturell immer zuoberst) und bei mouseenter einfach mit dem
 * `d`-Attribut des gehoverten Bogens befuellt und sichtbar gemacht wird.
 * Sie nimmt selbst nie an Hit-Tests teil und kann daher auch nie das
 * Hover-Tracking stoeren. Die AKTIVE (angeklickte) Referenz ist davon
 * unabhaengig: sie bekommt in updateStyle() direkt eine dauerhafte rote
 * Einfaerbung auf dem echten Pfad (kein Hover noetig).
 */
function createArcOverlay({
  anchorEl,
  crossRefs,
  verseIndex,
  tooltip,
  onArcClick,
}) {
  const svg = document.createElementNS(SVG_NS, "svg");
  svg.setAttribute("class", "arc-overlay");
  svg.style.position = "absolute";
  svg.style.top = "0";
  svg.style.left = "0";
  svg.style.width = "100%";
  svg.style.height = "100%";
  svg.style.pointerEvents = "none";
  svg.style.zIndex = "5";
  svg.style.overflow = "visible";
  anchorEl.appendChild(svg);

  // Dekorative Highlight-Kopie (s. Modulkommentar) - Farbe wird in
  // updateStyle() gesetzt (dort ist die aktuelle Akzentfarbe bekannt),
  // hier nur die statischen Grundeigenschaften.
  const highlight = document.createElementNS(SVG_NS, "path");
  highlight.setAttribute("fill", "transparent");
  highlight.setAttribute("stroke-width", "2");
  highlight.style.pointerEvents = "none";
  highlight.style.display = "none";

  // Dekorative Kopie der AKTIVEN (angeklickten) Referenz - aus demselben
  // Grund wie die Highlight-Kopie oben: der echte Pfad des aktiven Bogens
  // darf NIE per DOM-Verschiebung (appendChild/insertBefore) nach vorn
  // geholt werden (s. Modulkommentar bei createArcOverlay, Hover-Bug),
  // bleibt also an seiner urspruenglichen, distanzsortierten Position im
  // DOM - und kann daher von spaeter/oben liegenden, laengeren Boegen
  // ueberdeckt werden. Diese rein dekorative Kopie (pointer-events:none)
  // wird stattdessen bei JEDEM updateStyle()-Durchlauf auf die aktuelle
  // Geometrie des aktiven Bogens gesetzt und STRUKTURELL als vorletztes
  // Kind angehaengt (nur die Hover-Kopie liegt noch darueber, s. ganz
  // unten) - dadurch bleibt der aktive Bogen immer sichtbar im
  // Vordergrund, unabhaengig von seiner urspruenglichen Sortierposition.
  const activeCopy = document.createElementNS(SVG_NS, "path");
  activeCopy.setAttribute("fill", "transparent");
  activeCopy.style.pointerEvents = "none";
  activeCopy.style.display = "none";

  // 1. Pass: pro Bogen nur die GEOMETRIE-UNABHAENGIGEN Kenndaten sammeln -
  // Kapitel-INDEX von Quelle/Ziel (verseIndex.getChapter(...).position)
  // statt Bildschirm-Position, s. Modulkommentar oben.
  const records = [];
  crossRefs.forEach((ref) => {
    const sourceChapter = verseIndex.getChapter(
      ref.source.book,
      ref.source.chapter
    );
    if (!sourceChapter) return;
    ref.targets.forEach((target) => {
      const targetChapter = verseIndex.getChapter(
        target.bookFull,
        target.chapter
      );
      if (!targetChapter) return;
      records.push({
        source: ref.source,
        target,
        sourcePosition: sourceChapter.position,
        targetPosition: targetChapter.position,
        distance: Math.abs(sourceChapter.position - targetChapter.position),
      });
    });
  });

  const maxDistance = records.reduce((max, r) => Math.max(max, r.distance), 0);

  // Sortierung nach (Index-)Distanz ABSTEIGEND - s. Modulkommentar
  // "Layering". Einmalig, vor dem Erzeugen der Pfad-Elemente.
  records.sort((a, b) => b.distance - a.distance);

  // 2. Pass: `t` einmalig festschreiben und die eigentlichen Pfad-
  // Elemente samt Event-Listenern erzeugen - das passiert ab hier nie
  // wieder, s. Modulkommentar.
  records.forEach((record) => {
    record.t = maxDistance > 0 ? record.distance / maxDistance : 0;

    const path = document.createElementNS(SVG_NS, "path");
    path.setAttribute("fill", "transparent");
    path.style.pointerEvents = "stroke";
    record.pathEl = path;

    // Gleiche Schreibweise wie in den Querverweis-Chips und im
    // Sidebar-Dropdown: deutsche Abkuerzung + "Kapitel:Vers". Vorher stand
    // hier der interne (englische) Buchname mit Komma als Vers-Trenner -
    // derselbe Bogen hiess im Tooltip also "Isaiah 60,3 → Revelation 21,24"
    // und im Chip darunter "Jes 60:3 → Offb 21:24".
    const tooltipLabel = `${germanBookAbbrev(record.source.book)} ${
      record.source.chapter
    }:${record.source.verse} → ${germanBookAbbrev(record.target.bookFull)} ${
      record.target.chapter
    }:${record.target.verse}`;

    path.addEventListener("mouseenter", (e) => {
      // NUR die Highlight-Kopie aktualisieren - der echte Pfad selbst
      // bleibt unangetastet (weder Farbe noch Position), damit das
      // Hover-Tracking des Browsers stabil bleibt.
      highlight.setAttribute("d", path.getAttribute("d"));
      highlight.style.display = "";
      tooltip.show(tooltipLabel, e.pageX, e.pageY);
    });
    path.addEventListener("mousemove", (e) => tooltip.move(e.pageX, e.pageY));
    path.addEventListener("mouseleave", () => {
      highlight.style.display = "none";
      tooltip.hide();
    });

    if (onArcClick) {
      path.style.cursor = "pointer";
      path.addEventListener("click", () =>
        onArcClick({ source: record.source, target: record.target })
      );
    }

    svg.appendChild(path);
  });

  // Anhaenge-Reihenfolge = Ziel-Zeichenreihenfolge: activeCopy ZUERST
  // (liegt ueber allen echten Boegen, aber UNTER der Hover-Kopie), dann
  // highlight ALS LETZTES Kind (liegt strukturell ueber wirklich allem -
  // Hover-Feedback soll auch sichtbar bleiben, wenn man gerade den
  // aktiven Bogen selbst hovert).
  svg.appendChild(activeCopy);
  svg.appendChild(highlight);

  /**
   * Aktualisiert NUR die Position/Woelbung (`d`) aller Boegen - fuer
   * Zoom/Pan/Resize. Liest `anchorEl` nur EINMAL pro Aufruf (nicht pro
   * Bogen).
   */
  function updateGeometry({ chapterPositions, maxArcHeight }) {
    const anchorRect = anchorEl.getBoundingClientRect();
    records.forEach((record) => {
      const sourcePos = chapterPositions[record.sourcePosition];
      const targetPos = chapterPositions[record.targetPosition];

      const x1 = sourcePos.x - anchorRect.left;
      const y1 = sourcePos.y - anchorRect.top;
      const x2 = targetPos.x - anchorRect.left;
      const y2 = targetPos.y - anchorRect.top;

      const curveT = Math.pow(record.t, ARC_CURVE_EXPONENT);
      const arcHeight =
        (MIN_ARC_HEIGHT_RATIO + (1 - MIN_ARC_HEIGHT_RATIO) * curveT) *
        maxArcHeight;

      const midX = (x1 + x2) / 2;
      // s. Herleitung in der frueheren Version dieser Funktion: der
      // Kurvenscheitel einer quadratischen Bezierkurve mit y1===y2 liegt
      // bei genau der HAELFTE des Kontrollpunkt-Versatzes - deshalb hier
      // arcHeight VERDOPPELT als Kontrollpunkt-Versatz einsetzen.
      const midY = Math.min(y1, y2) - arcHeight * 2;

      record.pathEl.setAttribute(
        "d",
        `M ${x1},${y1} Q ${midX},${midY} ${x2},${y2}`
      );
    });
  }

  /**
   * Aktualisiert NUR Farbe/Strichbreite aller Boegen - fuer Theme-/
   * Paletten-Wechsel, Klick auf einen Querverweis (activeReference) oder
   * Aenderung der angepinnten Entities (pinnedEntities). Ruehrt `d` nicht an.
   *
   * `pinnedEntities`: Array (0-3 Eintraege, Index = Farb-Slot, s.
   * PERSON_COLOR_VARS) von {verseKeySet} - Personen UND Orte gemischt,
   * diese Funktion unterscheidet nicht zwischen Kategorien (das war nie
   * noetig: nur die Vers-Zugehoerigkeit zaehlt). Farb-/Deckkraft-Regeln
   * (s. auch Kommentar bei colorWithAlpha): ohne angepinnte Entities
   * traegt jeder Bogen seine distanzbasierte Verlaufsfarbe. Mit
   * mindestens einer angepinnten Entity wechseln ALLE Boegen auf ein
   * klares Schema - ein Bogen, dessen Quell- ODER Zielvers zu GENAU EINER
   * angepinnten Entity gehoert, traegt deren Slot-Farbe; gehoert er zu
   * MEHREREN gleichzeitig (Ueberlappung - z. B. eine Person UND ein Ort im
   * selben Vers), werden deren Farben per multiplyBlendColors() gemischt
   * (hebt sich bewusst von jeder Einzelfarbe ab, s. Anfrage); Boegen ohne
   * jeden Treffer werden auf eine neutrale Graufarbe MIT eingebackener
   * niedriger Deckkraft (ARC_PERSON_DIMMED_OPACITY) statt separatem CSS
   * `opacity` zurueckgeblendet (Performance, s. colorWithAlpha). Eine
   * geklickte activeReference gewinnt am Ende immer, auch wenn sie
   * zufaellig kein Treffer ist - ein bewusst angeklickter Bogen soll nie
   * durch den Filter unsichtbar/grau werden.
   */
  function updateStyle({ activeReference, pinnedEntities }) {
    const colorStops = readArcColorStops();
    const accentColor = readAccentColor();
    const mutedColorWithAlpha = colorWithAlpha(
      readMutedColor(),
      ARC_PERSON_DIMMED_OPACITY
    );
    const entityColors = pinnedEntities.map((_, idx) => readPersonColor(idx));

    highlight.setAttribute("stroke", accentColor);

    let activeRecord = null;

    records.forEach((record) => {
      const isActive = referencesMatch(record, activeReference);
      if (isActive) activeRecord = record;

      let strokeColor = interpolateMultiStopColor(colorStops, record.t);
      let strokeWidth = "0.6";

      if (pinnedEntities.length > 0) {
        const sourceKey = makeVerseKey(
          record.source.book,
          record.source.chapter,
          record.source.verse
        );
        const targetKey = makeVerseKey(
          record.target.bookFull,
          record.target.chapter,
          record.target.verse
        );
        const matchingColorIndexes = [];
        pinnedEntities.forEach((p, idx) => {
          if (p.verseKeySet.has(sourceKey) || p.verseKeySet.has(targetKey)) {
            matchingColorIndexes.push(idx);
          }
        });
        strokeColor =
          matchingColorIndexes.length > 0
            ? multiplyBlendColors(
                matchingColorIndexes.map((idx) => entityColors[idx])
              )
            : mutedColorWithAlpha;
      }

      if (isActive) {
        strokeColor = accentColor;
        strokeWidth = "1.6";
      }

      record.pathEl.setAttribute("stroke", strokeColor);
      record.pathEl.setAttribute("stroke-width", strokeWidth);
      record.pathEl.classList.toggle("arc-active", isActive);
    });

    // activeCopy auf die (soeben aktuelle) Geometrie des aktiven Bogens
    // ziehen - s. Modulkommentar bei der Erzeugung von activeCopy weiter
    // oben. Kopiert bewusst NUR das bereits gesetzte `d`-Attribut vom
    // echten Pfad, statt es selbst neu zu berechnen: updateGeometry() hat
    // es (falls noetig) bereits vor diesem Aufruf aktualisiert.
    if (activeRecord) {
      activeCopy.setAttribute("d", activeRecord.pathEl.getAttribute("d"));
      activeCopy.setAttribute("stroke", accentColor);
      activeCopy.setAttribute("stroke-width", "1.6");
      activeCopy.style.display = "";
    } else {
      activeCopy.style.display = "none";
    }
  }

  return {
    updateGeometry,
    updateStyle,
    /**
     * Simuliert Hover auf dem Bogen, der zu `reference` ({source,target})
     * passt - genutzt vom Word-Explorer, um beim Ueberfahren einer
     * Crossref-Zeile im Personen-Dropdown denselben visuellen Effekt wie
     * ein echter Maus-Hover auf den Bogen selbst auszuloesen (s. Anfrage
     * "Hover ... imitieren"). Nutzt dieselbe Highlight-Kopie wie ein
     * echter Hover - kein Sonderfall noetig, nur ein alternativer
     * Ausloeser dafuer.
     */
    simulateHover(reference) {
      const record = records.find((r) => referencesMatch(r, reference));
      if (!record) return;
      highlight.setAttribute("d", record.pathEl.getAttribute("d"));
      highlight.style.display = "";
    },
    clearSimulatedHover() {
      highlight.style.display = "none";
    },
    /**
     * Blendet das komplette Boegen-SVG aus/ein - genutzt beim Wechsel in
     * die Grid-Ansicht (s. setVisMode in main.js), die keine Boegen
     * zeigt. svg ist ein direktes Kind von .visualizer-canvas (NICHT von
     * .zoom-viewport), muss also unabhaengig von dessen [hidden]-Zustand
     * separat ausgeblendet werden.
     */
    setHidden(hidden) {
      svg.style.display = hidden ? "none" : "";
    },
  };
}

// ========================================================================
// chapterText.js — Kapiteltext im content-area darstellen
// ========================================================================

/**
 * Escaped die drei fuer HTML-Markup relevanten Zeichen, BEVOR eigene
 * <span>-Tags (s. highlightPersonName) in den Text eingefuegt werden -
 * ohne das koennte ein "&"/"<"/">" im Bibeltext selbst das injizierte
 * Markup zerstoeren. Anfuehrungszeichen muessen nicht escaped werden, der
 * Text landet nie in einem HTML-Attribut.
 */
function escapeHtml(str) {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/**
 * Umschliesst jedes Vorkommen EINER der `names` im (bereits escapten)
 * Verstext mit einer <span class="person-name-pill person-name-pill-N">
 * (N = colorIndex+1, s. PERSON_COLOR_VARS). Bewusst NUR innerhalb von
 * Versen aufgerufen, die laut versesByPerson TATSAECHLICH zur jeweiligen
 * angepinnten Person gehoeren (s. buildPersonNameHighlightInfo in
 * main.js) - dieselbe Referenz-statt-Text-Strategie wie beim Aufbau von
 * personReferenceIndex.json selbst (s. PROJEKTSTAND.md): die Textsuche
 * hier dient nur der VISUELLEN Hervorhebung innerhalb eines bereits
 * bekannten Verses, nicht der Zuordnung "welche Person kommt vor" - ein
 * Nicht-Treffer (z. B. weil KEINE der bekannten Namensformen im Vers
 * steht) blendet einfach keine Pille ein, veraendert aber nichts an der
 * Zuordnung selbst.
 *
 * `names` enthaelt neben dem englischen displayName auch bekannte
 * deutsche Namensformen/Beinamen aus GERMAN_PERSON_NAME_ALIASES (z. B.
 * "Mose" fuer "Moses", "Immanuel" fuer "Jesus") - s. Modulkommentar dort.
 * Laengere Namen zuerst in der Alternative, damit bei ueberlappenden
 * Formen (z. B. ein kurzer Name, der Praefix eines laengeren ist) der
 * spezifischere zuerst greift.
 *
 * `\b` nur am Wortanfang der Regex, dahinter zusaetzlich bis zu drei
 * ASCII-Kleinbuchstaben als optionale Endung erlaubt (z. B. "Aarons",
 * "Aaron" + Dativ-e) - deutsche Namen werden dekliniert, eine reine
 * Exakt-Wort-Suche wuerde die haeufigen Flexionsformen verpassen.
 *
 * WICHTIG: statt des eingebauten `\b` werden die Wortgrenzen hier ueber
 * explizite Lookaround-Ausdruecke `(?<![\p{L}])`/`(?![\p{L}])` mit dem
 * `u`-Flag geprueft (Unicode-Buchstabenklasse), NICHT ueber `\b`. Grund:
 * JavaScripts `\b` basiert intern auf `\w` = [A-Za-z0-9_] - rein ASCII.
 * Bei einem Namen, der mit einem Umlaut BEGINNT (z. B. "Ägypten" fuer
 * "Egypt", s. GERMAN_PLACE_NAME_ALIASES), gilt "Ä" damit selbst schon als
 * Nicht-Wortzeichen - zwischen einem Leerzeichen (auch Nicht-Wortzeichen)
 * und "Ä" liegt dann gar KEINE Grenze vor, `\b` matcht dort folglich nie
 * und die Pille erschien nie (empirisch verifiziert: "Ägypten" wurde mit
 * `\b` komplett uebersprungen). Die Lookaround-Variante prueft stattdessen
 * echte Unicode-Buchstaben auf beiden Seiten und funktioniert dadurch
 * unabhaengig davon, ob der Name mit einem Umlaut beginnt oder endet.
 *
 * Wird bei MEHREREN angepinnten Personen im selben Vers (Ueberlappung)
 * NACHEINANDER fuer jede Person aufgerufen (s. renderChapterText) - jede
 * faerbt nur IHRE eigenen Namens-Treffer in IHRER eigenen Farbe, keine
 * Mischfarbe fuer Text (die Mischfarbe/Multiply-Blend ist Balken/Boegen
 * vorbehalten, s. Anfrage - im Text sind es ja unterschiedliche, klar
 * abgegrenzte Woerter, keine deckungsgleiche Flaeche).
 */
function highlightPersonName(escapedText, names, colorIndex) {
  if (!names || names.length === 0) return escapedText;
  const escapedNames = names
    .slice()
    .sort((a, b) => b.length - a.length)
    .map((n) => n.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  const re = new RegExp(
    `(?<![\\p{L}])(?:${escapedNames.join("|")})[a-z]{0,3}(?![\\p{L}])`,
    "gu"
  );
  const cls = `person-name-pill person-name-pill-${colorIndex + 1}`;
  return escapedText.replace(
    re,
    (match) => `<span class="${cls}">${match}</span>`
  );
}

/**
 * highlightVerseNumber ist optional - wird von der Suche (s. wireReference
 * Search) oder der Personen-Navigation (s. openChapterView in main.js)
 * gesetzt, um einen konkreten Vers gepunktet zu unterstreichen UND
 * anzuscrollen (s. scrollToHighlightedVerse), genau wie .highlighted in
 * der Split-View (dieselbe CSS-Klasse, bewusst dieselbe Behandlung).
 *
 * personNameInfoList ist ebenfalls optional - ein ARRAY (eines pro
 * angepinnter Person, die ueberhaupt in diesem Kapitel vorkommt) von
 * {colorIndex, names, verseNumbers:Set} aus buildPersonNameHighlightInfo()
 * in main.js. Fuer jeden Vers wird JEDE betroffene Person nacheinander
 * angewandt (s. highlightPersonName) - bei Ueberlappung bekommt ein Vers
 * dadurch mehrere, unterschiedlich eingefaerbte Namens-Pillen. Unabhaengig
 * von highlightVerseNumber: ein Kapitel kann mehrere Personen-Verse
 * enthalten, aber nur EINEN Scroll-/Unterstreichungs-Ziel-Vers (s. main.js).
 */
function renderChapterText(
  outputEl,
  chapter,
  highlightVerseNumber,
  personNameInfoList
) {
  const versesHtml = chapter.verseList
    .map((v) => {
      const isHighlighted = v.number === highlightVerseNumber;
      const cls = isHighlighted ? ' class="highlighted"' : "";
      let text = escapeHtml(v.text);
      if (personNameInfoList) {
        personNameInfoList.forEach((info) => {
          if (info.verseNumbers.has(v.number)) {
            text = highlightPersonName(text, info.names, info.colorIndex);
          }
        });
      }
      return `<p${cls}><strong>${v.number}</strong> ${text}</p>`;
    })
    .join("");

  outputEl.innerHTML =
    `<h2>${germanBookName(chapter.bookName)} – Kapitel ${
      chapter.chapterNumber
    }</h2>` + versesHtml;
}

// ========================================================================
// referenceStrip.js — Chip-Leiste ueber dem Kapiteltext
// ========================================================================

function renderReferenceStrip(
  stripEl,
  chapter,
  crossRefsForChapter,
  onChipClick,
  activeReference
) {
  stripEl.innerHTML = "";
  stripEl.classList.remove("expanded");

  const chipsContainer = document.createElement("div");
  chipsContainer.className = "reference-strip-chips";

  const label = document.createElement("span");
  label.className = "reference-strip-label";
  label.textContent = `${germanBookName(chapter.bookName)} ${
    chapter.chapterNumber
  }.`;
  chipsContainer.appendChild(label);

  const divider = document.createElement("span");
  divider.style.color = "var(--border-color)";
  divider.textContent = "|";
  chipsContainer.appendChild(divider);

  crossRefsForChapter.forEach((entry) => {
    const { source, target } = entry;
    const chip = document.createElement("button");
    chip.className = "reference-chip";
    if (referencesMatch(entry, activeReference)) {
      chip.classList.add("is-active");
    }
    chip.innerHTML = `${germanBookAbbrev(source.book)} ${source.chapter}:${
      source.verse
    } <span class="arrow">→</span> ${germanBookAbbrev(target.bookFull)} ${
      target.chapter
    }:${target.verse}`;
    chip.addEventListener("click", () => onChipClick(source, target));
    chipsContainer.appendChild(chip);
  });

  stripEl.appendChild(chipsContainer);

  const more = document.createElement("button");
  more.className = "reference-strip-more";
  more.innerHTML = `
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M12 5v14M5 12h14" stroke-linecap="round"/>
    </svg>
  `;
  more.addEventListener("click", () => {
    stripEl.classList.toggle("expanded");
  });
  stripEl.appendChild(more);

  requestAnimationFrame(() => {
    const overflows =
      chipsContainer.scrollWidth > chipsContainer.clientWidth + 1;
    more.classList.toggle("visible", overflows);
  });
}

function getCrossRefsForChapter(crossRefs, bookName, chapterNumber) {
  const result = [];
  crossRefs.forEach((ref) => {
    if (ref.source.book === bookName && ref.source.chapter === chapterNumber) {
      ref.targets.forEach((target) => {
        result.push({ source: ref.source, target });
      });
    }
  });
  return result;
}

// ========================================================================
// verseSplitView.js
// ========================================================================

function renderSplitSideContent(
  sideEl,
  verseEntry,
  label,
  highlightVerseNumber,
  personNameInfoList
) {
  if (!verseEntry) {
    sideEl.innerHTML = `<p style="color:var(--text-muted); padding-top:4px;">${label} nicht gefunden</p>`;
    return;
  }
  const { chapter } = verseEntry;

  const versesHtml = chapter.verseList
    .map((v) => {
      const isHighlighted = v.number === highlightVerseNumber;
      const cls = isHighlighted ? ' class="highlighted"' : "";
      const id = isHighlighted ? ' id="split-highlight-verse"' : "";
      // Identisch zur Kapitelansicht (s. renderChapterText): erst
      // escapen, dann die Namens-Pillen einsetzen. Der Verstext wurde
      // hier zuvor UNESCAPED ausgegeben - fuer die Pillen ist das Escapen
      // ohnehin Voraussetzung, damit die eingefuegten <span>-Tags nicht
      // durch Sonderzeichen im Bibeltext zerstoert werden koennen.
      let text = escapeHtml(v.text);
      if (personNameInfoList) {
        personNameInfoList.forEach((info) => {
          if (info.verseNumbers.has(v.number)) {
            text = highlightPersonName(text, info.names, info.colorIndex);
          }
        });
      }
      return `<p${cls}${id}><strong>${v.number}</strong> ${text}</p>`;
    })
    .join("");

  sideEl.innerHTML = `
    <h3>${germanBookName(chapter.bookName)} ${chapter.chapterNumber}.</h3>
    ${versesHtml}
  `;
}

/**
 * `getHighlightInfo(chapter)` wird von main.js uebergeben
 * (buildEntityNameHighlightInfo) - dieselbe Quelle, aus der auch die
 * Kapitelansicht ihre Namens-Pillen bezieht. Dadurch sind angepinnte
 * Personen/Orte/Zeiten/Woerter jetzt auch in der Querverweis-Ansicht
 * farblich markiert, und zwar in BEIDEN Spalten - jede mit den Treffern
 * ihres eigenen Kapitels.
 */
function showSplitView(
  leftEl,
  rightEl,
  verseIndex,
  sourceRef,
  targetRef,
  getHighlightInfo
) {
  const sourceEntry = verseIndex.getVerse(
    sourceRef.book,
    sourceRef.chapter,
    sourceRef.verse
  );
  const targetEntry = verseIndex.getVerse(
    targetRef.bookFull,
    targetRef.chapter,
    targetRef.verse
  );

  renderSplitSideContent(
    leftEl,
    sourceEntry,
    "Quellvers",
    sourceRef.verse,
    sourceEntry && getHighlightInfo
      ? getHighlightInfo(sourceEntry.chapter)
      : null
  );
  renderSplitSideContent(
    rightEl,
    targetEntry,
    "Zielvers",
    targetRef.verse,
    targetEntry && getHighlightInfo
      ? getHighlightInfo(targetEntry.chapter)
      : null
  );

  requestAnimationFrame(() => {
    scrollToHighlightedVerse(leftEl, "h3");
    scrollToHighlightedVerse(rightEl, "h3");
  });
}

/**
 * Scrollt containerEl so, dass sein .highlighted-Kind sichtbar wird (statt
 * z. B. unter einem sticky Header verdeckt zu bleiben). stickyHeaderSelector
 * ist optional - Split-View hat einen sticky <h3>, dessen Hoehe beim
 * Scroll-Ziel beruecksichtigt werden muss; die Kapitelansicht (content-
 * area) hat keinen sticky Header und braucht dafuer keinen Selektor.
 */
function scrollToHighlightedVerse(containerEl, stickyHeaderSelector) {
  const highlighted = containerEl.querySelector(".highlighted");
  if (!highlighted) return;

  const headerHeight = stickyHeaderSelector
    ? containerEl.querySelector(stickyHeaderSelector)?.offsetHeight || 0
    : 0;
  const containerRect = containerEl.getBoundingClientRect();
  const highlightRect = highlighted.getBoundingClientRect();
  const currentOffsetWithinContainer = highlightRect.top - containerRect.top;

  const targetScroll =
    containerEl.scrollTop + currentOffsetWithinContainer - headerHeight - 60;
  containerEl.scrollTop = Math.max(0, targetScroll);
}

// ========================================================================
// panelDivider.js — Drag-Resize des Info-Bereich-Overlays.
// ========================================================================
// Der Trenner sitzt an der Oberkante des Info-Bereich-Overlays (CSS:
// bottom: var(--lower-pane-height)) und steuert beim Ziehen jetzt DIREKT
// dessen Hoehe - anders als frueher, wo er indirekt die Canvas-Hoehe
// steuerte. Die Canvas-Hoehe selbst ist inzwischen rein zustandsgesteuert
// (Idle/Kompakt) und nicht mehr per Drag veraenderbar.

function wirePanelDivider({
  divider,
  panelEl,
  onDragStart,
  onDragEnd,
  onResize,
}) {
  let dragging = false;
  let rafPending = false;

  function scheduleResize() {
    if (rafPending) return;
    rafPending = true;
    requestAnimationFrame(() => {
      rafPending = false;
      onResize();
    });
  }

  function clampLowerPaneHeight(rawHeight, panelHeight) {
    const maxHeight = panelHeight * LOWER_PANE_HEIGHT_MAX_RATIO;
    return Math.min(Math.max(rawHeight, LOWER_PANE_HEIGHT_MIN), maxHeight);
  }

  function onMouseMove(e) {
    if (!dragging) return;
    const panelRect = panelEl.getBoundingClientRect();
    // Der Info-Bereich ist bottom:0 verankert - der Abstand von der
    // Mausposition zur PANEL-Unterkante ist also direkt die neue Hoehe.
    const rawHeight = panelRect.bottom - e.clientY;
    const clamped = clampLowerPaneHeight(rawHeight, panelRect.height);
    document.documentElement.style.setProperty(
      "--lower-pane-height",
      `${clamped}px`
    );
    scheduleResize();
  }

  function stopDragging() {
    if (!dragging) return;
    dragging = false;
    divider.classList.remove("dragging");
    document.body.classList.remove("is-resizing");
    document.removeEventListener("mousemove", onMouseMove);
    document.removeEventListener("mouseup", stopDragging);
    if (onDragEnd) onDragEnd();
  }

  divider.addEventListener("mousedown", (e) => {
    dragging = true;
    if (onDragStart) onDragStart();
    divider.classList.add("dragging");
    document.body.classList.add("is-resizing");
    e.preventDefault();
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", stopDragging);
  });
}

// ========================================================================
// zoomController.js — Scroll-Zoom (zum Mauszeiger) + Drag-Pan fuer die
// Visualisierung, wie bei einer Kartenanwendung.
// ========================================================================
// Architektur: #bible-container bekommt eine transform:translate()scale()
// direkt aufs Element - NICHT auf .zoom-viewport selbst, obwohl DAS das
// sichtbare "Fenster" mit overflow:hidden ist. Grund: ein Element mit
// eigenem overflow:hidden UND einem Transform auf SICH SELBST wuerde
// seinen eigenen Clip-Bereich mitskalieren (das Fenster wuechse mit dem
// Inhalt mit statt ihn zu begrenzen) - das Fenster muss deshalb ein
// SEPARATES, UNVERAENDERTES Element sein, in dem der eigentliche Inhalt
// frei skaliert/verschoben werden kann.
//
// transform-origin:0 0 (in style.css) heisst: bei scale=1, pan=(0,0)
// deckt sich #bible-container exakt mit dem Fenster (wie vorher, ohne
// Zoom). Punkt (contentX, contentY) im UNSKALIERTEN Inhalt landet auf
// Bildschirm-Position (panX + contentX*scale, panY + contentY*scale)
// relativ zur Fensterecke - daraus folgt die Zoom-zum-Cursor-Formel unten.
//
// Die Boegen selbst werden NICHT hier transformiert - sie sind ein
// separates, unveraendertes SVG-Overlay ueber dem GESAMTEN Canvas (s.
// arcs.js-Teil) und werden stattdessen bei jeder Zoom-/Pan-Aenderung ueber
// onZoomChange -> redrawArcsRef() komplett neu gezeichnet, basierend auf
// den dann AKTUELLEN (schon skalierten/verschobenen) Balken-Bildschirm-
// positionen (getBarPositions liest ja per getBoundingClientRect - das
// spiegelt jeden Transform auf einem Vorfahren automatisch wider). Die
// Boegen "folgen" den Balken dadurch von selbst, ohne eigene Zoom-Logik.

const ZOOM_MIN = 1;
const ZOOM_MAX = 8; // hartes Maximum - "nicht unendlich reinzoomen"
// Multiplikativer statt additiver Zoom-Faktor pro Wheel-Event (per
// Math.exp), damit sich jeder einzelne Wheel-"Tick" unabhaengig vom
// AKTUELLEN Zoomlevel gleich stark anfuehlt (bei additiver Aenderung
// wuerde derselbe Tick bei hohem Zoom kaum noch etwas bewirken, bei
// niedrigem Zoom dagegen ueberproportional viel). Wert empirisch gewaehlt:
// ein einzelner Mausrad-Klick (deltaY ~100) aendert den Zoom um ca. 17%.
const ZOOM_WHEEL_SENSITIVITY = 0.0018;
// Mausbewegung in px, bevor ein mousedown auf der Visualisierung als
// Pan-Drag (statt als beginnender Klick auf einen Balken/Bogen) gilt.
const ZOOM_DRAG_THRESHOLD = 4;

function createZoomController({
  viewportEl,
  contentEl,
  onZoomChange,
  onDragEnd,
}) {
  let scale = ZOOM_MIN;
  let panX = 0;
  let panY = 0;

  // WICHTIG: CSS zoom statt transform:scale() im transform-String. Beide
  // sehen visuell zunaechst identisch aus, verhalten sich beim Rendern
  // aber grundlegend anders: transform:scale() skaliert eine bereits
  // GERASTERTE Ebene nachtraeglich hoch, wodurch die (bei so duennen
  // 0.5px-Balken zwangslaeufig leicht unregelmaessige) Pixel-Rundung bei
  // scale=1 beim Hochskalieren nur vergroessert wird (bei zoom=8 wurden
  // so Luecken zwischen 8px und 16px gemessen, obwohl die LAYOUT-
  // Positionen selbst nachweislich exakt gleichmaessig sind). zoom loest
  // dagegen ein ECHTES Neu-Layout bei der Zielgroesse aus - per Pixel-
  // Analyse verifiziert: die Luecken sind dadurch praktisch exakt gleich.
  //
  // Kompensation im translate(): zoom veraendert, wie das ELEMENT SEINE
  // EIGENEN transform-Werte interpretiert. Bei "zoom:z; transform:
  // translate(px,py)" gilt (empirisch verifiziert) screenPos =
  // z*(localPos+p) - NICHT screenPos = p + z*localPos wie bei purem
  // transform:scale(). Die Zoom-zum-Cursor-Formel unten (onWheel) und
  // clampPan() sind aber fuer LETZTERES hergeleitet und arbeiten mit
  // panX/panY als BILDSCHIRM-Pixel-Versatz. Division durch scale HIER
  // kompensiert exakt den zusaetzlichen Multiplikationsschritt, den zoom
  // einfuehrt: z*(local + p/z) = z*local + p - identisch zur
  // urspruenglichen Formel, onWheel/clampPan bleiben dadurch unveraendert
  // korrekt.
  function applyTransform() {
    contentEl.style.zoom = scale;
    contentEl.style.transform = `translate(${panX / scale}px, ${
      panY / scale
    }px)`;
  }

  // Haelt den Inhalt immer bildschirmfuellend: bei scale>1 ist der Inhalt
  // groesser als das Fenster, pan darf ihn aber nicht so weit verschieben,
  // dass am Rand eine leere Luecke entsteht. Referenzgroesse ist die
  // AKTUELLE Fenstergroesse (nicht gecacht), da sich #bible-container bei
  // scale=1 immer exakt daran ausrichtet - funktioniert dadurch auch nach
  // einem Fenster-Resize ohne separate Sonderbehandlung.
  function clampPan(rect) {
    const minX = rect.width * (1 - scale);
    const minY = rect.height * (1 - scale);
    panX = Math.min(0, Math.max(minX, panX));
    panY = Math.min(0, Math.max(minY, panY));
  }

  let rafPending = false;
  function scheduleZoomChange() {
    if (rafPending) return;
    rafPending = true;
    requestAnimationFrame(() => {
      rafPending = false;
      if (onZoomChange) onZoomChange(scale);
    });
  }

  function onWheel(e) {
    e.preventDefault();
    const rect = viewportEl.getBoundingClientRect();
    const cursorX = e.clientX - rect.left;
    const cursorY = e.clientY - rect.top;

    const oldScale = scale;
    // deltaY < 0 (Rad nach vorn/weg vom Koerper) = reinzoomen - dieselbe
    // Richtung wie bei jeder Kartenanwendung.
    const factor = Math.exp(-e.deltaY * ZOOM_WHEEL_SENSITIVITY);
    scale = Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, scale * factor));
    if (scale === oldScale) return;

    // Zoom-zum-Cursor: aufgeloest nach panX/panY aus der Bedingung, dass
    // der Punkt UNTER dem Cursor vor und nach der Skalierung an derselben
    // Bildschirmposition bleiben soll (s. Herleitung im Modul-Kommentar).
    panX = cursorX - (cursorX - panX) * (scale / oldScale);
    panY = cursorY - (cursorY - panY) * (scale / oldScale);
    clampPan(rect);
    applyTransform();
    scheduleZoomChange();
  }

  let dragState = null;

  function onMouseDown(e) {
    if (e.button !== 0) return; // nur linke Maustaste
    dragState = {
      startX: e.clientX,
      startY: e.clientY,
      startPanX: panX,
      startPanY: panY,
      isDragging: false,
    };
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  }

  function onMouseMove(e) {
    if (!dragState) return;
    const dx = e.clientX - dragState.startX;
    const dy = e.clientY - dragState.startY;

    if (!dragState.isDragging) {
      if (
        Math.abs(dx) < ZOOM_DRAG_THRESHOLD &&
        Math.abs(dy) < ZOOM_DRAG_THRESHOLD
      ) {
        return; // koennte noch ein normaler Klick werden, noch nicht eingreifen
      }
      dragState.isDragging = true;
      viewportEl.classList.add("is-panning");
      document.body.classList.add("is-panning-vis");
    }

    e.preventDefault();
    panX = dragState.startPanX + dx;
    panY = dragState.startPanY + dy;
    clampPan(viewportEl.getBoundingClientRect());
    applyTransform();
    scheduleZoomChange();
  }

  function onMouseUp() {
    document.removeEventListener("mousemove", onMouseMove);
    document.removeEventListener("mouseup", onMouseUp);
    if (dragState && dragState.isDragging) {
      viewportEl.classList.remove("is-panning");
      document.body.classList.remove("is-panning-vis");
      if (onDragEnd) onDragEnd();
    }
    dragState = null;
  }

  viewportEl.addEventListener("wheel", onWheel, { passive: false });
  viewportEl.addEventListener("mousedown", onMouseDown);

  return {
    reset() {
      scale = ZOOM_MIN;
      panX = 0;
      panY = 0;
      applyTransform();
      scheduleZoomChange();
    },
    // Nach einem Fenster-Resize koennte der bisherige pan ausserhalb der
    // (jetzt anderen) gueltigen Grenzen liegen - hier nur neu klemmen,
    // ohne den Zoom selbst zurueckzusetzen.
    reclamp() {
      clampPan(viewportEl.getBoundingClientRect());
      applyTransform();
    },
    getScale() {
      return scale;
    },
  };
}

// ========================================================================
// layoutController.js — schaltet zwischen den drei Zustaenden um
// ========================================================================

function createLayoutController({
  visualizerCanvas,
  resetButton,
  panelDivider,
  lowerPane,
  contentArea,
  splitView,
  canvasFooterEl,
  zoomViewport,
  gridViewport,
  mapViewport,
  infoPanel,
  getVisMode,
  onLayoutChange,
}) {
  async function applyAndRedraw() {
    await new Promise((resolve) => requestAnimationFrame(resolve));
    onLayoutChange();
  }

  // Faehrt den Info-Bereich, den Trenner UND den Canvas-Titel ("Zuercher
  // Bibel 1931...") gemeinsam von unten hoch (Slide-Up). [hidden] setzt
  // display:none, was jede CSS-Transition sofort abwuergen wuerde -
  // deshalb erst [hidden] entfernen, per erzwungenem Reflow (offsetHeight)
  // den Browser zwingen, die Ausgangsposition (aus der jeweiligen CSS-
  // Grundregel) tatsaechlich zu rendern, und ERST DANACH bei ALLEN DREI
  // Elementen "is-open" hinzufuegen, das zur Endposition transformiert.
  // Ohne den Reflow dazwischen wuerde der Browser Start- und Zielzustand
  // im selben Frame zusammenfassen und keine Animation abspielen. Trenner
  // UND Titel bekommen "is-open" bewusst GLEICHZEITIG mit dem Info-Bereich
  // (nicht frueher/spaeter) - ihre Transform-Formeln in style.css
  // referenzieren dieselbe --lower-pane-height-Variable wie der
  // Info-Bereich, dadurch wandern beide waehrend der GESAMTEN Animation im
  // Gleichschritt mit dessen Oberkante mit, statt (wie zuvor beim Trenner)
  // sofort starr auf der Ziel-Position aufzutauchen bzw. (wie zuvor beim
  // Titel) einfach vom Info-Bereich verdeckt zu werden.
  function openLowerPane() {
    if (!lowerPane.hidden && lowerPane.classList.contains("is-open")) return;
    lowerPane.hidden = false;
    panelDivider.hidden = false;
    void lowerPane.offsetHeight;
    lowerPane.classList.add("is-open");
    panelDivider.classList.add("is-open");
    canvasFooterEl.classList.add("is-open");
  }

  // Faehrt Info-Bereich, Trenner UND Titel gemeinsam wieder nach unten
  // aus. Info-Bereich und Trenner werden danach (erst wenn die Transition
  // tatsaechlich beendet ist) auf [hidden] zurueckgesetzt, damit sie
  // ausserhalb der Sichtbarkeit auch nicht mehr interagierbar sind - der
  // Titel braucht das nicht (rein dekorativ, nie interaktiv), fuer ihn
  // reicht das Entfernen der Klasse. Die "is-open"-Pruefung auf lowerPane
  // verhindert doppelte transitionend-Listener bei mehrfachem schnellem
  // Klicken auf Reset.
  function closeLowerPane() {
    if (!lowerPane.classList.contains("is-open")) return;
    lowerPane.classList.remove("is-open");
    panelDivider.classList.remove("is-open");
    canvasFooterEl.classList.remove("is-open");
    lowerPane.addEventListener("transitionend", function onEnd(e) {
      if (e.target !== lowerPane || e.propertyName !== "transform") return;
      lowerPane.hidden = true;
      panelDivider.hidden = true;
      lowerPane.removeEventListener("transitionend", onEnd);
    });
  }

  // Zeigt die eigentliche Balken-/Bogen- ODER Grid-Visualisierung wieder
  // an (je nach aktuellem Modus, s. getVisMode/setVisMode in main.js) und
  // blendet das Info-Panel aus, falls das gerade aktiv war - von
  // showChapter/showSplit/reset gemeinsam genutzt, da alle drei aus dem
  // Info-Zustand heraus erreichbar sein muessen. Blendet dabei auch die
  // Fusszeile (Verlauf + "Zuercher Bibel 1931"-Beschriftung) wieder ein,
  // falls sie fuer den Info-Zustand ausgeblendet war.
  function showVisualization() {
    // Ansicht am <html> spiegeln: im Info-/Onboarding-Zustand blendet CSS
    // die beiden Umschalter aus - sie wuerden dort ueber der Buehne liegen
    // und haetten ohnehin keine Wirkung.
    document.documentElement.dataset.view = "vis";
    const mode = getVisMode();
    zoomViewport.hidden = mode !== "arc";
    gridViewport.hidden = mode !== "grid";
    mapViewport.hidden = mode !== "map";
    infoPanel.hidden = true;
    canvasFooterEl.hidden = false;
  }

  return {
    showChapter() {
      showVisualization();
      visualizerCanvas.classList.remove("is-idle");
      resetButton.hidden = false;
      openLowerPane();
      contentArea.hidden = false;
      splitView.hidden = true;
      applyAndRedraw();
    },
    showSplit() {
      showVisualization();
      visualizerCanvas.classList.remove("is-idle");
      resetButton.hidden = false;
      openLowerPane();
      contentArea.hidden = true;
      splitView.hidden = false;
      applyAndRedraw();
    },
    // Ersetzt die Visualisierung komplett durch den beschreibenden Text
    // (statt sie wie Kapitel-/Split-Ansicht nur teilweise zu ueberlagern) -
    // passend zur Anfrage, dass Home explizit "zur Standardvisualisierung"
    // zurueckfuehren soll, waehrend Info sie ersetzt. Schliesst dafuer den
    // Info-Bereich (Kapitel-/Split-Text ergibt waehrenddessen keinen Sinn),
    // zeigt aber den Reset-Button, damit auch das Kreuz zurueckfuehrt. Die
    // Fusszeile (Verlauf + "Zuercher Bibel 1931") wird ebenfalls
    // ausgeblendet - im Info-Text wird weder der Verlauf (er wuerde ohne
    // Balken/Boegen ins Leere blenden) noch die Beschriftung gebraucht.
    showInfo() {
      document.documentElement.dataset.view = "info";
      zoomViewport.hidden = true;
      gridViewport.hidden = true;
      mapViewport.hidden = true;
      infoPanel.hidden = false;
      canvasFooterEl.hidden = true;
      visualizerCanvas.classList.remove("is-idle");
      resetButton.hidden = false;
      closeLowerPane();
      applyAndRedraw();
    },
    reset() {
      // Kein manuelles Zuruecksetzen der Canvas-Hoehe mehr noetig: die
      // Hoehe wird IMMER von applyLayoutVars() gesetzt (ueber
      // onLayoutChange -> applyAndRedraw), das sie ohnehin konstant haelt.
      showVisualization();
      visualizerCanvas.classList.add("is-idle");
      resetButton.hidden = true;
      closeLowerPane();
      applyAndRedraw();
    },
  };
}

// ========================================================================
// onboarding.js — scroll-getriebene Erklaerung im Info-Bereich
// ========================================================================
// Scrollytelling: .ob-stage bleibt per position:sticky stehen, die
// Text-Abschnitte scrollen daran vorbei. Der Scroll bestimmt NUR, welcher
// Schritt aktiv ist (data-ob-step auf .ob-root) - die Bewegung selbst
// machen CSS-Transitions, s. ausfuehrliche Begruendung im style.css.
//
// Der Aufbau nutzt eine EIGENE, leichte Darstellung statt der echten
// Kapitel-Balken: die haengen an Zoom-, Layout- und Hover-Logik, die hier
// nur stoeren wuerde, und duerfen waehrend des Onboardings nicht
// veraendert werden.

// So viele Boegen zeigt Schritt 4. Nicht alle 10.428: gleichzeitig
// eingeblendet ruckelt das beim Scrollen spuerbar. Die Auswahl nimmt jeden
// n-ten Bogen (nicht die ersten 1500), damit die Verteilung von kurzen und
// weiten Verbindungen erhalten bleibt - ein "nur die ersten" haette
// systematisch die Reihenfolge der Bibel abgebildet statt des Netzes.
const OB_ARC_SAMPLE = 1500;
// Balkenhoehe bei "alle gleich lang" (Schritt 1), als Anteil der vollen
// Hoehe eines maximal langen Kapitels.
const OB_EQUAL_SCALE = 0.28;

/**
 * Findet den Bogen fuer das im Text erklaerte Beispiel. Faellt auf den
 * ersten verfuegbaren Bogen zurueck, falls die Stelle einmal nicht mehr
 * auffindbar ist (z. B. nach einem Datenwechsel) - das Onboarding soll
 * daran nicht zerbrechen.
 */
function findOnboardingExampleArc(records) {
  const match = records.find(
    (r) =>
      r.source.book === "Isaiah" &&
      r.source.chapter === 54 &&
      r.target.bookFull === "Genesis" &&
      r.target.chapter === 9
  );
  return match || records[0] || null;
}

function createOnboarding({
  panelEl,
  chapters,
  crossRefs,
  verseIndex,
  examples,
  onFinish,
}) {
  const root = document.getElementById("ob-root");
  const stage = document.getElementById("ob-stage");
  const barsEl = document.getElementById("ob-bars");
  const arcsEl = document.getElementById("ob-arcs");
  const pinsEl = document.getElementById("ob-pins");
  const combosEl = document.getElementById("ob-combos");
  const steps = Array.from(root.querySelectorAll(".ob-step"));
  if (!root || !stage) return { layout() {}, reset() {} };

  const maxVerses = Math.max(...chapters.map((c) => c.verseCount));

  // ---- Balken einmalig erzeugen ---------------------------------------
  const bars = chapters.map((chapter, i) => {
    const bar = document.createElement("div");
    bar.className = "ob-bar";
    // Staffelung fuer das Erscheinen von links nach rechts. Gesamtdauer
    // bewusst unter einer Sekunde - laenger fuehlt sich beim Scrollen
    // nicht mehr wie eine Reaktion an, sondern wie Warten.
    bar.style.setProperty("--ob-delay", `${(i / chapters.length) * 700}ms`);
    // Beim Wachsen (Schritt 2) eine kleinere Staffelung, damit eine Welle
    // erkennbar bleibt, ohne dass das Ende ewig braucht.
    bar.style.setProperty(
      "--ob-grow-delay",
      `${(i / chapters.length) * 350}ms`
    );
    bar.style.setProperty("--ob-scale-equal", OB_EQUAL_SCALE);
    bar.style.setProperty(
      "--ob-scale-full",
      Math.max(0.012, chapter.verseCount / maxVerses)
    );
    // Schritt 8: Funkeln. Verzoegerung und Farbe einmalig festlegen -
    // waehrend der Animation wuerde das Auswuerfeln pro Frame bei 1189
    // Elementen deutlich kosten. Pseudo-zufaellig aus dem Index, damit
    // das Muster bei jedem Aufruf gleich (und damit ruhig) bleibt.
    const jitter = (Math.sin(i * 12.9898) * 43758.5453) % 1;
    bar.style.setProperty("--ob-sparkle-delay", `${Math.abs(jitter) * 2600}ms`);
    bar.style.setProperty(
      "--ob-sparkle-color",
      `var(--person-color-${(i % 4) + 1})`
    );
    barsEl.appendChild(bar);
    return bar;
  });

  // ---- Bogen-Datensaetze (Kapitel-Index statt Pixel, wie im Hauptview) --
  const records = [];
  crossRefs.forEach((ref) => {
    const sourceChapter = verseIndex.getChapter(
      ref.source.book,
      ref.source.chapter
    );
    if (!sourceChapter) return;
    ref.targets.forEach((target) => {
      const targetChapter = verseIndex.getChapter(
        target.bookFull,
        target.chapter
      );
      if (!targetChapter) return;
      records.push({
        source: ref.source,
        target,
        from: sourceChapter.position,
        to: targetChapter.position,
        distance: Math.abs(sourceChapter.position - targetChapter.position),
      });
    });
  });

  const exampleArc = findOnboardingExampleArc(records);
  const sampleStep = Math.max(1, Math.floor(records.length / OB_ARC_SAMPLE));
  const sampled = records.filter(
    (r, i) => i % sampleStep === 0 && r !== exampleArc
  );
  const maxDistance = records.reduce((m, r) => Math.max(m, r.distance), 1);

  // Pfade EINMALIG anlegen; spaeter wird nur noch das d-Attribut neu
  // berechnet (Resize) bzw. die Deckkraft per CSS animiert.
  const restPaths = sampled.map((record, i) => {
    const path = document.createElementNS(SVG_NS, "path");
    path.setAttribute("class", "ob-arc-rest");
    path.style.setProperty("--ob-delay", `${(i / sampled.length) * 900}ms`);
    arcsEl.appendChild(path);
    return { record, path };
  });

  const examplePath = document.createElementNS(SVG_NS, "path");
  examplePath.setAttribute("class", "ob-arc-example");
  arcsEl.appendChild(examplePath);

  const exampleLabel = document.createElementNS(SVG_NS, "text");
  exampleLabel.setAttribute("class", "ob-arc-label");
  exampleLabel.setAttribute("text-anchor", "middle");
  exampleLabel.textContent = "Jes 54:9 → Gen 9:11";
  arcsEl.appendChild(exampleLabel);

  if (exampleArc) {
    bars[exampleArc.from]?.classList.add("is-example");
    bars[exampleArc.to]?.classList.add("is-example");
  }

  // ---- Schritt 6: die vier Kategorien als Beispiel-Pins ---------------
  // Abstand, in dem die vier Beispiel-Gruppen nacheinander aufleuchten.
  // Bewusst gross genug, dass jede Gruppe einzeln wahrnehmbar ist, bevor
  // die naechste dazukommt - sonst waere es ein einziges Aufblitzen und
  // die Zuordnung Pin -> Kapitel ginge verloren.
  const OB_PIN_STEP_MS = 620;
  examples.forEach((pin, i) => {
    const el = document.createElement("div");
    el.className = `ob-pin ob-pin-${i + 1}`;
    el.style.setProperty("--ob-delay", `${i * OB_PIN_STEP_MS}ms`);
    el.innerHTML = `<span class="ob-pin-cat">${pin.category}</span><span class="ob-pin-label">${pin.label}</span>`;
    pinsEl.appendChild(el);
  });

  // ---- Schritt 7: alle Farben und Farbmischungen ----------------------
  // Erst zur Laufzeit gebaut, weil die Mischfarben mit derselben Funktion
  // berechnet werden wie in der echten Visualisierung
  // (multiplyBlendColors) - so stimmt das Beispiel garantiert mit dem
  // ueberein, was der Nutzer spaeter tatsaechlich sieht, statt
  // hartkodierte Farbwerte zu zeigen, die auseinanderlaufen koennen.
  function buildCombos() {
    combosEl.innerHTML = "";
    const slots = [0, 1, 2, 3];
    const groups = [];
    // Einzelfarben, dann Paare, dann Dreier, dann alle vier - in dieser
    // Reihenfolge wird die Mischung schrittweise dunkler, was den
    // Zusammenhang unmittelbar zeigt.
    for (let size = 1; size <= 4; size++) {
      const combos = [];
      const walk = (start, acc) => {
        if (acc.length === size) return combos.push(acc.slice());
        for (let i = start; i < slots.length; i++)
          walk(i + 1, acc.concat(slots[i]));
      };
      walk(0, []);
      groups.push(combos);
    }
    let index = 0;
    groups.forEach((combos) => {
      combos.forEach((combo) => {
        const swatch = document.createElement("div");
        swatch.className = "ob-combo";
        swatch.style.background = multiplyBlendColors(
          combo.map(readPersonColor)
        );
        swatch.style.setProperty("--ob-delay", `${index * 45}ms`);
        combosEl.appendChild(swatch);
        index += 1;
      });
    });
  }

  /**
   * Bestimmt fuer jeden Balken, zu welchen der vier Beispiele sein Kapitel
   * gehoert, und leitet daraus Farbe und Einblendzeitpunkt ab.
   *
   * Die Farbe entsteht mit derselben multiplyBlendColors()-Funktion wie in
   * der echten Visualisierung - ein Kapitel, in dem z. B. David UND
   * Jerusalem vorkommen, bekommt hier exakt denselben Mischton wie
   * spaeter beim echten Anpinnen. Damit ist Schritt 6 gleichzeitig die
   * Vorbereitung auf Schritt 7 (die Farbtafel).
   *
   * Die Verzoegerung richtet sich nach dem HOECHSTEN beteiligten
   * Beispiel-Index: ein Kapitel mit David+Jerusalem leuchtet also erst
   * auf, wenn Jerusalem an der Reihe ist - und dann sofort in der
   * gemischten Farbe. Beim niedrigsten Index waere es zuerst rot und
   * muesste spaeter die Farbe wechseln, was den Eindruck stoert.
   *
   * In layout() aufgerufen (nicht einmalig), weil readPersonColor() die
   * CSS-Variablen liest, die sich beim Theme-Wechsel aendern.
   */
  function applyExampleColors() {
    const chapterKeys = chapters.map((c) =>
      makeChapterKey(c.bookName, c.chapterNumber)
    );
    bars.forEach((bar, i) => {
      const matches = [];
      examples.forEach((example, idx) => {
        if (example.chapterKeys.has(chapterKeys[i])) matches.push(idx);
      });
      if (matches.length === 0) {
        bar.style.setProperty("--ob-pin-bg", "var(--text-body)");
        bar.style.setProperty("--ob-pin-opacity", "0.1");
        bar.style.setProperty("--ob-pin-delay", "0ms");
        return;
      }
      bar.style.setProperty(
        "--ob-pin-bg",
        multiplyBlendColors(matches.map(readPersonColor))
      );
      bar.style.setProperty("--ob-pin-opacity", "0.95");
      bar.style.setProperty(
        "--ob-pin-delay",
        `${Math.max(...matches) * OB_PIN_STEP_MS}ms`
      );
    });
  }

  let barX = [];
  let baselineY = 0;
  // Zuletzt verarbeitete Groesse - verhindert Endlos-Schleifen im
  // ResizeObserver (s. dort).
  let lastW = 0;
  let lastH = 0;
  // Scroll-Offsets der Text-Abschnitte, in layout() einmal gemessen.
  let stepOffsets = [];

  /**
   * Positioniert Balken und Boegen fuer die aktuelle Panel-Groesse. Wird
   * beim Oeffnen des Info-Bereichs und bei jedem Resize aufgerufen - die
   * Hoehen von Buehne und Text-Abschnitten haengen an der Panel-Hoehe, die
   * ihrerseits von der Fenstergroesse abhaengt und deshalb nicht in CSS
   * ausgedrueckt werden kann.
   */
  function layout() {
    const width = panelEl.clientWidth;
    const height = panelEl.clientHeight;
    if (width === 0 || height === 0) return;
    // Unveraenderte Groesse: nichts zu tun. Zusammen mit dem
    // rAF-Aufschub im ResizeObserver bricht das die Rueckkopplung
    // "Layout aendert Abschnittshoehen -> Scrollleiste erscheint ->
    // clientWidth aendert sich -> Observer feuert -> Layout ...", die den
    // Hauptthread blockierte (sichtbar als haengende Sidebar-Animation).
    if (width === lastW && height === lastH) return;
    lastW = width;
    lastH = height;

    stage.style.height = `${height}px`;
    steps.forEach((step, i) => {
      // Der erste Abschnitt ist der Titel-Zustand und darf kuerzer sein.
      step.style.height = `${height * (i === 0 ? 0.8 : 1)}px`;
    });
    // NACH dem Setzen der Hoehen messen. Wichtig: .ob-stage steht selbst
    // im Fluss und belegt die erste Panel-Hoehe an Scrollstrecke - die
    // Abschnitte beginnen also NICHT bei 0. Genau das war zunaechst
    // falsch angenommen, wodurch die angezeigte Textkarte um einen
    // Schritt gegenueber der Animation verschoben war.
    stepOffsets = steps.map((step) => step.offsetTop);
    // Farbfelder hier (nicht einmalig) bauen: readPersonColor() liest die
    // CSS-Variablen, die sich beim Theme-Wechsel aendern.
    buildCombos();
    applyExampleColors();

    // Die Textkarten liegen links (max. 420px breit + 60px Rand). Die
    // Visualisierung beginnt deshalb RECHTS davon, statt die volle Breite
    // zu nutzen: sonst laeuft der Beispiel-Bogen genau hinter der Karte
    // durch und ist ausgerechnet an der Stelle unsichtbar, an der der Text
    // ihn erklaert. Bei schmalen Fenstern greift eine anteilige Grenze,
    // damit der Grafik nicht zu wenig Platz bleibt.
    const padLeft = Math.min(520, Math.max(90, width * 0.38));
    const padRight = 70;
    const usable = Math.max(1, width - padLeft - padRight);
    const gap = usable / chapters.length;
    const barWidth = Math.max(1, gap * 0.62);
    // Balken haengen - wie in der echten Visualisierung - an einer
    // gemeinsamen OBEREN Kante und wachsen nach UNTEN. Die Boegen setzen
    // genau an dieser Kante an und woelben sich darueber. (Zuvor standen
    // die Balken auf einer unteren Grundlinie und wuchsen nach oben, die
    // Boegen entsprangen dadurch der Balken-BASIS statt ihrer Spitze -
    // ein anderes Bild als in der echten Grafik.)
    const barAreaHeight = height * 0.26;
    baselineY = height * 0.6;

    barX = chapters.map((_, i) => padLeft + i * gap + gap / 2);
    bars.forEach((bar, i) => {
      bar.style.left = `${barX[i] - barWidth / 2}px`;
      bar.style.width = `${barWidth}px`;
      bar.style.height = `${barAreaHeight}px`;
      bar.style.top = `${baselineY}px`;
    });

    arcsEl.setAttribute("viewBox", `0 0 ${width} ${height}`);
    arcsEl.setAttribute("width", width);
    arcsEl.setAttribute("height", height);

    const maxArc = height * 0.52;
    function arcPath(record) {
      const x1 = barX[record.from];
      const x2 = barX[record.to];
      if (x1 == null || x2 == null) return "";
      const t = record.distance / maxDistance;
      // Gleiche Wurzelkurve wie in der Hauptansicht (ARC_CURVE_EXPONENT),
      // damit das Onboarding dasselbe Bild zeigt wie die echte Grafik.
      const h = (0.02 + 0.98 * Math.pow(t, ARC_CURVE_EXPONENT)) * maxArc;
      return `M ${x1},${baselineY} Q ${(x1 + x2) / 2},${
        baselineY - h * 2
      } ${x2},${baselineY}`;
    }

    restPaths.forEach(({ record, path }) =>
      path.setAttribute("d", arcPath(record))
    );

    // ---- Schritt 5: Zielpositionen im Raster ---------------------------
    // Jeder Balken bekommt EINEN Transform, der ihn an seinen Rasterplatz
    // bringt und gleichzeitig zum Quadrat staucht. Berechnet mit
    // transform-origin "top center" (dieselbe Herkunft wie beim Wachsen -
    // ein Wechsel der Origin mitten in der Animation wuerde springen):
    //   Breite:  w * sx = c            -> sx = c / w
    //   Hoehe:   H * sy = c            -> sy = c / H
    //   links:   L + tx + w/2 - w*sx/2 -> tx = gx - barX + c/2
    //   oben:    T + ty                -> ty = gy - baselineY
    // (Skalierung verschiebt die Oberkante nicht, da die Origin dort liegt.)
    const gridArea = { w: usable, h: height * 0.62 };
    const { columns, cellSize } = computeGridLayout(
      chapters.length,
      gridArea.w,
      gridArea.h
    );
    const gridRows = Math.ceil(chapters.length / columns);
    // "gap" ist weiter oben schon fuer den Balkenabstand vergeben.
    const cellGap = Math.max(1, cellSize * 0.14);
    const cell = Math.max(1, cellSize - cellGap);
    const gridW = columns * cellSize;
    const gridH = gridRows * cellSize;
    const gridLeft = padLeft + (usable - gridW) / 2;
    const gridTop = Math.max(24, (height - gridH) / 2);

    bars.forEach((bar, i) => {
      const gx = gridLeft + (i % columns) * cellSize;
      const gy = gridTop + Math.floor(i / columns) * cellSize;
      bar.style.setProperty("--ob-grid-sx", cell / barWidth);
      bar.style.setProperty("--ob-grid-sy", cell / barAreaHeight);
      bar.style.setProperty("--ob-grid-tx", `${gx - barX[i] + cell / 2}px`);
      bar.style.setProperty("--ob-grid-ty", `${gy - baselineY}px`);
    });

    if (exampleArc) {
      examplePath.setAttribute("d", arcPath(exampleArc));
      // Pfadlaenge fuer den Trimpath-Effekt: dasharray = Laenge,
      // dashoffset wandert per CSS von dieser Laenge auf 0.
      const length = examplePath.getTotalLength();
      examplePath.style.setProperty("--ob-arc-length", length);
      examplePath.style.strokeDasharray = length;
      const t = exampleArc.distance / maxDistance;
      const h = (0.02 + 0.98 * Math.pow(t, ARC_CURVE_EXPONENT)) * maxArc;
      exampleLabel.setAttribute(
        "x",
        (barX[exampleArc.from] + barX[exampleArc.to]) / 2
      );
      exampleLabel.setAttribute("y", baselineY - h - 10);
    }
  }

  // ---- Aktiven Schritt aus der Scroll-Position ableiten ----------------
  let currentStep = -1;
  function updateStep() {
    const scrollTop = panelEl.scrollTop;
    const height = panelEl.clientHeight || 1;
    // Ein Schritt gilt als aktiv, sobald sein Abschnitt die Mitte der
    // Buehne erreicht hat. Bewusst ueber die aufsummierten Hoehen statt
    // ueber getBoundingClientRect pro Frame - das waere ein Layout-Read
    // bei jedem Scroll-Event.
    let step = 0;
    for (let i = 0; i < stepOffsets.length; i++) {
      // Ein Schritt wird aktiv, kurz bevor seine Textkarte die Mitte
      // erreicht - so laeuft die Animation an, waehrend der zugehoerige
      // Text ins Bild kommt, statt erst danach.
      if (scrollTop + height * 0.6 >= stepOffsets[i]) step = i;
    }
    if (step === currentStep) return;
    currentStep = step;
    root.dataset.obStep = String(step);
  }

  const finishBtn = document.getElementById("ob-finish");
  if (finishBtn && onFinish) {
    finishBtn.addEventListener("click", onFinish);
  }

  panelEl.addEventListener("scroll", updateStep, { passive: true });

  // Deckt ALLE Groessenaenderungen ab, nicht nur das Fenster-Resize:
  // Ein-/Ausklappen der Sidebar, und - subtiler - das Erscheinen der
  // vertikalen Scrollleiste, sobald die Abschnittshoehen gesetzt sind.
  // Ohne das wurde einmal mit der Breite VOR der Scrollleiste gerechnet,
  // wodurch der rechte Rand der Grafik abgeschnitten wirkte.
  if (typeof ResizeObserver !== "undefined") {
    let pending = false;
    const observer = new ResizeObserver(() => {
      // Aufschub in den naechsten Frame: der Callback feuert sonst
      // MITTEN im Layout-Durchlauf des Browsers, und ein dortiges
      // Schreiben von Groessen loest sofort die naechste Runde aus.
      if (pending) return;
      pending = true;
      requestAnimationFrame(() => {
        pending = false;
        layout();
      });
    });
    observer.observe(panelEl);
  }

  return {
    layout,
    /** Beim Oeffnen des Info-Bereichs: an den Anfang, Schritt 0. */
    reset() {
      panelEl.scrollTop = 0;
      currentStep = 0;
      root.dataset.obStep = "0";
      // Groessen-Merker zuruecksetzen: beim Oeffnen war das Panel zuvor
      // [hidden] (0x0), die gemerkten Werte stammen also aus der letzten
      // Sitzung und wuerden das noetige Neu-Layout unterdruecken.
      lastW = 0;
      lastH = 0;
      layout();
    },
  };
}

// ========================================================================
// main.js — Orchestrierung
// ========================================================================

const BIBLE_XML_PATH = "SF_2009-04-12_GER_ZUERCHER_(ZUERCHER BIBEL 1931).xml";

async function init() {
  const navbarEl = document.querySelector(".navbar");
  const visualizerPanelEl = document.querySelector(".visualizer-panel");
  const visualizerCanvas = document.querySelector(".visualizer-canvas");
  const zoomViewport = document.getElementById("zoom-viewport");
  const gridViewport = document.getElementById("grid-viewport");
  const chapterGridEl = document.getElementById("chapter-grid");
  const mapViewport = document.getElementById("map-viewport");
  const globeCanvasContainer = document.getElementById(
    "globe-canvas-container"
  );
  const arcPaletteControlEl = document.getElementById("arc-palette-control");
  const infoPanel = document.getElementById("info-panel");
  const infoButton = document.getElementById("info-button");
  const homeButton = document.getElementById("home-button");
  const searchFeedback = document.getElementById("search-feedback");
  const bibleContainer = document.getElementById("bible-container");
  const canvasFooterEl = document.querySelector(".canvas-footer");
  const output = document.getElementById("chapter-text");
  const referenceStrip = document.getElementById("reference-strip");
  const panelDivider = document.getElementById("panel-divider");
  const lowerPane = document.getElementById("lower-pane");
  const contentArea = document.getElementById("content-area");
  const splitView = document.getElementById("split-view");
  const splitLeft = document.getElementById("split-side-left");
  const splitRight = document.getElementById("split-side-right");
  const resetButton = document.getElementById("reset-button");

  let redrawArcsRef = () => {};
  // Leichter Pfad, der NUR Farbe/Strichbreite der Boegen aktualisiert
  // (arcOverlay.updateStyle), ohne deren Position neu zu berechnen - fuer
  // Faelle, in denen sich an den Bildschirm-Positionen nichts aendert
  // (Personen-Filter an/aus). s. Modulkommentar bei createArcOverlay,
  // warum diese Trennung die Personen-Filter-Performance ausmacht.
  let refreshArcStyleRef = () => {};
  // Platzhalter, bis die echten Balken existieren (s.u.) - gleiches
  // Muster wie redrawArcsRef, da diese Funktion schon vom weiter oben
  // verdrahteten Reset-Button referenziert wird.
  let updateActiveBars = () => {};
  // Ebenfalls ein Platzhalter nach demselben Muster: wireWordExplorer()
  // wird VOR renderChapterBars() aufgerufen (die Personendaten laden
  // parallel zur Bibel-XML, s.u.), kennt zu diesem Zeitpunkt also noch
  // keine `bars`. Der Callback aus der Sidebar landet deshalb zunaechst
  // hier und wird erst nach dem Balken-Rendering auf die echte
  // Implementierung umgebogen (exakt wie bei updateActiveBars).
  let updatePersonHighlight = () => {};
  let userHasManuallyResizedLowerPane = false;
  let maxBarHeight = 0;
  let activeReference = null;
  let activeChapterKey = null;
  // Welcher Vers in der offenen Kapitelansicht hervorgehoben ist. Wird
  // gebraucht, um den Text nach einer Pin-Aenderung identisch neu
  // aufbauen zu koennen (s. refreshOpenTextView).
  let activeFocusVerse = null;
  // Bis zu MAX_PINNED_PERSONS (4) gleichzeitig angepinnte Entities
  // (Personen, Orte, Zeiten UND Woerter gemischt, s. Anfrage
  // "gleichzeitig"), in Pin-Reihenfolge = Farb-Slot-Reihenfolge (Index 0 =
  // Slot 1/Rot, s. PERSON_COLOR_VARS). Jeder Eintrag: {id, category,
  // displayName, verseKeySet, chapterKeySet} - neu gebaut bei jeder
  // Pin-Aenderung (s. setPinnedEntities unten). Die Sidebar
  // (wireWordExplorer) fuehrt ihre eigene, rein ID+Kategorie-basierte
  // Pin-Liste - setPinnedEntities() ist der Callback, der beide synchron
  // haelt.
  let pinnedEntities = [];
  // Referenz auf das von wireWordExplorer() zurueckgegebene Objekt (u. a.
  // clearPins()) - erst NACH dem Aufruf weiter unten gesetzt, aber schon
  // hier deklariert, damit performFullReset() (das VOR diesem Aufruf
  // definiert, aber immer erst per Klick SPAETER ausgefuehrt wird) darauf
  // zugreifen kann - exakt dasselbe Platzhalter-Prinzip wie bei
  // redrawArcsRef/updateActiveBars.
  let wordExplorerApi = null;
  // Platzhalter fuer die Hover-Simulation auf Kapitel-Balken (s.
  // Modulkommentar bei wireWordExplorer) - `bars`/`chapters` existieren
  // erst nach dem Balken-Rendering weiter unten, werden dort auf die
  // echte Implementierung umgebogen (exakt dasselbe Prinzip wie
  // redrawArcsRef/updateActiveBars).
  let simulateBarHoverRef = () => {};
  let clearSimulatedBarHoverRef = () => {};
  // Aktueller Darstellungs-Modus ("arc" = Boegen/Balken, Standard, oder
  // "grid" = Kapitel-Quadrate, s. vis-mode-picker/setVisMode unten).
  // createLayoutController fragt das ueber getVisMode ab, um zu wissen,
  // welcher der beiden Container (zoomViewport/gridViewport) beim
  // Zurueckkehren aus Kapitel-/Split-/Info-Ansicht wieder eingeblendet
  // werden soll.
  let visMode = "arc";
  // Platzhalter fuer setVisMode (s.u., existiert erst nach dem Balken-/
  // Grid-Rendering) - der Vis-Mode-Picker wird aber schon jetzt
  // verdrahtet (zusammen mit den anderen Picker-Setups), sein Klick-
  // Callback feuert erst spaeter.
  let setVisModeRef = () => {};
  // Platzhalter fuer das Grid-Layout-Neuberechnen (Sidebar-Toggle/Resize)
  // - existiert erst, nachdem die Quadrate gebaut sind (s.u.), wird aber
  // schon jetzt referenziert (gleiches Prinzip wie redrawArcsRef).
  let layoutChapterGridRef = () => {};
  // Wird von zoomController.onDragEnd auf true gesetzt und beim naechsten
  // Balken-/Bogen-Klick-Handler abgefragt+zurueckgesetzt - verhindert, dass
  // das Loslassen eines Pan-Drags faelschlich als Klick durchschlaegt und
  // ungewollt ein Kapitel/eine Split-View oeffnet.
  let justFinishedPanDrag = false;

  // ---- Teilbarer Zustand in der URL -----------------------------------
  // Der komplette Ansichtszustand (Darstellungsmodus, aktiver Sidebar-Tab,
  // angepinnte Entities, geoeffneter Vers bzw. Querverweis) wird ins
  // URL-FRAGMENT gespiegelt - also hinter das "#". Das ist der einzige
  // Teil der URL, den der Browser NIE an den Server schickt: es braucht
  // dadurch weder Backend noch Routing, die App bleibt eine statische
  // Datei.
  //
  // Zweck: eine gefundene Konstellation laesst sich verlinken, als
  // Lesezeichen ablegen und ueberlebt einen Reload. Ohne das muesste man
  // einem Gegenueber die Klickfolge beschreiben, statt ihm die Ansicht
  // selbst zu schicken.
  //
  // Bewusst `history.replaceState` statt `location.hash = ...`: Letzteres
  // erzeugt bei JEDEM Pin-Klick einen Eintrag in der Browser-Historie, der
  // Zurueck-Button waere nach kurzer Nutzung unbrauchbar.
  //
  // Entity-IDs werden unveraendert uebernommen (z. B.
  // "Jerusalem@Gen.14.18-Rev"). Das macht die URL lang, aber eindeutig -
  // blosse Klarnamen waeren mehrdeutig (es gibt mehrere Orte gleichen
  // Namens). Der lesbare Teil steht ja vorn.
  let isRestoringUrlState = false;

  /**
   * Markiert die passende Option im Darstellungs-Dropdown. Noetig, wenn
   * der Modus NICHT per Klick gesetzt wurde (Wiederherstellung aus der
   * URL) - sonst zeigte das Menue weiterhin "Bögen" als ausgewaehlt an,
   * obwohl die Karte sichtbar ist.
   */
  function syncVisModePicker(mode) {
    document.querySelectorAll(".vis-mode-option").forEach((opt) => {
      const isActive = opt.dataset.visMode === mode;
      opt.classList.toggle("is-active", isActive);
      opt.setAttribute("aria-selected", isActive ? "true" : "false");
    });
  }

  function writeUrlState() {
    // Waehrend des Wiederherstellens NICHT zurueckschreiben - sonst
    // ueberschreiben die Zwischenzustaende (erst 1 Pin, dann 2, ...) die
    // Quelle, aus der gerade gelesen wird.
    if (isRestoringUrlState || !wordExplorerApi) return;

    const parts = [];
    parts.push(`mode=${visMode}`);

    const explorerState = wordExplorerApi.getState();
    parts.push(`cat=${explorerState.category}`);
    if (explorerState.pins.length > 0) {
      const pins = explorerState.pins
        .map((p) => `${p.category}:${encodeURIComponent(p.id)}`)
        .join(",");
      parts.push(`pins=${pins}`);
    }

    if (activeReference) {
      const { source, target } = activeReference;
      parts.push(
        `ref=${encodeURIComponent(source.book)}.${source.chapter}.${
          source.verse
        }` +
          `-${encodeURIComponent(target.bookFull)}.${target.chapter}.${
            target.verse
          }`
      );
    } else if (activeChapterKey) {
      const [book, chapter] = activeChapterKey.split("|");
      parts.push(`ch=${encodeURIComponent(book)}.${chapter}`);
    }

    const fragment = `#${parts.join("&")}`;
    if (fragment !== window.location.hash) {
      history.replaceState(null, "", fragment);
    }
  }

  /** Zerlegt das URL-Fragment in ein einfaches Schluessel/Wert-Objekt. */
  function readUrlState() {
    const raw = window.location.hash.replace(/^#/, "");
    if (!raw) return null;
    const state = {};
    raw.split("&").forEach((pair) => {
      const idx = pair.indexOf("=");
      if (idx === -1) return;
      state[pair.slice(0, idx)] = pair.slice(idx + 1);
    });
    return Object.keys(state).length > 0 ? state : null;
  }

  /** "Buch.Kapitel.Vers" -> {book, chapter, verse}; Buchnamen koennen
   * Leerzeichen enthalten ("1 Samuel"), sind also URL-codiert. Von hinten
   * getrennt, weil nur die letzten beiden Teile Zahlen sind. */
  function parseVerseRef(text, withVerse) {
    const bits = text.split(".");
    if (bits.length < (withVerse ? 3 : 2)) return null;
    const verse = withVerse ? parseInt(bits.pop(), 10) : null;
    const chapter = parseInt(bits.pop(), 10);
    const book = decodeURIComponent(bits.join("."));
    if (!book || Number.isNaN(chapter) || (withVerse && Number.isNaN(verse)))
      return null;
    return { book, chapter, verse };
  }

  /**
   * Wendet einen aus der URL gelesenen Zustand an - EINMALIG am Ende von
   * init(). Reihenfolge ist wichtig: erst Darstellungsmodus und Pins
   * (Letztere bestimmen die Einfaerbung), dann die Textansicht.
   */
  async function applyUrlState() {
    const state = readUrlState();
    if (!state) return;

    isRestoringUrlState = true;
    try {
      if (state.mode && state.mode !== visMode) {
        setVisModeRef(state.mode);
      }

      const pins = state.pins
        ? state.pins
            .split(",")
            .map((entry) => {
              const idx = entry.indexOf(":");
              if (idx === -1) return null;
              return {
                category: entry.slice(0, idx),
                id: decodeURIComponent(entry.slice(idx + 1)),
              };
            })
            .filter(Boolean)
        : [];
      await wordExplorerApi.restoreState({ category: state.cat, pins });

      if (state.ref) {
        const [sourcePart, targetPart] = state.ref.split("-");
        const source = parseVerseRef(sourcePart, true);
        const target = parseVerseRef(targetPart, true);
        if (source && target) {
          const sourceChapter = verseIndex.getChapter(
            source.book,
            source.chapter
          );
          selectCrossReference(
            source,
            {
              bookFull: target.book,
              chapter: target.chapter,
              verse: target.verse,
            },
            sourceChapter
          );
        }
      } else if (state.ch) {
        const parsed = parseVerseRef(state.ch, false);
        const chapter =
          parsed && verseIndex.getChapter(parsed.book, parsed.chapter);
        if (chapter) openChapterView(chapter);
      }
    } catch (err) {
      // Eine kaputte/veraltete URL darf die App nie am Starten hindern -
      // im Zweifel startet sie schlicht im Normalzustand.
      console.warn(
        "URL-Zustand konnte nicht vollständig wiederhergestellt werden:",
        err
      );
    } finally {
      isRestoringUrlState = false;
      writeUrlState();
    }
  }
  // Referenz auf das von createGlobeView() zurueckgegebene Objekt (dritter
  // Modus "Karte", s. setVisMode) - erst gesetzt, sobald placeCoordinates
  // geladen UND die Orts-/Pin-Daten (fuer die Marker-Faerbung) verfuegbar
  // sind (s.u.), aber schon hier deklariert, da setVisMode() (das VOR
  // diesem Zeitpunkt bereits per Klick ausloesbar ist, s.
  // wireVisModePicker) sicher pruefen koennen muss, ob die Globe ueberhaupt
  // schon existiert (`if (globeViewRef) ...`) - exakt dasselbe
  // Platzhalter-Prinzip wie bei redrawArcsRef/updateActiveBars.
  let globeViewRef = null;
  // Onboarding im Info-Bereich - existiert erst nach dem Parsen der Bibel
  // (s.u.), wird aber schon vom Info-Button referenziert.
  let onboardingRef = null;

  function currentCanvasLayout() {
    return computeCurrentCanvasLayout(navbarEl, maxBarHeight, canvasFooterEl);
  }

  function currentArcHeight() {
    return currentCanvasLayout().arcHeight;
  }

  // Setzt --chrome-height, --bible-padding, die Canvas-Hoehe (inline,
  // IMMER - in jedem der drei Zustaende) und - sofern der Info-Bereich
  // nicht gerade manuell per Drag ueberschrieben wurde - dessen Hoehe.
  // Canvas-Hoehe und Info-Bereich-Hoehe werden UNABHAENGIG voneinander
  // berechnet (siehe arcs.js-Teil) und duerfen sich daher bewusst
  // ueberlappen, statt sich einen gemeinsamen Platz teilen zu muessen.
  function applyLayoutVars() {
    const { chromeHeight, panelHeight, canvasHeight, arcHeight } =
      currentCanvasLayout();

    document.documentElement.style.setProperty(
      "--chrome-height",
      `${chromeHeight}px`
    );
    document.documentElement.style.setProperty(
      "--bible-padding",
      `${arcHeight + ARC_PADDING_BUFFER}px`
    );

    visualizerCanvas.style.height = `${canvasHeight}px`;

    if (!userHasManuallyResizedLowerPane) {
      const lowerPaneHeight = computeLowerPaneHeight(panelHeight);
      document.documentElement.style.setProperty(
        "--lower-pane-height",
        `${lowerPaneHeight}px`
      );
    }

    return arcHeight;
  }

  /**
   * Layoutet die GERADE SICHTBARE Darstellung neu.
   *
   * Der Schutz am Anfang ist der eigentliche Punkt: waehrend der
   * Info-/Onboarding-Ansicht sind ALLE drei Visualisierungs-Container
   * [hidden] und melden 0x0. Lief in diesem Zustand ein
   * layoutChapterBars(), bekam #bible-container die Breite 0 - sichtbar
   * erst BEIM ZURUECKKEHREN aus dem Info-Bereich als zusammengestauchte
   * Visualisierung. Ausgeloest wurde das u. a. vom Fenster-Resize und vom
   * Sidebar-Toggle, die beide auch bei offenem Info-Bereich feuern.
   */
  function relayoutCurrentView() {
    if (!infoPanel.hidden) return;
    if (visMode === "arc") {
      layoutChapterBars(bibleContainer, zoomViewport, bars);
      zoomController.reclamp();
      redrawArcsRef();
    } else if (visMode === "grid") {
      layoutChapterGridRef();
    } else if (globeViewRef) {
      globeViewRef.resize();
    }
  }

  // Gesamt-Update-Funktion: wird beim Start, bei jedem Fenster-Resize UND
  // bei jedem Zustandswechsel (Idle/Kapitel/Split) aufgerufen.
  function updateLayoutForViewport() {
    applyLayoutVars();
    redrawArcsRef();
  }

  const layout = createLayoutController({
    visualizerCanvas,
    resetButton,
    panelDivider,
    lowerPane,
    contentArea,
    splitView,
    canvasFooterEl,
    zoomViewport,
    gridViewport,
    mapViewport,
    infoPanel,
    getVisMode: () => visMode,
    onLayoutChange: () => {
      applyLayoutVars();
      // Nicht nur die Boegen: beim Verlassen des Info-Bereichs war der
      // jeweilige Container die ganze Zeit versteckt und braucht ein
      // vollstaendiges Neu-Layout, s. relayoutCurrentView().
      relayoutCurrentView();
    },
  });

  visualizerCanvas.classList.add("is-idle");
  document.documentElement.dataset.visMode = visMode;
  panelDivider.hidden = true;
  applyLayoutVars();

  // Von Reset-Button UND Home-Button genutzt - "Home" soll laut Anfrage
  // explizit zur Standardvisualisierung zurueckfuehren, das ist exakt
  // dasselbe Verhalten wie das bestehende Kreuz oben rechts. Setzt jetzt
  // auch den Personen-Filter zurueck, damit "Home" wirklich zur
  // unveraenderten Ausgangsansicht fuehrt.
  /**
   * Verlaesst den Info-/Onboarding-Bereich und zeigt wieder die
   * Visualisierung - OHNE angepinnte Eintraege zu entfernen. Genutzt vom
   * "Zur Visualisierung"-Button am Ende des Onboardings und vom
   * Home-/Reset-Button, solange die Info-Ansicht offen ist.
   *
   * Grund fuer die Unterscheidung: die Sidebar ist auch waehrend des
   * Onboardings bedienbar. Wer dort beim Lesen etwas anpinnt, will es
   * anschliessend in der Visualisierung sehen - ein Reset an dieser Stelle
   * wuerde genau die Auswahl verwerfen, die man gerade treffen wollte.
   * Der volle Reset (performFullReset) bleibt fuer alle uebrigen
   * Situationen unveraendert.
   */
  function leaveInfoView() {
    layout.reset();
  }

  function performFullReset() {
    // Kommt der Klick aus der Info-Ansicht, ist er als "zurueck zur
    // Visualisierung" gemeint, nicht als "alles verwerfen".
    if (!infoPanel.hidden) {
      leaveInfoView();
      return;
    }
    userHasManuallyResizedLowerPane = false;
    activeReference = null;
    activeChapterKey = null;
    pinnedEntities = [];
    updateActiveBars();
    updatePersonHighlight();
    if (wordExplorerApi) wordExplorerApi.clearPins();
    zoomController.reset();
    layout.reset();
    writeUrlState();
  }

  resetButton.addEventListener("click", performFullReset);
  homeButton.addEventListener("click", performFullReset);
  infoButton.addEventListener("click", () => {
    layout.showInfo();
    // Erst NACH dem Einblenden layouten: vorher ist #info-panel [hidden]
    // und meldet 0x0, die Buehne bekaeme dann eine Hoehe von 0.
    requestAnimationFrame(() => {
      if (onboardingRef) onboardingRef.reset();
    });
  });

  wirePanelDivider({
    divider: panelDivider,
    panelEl: visualizerPanelEl,
    onDragStart: () => {
      userHasManuallyResizedLowerPane = true;
      // Die Transform-Formel des Titels (.canvas-footer.is-open) haengt
      // direkt von --lower-pane-height ab, das sich waehrend des Drags
      // laufend aendert. Mit aktiver Transition wuerde der Titel dem
      // Trenner dadurch spuerbar hinterherhinken (getestet: ca. 70px
      // Versatz) statt ihm 1:1 zu folgen - deshalb die Transition fuer die
      // Dauer des Drags komplett abschalten (s. .canvas-footer.is-dragging
      // in style.css). Trenner und Info-Bereich selbst brauchen dieses
      // Abschalten nicht: ihre eigenen offenen/geschlossenen Transform-
      // Formeln sind Konstanten (translateY(50%) bzw. translateY(0)), die
      // --lower-pane-height gar nicht referenzieren - nur ihre
      // UNTRANSITIONIERTEN bottom/height-Werte tun das.
      canvasFooterEl.classList.add("is-dragging");
    },
    onDragEnd: () => {
      canvasFooterEl.classList.remove("is-dragging");
    },
    onResize: () => redrawArcsRef(),
  });

  // redrawArcsRef() als onZoomChange-Callback: sobald sich Skalierung
  // oder Verschiebung der Visualisierung aendert, muessen die Boegen neu
  // gezeichnet werden, damit sie den (schon transformierten) Balken
  // folgen - s. Modul-Kommentar bei createZoomController.
  const zoomController = createZoomController({
    viewportEl: zoomViewport,
    contentEl: bibleContainer,
    onZoomChange: () => redrawArcsRef(),
    onDragEnd: () => {
      justFinishedPanDrag = true;
    },
  });

  // Als Callback eine kleine Wrapper-Funktion statt redrawArcsRef direkt
  // reinreichen: wireStaticControls() haengt seinen Listener zwar schon
  // JETZT ein, der Callback wird aber erst SPAETER (beim tatsaechlichen
  // Sidebar-Toggle) aufgerufen - bis dahin wurde redrawArcsRef laengst von
  // seinem Platzhalter auf die echte Funktion umgebogen (s.u.). Ein Aufruf
  // VOR diesem Umbiegen waere ohnehin ein harmloses No-op.
  wireStaticControls({
    onSidebarToggle: () => {
      relayoutCurrentView();
      // Das Onboarding zusaetzlich EXPLIZIT neu layouten. Der
      // ResizeObserver deckt das zwar prinzipiell ab, feuert bei einer
      // laufenden width-Transition aber mit Zwischenwerten; dieser Aufruf
      // kommt garantiert NACH dem Ende der Transition (transitionend, s.
      // wireStaticControls) und setzt damit den endgueltigen Zustand.
      if (onboardingRef && !infoPanel.hidden) onboardingRef.layout();
    },
  });

  // Gleiches Wrapper-Prinzip fuer den Theme-Toggle: beim Umschalten sollen
  // sich die Boegen neu zeichnen, damit Verlauf und aktive Bogenfarbe zum
  // neuen Theme passen (s. Kommentar in wireThemeToggle). Ebenso die
  // Personen-Balkenfarben: updatePersonHighlight() setzt --person-bg per
  // JS aus den (jetzt neuen) --person-color-*-CSS-Variablen - ohne diesen
  // erneuten Aufruf wuerde ein angepinnter Balken beim Theme-Wechsel in
  // der alten Farbe stehen bleiben, bis er naechstens neu ausgewertet wird.
  wireThemeToggle({
    onThemeChange: () => {
      redrawArcsRef();
      updatePersonHighlight();
      if (globeViewRef) globeViewRef.refreshTheme();
    },
  });

  // Und fuer den Bogen-Paletten-Dropdown: derselbe Grund, andere Ursache
  // (neue Palette statt neues Theme).
  wireArcPalettePicker({ onPaletteChange: () => redrawArcsRef() });

  // Boegen-/Grid-Umschalter: blendet die passenden Container ein/aus (s.
  // setVisMode weiter unten, referenziert wieder ueber das etablierte
  // Platzhalter-Prinzip - setVisMode existiert erst nach dem
  // Balken-/Grid-Rendering, wird aber erst durch einen spaeteren Klick
  // aufgerufen).
  wireVisModePicker({ onModeChange: (mode) => setVisModeRef(mode) });
  // Startmodus ist "arc" (s. visMode) - der Bogenfarben-Schalter ist damit
  // von Anfang an sichtbar; setVisMode() haelt das danach aktuell.
  arcPaletteControlEl.hidden = false;

  // Parallel zur Bibel-XML angestossen (nicht danach), damit die
  // Netzwerk-Anfragen gleichzeitig laufen statt sich zu verzoegern.
  //
  // BEWUSST NICHT DABEI: wordReferenceIndex.json. Die Datei ist mit ~27 MB
  // mit Abstand die groesste des Projekts (mehr als alle uebrigen Daten
  // inkl. der Bibel-XML zusammen) und wird nur gebraucht, wenn der Nutzer
  // den "Wörter"-Tab ueberhaupt oeffnet. Sie wird deshalb erst bei dessen
  // erstem Oeffnen nachgeladen (s. loadCategoryData weiter unten) -
  // dasselbe Lazy-Prinzip wie bei der Karte.
  // loadEntityIndex() ist kategorie-agnostisch (s. wordExplorer.js-Teil) -
  // dieselbe Funktion laedt Personen-, Orts-, Zeit- UND Wort-Datei.
  const personsIndexPromise = loadEntityIndex(
    "personReferenceIndex.json",
    "persons",
    "versesByPerson"
  );
  const placesIndexPromise = loadEntityIndex(
    "placeReferenceIndex.json",
    "places",
    "versesByPlace"
  );
  const timesIndexPromise = loadEntityIndex(
    "timeReferenceIndex.json",
    "times",
    "versesByTime"
  );
  // Koordinaten fuer die "Karte"-Ansicht (dritter Modus, s. setVisMode) -
  // NICHT ueber loadEntityIndex() (das erwartet eine {meta, <metaKey>,
  // <versesKey>}-Struktur mit displayName/count pro Entity, s. dort) -
  // placeCoordinates.json ist bewusst simpler: nur {meta, coordinates:
  // {placeId: {lat, lon, precision}}}, s. build_place_coords.py.
  const placeCoordinatesPromise = fetch("placeCoordinates.json").then((r) =>
    r.json()
  );
  // Orts-zu-Orts-Querverweis-Netz fuer die Karte (s. build_place_arcs.py):
  // 594 EINDEUTIGE Ortspaare, abgeleitet aus den 656 Vers-Paaren, bei denen
  // sowohl Quell- als auch Zielvers eines Fussnoten-Querverweises einen
  // geokodierten Ort nennt. Bewusst vorab offline aufgebaut statt hier zur
  // Laufzeit aus crossRefs+versesByPlace berechnet: die Berechnung ist ein
  // kartesisches Produkt ueber zehntausende Querverweise und waere beim
  // Seitenaufbau unnoetige Arbeit fuer ein Ergebnis, das sich nie aendert.
  const placeArcsPromise = fetch("placeArcs.json").then((r) => r.json());

  const xmlText = await fetch(BIBLE_XML_PATH).then((r) => r.text());
  const { chapters, crossRefs } = parseBible(xmlText);

  const verseIndex = buildVerseIndex(chapters);

  const { unresolvedShorts } = resolveCrossRefTargets(
    crossRefs,
    verseIndex.knownBookNames
  );
  if (unresolvedShorts.size > 0) {
    console.warn(
      "Folgende Buchkuerzel aus Querverweisen konnten nicht zugeordnet werden:",
      Array.from(unresolvedShorts).join(", ")
    );
  }

  // Einmalig gebaute Nachschlage-Map verseKey -> Crossref-Ziele (NACH der
  // obigen Buchnamen-Aufloesung, damit target.bookFull final korrekt ist).
  // Der Word-Explorer braucht das, um pro Vers einer Entity (Person, Ort,
  // Zeitausdruck ODER Wort) zu wissen, ob dieser Vers selbst eine
  // Fussnoten-Querverweis-QUELLE ist (dann Anzeige als Crossref-Zeile mit
  // Pfeil statt als einfache Vers-Zeile, s. getEntityEntryRows) - ohne
  // diese Map muesste sonst bei JEDER angepinnten/gehoverten Entity das
  // komplette crossRefs-Array durchsucht werden.
  const crossRefSourceMap = new Map();
  crossRefs.forEach((ref) => {
    const key = makeVerseKey(
      ref.source.book,
      ref.source.chapter,
      ref.source.verse
    );
    crossRefSourceMap.set(key, ref.targets);
  });

  // Sidebar-Explorer: einmalig aufbauen, sobald ALLE Datenquellen
  // vorliegen - dieselbe "einmal beim Laden, nicht bei jeder Interaktion"-
  // Logik wie beim Bogen-Aufbau weiter unten. `raw.versesByPerson`/
  // `raw.versesByPlace`/`raw.versesByTime`/`raw.versesByWord` werden
  // sowohl fuer den Vers-/Crossref-Dropdown in der Sidebar (ueber
  // getVersesForEntity durchgereicht) als auch fuer das Balken-/Bogen-
  // Highlighting hier in main.js gebraucht (setPinnedEntities()).
  /**
   * Ersetzt den englischen Anzeigenamen durch die deutsche Form, sofern
   * eine bekannt ist (s. GERMAN_PERSON_DISPLAY_NAMES /
   * GERMAN_PLACE_DISPLAY_NAMES). Betrifft AUSSCHLIESSLICH die Anzeige:
   * `entry.id` und die Rohdaten bleiben unangetastet, damit
   * Entity-IDs, URL-Zustand und das Alias-Nachschlagen fuer die
   * Namens-Pillen (die ueber den ENGLISCHEN Namen gehen, s.
   * getEntityHighlightNames) weiter funktionieren.
   *
   * `searchName` haelt beide Schreibweisen zusammen, damit die Suche in
   * der Sidebar auf Deutsch UND Englisch trifft - sonst waeren Eintraege
   * nach dem Umbenennen unter ihrem gewohnten englischen Namen ploetzlich
   * nicht mehr auffindbar.
   */
  function applyGermanDisplayNames(entries, displayNameTable) {
    return entries.map((entry) => {
      const german = displayNameTable[entry.name];
      if (!german) {
        // Kein deutscher Name bekannt: wenigstens die Unterstriche
        // aufloesen, die aus den STEPBible-Kennungen stammen und kein
        // Bestandteil des Namens sind ("Kiriath_Jearim" -> "Kiriath
        // Jearim"). Gesucht werden kann weiterhin nach beidem.
        const cleaned = entry.name.replace(/_/g, " ");
        return {
          ...entry,
          name: cleaned,
          searchName: `${cleaned} ${entry.name}`.toLowerCase(),
        };
      }
      return {
        ...entry,
        name: german,
        englishName: entry.name,
        searchName: `${german} ${entry.name}`.toLowerCase(),
      };
    });
  }

  const { entries: personsIndex, raw: personsRaw } = await personsIndexPromise;
  const { entries: placesIndex, raw: placesRaw } = await placesIndexPromise;
  const { entries: timesIndex, raw: timesRaw } = await timesIndexPromise;
  const placeCoordinatesData = await placeCoordinatesPromise;
  const placeArcsData = await placeArcsPromise;

  // ---- Wortschatz: zweistufig geladen (s. build_word_shards.py) -------
  // `wordsMeta` kommt aus wordIndex.json (1,7 MB, nur Lemma/Wortart/
  // Haeufigkeit) und reicht fuer die komplette Sidebar-Liste.
  // Die Detaildaten (Verse + surfaceForms) liegen in 64 Schnipseln und
  // werden erst geladen, wenn ein Wort tatsaechlich angepinnt/aufgeklappt
  // wird - also fuer hoechstens eine Handvoll der ~26.000 Eintraege.
  let wordsMeta = null;
  const wordDetails = new Map(); // id -> {surfaceForms, verses}
  const loadedWordShards = new Map(); // shardId -> Promise

  const WORD_SHARD_COUNT = 64;

  /** MUSS identisch zu shard_for() in build_word_shards.py sein. */
  function wordShardFor(wordId) {
    let total = 0;
    for (let i = 0; i < wordId.length; i++) {
      total = (total + wordId.charCodeAt(i)) % WORD_SHARD_COUNT;
    }
    return total;
  }

  /**
   * Laedt den Schnipsel, der `wordId` enthaelt - einmalig pro Schnipsel.
   * Das Promise wird gecacht, damit gleichzeitige Anfragen auf denselben
   * Schnipsel (z. B. schnelles Anpinnen mehrerer Woerter) nur EINEN
   * Request ausloesen.
   */
  function ensureWordShard(wordId) {
    const shardId = wordShardFor(wordId);
    let promise = loadedWordShards.get(shardId);
    if (!promise) {
      promise = fetch(`wordVerses/${shardId}.json`)
        .then((r) => r.json())
        .then((entries) => {
          Object.entries(entries).forEach(([id, detail]) => {
            wordDetails.set(id, detail);
          });
        });
      loadedWordShards.set(shardId, promise);
    }
    return promise;
  }

  /**
   * Von der Sidebar aufgerufen, BEVOR eine Entity angepinnt oder
   * aufgeklappt wird (s. ensureEntityData in wireWordExplorer). Nur
   * Woerter brauchen hier ueberhaupt etwas - bei allen anderen Kategorien
   * liegen die Verse schon seit dem Start vollstaendig vor.
   */
  function ensureEntityData(category, id) {
    if (category !== "words") return;
    if (wordDetails.has(id)) return;
    return ensureWordShard(id);
  }

  // Einzige Stelle, an der zwischen den Kategorien unterschieden wird
  // (s. Modulkommentar bei wireWordExplorer) - liefert fuer eine
  // {category, id}-Kombination die passende Rohdaten-Vers-Liste bzw. die
  // Metadaten (displayName).
  function getVersesForEntity(category, id) {
    if (category === "persons") return personsRaw.versesByPerson[id];
    if (category === "places") return placesRaw.versesByPlace[id];
    if (category === "times") return timesRaw.versesByTime[id];
    if (category === "words") {
      const detail = wordDetails.get(id);
      return detail ? detail.verses : undefined;
    }
    return undefined;
  }

  function getEntityMeta(category, id) {
    if (category === "persons") return personsRaw.persons[id];
    if (category === "places") return placesRaw.places[id];
    if (category === "times") return timesRaw.times[id];
    if (category === "words") {
      const meta = wordsMeta ? wordsMeta[id] : undefined;
      if (!meta) return undefined;
      // Listendaten und (erst spaeter geladene) Detaildaten
      // zusammenfuehren - getEntityHighlightNames erwartet surfaceForms
      // direkt auf dem Meta-Objekt.
      const detail = wordDetails.get(id);
      return detail ? { ...meta, surfaceForms: detail.surfaceForms } : meta;
    }
    return undefined;
  }

  function getEntityAliasTable(category) {
    if (category === "persons") return GERMAN_PERSON_NAME_ALIASES;
    if (category === "places") return GERMAN_PLACE_NAME_ALIASES;
    return {};
  }

  /**
   * Liefert ALLE Textformen, nach denen im Kapiteltext fuer die Namens-
   * Pille gesucht werden soll (s. highlightPersonName) - je Kategorie
   * unterschiedlich hergeleitet:
   * - Personen/Orte: displayName (Englisch) + bekannte deutsche Alias-
   *   Formen aus einer FESTEN, von HAND kuratierten Tabelle (s.
   *   GERMAN_PERSON_NAME_ALIASES/GERMAN_PLACE_NAME_ALIASES) - noetig, weil
   *   die STEPBible-Quelle nur den englischen Namen liefert.
   * - Zeitausdruecke UND Woerter: `surfaceForms` aus timeReferenceIndex.json
   *   bzw. wordReferenceIndex.json - die TATSAECHLICH im deutschen
   *   Zuercher-Text vorkommenden Schreibweisen/Flexionsformen (z. B.
   *   "vierzig Tage" UND "40 Tage" fuer dieselbe Zeit-Entity, oder
   *   "ging"/"geht"/"gegangen" fuer das Wort-Lemma "gehen") - waehrend
   *   build_time_index.py bzw. build_word_index.py laeuft bereits pro Vers
   *   mitgeschrieben (s. dort). Hier ist KEINE Uebersetzung noetig (der
   *   Text ist ja schon Deutsch), nur die Ruecksicht auf unterschiedliche
   *   Schreib-/Flexionsformen. Bei den 5 hand-kuratierten prophetischen
   *   Zeit-Entities (s. build_time_index.py) ist surfaceForms bewusst leer
   *   (die tatsaechliche Formulierung variiert zu stark) - dort gibt es
   *   KEINE Pille, der Rest der Navigation funktioniert aber unveraendert.
   */
  function getEntityHighlightNames(category, id, displayName) {
    if (category === "times" || category === "words") {
      const meta = getEntityMeta(category, id);
      const forms = meta && meta.surfaceForms;
      return forms && forms.length > 0 ? forms : [];
    }
    const aliasTable = getEntityAliasTable(category);
    return [displayName, ...(aliasTable[displayName] || [])];
  }

  /**
   * Zentrale Funktion fuer "genau DIESE Entities sind jetzt angepinnt" -
   * wird von der Sidebar (wireWordExplorer) bei JEDER Pin-Aenderung mit
   * der KOMPLETTEN, aktuellen {id, category}-Liste aufgerufen (Reihenfolge
   * = Farb-Slot-Reihenfolge). Baut pro Entity die beiden Nachschlage-
   * Mengen aus der jeweils passenden Rohdatenquelle (Kapitel- bzw. Vers-
   * Schluessel im selben makeChapterKey/makeVerseKey-Format wie der Rest
   * der App, s. PROJEKTSTAND.md) und aktualisiert Balken sowie Boegen. Ein
   * aktiver Kapitel-/Querverweis-Zustand (activeChapterKey/activeReference)
   * wird dabei bewusst NICHT zurueckgesetzt: die Faerbung ist eine
   * zusaetzliche, rein visuelle Ebene und schliesst eine gleichzeitig
   * offene Kapitel-/Split-Ansicht nicht aus.
   */
  /**
   * Baut die GERADE OFFENE Textansicht mit den aktuellen Pins neu auf.
   *
   * Ohne das blieben Balken/Boegen/Karte und der Text auseinander: eine
   * Pin-Aenderung faerbte zwar sofort die Visualisierung um, die
   * Namens-Pillen im bereits gerenderten Kapitel- bzw. Querverweis-Text
   * blieben aber auf dem Stand von vorhin stehen - man musste erst
   * weiternavigieren, damit sie nachzogen.
   *
   * Die Scrollposition wird vorher gesichert und danach wieder gesetzt:
   * renderChapterText()/showSplitView() ersetzen den kompletten Inhalt,
   * wodurch der Browser sonst an den Anfang zurueckspringt - mitten im
   * Lesen ein aergerlicher Sprung.
   */
  function refreshOpenTextView() {
    if (lowerPane.hidden) return;

    if (activeReference) {
      const leftScroll = splitLeft.scrollTop;
      const rightScroll = splitRight.scrollTop;
      showSplitView(
        splitLeft,
        splitRight,
        verseIndex,
        activeReference.source,
        activeReference.target,
        buildEntityNameHighlightInfo
      );
      requestAnimationFrame(() => {
        splitLeft.scrollTop = leftScroll;
        splitRight.scrollTop = rightScroll;
      });
      return;
    }

    if (!activeChapterKey) return;
    const [book, chapterNumber] = activeChapterKey.split("|");
    const chapter = verseIndex.getChapter(book, parseInt(chapterNumber, 10));
    if (!chapter) return;
    const scroll = contentArea.scrollTop;
    renderChapterText(
      output,
      chapter,
      activeFocusVerse,
      buildEntityNameHighlightInfo(chapter)
    );
    requestAnimationFrame(() => {
      contentArea.scrollTop = scroll;
    });
  }

  function setPinnedEntities(pinnedRefs) {
    pinnedEntities = pinnedRefs.map(({ id, category }) => {
      const verses = getVersesForEntity(category, id) || [];
      const meta = getEntityMeta(category, id);
      return {
        id,
        category,
        displayName: meta ? meta.displayName : id,
        verseKeySet: new Set(
          verses.map((v) => makeVerseKey(v.book, v.chapter, v.verse))
        ),
        chapterKeySet: new Set(
          verses.map((v) => makeChapterKey(v.book, v.chapter))
        ),
      };
    });
    updatePersonHighlight();
    refreshOpenTextView();
    // Pins sind Teil des teilbaren Zustands (s. writeUrlState). Dieser
    // Aufruf fehlte: Pin-Aenderungen landeten dadurch nur dann in der URL,
    // wenn zufaellig ein ANDERES Ereignis (Tab-/Modus-Wechsel, Kapitel
    // oeffnen) danach ohnehin geschrieben hat.
    writeUrlState();
  }

  // Die Wort-Kategorie startet LEER und wird beim ersten Oeffnen ihres
  // Tabs befuellt (s. loadCategoryData). Das Objekt wird bewusst als
  // Variable gehalten und spaeter MUTIERT, statt wireWordExplorer neu
  // aufzurufen: der Explorer haelt eine Referenz darauf und sieht die
  // nachgeladenen Daten dadurch automatisch beim naechsten render().
  const categories = {
    persons: applyGermanDisplayNames(personsIndex, GERMAN_PERSON_DISPLAY_NAMES),
    places: applyGermanDisplayNames(placesIndex, GERMAN_PLACE_DISPLAY_NAMES),
    times: timesIndex,
    words: [],
  };

  /**
   * Laedt die Daten einer Kategorie nach, sobald ihr Tab zum ersten Mal
   * geoeffnet wird - aktuell nur fuer "words" relevant (~27 MB, s.
   * Kommentar beim Start-Fetch). Personen/Orte/Zeiten sind beim Start
   * ohnehin schon da, deren Aufruf ist ein No-op.
   *
   * Geladen wird hier NUR die schlanke Liste (wordIndex.json, 1,7 MB).
   * Die Verse/surfaceForms der einzelnen Woerter kommen erst beim
   * Anpinnen/Aufklappen dazu (s. ensureEntityData/ensureWordShard) -
   * gebraucht werden sie ja nur fuer hoechstens vier Eintraege
   * gleichzeitig, nicht fuer alle ~26.000.
   */
  async function loadCategoryData(category) {
    if (category !== "words" || categories.words.length > 0) return;
    // Bewusst NICHT loadEntityIndex(): das erwartet eine Datei MIT
    // Vers-Zuordnung. wordIndex.json enthaelt nur die Listendaten - die
    // Verse kommen spaeter schnipselweise (s. ensureWordShard).
    const data = await fetch("wordIndex.json").then((r) => r.json());
    wordsMeta = data.words;
    categories.words = Object.entries(wordsMeta)
      .map(([id, meta]) => ({
        id,
        name: meta.displayName,
        count: meta.count,
        pos: meta.pos,
      }))
      .sort((a, b) => b.count - a.count);
    console.log(`Wortliste nachgeladen: ${categories.words.length} Einträge.`);
  }

  wordExplorerApi = wireWordExplorer({
    categories,
    loadCategoryData,
    ensureEntityData,
    onCategoryChange: () => writeUrlState(),
    getVersesForEntity,
    crossRefSourceMap,
    onPinsChange: setPinnedEntities,
    onVerseSelect: (book, chapterNumber, verseNumber) => {
      const chapter = verseIndex.getChapter(book, chapterNumber);
      if (!chapter) return;
      openChapterView(chapter, verseNumber);
    },
    onCrossRefSelect: (source, target) => {
      const sourceChapter = verseIndex.getChapter(source.book, source.chapter);
      selectCrossReference(source, target, sourceChapter);
    },
    // Hover-Simulation (s. Anfrage "Hover ... imitieren"): Vers-Zeilen
    // imitieren den Hover auf dem zugehoerigen Kapitel-Balken, Crossref-
    // Zeilen den Hover auf dem zugehoerigen Bogen. `arcOverlay` wird erst
    // WEITER UNTEN erzeugt, aber diese Callbacks werden erst durch
    // spaetere Maus-Hover-Ereignisse aufgerufen (nie synchron waehrend
    // des Setups hier) - zu dem Zeitpunkt ist arcOverlay laengst
    // zugewiesen, der Zugriff hier ist deshalb unproblematisch (gaengiges
    // Closure-Muster, keine TDZ-Verletzung trotz "spaeterer" Deklaration
    // im Quelltext).
    onVerseHover: (book, chapterNumber) =>
      simulateBarHoverRef(book, chapterNumber),
    onVerseHoverEnd: (book, chapterNumber) =>
      clearSimulatedBarHoverRef(book, chapterNumber),
    onCrossRefHover: (source, target) =>
      arcOverlay.simulateHover({ source, target }),
    onCrossRefHoverEnd: () => arcOverlay.clearSimulatedHover(),
  });

  maxBarHeight = Math.max(...chapters.map((c) => c.verseCount));

  const bars = renderChapterBars(bibleContainer, zoomViewport, chapters);

  // Grid-Ansicht: parallel zu den Balken erzeugt (gleiche chapters[i]-
  // Indizierung wie bars), aber unabhaengig positioniert/skaliert -
  // s. Modulkommentar bei renderChapterGrid/layoutChapterGrid. Bewusst
  // KEIN initialer layoutChapterGridRef()-Aufruf hier: #grid-viewport ist
  // zu diesem Zeitpunkt noch [hidden] (Start-Modus ist immer "arc", s.
  // visMode), eine Layout-Berechnung wuerde also mit einem 0x0-Container
  // rechnen. setVisMode() fuehrt beim ERSTEN tatsaechlichen Wechsel in die
  // Grid-Ansicht ohnehin eine vollstaendige, dann gueltige Neuberechnung
  // durch (s. dort) - ein Aufruf hier waere nur verschwendete (und
  // potenziell irrefuehrende) Arbeit.
  const squares = renderChapterGrid(chapterGridEl, chapters);
  layoutChapterGridRef = () =>
    layoutChapterGrid(chapterGridEl, gridViewport, chapters.length);

  // Nachschlage-Map Kapitel-Schluessel -> Balken- bzw. Quadrat-Element,
  // EINMALIG gebaut (nicht pro Hover) - Basis fuer die Hover-Simulation
  // aus dem Personen-Dropdown (s. simulateBarHoverRef/
  // clearSimulatedBarHoverRef unten). Beide Maps, nicht nur eine: die
  // Simulation soll unabhaengig vom aktuellen Darstellungs-Modus
  // funktionieren (nur das jeweils SICHTBARE Element zeigt optisch etwas,
  // das andere wird trotzdem mit aktualisiert, damit es beim naechsten
  // Moduswechsel sofort korrekt aussieht).
  const barByChapterKey = new Map();
  const squareByChapterKey = new Map();
  bars.forEach((bar, i) => {
    barByChapterKey.set(
      makeChapterKey(chapters[i].bookName, chapters[i].chapterNumber),
      bar
    );
  });
  squares.forEach((square, i) => {
    squareByChapterKey.set(
      makeChapterKey(chapters[i].bookName, chapters[i].chapterNumber),
      square
    );
  });

  // Imitiert exakt denselben visuellen Effekt wie der echte mouseenter-
  // Handler weiter unten (bar.style.background/-transform) - bewusst OHNE
  // Tooltip: der haette hier keine sinnvolle Bildschirmposition (kein
  // echter Mauszeiger ueber dem Balken). bar.style.background wird (statt
  // z. B. einer CSS-Klasse) direkt gesetzt, weil das exakt dieselbe
  // Eigenschaft ist, die auch die Personen-Faerbung (--person-bg) beim
  // Verlassen des Hovers unangetastet laesst, s. Kommentar bei
  // .chapter-bar.is-person-active in style.css.
  simulateBarHoverRef = function (book, chapterNumber) {
    const bar = barByChapterKey.get(makeChapterKey(book, chapterNumber));
    const square = squareByChapterKey.get(makeChapterKey(book, chapterNumber));
    if (bar) {
      bar.style.background = "red";
      bar.style.transform = "scaleX(1.5)";
    }
    if (square) square.style.background = "red";
  };
  clearSimulatedBarHoverRef = function (book, chapterNumber) {
    const bar = barByChapterKey.get(makeChapterKey(book, chapterNumber));
    const square = squareByChapterKey.get(makeChapterKey(book, chapterNumber));
    if (bar) {
      bar.style.background = "";
      bar.style.transform = "scaleX(1)";
    }
    if (square) square.style.background = "";
  };

  // Markiert die Balken, deren Kapitel gerade "aktiv" ist, dauerhaft rot
  // (per CSS-Klasse, s. .chapter-bar.is-active in style.css) - genau wie
  // bei Boegen/Chips bleibt das bis zum Reset bestehen. "Aktiv" heisst:
  // entweder direkt als Kapiteltext angewaehlt (activeChapterKey) ODER
  // Quelle/Ziel des gerade aktiven Querverweises (activeReference). Beide
  // Zustaende schliessen sich gegenseitig aus (jeder Klick setzt den
  // jeweils anderen auf null) - trotzdem wird hier bewusst mit "oder"
  // geprueft, nicht mit einer Fallunterscheidung, das ist robuster.
  updateActiveBars = function () {
    chapters.forEach((chapter, i) => {
      const key = makeChapterKey(chapter.bookName, chapter.chapterNumber);
      const isActive =
        key === activeChapterKey ||
        (activeReference !== null &&
          ((chapter.bookName === activeReference.source.book &&
            chapter.chapterNumber === activeReference.source.chapter) ||
            (chapter.bookName === activeReference.target.bookFull &&
              chapter.chapterNumber === activeReference.target.chapter)));
      applyChapterActiveClass(bars[i], isActive);
      applyChapterActiveClass(squares[i], isActive);
    });
  };

  // Faerbung auf Balken/Quadraten: getrennt von updateActiveBars, da
  // beide Zustaende (Kapitel-/Referenz-Auswahl vs. Entity-Pins)
  // gleichzeitig aktiv sein koennen (s. Kommentar bei setPinnedEntities()).
  // Ohne angepinnte Entities (pinnedEntities.length===0) werden beide
  // Klassen wieder entfernt - das ist der Ausgangszustand. Bei genau
  // EINEM treffenden Eintrag wird dessen Slot-Farbe gesetzt, bei MEHREREN
  // gleichzeitig treffenden (Ueberlappung - Personen, Orte, Zeiten UND
  // Woerter beliebig gemischt moeglich, s. Anfrage) die per
  // multiplyBlendColors() gemischte Farbe. Die Farbe wird bewusst ueber
  // die CSS-Variable --person-bg gesetzt, NICHT direkt als `background` -
  // s. ausfuehrliche Begruendung im style.css-Kommentar bei
  // .chapter-bar.is-person-active (kurz: die bestehenden Hover-Handler
  // manipulieren `background` direkt und wuerden eine dort gesetzte Farbe
  // beim Verlassen des Hovers versehentlich wieder loeschen).
  // refreshArcStyleRef() am Ende sorgt dafuer, dass auch die Boegen
  // synchron nachziehen - ganz bewusst NICHT redrawArcsRef() (das wuerde
  // zusaetzlich unnoetig die Bogen-POSITIONEN neu berechnen, obwohl sich
  // am Zoom/Pan nichts geaendert hat). Genau diese Trennung behebt die
  // Performance-Traegheit bei Pin-Klicks, s. Modulkommentar bei
  // createArcOverlay.
  updatePersonHighlight = function () {
    chapters.forEach((chapter, i) => {
      if (pinnedEntities.length === 0) {
        clearChapterPersonState(bars[i]);
        clearChapterPersonState(squares[i]);
        return;
      }
      const key = makeChapterKey(chapter.bookName, chapter.chapterNumber);
      const matchingColorIndexes = [];
      pinnedEntities.forEach((p, idx) => {
        if (p.chapterKeySet.has(key)) matchingColorIndexes.push(idx);
      });
      applyChapterPersonState(bars[i], matchingColorIndexes);
      applyChapterPersonState(squares[i], matchingColorIndexes);
    });
    refreshArcStyleRef();
    if (globeViewRef) globeViewRef.refreshColors();
  };

  /**
   * Wechselt zwischen "arc" (Balken + Boegen, Standard), "grid" (Kapitel-
   * Quadrate) und "map" (3D-Globe mit Orts-Markern) - s. vis-mode-picker.
   * Blendet den jeweils unpassenden Container aus/ein, das Bogen-SVG (das
   * als eigenstaendiges Overlay separat von .zoom-viewport existiert, s.
   * createArcOverlay) sowie den Bogen-Paletten-Picker (nur in der
   * Boegen-Ansicht sinnvoll, weder Grid noch Karte haben Boegen).
   *
   * Layoutet die NEU sichtbare Darstellung IMMER vollstaendig neu (Balken+
   * Zoom-Reclamp+Boegen bzw. Grid bzw. Globe-Resize), unabhaengig davon,
   * ob "eigentlich" schon eine gueltige Geometrie vorlaege - genau das
   * behebt den gemeldeten Bug ("Switch zurueck zu Arc funktioniert nicht
   * immer einwandfrei"): waehrend eine Ansicht unsichtbar war, koennen
   * Resize-Handler/Kapitel-Oeffnen-Aufrufe (die redrawArcsRef()
   * inzwischen als no-op behandeln, s. dort) veraltete oder gar keine
   * gueltige Geometrie hinterlassen haben - dieser Aufruf stellt beim
   * tatsaechlichen Zurueckwechseln zuverlaessig den korrekten Zustand her,
   * statt auf den naechsten "richtigen" Ausloeser zu warten. Bei der Globe
   * ist das sogar noch wichtiger als bei Grid: `globeView.setActive()`
   * startet/stoppt zusaetzlich den kontinuierlichen WebGL-Render-Loop -
   * ohne diesen Aufruf wuerde entweder unnoetig im Hintergrund weiter-
   * gerendert (Grid/Boegen aktiv) oder die Globe bliebe beim naechsten
   * Wechsel dorthin eingefroren (kein Loop gestartet).
   *
   * Ruehrt bewusst NICHT an, ob gerade eine Kapitel-/Split-/Info-Ansicht
   * offen ist (infoPanel.hidden wird nur GELESEN, nie gesetzt) - ist die
   * Info-Ansicht aktiv, sollen ohnehin ALLE DREI Visualisierungs-Container
   * verborgen bleiben (das managt bereits showInfo() in
   * createLayoutController); ein Moduswechsel waehrenddessen wird beim
   * naechsten Verlassen der Info-Ansicht automatisch korrekt aufgeloest,
   * weil showVisualization() dort ueber getVisMode() denselben `visMode`
   * abfragt.
   */
  function setVisMode(mode) {
    visMode = mode;
    // Aktuellen Modus am <html>-Element spiegeln, damit CSS darauf
    // reagieren kann (s. .canvas-footer::before in style.css: der
    // Ausblend-Verlauf ueber der Fusszeile ist nur fuer die Balken
    // gedacht und blasste im Grid die unterste Quadratreihe aus).
    document.documentElement.dataset.visMode = mode;
    const isGrid = mode === "grid";
    const isMap = mode === "map";

    // Bogenfarben nur in der Arc-Ansicht anbieten - Grid und Karte haben
    // keine Boegen, der Schalter waere dort wirkungslos.
    arcPaletteControlEl.hidden = mode !== "arc";
    syncVisModePicker(mode);
    arcOverlay.setHidden(mode !== "arc");

    if (infoPanel.hidden) {
      zoomViewport.hidden = mode !== "arc";
      gridViewport.hidden = !isGrid;
      mapViewport.hidden = !isMap;
    }

    if (globeViewRef) globeViewRef.setActive(isMap && infoPanel.hidden);

    if (isGrid) {
      layoutChapterGridRef();
    } else if (isMap) {
      if (globeViewRef) globeViewRef.resize();
    } else {
      layoutChapterBars(bibleContainer, zoomViewport, bars);
      zoomController.reclamp();
      redrawArcsRef();
    }

    updateActiveBars();
    updatePersonHighlight();
    writeUrlState();
  }
  setVisModeRef = setVisMode;

  /**
   * Zentrale Funktion fuer "diese Quelle/Ziel-Referenz ist jetzt aktiv":
   * setzt den State, zeigt die Split-View und rendert - falls eine
   * Chip-Leiste sichtbar sein soll - diese mit der aktualisierten
   * activeReference neu. Der letzte Teil ist der eigentliche Fix: vorher
   * aktualisierte ein Chip-Klick zwar Balken und Split-View korrekt, liess
   * die Chip-Leiste selbst aber unveraendert stehen - der gerade
   * angeklickte Chip bekam dadurch NIE seine is-active-Markierung (nur ein
   * spaeterer Bogen-Klick auf dieselbe Referenz rendert die Leiste ja neu).
   * Ersetzt zwei vorher fast identische, separat gepflegte Closures (im
   * Balken-Klick-Handler und in onArcClick). Ruft sich selbst als
   * onChipClick-Callback erneut auf, damit auch ein zweiter/dritter
   * Chip-Klick in derselben Leiste korrekt nachzieht.
   */
  function selectCrossReference(source, target, stripChapter) {
    activeChapterKey = null;
    activeReference = { source, target };
    updateActiveBars();
    layout.showSplit();
    showSplitView(
      splitLeft,
      splitRight,
      verseIndex,
      source,
      target,
      buildEntityNameHighlightInfo
    );

    if (!stripChapter) return;
    const chapterRefs = getCrossRefsForChapter(
      crossRefs,
      stripChapter.bookName,
      stripChapter.chapterNumber
    );
    renderReferenceStrip(
      referenceStrip,
      stripChapter,
      chapterRefs,
      (s, t) => selectCrossReference(s, t, stripChapter),
      activeReference
    );
    writeUrlState();
  }

  /**
   * Liefert die Nummer des ERSTEN Verses (niedrigste Versnummer) in
   * `chapter`, der zu MINDESTENS EINER angepinnten Entity gehoert - oder
   * null, wenn keine Entity angepinnt ist oder das Kapitel keinen solchen
   * Vers enthaelt. chapter.verseList steht bereits in aufsteigender
   * Versnummer-Reihenfolge (s. parseBible), ein simpler Vorwaerts-Scan
   * ueber ALLE angepinnten Entities (Personen, Orte, Zeiten und Woerter
   * gemischt) reicht deshalb.
   */
  function getFirstEntityVerseInChapter(chapter) {
    if (pinnedEntities.length === 0) return null;
    for (const v of chapter.verseList) {
      const key = makeVerseKey(
        chapter.bookName,
        chapter.chapterNumber,
        v.number
      );
      if (pinnedEntities.some((p) => p.verseKeySet.has(key))) return v.number;
    }
    return null;
  }

  /**
   * Baut EIN {colorIndex, names, verseNumbers}-Objekt PRO angepinnter
   * Entity, die ueberhaupt in `chapter` vorkommt (Array, s. renderChapterText/
   * highlightPersonName) - `names` kommt kategorie-abhaengig aus
   * getEntityHighlightNames() (s. dort: Alias-Tabelle bei Personen/Orten,
   * surfaceForms bei Zeiten/Woertern), `colorIndex` den Pin-Slot (0-3) fuer
   * die richtige Pillen-Farbe. Entities ohne Treffer in diesem Kapitel
   * werden ausgelassen, ebenso Entities ohne jede Namensform (aktuell nur
   * die 5 hand-kuratierten prophetischen Zeit-Entities, s. dort). Gibt
   * null zurueck, wenn ueberhaupt keine Entity angepinnt ist ODER keine
   * einzige der angepinnten Entities in diesem Kapitel vorkommt (dann
   * macht renderChapterText gar nichts anders als ohne Pins).
   */
  function buildEntityNameHighlightInfo(chapter) {
    if (pinnedEntities.length === 0) return null;

    const perEntity = pinnedEntities
      .map((p, colorIndex) => {
        const verseNumbers = new Set();
        chapter.verseList.forEach((v) => {
          const key = makeVerseKey(
            chapter.bookName,
            chapter.chapterNumber,
            v.number
          );
          if (p.verseKeySet.has(key)) verseNumbers.add(v.number);
        });
        if (verseNumbers.size === 0) return null;
        const names = getEntityHighlightNames(p.category, p.id, p.displayName);
        if (names.length === 0) return null;
        return { colorIndex, names, verseNumbers };
      })
      .filter(Boolean);

    return perEntity.length > 0 ? perEntity : null;
  }

  /**
   * Oeffnet die Kapitelansicht fuer ein gegebenes chapter-Objekt - exakt
   * dieselbe Abfolge wie ein direkter Balken-Klick (s.u.). Extrahiert aus
   * dem Balken-Klick-Handler, damit auch der Vers-/Crossref-Dropdown im
   * Word-Explorer (Klick auf "Genesis 4:14" o. ae.) dieselbe, immer
   * konsistente Logik nutzen kann, statt sie ein zweites Mal zu pflegen.
   *
   * `focusVerseNumber` (optional): EXPLIZITER Ziel-Vers, z. B. weil im
   * Dropdown auf eine ganz bestimmte Vers-Zeile geklickt wurde - gewinnt
   * in diesem Fall gegenueber dem automatisch ermittelten ERSTEN Treffer-
   * Vers (getFirstEntityVerseInChapter), da ein gezielter Klick auf einen
   * konkreten Vers immer Vorrang vor der Automatik haben soll. Ohne
   * explizite Angabe (Balken-Klick) bleibt das bisherige Verhalten: bei
   * angepinnten Entities automatisch zum ERSTEN Treffer in diesem Kapitel
   * springen (gepunktet unterstrichen + angescrollt, exakt wie bei der
   * Referenz-Suche) und den Namen JEDER betroffenen Entity in IHRER Farbe
   * markieren (s. renderChapterText).
   */
  function openChapterView(chapter, focusVerseNumber) {
    activeChapterKey = makeChapterKey(chapter.bookName, chapter.chapterNumber);
    activeReference = null;
    updateActiveBars();

    const entityVerse =
      focusVerseNumber != null
        ? focusVerseNumber
        : getFirstEntityVerseInChapter(chapter);
    const entityNameInfo = buildEntityNameHighlightInfo(chapter);

    layout.showChapter();
    activeFocusVerse = entityVerse;
    renderChapterText(output, chapter, entityVerse, entityNameInfo);

    const chapterRefs = getCrossRefsForChapter(
      crossRefs,
      chapter.bookName,
      chapter.chapterNumber
    );
    renderReferenceStrip(
      referenceStrip,
      chapter,
      chapterRefs,
      (source, target) => selectCrossReference(source, target, chapter),
      activeReference
    );

    if (entityVerse != null) {
      requestAnimationFrame(() => scrollToHighlightedVerse(contentArea));
    }
    writeUrlState();
  }

  await new Promise((resolve) => requestAnimationFrame(resolve));

  const tooltip = createTooltip();

  // Baut das Boegen-SVG samt ALLEN Pfad-Elementen und Event-Listenern
  // EINMALIG auf (s. Modulkommentar bei createArcOverlay) - alle
  // spaeteren Aenderungen (Zoom/Pan/Resize/Theme/Palette/Personen-Filter/
  // aktive Referenz) laufen ueber arcOverlay.updateGeometry()/
  // .updateStyle(), die nur bestehende Attribute anpassen statt das SVG
  // erneut komplett abzureissen und neu zu bauen.
  const arcOverlay = createArcOverlay({
    anchorEl: visualizerCanvas,
    crossRefs,
    verseIndex,
    tooltip,
    onArcClick: ({ source, target }) => {
      if (justFinishedPanDrag) {
        justFinishedPanDrag = false;
        return;
      }
      const sourceChapter = verseIndex.getChapter(source.book, source.chapter);
      selectCrossReference(source, target, sourceChapter);
    },
  });

  // ---- "Karte"-Ansicht (dritter Modus, s. vis-mode-picker) -------------
  // Baut die Globe NUR fuer Orte, fuer die placeCoordinates.json (s.
  // build_place_coords.py) tatsaechlich eine Koordinate liefert (~91% der
  // 1014 Orte, s. Chat) - placesIndex/placesRaw enthaelt ALLE Orte, hier
  // wird auf die geokodierte Teilmenge gefiltert. `pos` in loadEntityIndex
  // wird hier nicht gebraucht (das ist nur fuer "words" relevant).
  // categories.places statt des rohen placesIndex: die Karte soll dieselben
  // deutschen Ortsnamen zeigen wie die Sidebar ("Ägypten", nicht "Egypt").
  // Betrifft Marker-Beschriftungen, Marker-Tooltips UND die Bogen-Tooltips
  // ("Joppe ↔ Mazedonien"), die alle aus diesen Namen gespeist werden.
  // `id` bleibt unveraendert, das Anpinnen ueber die Karte funktioniert
  // daher weiterhin ueber dieselben Entity-IDs wie aus der Sidebar.
  const geocodedPlaces = categories.places
    .map((entry) => {
      const coord = placeCoordinatesData.coordinates[entry.id];
      if (!coord) return null;
      return {
        id: entry.id,
        name: entry.name,
        count: entry.count,
        lat: coord.lat,
        lon: coord.lon,
      };
    })
    .filter(Boolean);

  console.log(
    `Karte: ${geocodedPlaces.length}/${placesIndex.length} Orte mit Koordinate (aus placeCoordinates.json).`
  );

  // Orts-Bogen-Netz: placeArcs.json liefert nur die Ortspaar-IDs (+ Gewicht
  // und einen Beleg-Vers), NICHT die Koordinaten - die stehen bereits in
  // placeCoordinates.json und sollen nicht doppelt gepflegt/uebertragen
  // werden. Hier werden beide zusammengefuehrt zu der {aLat, aLon, bLat,
  // bLon, ...}-Form, die createGlobeView erwartet. Ein Paar, dessen Orte
  // (aus welchem Grund auch immer) keine Koordinate oder keinen Eintrag im
  // Orts-Index haben, wird uebersprungen statt mit undefined-Koordinaten
  // eine kaputte Linie zu erzeugen.
  const placeById = new Map(geocodedPlaces.map((p) => [p.id, p]));
  const resolvedPlaceArcs = placeArcsData.arcs
    .map((arc) => {
      const a = placeById.get(arc.from);
      const b = placeById.get(arc.to);
      if (!a || !b) return null;
      return {
        aId: a.id,
        aName: a.name,
        aLat: a.lat,
        aLon: a.lon,
        bId: b.id,
        bName: b.name,
        bLat: b.lat,
        bLon: b.lon,
        weight: arc.weight,
        exampleVerse: arc.example,
      };
    })
    .filter(Boolean);

  console.log(
    `Karte: ${resolvedPlaceArcs.length}/${placeArcsData.arcs.length} Orts-Querverweis-Bögen aufgelöst (${placeArcsData.meta.involvedPlaces} beteiligte Orte).`
  );

  const globeView = createMapView({
    container: globeCanvasContainer,
    places: geocodedPlaces,
    placeArcs: resolvedPlaceArcs,
    // Liefert main.js' Pin-Farblogik an die Globe weiter - EIN Ort ist
    // hoechstens EINMAL angepinnt (kein Ueberlappungs-/Blend-Fall wie bei
    // Kapitel-Balken, wo mehrere Entities dasselbe Kapitel teilen koennen,
    // s. Modulkommentar bei createGlobeView), daher reicht ein einfacher
    // find() statt einer gemischten multiplyBlendColors()-Farbe.
    getColorForPlace: (placeId) => {
      const idx = pinnedEntities.findIndex(
        (p) => p.category === "places" && p.id === placeId
      );
      return idx === -1 ? null : readPersonColor(idx);
    },
    // Klick auf einen Marker verhaelt sich exakt wie ein Klick auf denselben
    // Ort in der Sidebar-Liste (pinnen/entpinnen, gleiche 4-Slot-Kappung) -
    // s. pinEntity() in wireWordExplorer.
    onMarkerClick: (placeId) => {
      if (wordExplorerApi) wordExplorerApi.pinEntity("places", placeId);
    },
    onMarkerHover: (placeId, clientX, clientY) => {
      const place = geocodedPlaces.find((p) => p.id === placeId);
      if (!place) return;
      tooltip.show(`${place.name} (${place.count})`, clientX, clientY);
    },
    onMarkerHoverEnd: () => tooltip.hide(),
    // Hover ueber einen Orts-Bogen zeigt, WELCHE beiden Orte er verbindet -
    // dieselbe Tooltip-Instanz wie Marker/Balken/2D-Boegen.
    onArcHover: (aName, bName, clientX, clientY) => {
      tooltip.show(`${aName} ↔ ${bName}`, clientX, clientY);
    },
    onArcHoverEnd: () => tooltip.hide(),
    // Klick auf einen Orts-Bogen oeffnet den zugrundeliegenden Querverweis
    // in der gewohnten Split-Ansicht (Quell- und Zielvers nebeneinander) -
    // exakt wie ein Klick auf einen Bogen in der 2D-Boegen-Ansicht, nur
    // dass die Referenz hier aus dem Beleg-Beispiel des Ortspaars kommt
    // (s. `example` in build_place_arcs.py).
    onArcClick: (exampleVerse) => {
      if (!exampleVerse) return;
      const source = {
        book: exampleVerse.sourceBook,
        chapter: exampleVerse.sourceChapter,
        verse: exampleVerse.sourceVerse,
      };
      const target = {
        bookFull: exampleVerse.targetBook,
        chapter: exampleVerse.targetChapter,
        verse: exampleVerse.targetVerse,
      };
      const sourceChapter = verseIndex.getChapter(source.book, source.chapter);
      selectCrossReference(source, target, sourceChapter);
    },
  });
  // Bewusst KEIN refreshTheme() direkt nach dem Erzeugen: die Karte wird
  // erst beim ersten Oeffnen der "Karte"-Ansicht aufgebaut (s. ensureMap/
  // setActive in createMapView) und liest den dann gueltigen Style selbst
  // aus. Der frueher hier stehende Aufruf war sogar schaedlich - er loeste
  // ein setStyle() aus, das die eben angelegten Datenlayer wieder
  // abgeraeumt hat.
  globeViewRef = globeView;

  bars.forEach((bar, i) => {
    const chapter = chapters[i];

    bar.addEventListener("mouseenter", (e) => {
      bar.style.background = "red";
      bar.style.transform = "scaleX(1.5)";
      tooltip.show(
        `${germanBookName(chapter.bookName)} – Kapitel ${
          chapter.chapterNumber
        } (${chapter.verseCount} Verse)`,
        e.pageX,
        e.pageY
      );
    });
    bar.addEventListener("mousemove", (e) => tooltip.move(e.pageX, e.pageY));
    bar.addEventListener("mouseleave", () => {
      bar.style.background = "";
      bar.style.transform = "scaleX(1)";
      tooltip.hide();
    });
    bar.addEventListener("click", () => {
      if (justFinishedPanDrag) {
        justFinishedPanDrag = false;
        return;
      }
      openChapterView(chapter);
    });
  });

  // Dieselben Interaktionen fuer die Grid-Quadrate - OHNE
  // justFinishedPanDrag-Pruefung, da die Grid-Ansicht bewusst kein Zoom/
  // Pan hat (s. Anfrage) und ein Klick dort daher nie mit einem Drag
  // verwechselt werden kann. Der Hover-Flash nutzt bewusst dieselbe
  // `background`-Eigenschaft wie bei den Balken (nicht z. B. eine eigene
  // CSS-Klasse) - aus demselben Grund wie dort: sie lässt sich beim
  // Verlassen einfach auf "" zuruecksetzen, ohne die per --person-bg
  // gesetzte Personen-Faerbung zu verlieren (s. Kommentar bei
  // .chapter-square.is-person-active in style.css).
  squares.forEach((square, i) => {
    const chapter = chapters[i];

    square.addEventListener("mouseenter", (e) => {
      square.style.background = "red";
      tooltip.show(
        `${germanBookName(chapter.bookName)} – Kapitel ${
          chapter.chapterNumber
        } (${chapter.verseCount} Verse)`,
        e.pageX,
        e.pageY
      );
    });
    square.addEventListener("mousemove", (e) => tooltip.move(e.pageX, e.pageY));
    square.addEventListener("mouseleave", () => {
      square.style.background = "";
      tooltip.hide();
    });
    square.addEventListener("click", () => openChapterView(chapter));
  });

  // Voller Redraw: Position UND Farbe - fuer Zoom/Pan/Resize/Sidebar-
  // Toggle/Theme/Palette/Kapitel- bzw. Referenz-Auswahl, wo sich
  // tatsaechlich etwas an den Bildschirm-Positionen aendern kann (oder wo
  // eine Style-Aktualisierung ohnehin so selten passiert, dass der
  // zusaetzliche Geometrie-Durchlauf nicht ins Gewicht faellt).
  //
  // WICHTIG: no-op, wenn gerade die Grid- statt der Boegen-Ansicht aktiv
  // ist (s. visMode/setVisMode). Grund: getBarPositions(bars) liest
  // getBoundingClientRect() der Balken - sind diese (weil .zoom-viewport
  // per [hidden] auf display:none steht) gerade NICHT gerendert, liefert
  // das fuer ALLE Balken ein Null-Rechteck (0,0,0,0). Ohne diesen Schutz
  // wuerden z. B. ein Fenster-Resize oder das Oeffnen eines Kapitels
  // (beides loest ganz normal einen Redraw aus, unabhaengig vom aktuellen
  // Darstellungs-Modus) waehrend der Grid-Ansicht die Bogen-Geometrie mit
  // diesen Nullwerten ueberschreiben ("kollabierte" Boegen) - sichtbar
  // erst BEIM ZURUECKWECHSELN zur Boegen-Ansicht, da sie bis dahin ja
  // unsichtbar war. Genau das war der gemeldete Bug ("Switch zurueck zu
  // Arc funktioniert nicht einwandfrei, gerade wenn im Gridmodus ein
  // Chapter angewaehlt ist" - das Oeffnen eines Kapitels IST einer der
  // Redraw-Ausloeser). setVisMode() holt beim tatsaechlichen Wechsel
  // ZURUECK zur Boegen-Ansicht ohnehin einen vollstaendigen, dann wieder
  // gueltigen Redraw nach.
  function redrawArcs() {
    if (visMode !== "arc") return;
    const freshPositions = getBarPositions(bars);
    // Mit dem aktuellen Zoom-Level skaliert: die Balken-Bildschirm-
    // positionen (freshPositions) spiegeln den Zoom bereits wider (s.
    // Modul-Kommentar bei createZoomController), die Bogenhoehe selbst
    // aber nicht von allein, da sie unabhaengig von der (unveraenderten)
    // Canvas-Groesse berechnet wird - ohne diese Multiplikation wuerden
    // Boegen beim Reinzoomen zunehmend FLACH wirken (Spannweite waechst,
    // Hoehe bliebe gleich), statt proportional mitzuwachsen wie der Rest
    // der Visualisierung.
    const maxArcHeight = currentArcHeight() * zoomController.getScale();
    arcOverlay.updateGeometry({
      chapterPositions: freshPositions,
      maxArcHeight,
    });
    arcOverlay.updateStyle({ activeReference, pinnedEntities });
  }

  // Leichter Redraw: NUR Farbe/Strichbreite, keine Geometrie - fuer
  // Pin-Aenderungen (s. updatePersonHighlight), wo sich an den
  // Bildschirm-Positionen der Boegen nachweislich nichts aendert. Das ist
  // der eigentliche Performance-Fix: bei mehreren zehntausend
  // Querverweisen spart das pro Pin-Klick den kompletten (unnoetigen)
  // Geometrie-Durchlauf.
  function refreshArcStyle() {
    arcOverlay.updateStyle({ activeReference, pinnedEntities });
  }

  // Onboarding im Info-Bereich - erst hier, weil es chapters, crossRefs
  // und den Vers-Index braucht. Das Layout wird beim Oeffnen des
  // Info-Bereichs gesetzt (der Panel-Container ist vorher [hidden] und
  // meldet 0x0 - dieselbe Falle wie bei Grid und Karte).
  /**
   * Baut fuer die vier Onboarding-Beispiele die Menge der Kapitel, in
   * denen sie vorkommen - dieselbe Grundlage, aus der die echte
   * Visualisierung ihre Einfaerbung ableitet (chapterKeySet in
   * setPinnedEntities).
   *
   * Drei der vier kommen direkt aus den geladenen Referenzdateien. Das
   * Wort "heilig" wird stattdessen im Text gesucht: die Wortdaten liegen
   * beim Start bewusst nicht vor (s. Lazy Loading, Stand 4/5), und rund
   * 2 MB nachzuladen, nur um im Onboarding vier Beispielfarben zu zeigen,
   * waere ein schlechtes Geschaeft. Ein Regex ueber die ohnehin
   * geparsten Verse kostet nichts und trifft dieselben Kapitel.
   */
  function buildOnboardingExamples() {
    const chapterKeysFrom = (verses) =>
      new Set((verses || []).map((v) => makeChapterKey(v.book, v.chapter)));

    const heiligRe = /\bheilig\w*/i;
    const heiligKeys = new Set();
    chapters.forEach((chapter) => {
      if (chapter.verseList.some((v) => heiligRe.test(v.text))) {
        heiligKeys.add(makeChapterKey(chapter.bookName, chapter.chapterNumber));
      }
    });

    return [
      {
        label: "David",
        category: "Personen",
        chapterKeys: chapterKeysFrom(
          personsRaw.versesByPerson["David@Rut.4.17-Rev"]
        ),
      },
      {
        label: "Jerusalem",
        category: "Orte",
        chapterKeys: chapterKeysFrom(
          placesRaw.versesByPlace["Jerusalem@Gen.14.18-Rev"]
        ),
      },
      {
        label: "ewig",
        category: "Zeiten",
        chapterKeys: chapterKeysFrom(timesRaw.versesByTime["et_ewig"]),
      },
      { label: "heilig", category: "Wörter", chapterKeys: heiligKeys },
    ];
  }

  const onboarding = createOnboarding({
    panelEl: infoPanel,
    chapters,
    crossRefs,
    verseIndex,
    examples: buildOnboardingExamples(),
    onFinish: () => leaveInfoView(),
  });
  onboardingRef = onboarding;

  redrawArcsRef = redrawArcs;
  refreshArcStyleRef = refreshArcStyle;
  updateLayoutForViewport();

  // ---- Suchleiste: "Buch Kapitel[:,.]Vers" -> Kapitelansicht + Vers-
  // Hervorhebung. Das eigentliche Parsen/unscharfe Buch-Matching passiert
  // in parseReferenceQuery/findBookNameMatch (bookSearch.js-Teil) - hier
  // nur noch das Ergebnis in die bestehende Kapitel-Anzeige-Logik
  // einspeisen, exakt wie beim Balken-Klick (gleicher State-Umgang).
  const searchInputEl = document.getElementById("reference-search");
  let searchFeedbackTimeout = null;

  function showSearchFeedback(message) {
    searchFeedback.textContent = message;
    searchFeedback.hidden = false;
    clearTimeout(searchFeedbackTimeout);
    searchFeedbackTimeout = setTimeout(() => {
      searchFeedback.hidden = true;
    }, 3500);
  }

  function hideSearchFeedback() {
    searchFeedback.hidden = true;
    clearTimeout(searchFeedbackTimeout);
  }

  searchInputEl.addEventListener("input", hideSearchFeedback);

  document.addEventListener("reference-search", (e) => {
    const query = e.detail;
    hideSearchFeedback();

    const parsed = parseReferenceQuery(query);
    const chapter = parsed
      ? verseIndex.getChapter(parsed.bookFull, parsed.chapter)
      : null;

    if (!parsed || !chapter) {
      showSearchFeedback(`Kein Kapitel gefunden für „${query}“`);
      return;
    }

    // Vers nur uebernehmen, wenn er in diesem Kapitel tatsaechlich
    // existiert - ein falscher/zu hoher Vers soll nicht die ganze Suche
    // scheitern lassen, das Kapitel wird trotzdem angezeigt (nur ohne
    // Hervorhebung).
    const searchedVerse =
      parsed.verse != null &&
      chapter.verseList.some((v) => v.number === parsed.verse)
        ? parsed.verse
        : null;

    // War KEIN Vers explizit angegeben (nur "Buch Kapitel") UND ist
    // mindestens eine Entity angepinnt, springt die Suche - genau wie ein
    // Klick im Dropdown - automatisch zum ersten Vers dieser Entity in
    // diesem Kapitel. Ein explizit gesuchter Vers ("Buch Kapitel:Vers")
    // hat dagegen immer Vorrang - die Suche soll nie einen bewusst
    // gesuchten Vers ueberschreiben. Die Namens-Pillen (entityNameInfo)
    // werden unabhaengig davon in JEDEM Fall eingeblendet, sobald das
    // Kapitel ueberhaupt Treffer-Verse enthaelt - auch wenn ein expliziter
    // Vers den Scroll-/Unterstreich-Fokus uebernimmt.
    const entityVerse =
      searchedVerse == null ? getFirstEntityVerseInChapter(chapter) : null;
    const highlightVerse = searchedVerse != null ? searchedVerse : entityVerse;
    const entityNameInfo = buildEntityNameHighlightInfo(chapter);

    activeChapterKey = makeChapterKey(chapter.bookName, chapter.chapterNumber);
    activeReference = null;
    updateActiveBars();

    layout.showChapter();
    activeFocusVerse = highlightVerse;
    renderChapterText(output, chapter, highlightVerse, entityNameInfo);

    const chapterRefs = getCrossRefsForChapter(
      crossRefs,
      chapter.bookName,
      chapter.chapterNumber
    );
    renderReferenceStrip(
      referenceStrip,
      chapter,
      chapterRefs,
      (source, target) => selectCrossReference(source, target, chapter),
      activeReference
    );

    if (highlightVerse != null) {
      requestAnimationFrame(() => scrollToHighlightedVerse(contentArea));
    }
  });

  let resizeRafPending = false;
  window.addEventListener("resize", () => {
    if (resizeRafPending) return;
    resizeRafPending = true;
    requestAnimationFrame(() => {
      resizeRafPending = false;
      applyLayoutVars();
      // Nur die gerade SICHTBARE Darstellung neu layouten - genau wie bei
      // redrawArcs() wuerde layoutChapterBars() (bzw. layoutChapterGridRef())
      // bei versteckter [hidden]-Ansicht mit einem 0x0-Container rechnen
      // und deren Layout korrumpieren. setVisMode() holt beim naechsten
      // tatsaechlichen Wechsel ohnehin eine vollstaendige Neuberechnung
      // nach, s. dort.
      relayoutCurrentView();
      // Buehnen-/Abschnittshoehen des Onboardings haengen an der
      // Panel-Hoehe und muessen bei Groessenaenderung mitziehen.
      if (onboardingRef && !infoPanel.hidden) onboardingRef.layout();
    });
  });

  // Ganz zum Schluss: einen ggf. in der URL mitgegebenen Zustand
  // herstellen. Erst hier, weil dafuer ALLES bereitstehen muss - Balken,
  // Grid, Bogen-Overlay, Sidebar und der Vers-Index.
  await applyUrlState();

  // Erst jetzt den Ladebildschirm ausblenden: ab hier steht die fertige
  // Visualisierung, inklusive eines evtl. aus der URL wiederhergestellten
  // Zustands. Frueher ausgeblendet saehe man kurz eine leere Flaeche oder
  // einen Zwischenzustand.
  hideAppLoader();
}

// ---- UI-Wiring: Sidebar Toggle, Suchleiste ----
// Nimmt optional onSidebarToggle entgegen (statt einer eigenen
// Modul-globalen Referenz), damit diese Funktion trotzdem eigenstaendig
// bleibt, aber init() ihr redrawArcsRef reinreichen kann - gleiches Prinzip
// wie bei wirePanelDivider({ onResize }). Deshalb wird sie jetzt aus
// init() heraus aufgerufen statt (wie bisher) davor auf oberster Ebene.
function wireStaticControls({ onSidebarToggle } = {}) {
  const sidebar = document.getElementById("sidebar");
  const sidebarToggle = document.getElementById("sidebar-toggle");
  sidebarToggle.addEventListener("click", () => {
    sidebar.classList.toggle("expanded");
  });

  // Die Balken selbst passen sich beim Sidebar-Ein-/Ausklappen von allein
  // an (justify-content:center im jetzt schmaleren/breiteren
  // #bible-container uebernimmt das automatisch per CSS-Reflow) - die
  // Boegen dagegen sind einmalig gezeichnete SVG-Pfade mit festen x/y-
  // Koordinaten, die sich NICHT von selbst nachziehen. Deshalb hier nach
  // Abschluss der width-Transition (nicht schon waehrend, sonst wuerden
  // die Boegen auf Basis einer Zwischenbreite gezeichnet) explizit neu
  // zeichnen lassen.
  sidebar.addEventListener("transitionend", (e) => {
    if (e.propertyName !== "width") return;
    if (onSidebarToggle) onSidebarToggle();
  });

  const searchInput = document.getElementById("reference-search");
  searchInput.addEventListener("keydown", (e) => {
    if (e.key !== "Enter") return;
    document.dispatchEvent(
      new CustomEvent("reference-search", { detail: searchInput.value })
    );
  });
}

// ========================================================================
// themeToggle.js — Dark-Mode-Umschaltung
// ========================================================================
// Der SCHLUESSEL hier muss mit dem im Inline-Script in index.html <head>
// uebereinstimmen - jenes Script setzt den ANFANGSZUSTAND synchron vor dem
// ersten Rendern (verhindert einen kurzen Flash des falschen Themes), da
// dieses hier erst am Ende von <body> geladene Script dafuer zu spaet
// kaeme. Hier wird der bereits gesetzte Zustand nur noch uebernommen
// (aria/title synchronisiert) und der Klick-Handler fuers Umschalten
// verdrahtet.
const THEME_STORAGE_KEY = "bible-explorer-theme";

function wireThemeToggle({ onThemeChange } = {}) {
  const toggle = document.getElementById("theme-toggle");
  const root = document.documentElement;

  function applyTheme(theme) {
    root.dataset.theme = theme;
    toggle.setAttribute("aria-pressed", theme === "dark" ? "true" : "false");
    toggle.title =
      theme === "dark" ? "Zu Light Mode wechseln" : "Zu Dark Mode wechseln";
  }

  applyTheme(root.dataset.theme || "light");

  toggle.addEventListener("click", () => {
    const next = root.dataset.theme === "dark" ? "light" : "dark";
    applyTheme(next);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch (e) {
      // localStorage kann z. B. im privaten Modus fehlschlagen - die Wahl
      // gilt dann nur fuer die aktuelle Sitzung, kein Absturz.
    }
    // Balken/Chips aktualisieren sich automatisch ueber die CSS-Kaskade
    // (var(--accent) etc.). Die Boegen sind dagegen einmalig gezeichnete
    // SVG-Pfade mit zum Zeitpunkt des Zeichnens fest eingetragenen
    // Farbwerten (s. readArcColorStops/readAccentColor) - die muessen
    // nach einem Theme-Wechsel explizit neu gezeichnet werden, damit
    // Verlauf und aktive Bogenfarbe zum neuen Theme passen.
    if (onThemeChange) onThemeChange();
  });
}

// ========================================================================
// arcPalette.js — Bogen-Farbpaletten-Dropdown (oben links in der Vis-Box)
// ========================================================================
// Schaltet ausschliesslich data-arc-palette auf <html> um - ein von
// data-theme UNABHAENGIGES Attribut, beide sind frei kombinierbar (z. B.
// "Monochrome" im Dark Mode, s. die entsprechenden Selektoren in
// style.css). "Neon" ist der Sonderfall OHNE gesetztes Attribut: das sind
// exakt die Werte, die schon unveraendert in :root stehen, deshalb wird
// hier bei "neon" das Attribut aktiv ENTFERNT statt auf "neon" gesetzt -
// dafuer braucht style.css keinen eigenen [data-arc-palette="neon"]-Block.
const ARC_PALETTE_STORAGE_KEY = "bible-explorer-arc-palette";

function wireArcPalettePicker({ onPaletteChange } = {}) {
  const control = document.getElementById("arc-palette-control");
  const options = Array.from(control.querySelectorAll(".arc-palette-option"));
  const root = document.documentElement;

  function applyPalette(palette) {
    if (palette === "neon") {
      delete root.dataset.arcPalette;
    } else {
      root.dataset.arcPalette = palette;
    }
    options.forEach((opt) => {
      const isActive = opt.dataset.palette === palette;
      opt.classList.toggle("is-active", isActive);
      opt.setAttribute("aria-selected", isActive ? "true" : "false");
    });
  }

  options.forEach((opt) => {
    opt.addEventListener("click", () => {
      const palette = opt.dataset.palette;
      applyPalette(palette);
      try {
        localStorage.setItem(ARC_PALETTE_STORAGE_KEY, palette);
      } catch (e) {
        // localStorage kann z. B. im privaten Modus fehlschlagen - die
        // Wahl gilt dann nur fuer die aktuelle Sitzung, kein Absturz.
      }
      // Wie beim Theme-Wechsel: die Boegen tragen ihre Farbe als einmalig
      // gesetztes SVG-Attribut, nicht live per CSS-Variable - muessen bei
      // einem Paletten-Wechsel also explizit neu gezeichnet werden.
      if (onPaletteChange) onPaletteChange();
    });
  });

  let stored = null;
  try {
    stored = localStorage.getItem(ARC_PALETTE_STORAGE_KEY);
  } catch (e) {
    // ignorieren - Standard bleibt "neon"
  }
  // Gespeicherte Werte gegen die noch VORHANDENEN Optionen pruefen: wer
  // frueher "Pastell" gewaehlt hatte, haette sonst einen Zustand, den es
  // nicht mehr gibt - die Palette waere gesetzt, aber kein Schalter aktiv.
  const isKnown = options.some((opt) => opt.dataset.palette === stored);
  applyPalette(isKnown ? stored : "neon");
}

// ========================================================================
// visModePicker.js — Umschalter Boegen-/Grid-Ansicht (oben links in der
// Vis-Box, direkt neben dem Bogen-Paletten-Dropdown)
// ========================================================================
// Schaltet ausschliesslich zwischen den beiden String-Werten "arc"/"grid"
// um - die eigentliche Sichtbarkeits-Umschaltung (welcher Container
// gezeigt wird, Boegen aus-/eingeblendet, Grid-Layout neu berechnet)
// passiert im onModeChange-Callback in main.js (setVisMode), dieses
// Modul kuemmert sich nur um die Dropdown-UI selbst. Bewusst OHNE
// localStorage-Persistenz (anders als die Bogen-Palette): setVisMode()
// in main.js braucht bereits existierende Balken/Quadrate/das Bogen-
// Overlay, die zum fruehen Zeitpunkt dieses Aufrufs (zusammen mit
// wireArcPalettePicker etc., lange vor dem XML-Fetch) noch gar nicht
// existieren - ein sofortiges Anwenden einer gespeicherten "grid"-
// Praeferenz wuerde daher fehlschlagen. Die Ansicht startet deshalb
// immer mit "Boegen" (passend zum HTML-Standardzustand), Grid laesst
// sich pro Sitzung ueber das Dropdown aktivieren.
function wireVisModePicker({ onModeChange } = {}) {
  const control = document.getElementById("vis-mode-control");
  const options = Array.from(control.querySelectorAll(".vis-mode-option"));

  options.forEach((opt) => {
    opt.addEventListener("click", () => {
      const mode = opt.dataset.visMode;
      if (opt.classList.contains("is-active")) return;
      if (onModeChange) onModeChange(mode);
    });
  });
}

// Dauer EINES Animationszyklus des Ladebildschirms. Muss mit der
// animation-duration von .app-loader-arc in style.css uebereinstimmen.
const APP_LOADER_CYCLE_MS = 2600;

/**
 * Blendet den Ladebildschirm aus - immer an einer ZYKLUSGRENZE der
 * Bogen-Animation und nie vor Ende des ersten Zyklus.
 *
 * Vorher stand eine feste Mindestzeit (3200 ms). Die lag mitten im zweiten
 * Durchlauf: die Boegen hatten gerade neu zu wachsen begonnen und wurden
 * dabei abgeschnitten - es wirkte wie eineinhalb Zyklen. Auf ein Vielfaches
 * von APP_LOADER_CYCLE_MS gerundet endet die Bewegung dagegen immer dort,
 * wo die Boegen ohnehin ausgeblendet sind, und der Uebergang wirkt
 * beabsichtigt.
 *
 * `performance.now()` zaehlt ab Navigationsbeginn und misst damit direkt,
 * wie lange der Ladebildschirm schon zu sehen war - ein eigener
 * Startzeitpunkt muss nicht gemerkt werden.
 *
 * Idempotent: wird sowohl am regulaeren Ende von init() als auch vom
 * Sicherheitsnetz unten aufgerufen.
 */
function hideAppLoader() {
  const loader = document.getElementById("app-loader");
  if (!loader || loader.classList.contains("is-done")) return;
  const elapsed = performance.now();
  const cycles = Math.max(1, Math.ceil(elapsed / APP_LOADER_CYCLE_MS));
  const remaining = cycles * APP_LOADER_CYCLE_MS - elapsed;
  if (remaining > 0) {
    setTimeout(() => loader.classList.add("is-done"), remaining);
  } else {
    loader.classList.add("is-done");
  }
}

// init() ist async und kann an einem fehlgeschlagenen fetch scheitern
// (fehlende Datei, kein Netz). Ohne diesen Fang bliebe der Ladebildschirm
// dann fuer immer stehen und die App waere nicht bedienbar - eine leere,
// aber sichtbare Oberflaeche ist in dem Fall die deutlich bessere
// Rueckmeldung als ein ewiger Ladezustand.
init().catch((err) => {
  console.error("Initialisierung fehlgeschlagen:", err);
  hideAppLoader();
});
