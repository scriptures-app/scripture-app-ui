import { BibleVersion, Chapter } from "@scripture-app/types";

export interface AppState {
  passages: Chapter[];
}

export interface BibleVersionsMap {
  [bibleId: string]: BibleVersion;
}

export interface BibleInputConfig {
  id: string;
  lang: string;
  name: string;
  input: string;
  pathInArchive?: string;
  type: string;
}

export type StateReducerFunc = (state: AppState) => AppState;

export type PassageAddFunc = () => void;

export type PassageChangeCreatorFunc = (
  passageIndex: number,
  versionId: string,
  book: string,
  chapter: number,
  verses: string[]
) => StateReducerFunc;

export type PassageChangeFunc = (
  index: number,
  versionId: string,
  book: string,
  chapter: number
) => void;

export type PassageChangeFuncCurried = (
  versionId: string,
  book: string,
  chapter: number
) => void;

export type PassageCloseCreatorFunc = (
  passageIndex: number
) => StateReducerFunc;

export type PassageCloseFunc = (index: number) => void;

export type PassageCloseFuncCurried = () => void;
