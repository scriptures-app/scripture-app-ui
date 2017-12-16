interface IPassageViewProps {
  allBibleIds: Array<string>,
  bibleId: string,
  book: string,
  chapter: number,
  stats: IBibleStats,
  verses: Array<string>,
  onPassageChange: PassageChangeFuncCurried,
  onPassageClose: PassageCloseFuncCurried
}
