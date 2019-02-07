import { ChapterReference } from "@bible-reader/types";

import { BibleInputConfig, BiblesHashes } from "../types";

import generateCode from "./generateCode";

const bibles: BibleInputConfig[] = [
  {
    id: "bkr",
    lang: "cz",
    name: "Bible Kralická",
    input: "./src/tools/testData/czech_bkr_utf8_sample.txt",
    type: "unbound"
  },
  {
    id: "kjv",
    lang: "en",
    name: "King James Version",
    input: "./src/tools/testData/KJV_test_sample.xmm",
    type: "opensong"
  }
];

const biblesHashes: BiblesHashes = {
  bkr: {
    allHash: "c678a9",
    v11nHash: "d21033",
    booksHashes: { gen: "a53443", exo: "a8888d" }
  },
  kjv: {
    allHash: "edb19a",
    v11nHash: "c9bbd0",
    booksHashes: {
      gen: "65bd48",
      exo: "e22dea",
      lev: "bbdf85",
      num: "bbdf85",
      deu: "bbdf85"
    }
  }
};

const defaultChapter: ChapterReference = {
  versionId: "kjv",
  book: "gen",
  chapter: 1
};

const path = "../../src/tools/testData/bibles/";

describe("generateCode", () => {
  it("should generate correct code", () => {
    expect(
      generateCode(path, bibles, defaultChapter, "2f8b83", biblesHashes)
    ).toMatchSnapshot();
  });
});
