import * as React from "react";
import MediaQuery from "react-responsive";
import * as ReactSwipe from "react-swipe";

import "./MainLayout.css";

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

interface MainLayoutState {
  passageIndex: number;
}

class MainLayout extends React.Component<MainLayoutProps, MainLayoutState> {
  props: MainLayoutProps;
  state = {
    passageIndex: 0
  };
  reactSwipe: ReactSwipe | null;

  changeActivePassage = (index: number) => {
    this.setState({ passageIndex: index });
  };

  renderPassages = (wrapInDiv = false) => {
    const { bibles, passages, onPassageChange } = this.props;

    return passages.map(
      (
        { versionId, book, chapter, verses, loading }: Chapter,
        index: number
      ) => {
        const v11n = bibles[versionId].v11n;
        const passage = (
          <PassageView
            key={`${versionId}_${book}_${chapter}_${index}`}
            allVersionIds={Object.keys(bibles)}
            versionId={versionId}
            book={book}
            chapter={chapter}
            v11n={v11n}
            verses={verses}
            onPassageChange={(
              versionId: string,
              book: string,
              chapter: number
            ) => onPassageChange(index, versionId, book, chapter)}
            onPassageClose={() => this.handlePassageClose(index)}
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

  handlePassageAdd = () => {
    this.setState({ passageIndex: this.props.passages.length });
    this.props.onPassageAdd();
  };

  handlePassageClose = (index: number) => {
    if (index > 0) {
      this.setState(({ passageIndex }) => ({
        passageIndex: passageIndex - 1
      }));
    }
    this.props.onPassageClose(index);
  };

  handlePassageNavigate = (index: number) => {
    const transitionSpeed = 300; // miliseconds
    if (this.reactSwipe) {
      this.reactSwipe.slide(index, transitionSpeed);
    }
  };

  render() {
    const { passages } = this.props;

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

    const columnsClass = `passages_${
      passages.length < 6 ? passages.length : "many"
    }_columns`;

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
          <div className={`main ${columnsClass}`}>
            <MediaQuery query="(min-device-width: 826px)">
              {this.renderPassages(false)}
              <div
                onClick={this.handlePassageAdd}
                className="PassageView add-passage"
                title="Open new passage"
                aria-label="Open new passage"
                role="button"
                tabIndex={0}
              >
                +
              </div>
            </MediaQuery>
            <MediaQuery query="(max-device-width: 825px)">
              <ReactSwipe
                ref={element => {
                  this.reactSwipe = element;
                }}
                key={passages.length}
                swipeOptions={{
                  startSlide: this.state.passageIndex,
                  continuous: false,
                  callback: this.changeActivePassage
                }}
                style={swipeStyles}
              >
                {this.renderPassages(true)}
              </ReactSwipe>
            </MediaQuery>
          </div>
        </div>
        <MediaQuery query="(max-device-width: 825px)">
          {passages.length > 1 && (
            <PassagesNavbar
              activePassageIndex={this.state.passageIndex}
              passages={passages.map(({ versionId, book, chapter }) => ({
                versionId,
                book,
                chapter
              }))}
              onPassageAdd={this.handlePassageAdd}
              onPassageNavigate={this.handlePassageNavigate}
            />
          )}
          {passages.length <= 1 && (
            <div onClick={this.handlePassageAdd} className="fixed-add-button">
              +
            </div>
          )}
        </MediaQuery>
      </div>
    );
  }
}

export default MainLayout;
