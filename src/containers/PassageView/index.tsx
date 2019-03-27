import * as React from "react";
import { Versification } from "@bible-reader/types";
import { getPreviousChapter, getNextChapter } from "@bible-reader/v11n-utils";

import { PassageChangeFuncCurried, PassageCloseFuncCurried } from "../../types";

import PassageNavigation from "../../components/PassageNavigation";
import { PassagePreviousNextButtons } from "../../components/PassagePreviousNextButtons";
import ShadowScrollbar from "../ShadowScrollbar";

import "./PassageView.css";

interface PassageViewProps {
  allVersionIds: string[];
  versionId: string;
  book: string;
  chapter: number;
  v11n: Versification;
  verses: string[];
  onPassageChange: PassageChangeFuncCurried;
  onPassageClose: PassageCloseFuncCurried;
  loading: boolean;
}

export class PassageView extends React.Component<PassageViewProps> {
  getPassageViewContent = (verses: string[]) => {
    const { v11n, book, chapter, versionId } = this.props;
    const previousChapterRef = getPreviousChapter(v11n, {
      book,
      chapter
    });
    const nextChapterRef = getNextChapter(v11n, { book, chapter });

    // curry versionId parameter
    const onPassageChange = (book: string, chapter: number) =>
      this.props.onPassageChange(versionId, book, chapter);

    return (
      <>
        {verses.map((text, index) => (
          <p key={index + 1}>
            <sup>{index + 1}</sup> {text}
          </p>
        ))}
        <PassagePreviousNextButtons
          nextChapterRef={nextChapterRef}
          previousChapterRef={previousChapterRef}
          onPassageChange={onPassageChange}
        />
      </>
    );
  };
  render() {
    const {
      allVersionIds,
      versionId,
      book,
      chapter,
      v11n,
      verses,
      onPassageChange,
      onPassageClose,
      loading
    } = this.props;
    return (
      <div className="PassageView">
        <div className="PassageView__passage">
          <div className="PassageView__header">
            <PassageNavigation
              allVersionIds={allVersionIds}
              versionId={versionId}
              book={book}
              chapter={chapter}
              v11n={v11n}
              onPassageChange={onPassageChange}
              onPassageClose={onPassageClose}
              loading={loading}
            />
          </div>
          <div className="PassageView__verses">
            <ShadowScrollbar autoHide style={{ height: "100%" }}>
              {this.getPassageViewContent(verses)}
            </ShadowScrollbar>
          </div>
        </div>
      </div>
    );
  }
}
