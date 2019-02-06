export function pad(n: string, width: number, z?: string) {
  z = z || "0";
  n += "";
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

export async function buildChapterPath(
  bibleId: string,
  book: string,
  chapter: number,
  bookHash: string
) {
  let chapterHash = "";
  try {
    const response = await fetch(
      `/bibles/${bibleId}/${book}/hashfile.${bookHash}.json`
    );
    const data = await response.json();
    chapterHash = data[chapter - 1];
  } catch (err) {
    throw err;
  }

  return `/bibles/${bibleId}/${book}/ch${pad(
    String(chapter),
    3
  )}.${chapterHash}.json`;
}

export default {
  pad,
  buildChapterPath
};
