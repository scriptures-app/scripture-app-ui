import * as React from "react";
import MediaQuery from "react-responsive";
import * as ReactSwipe from "react-swipe";

import { Chapter } from "@bible-reader/types";

import {
  BibleVersionsMap,
  PassageAddFunc,
  PassageChangeFunc,
  PassageCloseFunc
} from "../../types";

import PassageView from "../PassageView";
import { PassagesNavbar } from "../PassagesNavbar";

interface MainLayoutProps {
  bibles: BibleVersionsMap;
  passages: Chapter[];
  onPassageAdd: PassageAddFunc;
  onPassageChange: PassageChangeFunc;
  onPassageClose: PassageCloseFunc;
}

class MainLayout extends React.Component<MainLayoutProps> {
  props: MainLayoutProps;

  renderPassages = (wrapInDiv = false) => {
    const { bibles, passages, onPassageChange, onPassageClose } = this.props;
    return passages.map(
      (
        { versionId, book, chapter, verses, loading }: Chapter,
        index: number
      ) => {
        const passage = (
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
            loading={loading}
          />
        );
        if (wrapInDiv) {
          return <div key={index}>{passage}</div>;
        } else {
          return passage;
        }
      }
    );
  };

  render() {
    const { passages, onPassageAdd } = this.props;

    const swipeStyles: ReactSwipe.Style = {
      // using default styles from react-swipe,
      // only height: 100% added to each
      container: {
        overflow: "hidden",
        visibility: "hidden",
        position: "relative",
        height: "100%"
      },

      wrapper: {
        overflow: "hidden",
        position: "relative",
        height: "100%"
      },

      child: {
        float: "left",
        width: "100%",
        position: "relative",
        transitionProperty: "transform",
        height: "100%"
      }
    };

    return (
      <div className="container">
        <div className="toolbar">
          <div className="header">
            <header>
              <h1>Bible Reader</h1>
            </header>
          </div>
        </div>
        <div className="content">
          <div className="main">
            <MediaQuery query="(min-device-width: 801px)">
              {this.renderPassages(false)}
              <div className="PassageView add-passage">
                <button onClick={onPassageAdd}>Add</button>
              </div>
            </MediaQuery>
            <MediaQuery query="(max-device-width: 800px)">
              <ReactSwipe
                key={passages.length}
                swipeOptions={{ continuous: false }}
                style={swipeStyles}
              >
                {this.renderPassages(true)}
              </ReactSwipe>
            </MediaQuery>
          </div>
        </div>
        <MediaQuery query="(max-device-width: 800px)">
          <PassagesNavbar
            passages={passages.map(({ versionId, book, chapter }) => ({
              versionId,
              book,
              chapter
            }))}
          />
        </MediaQuery>
      </div>
    );
  }
}

export default MainLayout;
