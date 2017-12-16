declare module "*config.json" {
  const config: IConfig;
  export default config;
  export const _outputPath: string;
  export const bibles: Array<IBibleInputConfig>;
  export const defaultChapter: IPassage;
}

interface IConfig {
  outputPath: string;
  bibles: Array<IBibleInputConfig>;
  defaultChapter: IPassage;
}

interface IBibleInputConfig {
  id: string;
  lang: string;
  name: string;
  short: string;
  input: string;
  pathInArchive?: string;
  type: string;
}

interface IBibleInputObject {
  name: string;
  books: IBibleBooks;
  stats: IBibleStats;
}
