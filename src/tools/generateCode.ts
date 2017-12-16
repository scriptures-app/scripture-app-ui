import { pad } from "../utils/utils";

function generateCode(
  publicPath: string,
  bibles: IBibleInputConfig[],
  { bibleId, book, chapter }: IPassageCoords
) {
  const biblesJSON = require(`${publicPath}/bibles.json`);
  let code = `/**
 * This file is generated using npm run generate and is not to be manualy modified.
 */
 /* tslint:disable */
`;
  bibles.forEach(({ id, lang, name, short }: IBibleInputConfig) => {
    const statsJSON = require(`${publicPath}/${id}/stats.json`);
    biblesJSON[id].stats = statsJSON;
  });
  code += `const bibles = ${JSON.stringify(biblesJSON)};\n`;
  const initialChapterJSON = require(`${publicPath}/${bibleId}/${book}/ch${pad(
    chapter.toString(),
    3
  )}.json`);
  code += `const initialChapter`;
  code += `  = ${JSON.stringify(initialChapterJSON)};\n`;
  code += "export default {\n";
  code += "  bibles,\n";
  code += "  defaultPassage: {\n";
  code += `    bibleId: "${bibleId}",\n`;
  code += `    book: "${book}",\n`;
  code += `    chapter: ${chapter},\n`;
  code += `    verses: initialChapter.verses\n`;
  code += "  }\n";
  code += "};\n";
  return code;
}

export default generateCode;
