import { Chapter } from "@bible-reader/types";

import {
  PassageCloseCreatorFunc,
  PassageChangeCreatorFunc,
  AppState,
  PassageAddCreatorFunc
} from "../../types";

export const changePassageReducer: PassageChangeCreatorFunc = (
  passageIndex: number,
  versionId: string,
  book: string,
  chapter: number,
  verses: string[],
  loading: boolean
) => (prevState: AppState) => ({
  ...prevState,
  passages: [
    ...prevState.passages.slice(0, passageIndex),
    { versionId, book, chapter, verses, loading },
    ...prevState.passages.slice(passageIndex + 1, prevState.passages.length)
  ]
});

export const closePassageReducer: PassageCloseCreatorFunc = (
  passageIndex: number
) => ({ passages, activePassage }: AppState) => ({
  activePassage:
    activePassage === passageIndex && passageIndex > 0
      ? activePassage - 1
      : activePassage,
  passages: [
    ...passages.slice(0, passageIndex),
    ...passages.slice(passageIndex + 1, passages.length)
  ]
});

export const addPassageReducer: PassageAddCreatorFunc = (
  defaultPassage: Chapter
) => (prevState: AppState) => ({
  ...prevState,
  activePassage: prevState.passages.length,
  passages: [...prevState.passages, defaultPassage]
});
