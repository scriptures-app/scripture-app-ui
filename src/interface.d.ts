interface IBibleStats {
  [key: string]: number[];
}

interface IBibleObject {
  id: string;
  lang: string;
  name: string;
  short: string;
  stats: IBibleStats;
}

interface IChapter {
  verses: string[];
}

interface IBook {
  slug: string;
  name: string;
  chapters: Array<IChapter>;
}

interface IBibleBooks {
  [key: string]: IBook;
}

interface IAppProps {}

interface IAppState {
  passages: Array<IPassage>;
}

interface IPassageCoords {
  bibleId: string;
  book: string;
  chapter: number;  
}

interface IPassage {
  bibleId: string;
  book: string;
  chapter: number;
  verses: Array<string>;
}

interface StateReducerFunc {
  (state: IAppState): IAppState;
}

interface StateReducerCreatorFunc {
  (...args: any[]): StateReducerFunc;
}

interface PassageAddFunc {
  (): void;
}

interface PassageChangeFunc {
  (index: number, bibleId: string, book: string, chapter: number): void;
}
interface PassageChangeFuncCurried {
  (bibleId: string, book: string, chapter: number): void;
}

interface PassageCloseFunc {
  (index: number): void;
}
interface PassageCloseFuncCurried {
  (): void;
}
