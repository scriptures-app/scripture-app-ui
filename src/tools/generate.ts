import { fs } from "mz";
import * as path from "path";
import { BibleVersionContent } from "@bible-reader/types";
import * as xml2json from "@bible-reader/bible-converter";

import { BibleInputConfig, BiblesHashes } from "../types";
import readSource from "./readSource";
import generateCode from "./generateCode";
import { outputPath, bibles, defaultChapter } from "../config";
import { getProgressBars } from "./progressBars";

const { getHash } = xml2json;

const publicBiblesPath = path.join(__dirname, "..", "..", outputPath);

const progressbars = getProgressBars(bibles);

const biblesHashes: BiblesHashes = {};

let biblesJsonHash = "";

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
        biblesHashes[bible.id] = {};
        biblesHashes[bible.id].allHash = getHash(JSON.stringify(bibleObj));
        biblesHashes[bible.id].v11nHash = getHash(
          JSON.stringify(bibleObj.v11n)
        );
        return xml2json.generate(
          pathOut,
          bibleObj,
          updateProgressCallback.bind(null, bible.id)
        );
      })
      .then(descriptorHash => {
        if (descriptorHash) {
          biblesHashes[bible.id].descriptorHash = descriptorHash;
        }
      })
      .catch((err: Error) => {
        throw err;
      });
  })
)
  .then(() => {
    const biblesMap = bibles.reduce(
      (map, bible) => ({
        ...map,
        [bible.id]: {
          ...bible,
          hashes: biblesHashes[bible.id],
          // "un-define" config-specific fields
          input: undefined,
          pathInArchive: undefined,
          type: undefined
        }
      }),
      {}
    );
    const biblesMapPayload = JSON.stringify(biblesMap);
    biblesJsonHash = getHash(biblesMapPayload);
    return fs.writeFile(
      path.join(publicBiblesPath, `bibles.${biblesJsonHash}.json`),
      biblesMapPayload
    );
  })
  .then(() => {
    // console.log("The conversion finished successfully.");
  })
  .then(() => {
    const preBundledFile = "../initialDataGenerated.ts";
    return fs.writeFile(
      path.join(__dirname, preBundledFile),
      generateCode(
        publicBiblesPath,
        bibles,
        defaultChapter,
        biblesJsonHash,
        biblesHashes
      )
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
