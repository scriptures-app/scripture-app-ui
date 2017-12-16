import * as React from "react";

export default class PassageSelect extends React.Component<
  IPassageSelectProps,
  IPassageSelectState
> {
  props: IPassageSelectProps;

  constructor(props: IPassageSelectProps) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  handleChange(event: React.FormEvent<HTMLSelectElement | HTMLInputElement>) {
    const target = event.currentTarget;
    const name = target.name;
    const value = target.value;

    const currentPassage = {
      bibleId: this.props.bibleId,
      book: this.props.book,
      chapter: this.props.chapter
    };

    const newPassage = {
      ...currentPassage,
      [name]: value
    };

    this.props.onPassageChange(
      newPassage.bibleId,
      newPassage.book,
      newPassage.chapter
    );
  }

  handleClose() {
    this.props.onPassageClose();
  }

  render() {
    const {
      allBibleIds,
      bibleId,
      book,
      chapter,
      stats
    }: IPassageSelectProps = this.props;
    return (
      <div>
        <select
          name="bibleId"
          defaultValue={bibleId}
          onChange={this.handleChange}
        >
          {allBibleIds.map((bibleOption: string) =>
            <option key={bibleOption}>{bibleOption}</option>
          )}
        </select>
        <select name="book" defaultValue={book} onChange={this.handleChange}>
          {Object.keys(stats).map(bookId =>
            <option key={bookId}>{bookId}</option>
          )}
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
