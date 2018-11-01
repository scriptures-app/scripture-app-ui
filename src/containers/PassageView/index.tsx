import * as React from "react";
import { Versification } from "@bible-reader/types";

import { PassageChangeFuncCurried, PassageCloseFuncCurried } from "../../types";

import PassageNavigation from "../../components/PassageNavigation";
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
  onPrevious: () => void;
  onNext: () => void;
  loading: boolean;
}

class PassageView extends React.Component<PassageViewProps> {
  getPassageViewContent = (verses: string[]) => {
    const versesComponents = verses.map((text, index) => (
      <p key={index + 1}>
        <sup>{index + 1}</sup> {text}
      </p>
    ));

    const previousNextChapter = (
      <div>
        <button onClick={this.props.onPrevious}>Previous</button>
        <button onClick={this.props.onNext}>Next</button>
      </div>
    );

    return [previousNextChapter, ...versesComponents, previousNextChapter];
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

export default PassageView;
