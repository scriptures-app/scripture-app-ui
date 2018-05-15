import { ChapterReference } from "@bible-reader/types";

import { BibleInputConfig } from "../types";

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

const defaultChapter: ChapterReference = {
  versionId: "kjv",
  book: "gen",
  chapter: 1
};

const path = "../../src/tools/testData/bibles/";

describe("generateCode", () => {
  it("should generate correct code", () => {
    expect(generateCode(path, bibles, defaultChapter)).toMatchSnapshot();
  });
});
