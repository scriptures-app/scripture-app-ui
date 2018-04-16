import * as React from "react";
import { Versification } from "@scripture-app/types";

import { PassageChangeFuncCurried, PassageCloseFuncCurried } from "../../types";

import ChapterSelect from "../../components/ChapterSelect";

import "./PassageNavigation.css";

interface PassageNavigationProps {
  allVersionIds: string[];
  versionId: string;
  book: string;
  chapter: number;
  v11n: Versification;
  onPassageChange: PassageChangeFuncCurried;
  onPassageClose: PassageCloseFuncCurried;
}

export default class PassageNavigation extends React.Component<
  PassageNavigationProps,
  {}
> {
  constructor(props: PassageNavigationProps) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  handleChange(event: React.FormEvent<HTMLSelectElement | HTMLInputElement>) {
    const target = event.currentTarget;
    const name = target.name;
    const value = target.value;

    const currentPassage = {
      versionId: this.props.versionId,
      book: this.props.book,
      chapter: this.props.chapter
    };

    const newPassage = {
      ...currentPassage,
      [name]: value
    };

    this.props.onPassageChange(
      newPassage.versionId,
      newPassage.book,
      newPassage.chapter
    );
  }

  onChapterChange = (book: string, chapter: number) => {
    this.props.onPassageChange(this.props.versionId, book, chapter);
  };

  handleClose() {
    this.props.onPassageClose();
  }

  render() {
    const {
      allVersionIds,
      versionId,
      book,
      chapter,
      v11n
    }: PassageNavigationProps = this.props;

    return (
      <div className="PassageNavigation">
        <ChapterSelect
          book={book}
          chapter={chapter}
          v11n={v11n}
          onChange={this.onChapterChange}
        />
        <div>
          <select
            name="versionId"
            defaultValue={versionId}
            onChange={this.handleChange}
          >
            {allVersionIds.map((bibleOption: string) => (
              <option key={bibleOption}>{bibleOption}</option>
            ))}
          </select>
        </div>
        <button onClick={this.handleClose}>⨯</button>
      </div>
    );
  }
}
