import * as React from "react";
import { Chapter } from "@bible-reader/types";

import { buildChapterPath } from "../../utils/utils";
import {
  AppState,
  BibleVersionsMap,
  PassageChangeFunc,
  PassageAddFunc,
  PassageCloseFunc,
  PassageChangeActivePassageFunc
} from "../../types";

import {
  changePassageReducer,
  closePassageReducer,
  addPassageReducer
} from "./reducers";

interface ContextValue extends AppState {
  onChangePassage: PassageChangeFunc;
  onAddPassage: PassageAddFunc;
  onClosePassage: PassageCloseFunc;
  onChangeActivePassage: PassageChangeActivePassageFunc;
}

interface AppStateProviderProps {
  defaultPassage: Chapter;
  bibles: BibleVersionsMap;
  loadBibleVersionDescriptor: (versionId: string) => Promise<void>;
}

const { Provider, Consumer } = React.createContext<ContextValue>({
  passages: [],
  activePassage: 0,
  onAddPassage: () => null,
  onChangePassage: () => null,
  onClosePassage: () => null,
  onChangeActivePassage: () => null
});

class AppStateProvider extends React.Component<
  AppStateProviderProps,
  AppState
> {
  state: AppState;

  constructor(props: AppStateProviderProps) {
    super(props);
    this.state = {
      activePassage: 0,
      passages: [{ ...props.defaultPassage, loading: false }]
    };
  }

  isPassageValid(versionId: string, book: string, chapter: number) {
    const { bibles } = this.props;
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

  changePassage = async (
    passageIndex: number,
    versionId: string,
    book: string,
    chapter: number
  ) => {
    // console.log("Changing to ", { passageIndex, versionId, book, chapter });

    this.setState(({ passages }) => ({
      passages: [
        ...passages.slice(0, passageIndex),
        { ...passages[passageIndex], loading: true },
        ...passages.slice(passageIndex + 1, passages.length)
      ]
    }));

    await this.props.loadBibleVersionDescriptor(versionId);

    // It is essential to do this assignment after the previous await call
    // chapterHashes would be undefined otherwise
    const { bibles } = this.props;

    if (this.isPassageValid(versionId, book, chapter)) {
      const verses = this.getPassageFromLocalStorage(versionId, book, chapter);

      const chaptersHashes = bibles[versionId].hashes.chaptersHashes;

      if (!verses.length && chaptersHashes) {
        const urlPath = buildChapterPath(
          versionId,
          book,
          chapter,
          chaptersHashes[book][chapter - 1]
        );
        try {
          const response = await fetch(urlPath);
          const data = await response.json();
          this.setState(
            changePassageReducer(
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
          changePassageReducer(
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
  };

  addPassage = () => {
    this.setState(addPassageReducer(this.props.defaultPassage));
  };

  closePassage = (passageIndex: number) => {
    this.setState(closePassageReducer(passageIndex));
  };

  changeActivePassage = (passageIndex: number) => {
    this.setState(prevState => ({ ...prevState, activePassage: passageIndex }));
  };

  render() {
    return (
      <Provider
        value={{
          ...this.state,
          onAddPassage: this.addPassage,
          onChangePassage: this.changePassage,
          onClosePassage: this.closePassage,
          onChangeActivePassage: this.changeActivePassage
        }}
      >
        {this.props.children}
      </Provider>
    );
  }
}

export { AppStateProvider as Provider, Consumer };
