import * as Multiprogress from "multi-progress";

import { leftPad } from "./leftPad";

const progressbarFormat = ":id - :name (:lang) :bar :percent | :status";
var multiProgress = new Multiprogress();

interface Bible {
  id: string;
  lang: string;
  name: string;
  input: string;
  pathInArchive: string;
  type: string;
}

interface Progressbar {
  bar: ProgressBar;
  values: {
    id: string;
    lang: string;
    status: string;
    name: string;
  };
}

export function getProgressBars(bibles: Bible[]) {
  const progressbars: Progressbar[] = [];
  for (const { id, lang, name } of bibles) {
    const bar = multiProgress.newBar(progressbarFormat, {
      complete: "\u2588",
      incomplete: "\u2591",
      width: 40,
      total: 100,
      renderThrottle: 100
    });
    const values = {
      id: leftPad(id, 5, " "),
      lang: leftPad(lang, 2, " "),
      name: leftPad(name, 12, " "),
      status: "Waiting ..."
    };
    bar.update(0, values);
    progressbars[id] = {
      bar,
      values
    };
  }
  return progressbars;
}
