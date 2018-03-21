import { fs } from "mz";
import * as path from "path";
import { BibleVersionContent } from "@scripture-app/types";
import * as xml2json from "@scripture-app/bible-converter";
import { BibleInputConfig } from "../types";
import readSource from "./readSource";
import generateCode from "./generateCode";
import { outputPath, bibles, defaultChapter } from "../config";

const publicBiblesPath = path.join(__dirname, "..", "..", outputPath);

Promise.all(
  bibles.map((bible: BibleInputConfig) => {
    const parseData = xml2json.getParser(bible.type);
    return readSource(path.join(bible.input || ""), bible.pathInArchive)
      .then(data => parseData(data, bible.id, bible.name, bible.lang))
      .then((bibleObj: BibleVersionContent) => {
        const pathOut = path.join(publicBiblesPath, bible.id);
        return xml2json.generate(pathOut, bibleObj);
      })
      .then(() => {
        const biblesMap = bibles.reduce(
          (map, bible) => ({
            ...map,
            [bible.id]: {
              ...bible,
              // "un-define" config-specific fields
              input: undefined,
              pathInArchive: undefined,
              type: undefined
            }
          }),
          {}
        );
        return fs.writeFile(
          path.join(publicBiblesPath, "bibles.json"),
          JSON.stringify(biblesMap)
        );
      })
      .catch((err: Error) => {
        throw err;
      });
  })
)
  .then(() => {
    // console.log("The conversion finished successfully.");
  })
  .then(() => {
    const preBundledFile = "../initialDataGenerated.ts";
    return fs.writeFile(
      path.join(__dirname, preBundledFile),
      generateCode(publicBiblesPath, bibles, defaultChapter)
    );
  })
  .then(() => {
    // console.log("Code generated successfully.");
  })
  .catch(err => {
    throw err;
  });
