import * as React from "react";
import { Versification } from "@scripture-app/types";

import { PassageChangeFuncCurried, PassageCloseFuncCurried } from "../../types";

import ChapterSelect from "../../components/ChapterSelect";

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
  props: PassageNavigationProps;

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

    const numberOfChapters = v11n[book].length;

    return (
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
        <ChapterSelect
          defaultValue={book}
          items={Object.keys(v11n)}
          onChange={this.handleChange}
        />
        <select
          name="chapter"
          defaultValue={String(chapter)}
          onChange={this.handleChange}
        >
          {Array.from(Array(numberOfChapters).keys()).map(chapterNumber => (
            <option key={chapterNumber + 1}>{chapterNumber + 1}</option>
          ))}
        </select>
        <button onClick={this.handleClose}>⨯</button>
      </div>
    );
  }
}
