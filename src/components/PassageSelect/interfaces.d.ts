interface IPassageSelectProps {
  allBibleIds: Array<string>,  
  bibleId: string,
  book: string,
  chapter: number,
  stats: IBibleStats,
  onPassageChange: PassageChangeFuncCurried,
  onPassageClose: PassageCloseFuncCurried
}

interface IPassageSelectState {
}
