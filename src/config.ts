export const outputPath = "public/bibles/";
export const bibles = [
  {
    id: "kjv",
    lang: "en",
    name: "King James Version",
    input: "http://unbound.biola.edu/downloads/bibles/kjv_apocrypha.zip",
    pathInArchive: "kjv_apocrypha_utf8.txt",
    type: "unbound"
  },
  {
    id: "beb",
    lang: "en",
    name: "Basic English Bible",
    input: "http://unbound.biola.edu/downloads/bibles/basic_english.zip",
    pathInArchive: "basic_english_utf8.txt",
    type: "unbound"
  },
  {
    id: "rves",
    lang: "es",
    name: "Reina Valera (1909)",
    input:
      "http://unbound.biola.edu/downloads/bibles/spanish_reina_valera_1909.zip",
    pathInArchive: "spanish_reina_valera_1909_utf8.txt",
    type: "unbound"
  },
  {
    id: "syno",
    lang: "ru",
    name: "Синодальный перевод (1876)",
    input: "http://unbound.biola.edu/downloads/bibles/russian_synodal_1876.zip",
    pathInArchive: "russian_synodal_1876_utf8.txt",
    type: "unbound"
  },
  {
    id: "bkr",
    lang: "cz",
    name: "Bible Kralická",
    input: "http://www.unboundbible.org/downloads/bibles/czech_bkr.zip",
    pathInArchive: "czech_bkr_utf8.txt",
    type: "unbound"
  }
];

export const defaultChapter = {
  versionId: "kjv",
  book: "gen",
  chapter: 1
};
