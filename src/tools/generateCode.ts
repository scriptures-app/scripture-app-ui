import { ChapterReference } from "@bible-reader/types";
import { BibleInputConfig, BiblesHashes } from "../types";

import { pad } from "../utils/utils";

function generateCode(
  publicPath: string,
  bibles: BibleInputConfig[],
  { versionId, book, chapter }: ChapterReference,
  biblesJsonHash: string,
  biblesHashes: BiblesHashes
) {
  const biblesJSON = require(`${publicPath}/bibles.${biblesJsonHash}.json`);
  let code = `/**
 * This file is generated using npm run generate and is not to be manualy modified.
 */
 /* tslint:disable */
import { ChapterContent } from "@bible-reader/types";
import { BibleVersionsMap } from "./types";
`;
  const descriptorHash = biblesHashes[versionId].descriptorHash;
  const descriptor = require(`${publicPath}/${versionId}/descriptor.${descriptorHash}.json`);

  bibles.forEach(({ id }: BibleInputConfig) => {
    biblesJSON[id].v11n = {}; // v11n data for current bible will be loaded right after first page load
  });
  code += `const bibles: BibleVersionsMap = ${JSON.stringify(biblesJSON)};\n`;

  const hash = descriptor.chapters[book][chapter - 1];
  const initialChapterJSON = require(`${publicPath}/${versionId}/${book}/ch${pad(
    chapter.toString(),
    3
  )}.${hash}.json`);

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
