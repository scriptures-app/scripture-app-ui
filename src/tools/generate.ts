import { fs } from "mz";
import * as path from "path";
import { BibleVersionContent } from "@bible-reader/types";
import * as xml2json from "@bible-reader/bible-converter";
import * as _cliProgress from "cli-progress";

import { BibleInputConfig } from "../types";
import readSource from "./readSource";
import generateCode from "./generateCode";
import { outputPath, bibles, defaultChapter } from "../config";

const publicBiblesPath = path.join(__dirname, "..", "..", outputPath);

let stateBibles = bibles.reduce(
  (previous, { id, lang, name }) => ({
    ...previous,
    [id]: {
      id,
      lang,
      name,
      progress: -1,
      status: "Waiting ..."
    }
  }),
  {}
);

const progressbars = bibles.reduce((prev, { id }) => {
  const bar = new _cliProgress.Bar({}, _cliProgress.Presets.shades_classic);
  bar.start(100, 0);
  return {
    ...prev,
    [id]: bar
  };
}, {});

const handleUpdateProgress = (
  bibleId: string,
  progress: number,
  status: string
) => {
  stateBibles = {
    ...stateBibles,
    [bibleId]: {
      ...stateBibles[bibleId],
      progress,
      status
    }
  };
  progressbars[bibleId].update(Math.floor(100 * progress));
};

Promise.all(
  bibles.map((bible: BibleInputConfig) => {
    const parseData = xml2json.getParser(bible.type);
    return readSource(
      path.join(bible.input || ""),
      handleUpdateProgress.bind(null, bible.id),
      bible.pathInArchive
    )
      .then(data =>
        parseData(
          data,
          bible.id,
          bible.name,
          bible.lang,
          handleUpdateProgress.bind(null, bible.id)
        )
      )
      .then((bibleObj: BibleVersionContent) => {
        const pathOut = path.join(publicBiblesPath, bible.id);
        return xml2json.generate(
          pathOut,
          bibleObj,
          handleUpdateProgress.bind(null, bible.id)
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
    for (const id in progressbars) {
      progressbars[id].stop();
    }
  })
  .catch(err => {
    throw err;
  });
