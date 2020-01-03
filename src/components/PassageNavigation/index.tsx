import * as React from "react";

import { PassageChangeFuncCurried, PassageCloseFuncCurried } from "../../types";

import ChapterSelect from "../../components/ChapterSelect";
import BibleVersionSelect from "../../components/BibleVersionSelect";

import "./PassageNavigation.css";

interface PassageNavigationProps {
  versionId: string;
  book: string;
  chapter: number;
  onPassageChange: PassageChangeFuncCurried;
  onPassageClose: PassageCloseFuncCurried;
  loading: boolean;
}

export default class PassageNavigation extends React.Component<
  PassageNavigationProps
> {
  onChapterChange = (book: string, chapter: number) => {
    this.props.onPassageChange(this.props.versionId, book, chapter);
  };

  onVersionChange = (versionId: string) => {
    this.props.onPassageChange(versionId, this.props.book, this.props.chapter);
  };

  handleClose = () => {
    this.props.onPassageClose();
  };

  render() {
    const { versionId, book, chapter }: PassageNavigationProps = this.props;

    return (
      <div className="PassageNavigation">
        <ChapterSelect
          book={book}
          chapter={chapter}
          versionId={versionId}
          onChange={this.onChapterChange}
          loading={this.props.loading}
        />
        <BibleVersionSelect
          versionId={versionId}
          onChange={this.onVersionChange}
        />
        <button
          className="PassageNavigation_close-button"
          onClick={this.handleClose}
          title="Close"
        >
          ⨯
        </button>
      </div>
    );
  }
}
