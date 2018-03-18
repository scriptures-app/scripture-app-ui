import { ChapterReference } from "@scripture-app/types";

import generateCode from "./generateCode";

const bibles = [
  {
    id: "cz_bkr",
    lang: "cz",
    name: "Bible Kralická",
    short: "BKR",
    input: "./src/tools/testData/czech_bkr_utf8_sample.txt",
    type: "unbound"
  },
  {
    id: "en_kjv",
    lang: "en",
    name: "King James Version",
    short: "KJV",
    input: "./src/tools/testData/KJV_test_sample.xmm",
    type: "opensong"
  }
];

const defaultChapter: ChapterReference = {
  versionId: "en_kjv",
  book: "gen",
  chapter: 1
};

const path = "../../src/tools/testData/bibles/";

describe("generateCode", () => {
  it("should generate correct code", () => {
    expect(generateCode(path, bibles, defaultChapter)).toMatchSnapshot();
  });
});
