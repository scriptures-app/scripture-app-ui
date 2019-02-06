import * as React from "react";

import {
  AppState,
  PassageCloseCreatorFunc,
  PassageChangeCreatorFunc,
  StateReducerFunc,
  PassageAddFunc
} from "./types";
import { buildChapterPath } from "./utils/utils";
import initialData from "./initialDataGenerated";
const { bibles, defaultPassage } = initialData;

import MainLayout from "./containers/MainLayout";

class App extends React.Component<{}, AppState> {
  state: AppState;

  constructor(props: {}) {
    super(props);
    this.state = {
      passages: [{ ...defaultPassage, loading: false }]
    };
    this.changePassage = this.changePassage.bind(this);
    this.closePassage = this.closePassage.bind(this);
    this.addPassage = this.addPassage.bind(this);
  }

  isPassageValid(versionId: string, book: string, chapter: number) {
    return (
      chapter > 0 &&
      bibles[versionId] !== undefined &&
      bibles[versionId].v11n[book] !== undefined &&
      bibles[versionId].v11n[book][chapter - 1] > 0
    );
  }

  getPassageFromLocalStorage(versionId: string, book: string, chapter: number) {
    // return localStorage.getItem(`${versionId}/${book}/${chapter}`);
    return [];
  }

  changePassageReducer: PassageChangeCreatorFunc = (
    passageIndex: number,
    versionId: string,
    book: string,
    chapter: number,
    verses: string[],
    loading: boolean
  ) => ({ passages }: AppState) => ({
    passages: [
      ...passages.slice(0, passageIndex),
      { versionId, book, chapter, verses, loading },
      ...passages.slice(passageIndex + 1, passages.length)
    ]
  });

  async changePassage(
    passageIndex: number,
    versionId: string,
    book: string,
    chapter: number
  ) {
    // console.log("Changing to ", { passageIndex, versionId, book, chapter });
    this.setState(({ passages }) => ({
      passages: [
        ...passages.slice(0, passageIndex),
        { ...passages[passageIndex], loading: true },
        ...passages.slice(passageIndex + 1, passages.length)
      ]
    }));

    if (this.isPassageValid(versionId, book, chapter)) {
      const verses = this.getPassageFromLocalStorage(versionId, book, chapter);
      const booksHashes = bibles[versionId].hashes.booksHashes;
      const bookHash =
        booksHashes && booksHashes[book] ? booksHashes[book] : "";
      if (!verses.length) {
        const urlPath = await buildChapterPath(
          versionId,
          book,
          chapter,
          bookHash
        );
        try {
          const response = await fetch(urlPath);
          const data = await response.json();
          this.setState(
            this.changePassageReducer(
              passageIndex,
              versionId,
              book,
              chapter,
              data.verses || [],
              false
            )
          );
        } catch (err) {
          throw err;
        }
      } else {
        this.setState(
          this.changePassageReducer(
            passageIndex,
            versionId,
            book,
            chapter,
            verses,
            false
          )
        );
      }
    }
  }

  closePassageReducer: PassageCloseCreatorFunc = (passageIndex: number) => ({
    passages
  }: AppState) => ({
    passages: [
      ...passages.slice(0, passageIndex),
      ...passages.slice(passageIndex + 1, passages.length)
    ]
  });

  closePassage(passageIndex: number) {
    this.setState(this.closePassageReducer(passageIndex));
  }

  addPassageReducer: StateReducerFunc = ({ passages }: AppState) => ({
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
