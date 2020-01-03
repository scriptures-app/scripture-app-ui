import { BibleVersion, Chapter } from "@bible-reader/types";

export interface AppState {
  passages: Chapter[];
  activePassage: number; // makes sense in mobile view when only one passage is in (swipable) view
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

export type PassageAddCreatorFunc = (
  defaultPassage: Chapter
) => StateReducerFunc;

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

export type PassageChangeActivePassageFunc = (index: number) => void;

export type PassageCloseFuncCurried = () => void;

type Hash = string;

interface BibleHashes {
  allHash?: Hash;
  v11nHash?: Hash;
  descriptorHash?: Hash;
  chaptersHashes?: {
    [book: string]: Hash[];
  };
}

export interface BiblesHashes {
  [bibleId: string]: BibleHashes;
}
