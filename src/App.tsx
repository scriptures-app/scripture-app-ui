import * as React from "react";
import MainLayout from "./containers/MainLayout";
import { buildChapterPath } from "./utils/utils";

import initialData from "./initialDataGenerated";
const { bibles, defaultPassage } = initialData;

class App extends React.Component<IAppProps, IAppState> {
  state: IAppState;

  constructor(props: IAppProps) {
    super(props);
    this.state = {
      passages: [defaultPassage]
    };
    this.changePassage = this.changePassage.bind(this);
    this.closePassage = this.closePassage.bind(this);
    this.addPassage = this.addPassage.bind(this);
  }

  isPassageValid(bibleId: string, book: string, chapter: number) {
    return (
      chapter > 0 &&
      bibles[bibleId] !== undefined &&
      bibles[bibleId].stats[book] !== undefined &&
      bibles[bibleId].stats[book][chapter - 1] > 0
    );
  }

  getPassageFromLocalStorage(bibleId: string, book: string, chapter: number) {
    // return localStorage.getItem(`${bibleId}/${book}/${chapter}`);
    return [];
  }

  changePassageReducer: StateReducerCreatorFunc = (
    passageIndex: number,
    bibleId: string,
    book: string,
    chapter: number,
    verses: string[]
  ) => ({ passages }: IAppState) => ({
    passages: [
      ...passages.slice(0, passageIndex),
      { bibleId, book, chapter, verses },
      ...passages.slice(passageIndex + 1, passages.length)
    ]
  });

  changePassage(
    passageIndex: number,
    bibleId: string,
    book: string,
    chapter: number
  ) {
    console.log("Changing to ", { passageIndex, bibleId, book, chapter });

    if (this.isPassageValid(bibleId, book, chapter)) {
      const verses = this.getPassageFromLocalStorage(bibleId, book, chapter);
      if (!verses.length) {
        const urlPath = buildChapterPath(bibleId, book, chapter);
        fetch(urlPath)
          .then(response => {
            return response.json();
          })
          .then(data => {
            this.setState(
              this.changePassageReducer(
                passageIndex,
                bibleId,
                book,
                chapter,
                data.verses || []
              )
            );
          })
          .catch(err => {
            throw err;
          });
      } else {
        this.setState(
          this.changePassageReducer(
            passageIndex,
            bibleId,
            book,
            chapter,
            verses
          )
        );
      }
    }
  }

  closePassageReducer: StateReducerCreatorFunc = (passageIndex: number) => ({
    passages
  }) => ({
    passages: [
      ...passages.slice(0, passageIndex),
      ...passages.slice(passageIndex + 1, passages.length)
    ]
  });

  closePassage(passageIndex: number) {
    this.setState(this.closePassageReducer(passageIndex));
  }

  addPassageReducer: StateReducerFunc = ({ passages }) => ({
    passages: [...passages, defaultPassage]
  });

  addPassage: PassageAddFunc = () => {
    this.setState(this.addPassageReducer);
  };

  render() {
    return (
      <MainLayout
        bibles={bibles}
        passages={this.state.passages}
        onPassageChange={this.changePassage}
        onPassageClose={this.closePassage}
        onPassageAdd={this.addPassage}
      />
    );
  }
}

export default App;
