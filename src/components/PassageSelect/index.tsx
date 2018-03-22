import * as React from "react";
import { Versification } from "@scripture-app/types";

import { PassageChangeFuncCurried, PassageCloseFuncCurried } from "../../types";

interface PassageSelectProps {
  allVersionIds: string[];
  versionId: string;
  book: string;
  chapter: number;
  v11n: Versification;
  onPassageChange: PassageChangeFuncCurried;
  onPassageClose: PassageCloseFuncCurried;
}

export default class PassageSelect extends React.Component<
  PassageSelectProps,
  {}
> {
  props: PassageSelectProps;

  constructor(props: PassageSelectProps) {
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
    }: PassageSelectProps = this.props;
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
        <select name="book" defaultValue={book} onChange={this.handleChange}>
          {Object.keys(v11n).map(bookId => (
            <option key={bookId}>{bookId}</option>
          ))}
        </select>
        <input
          name="chapter"
          type="number"
          defaultValue={String(chapter)}
          onChange={this.handleChange}
        />
        <button onClick={this.handleClose}>⨯</button>
      </div>
    );
  }
}
