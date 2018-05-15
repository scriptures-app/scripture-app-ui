import { ChapterReference } from "@bible-reader/types";

declare module "*config.json" {
  const config: Config;
  export default config;
  export const _outputPath: string;
  export const bibles: Array<BibleInputConfig>;
  export const defaultChapter: ChapterReference;
}

interface Config {
  outputPath: string;
  bibles: Array<BibleInputConfig>;
  defaultChapter: ChapterReference;
}

interface BibleInputConfig {
  id: string;
  lang: string;
  name: string;
  input: string;
  pathInArchive?: string;
  type: string;
}
