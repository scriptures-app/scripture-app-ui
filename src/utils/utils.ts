export function pad(n: string, width: number, z?: string) {
  z = z || "0";
  n += "";
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

export function buildChapterPath(
  bibleId: string,
  book: string,
  chapter: number
) {
  return `/bibles/${bibleId}/${book}/ch${pad(String(chapter), 3)}.json`;
}

export default {
  pad,
  buildChapterPath
};
