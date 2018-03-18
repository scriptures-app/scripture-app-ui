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
