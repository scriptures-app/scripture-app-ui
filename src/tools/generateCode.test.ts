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
    descriptorHash: "afa3ce"
  },
  kjv: {
    allHash: "edb19a",
    v11nHash: "c9bbd0",
    descriptorHash: "b29dce"
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
      generateCode(path, bibles, defaultChapter, "a25269", biblesHashes)
    ).toMatchSnapshot();
  });
});
