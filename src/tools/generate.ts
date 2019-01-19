import { fs } from "mz";
import * as path from "path";
import { BibleVersionContent } from "@bible-reader/types";
import * as xml2json from "@bible-reader/bible-converter";
import * as _cliProgress from "cli-progress";
import * as _colors from "colors";

import { leftPad } from "./leftPad";
import { BibleInputConfig } from "../types";
import readSource from "./readSource";
import generateCode from "./generateCode";
import { outputPath, bibles, defaultChapter } from "../config";

const publicBiblesPath = path.join(__dirname, "..", "..", outputPath);

const progressbarPreset = {
  ..._cliProgress.Presets.shades_classic,
  format:
    "{id} - {name} ({lang}) " +
    _colors.grey("{bar}") +
    " {percentage}% | {status}"
};

const progressbars = bibles.reduce((prev, { id, lang, name }) => {
  const bar = new _cliProgress.Bar({}, progressbarPreset);
  bar.start(100, 0, {
    id: leftPad(id, 5, " "),
    lang: leftPad(lang, 2, " "),
    name: leftPad(name, 12, " "),
    status: "Waiting ..."
  });
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
  progressbars[bibleId].update(Math.floor(100 * progress), { status });
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
