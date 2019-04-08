import * as React from "react";

import { PassageChangeFuncCurried, PassageCloseFuncCurried } from "../../types";

import PassageNavigation from "../../components/PassageNavigation";
import { PassagePreviousNextButtons } from "../../components/PassagePreviousNextButtons";
import ShadowScrollbar from "../ShadowScrollbar";

import "./PassageView.css";

interface PassageViewProps {
  versionId: string;
  book: string;
  chapter: number;
  verses: string[];
  onPassageChange: PassageChangeFuncCurried;
  onPassageClose: PassageCloseFuncCurried;
  loading: boolean;
}

export class PassageView extends React.Component<PassageViewProps> {
  getPassageViewContent = (verses: string[]) => {
    const { book, chapter, versionId } = this.props;

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
          book={book}
          chapter={chapter}
          versionId={versionId}
          onPassageChange={onPassageChange}
        />
      </>
    );
  };
  render() {
    const {
      versionId,
      book,
      chapter,
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
              versionId={versionId}
              book={book}
              chapter={chapter}
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
