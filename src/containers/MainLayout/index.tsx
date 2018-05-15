import * as React from "react";
import { Chapter } from "@bible-reader/types";

import {
  BibleVersionsMap,
  PassageAddFunc,
  PassageChangeFunc,
  PassageCloseFunc
} from "../../types";

import PassageView from "../PassageView";

interface MainLayoutProps {
  bibles: BibleVersionsMap;
  passages: Chapter[];
  onPassageAdd: PassageAddFunc;
  onPassageChange: PassageChangeFunc;
  onPassageClose: PassageCloseFunc;
}

class MainLayout extends React.Component<MainLayoutProps> {
  props: MainLayoutProps;

  render() {
    const {
      bibles,
      passages,
      onPassageAdd,
      onPassageChange,
      onPassageClose
    } = this.props;

    return (
      <div className="container">
        <div className="toolbar">
          <div className="header">
            <header>
              <h1>Scripture App</h1>
            </header>
          </div>
        </div>
        <div className="content">
          <div className="main">
            {passages.map(
              (
                { versionId, book, chapter, verses }: Chapter,
                index: number
              ) => (
                <PassageView
                  key={`${versionId}_${book}_${chapter}_${index}`}
                  allVersionIds={Object.keys(bibles)}
                  versionId={versionId}
                  book={book}
                  chapter={chapter}
                  v11n={bibles[versionId].v11n}
                  verses={verses}
                  onPassageChange={(
                    versionId: string,
                    book: string,
                    chapter: number
                  ) => onPassageChange(index, versionId, book, chapter)}
                  onPassageClose={() => onPassageClose(index)}
                />
              )
            )}
            <div className="PassageView add-passage">
              <button onClick={onPassageAdd}>Add</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default MainLayout;
