import { fs } from "mz";
import * as path from "path";
import { BibleVersionContent } from "@bible-reader/types";
import * as xml2json from "@bible-reader/bible-converter";

import { BibleInputConfig } from "../types";
import readSource from "./readSource";
import generateCode from "./generateCode";
import { outputPath, bibles, defaultChapter } from "../config";
import { getProgressBars } from "./progressBars";

const publicBiblesPath = path.join(__dirname, "..", "..", outputPath);

const progressbars = getProgressBars(bibles);

const updateProgressCallback = (
  bibleId: string,
  progress: number,
  status: string
) => {
  progressbars[bibleId].bar.update(progress, {
    ...progressbars[bibleId].values,
    status
  });
};

Promise.all(
  bibles.map((bible: BibleInputConfig) => {
    const parseData = xml2json.getParser(bible.type);
    return readSource(
      path.join(bible.input || ""),
      updateProgressCallback.bind(null, bible.id),
      bible.pathInArchive
    )
      .then(data =>
        parseData(
          data,
          bible.id,
          bible.name,
          bible.lang,
          updateProgressCallback.bind(null, bible.id)
        )
      )
      .then((bibleObj: BibleVersionContent) => {
        const pathOut = path.join(publicBiblesPath, bible.id);
        return xml2json.generate(
          pathOut,
          bibleObj,
          updateProgressCallback.bind(null, bible.id)
        );
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
        const biblesMapPayload = JSON.stringify(biblesMap);
        const biblesMapHash = xml2json.getHash(biblesMapPayload);
        return fs.writeFile(
          path.join(publicBiblesPath, `bibles.${biblesMapHash}.json`),
          biblesMapPayload
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
    let newLines = "";
    let count = 0;
    for (const id in progressbars) {
      progressbars[id].bar.terminate();
      newLines += "\n";
      count++;
    }
    console.log(newLines);
    console.log(
      `All data files for all ${count} Bible versions were generated successfully!\n`
    );
  })
  .catch(err => {
    throw err;
  });
