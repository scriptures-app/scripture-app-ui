import { ChapterReference } from "@bible-reader/types";
import { BibleInputConfig } from "../types";

import { pad } from "../utils/utils";

function generateCode(
  publicPath: string,
  bibles: BibleInputConfig[],
  { versionId, book, chapter }: ChapterReference
) {
  const biblesJSON = require(`${publicPath}/bibles.json`);
  let code = `/**
 * This file is generated using npm run generate and is not to be manualy modified.
 */
 /* tslint:disable */
import { ChapterContent } from "@bible-reader/types";
import { BibleVersionsMap } from "./types";
`;
  bibles.forEach(({ id, lang, name }: BibleInputConfig) => {
    const v11nJSON = require(`${publicPath}/${id}/v11n.json`);
    biblesJSON[id].v11n = v11nJSON;
  });
  code += `const bibles: BibleVersionsMap = ${JSON.stringify(biblesJSON)};\n`;
  const initialChapterJSON = require(`${publicPath}/${versionId}/${book}/ch${pad(
    chapter.toString(),
    3
  )}.json`);
  code += `const initialChapter: ChapterContent`;
  code += `  = ${JSON.stringify(initialChapterJSON)};\n`;
  code += "export default {\n";
  code += "  bibles,\n";
  code += "  defaultPassage: {\n";
  code += `    versionId: "${versionId}",\n`;
  code += `    book: "${book}",\n`;
  code += `    chapter: ${chapter},\n`;
  code += `    verses: initialChapter.verses,\n`;
  code += `    loading: false\n`;
  code += "  }\n";
  code += "};\n";
  return code;
}

export default generateCode;
