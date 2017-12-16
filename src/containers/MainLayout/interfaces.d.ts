interface IMainLayoutProps {
  bibles: IBiblesMap;
  passages: Array<IPassage>;
  onPassageAdd: PassageAddFunc;
  onPassageChange: PassageChangeFunc;
  onPassageClose: PassageCloseFunc;
}

interface IBiblesMap {
  [bibleId: string]: IBibleObject;
}
