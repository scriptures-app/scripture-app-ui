import { BibleVersion, Chapter } from "@bible-reader/types";

export interface AppState {
  passages: Chapter[];
}

export interface BibleVersionWithHashes extends BibleVersion {
  hashes: BibleHashes;
}

export interface BibleVersionsMap {
  [bibleId: string]: BibleVersionWithHashes;
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
  verses: string[],
  loading: boolean
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

type Hash = string;

interface BibleHashes {
  allHash?: Hash;
  v11nHash?: Hash;
  booksHashes?: {
    [bookId: string]: Hash;
  };
}

export interface BiblesHashes {
  [bibleId: string]: BibleHashes;
}
