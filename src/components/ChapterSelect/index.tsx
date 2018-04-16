import * as React from "react";
import Downshift, { StateChangeOptions, DownshiftState } from "downshift";

import { Versification } from "@scripture-app/types";

interface ChapterSelectProps {
  book: string;
  chapter: number;
  v11n: Versification;
  onChange: (book: string, chapter: number) => void;
}

enum SelectionType {
  BOOK,
  CHAPTER
}

interface ChapterSelectState {
  beingSelected: SelectionType;
  selectedBook: string;
  selectedChapter: number;
}

export default class ChapterSelect extends React.Component<
  ChapterSelectProps,
  ChapterSelectState
> {
  constructor(props: ChapterSelectProps) {
    super(props);
    this.state = {
      beingSelected: SelectionType.CHAPTER,
      selectedBook: props.book,
      selectedChapter: props.chapter
    };
  }

  onChange = (selectedItem: string) => {
    if (this.state.beingSelected === SelectionType.BOOK) {
      this.setState({
        beingSelected: SelectionType.CHAPTER,
        selectedBook: selectedItem
      });
    } else {
      const book = this.state.selectedBook;
      const chapter = selectedItem
        .trim()
        .slice(book.length)
        .trim();

      const chapterNumber = parseInt(chapter, 10);
      if (chapterNumber && chapterNumber > 0) {
        this.props.onChange(this.state.selectedBook, chapterNumber);
      }
    }
  };

  onInputValueChange = (inputValue: string) => {
    if (inputValue.indexOf(this.state.selectedBook) !== 0) {
      this.setState(oldState => ({
        ...oldState,
        beingSelected: SelectionType.BOOK
      }));
    }
  };

  onBlur = () => {
    this.setState(oldState => ({
      beingSelected: SelectionType.CHAPTER,
      selectedBook: this.props.book,
      selectedChapter: this.props.chapter
    }));
  };

  onDownshiftStateChange = (changes: StateChangeOptions) => {
    switch (changes.type) {
      case Downshift.stateChangeTypes.changeInput:
        this.onInputValueChange(changes.inputValue);
        break;
      case Downshift.stateChangeTypes.blurInput:
      case Downshift.stateChangeTypes.mouseUp:
        this.onBlur();
        break;
      default:
    }
  };

  downshiftStateReducer = (
    state: DownshiftState,
    changes: StateChangeOptions
  ): StateChangeOptions => {
    switch (changes.type) {
      case Downshift.stateChangeTypes.changeInput:
        return {
          ...changes,
          highlightedIndex: 0
        };
      case Downshift.stateChangeTypes.keyDownEnter:
      case Downshift.stateChangeTypes.clickItem:
        return {
          ...changes,
          isOpen: this.state.beingSelected === SelectionType.BOOK,
          highlightedIndex:
            this.state.beingSelected === SelectionType.BOOK
              ? 0
              : state.highlightedIndex || 0
        };
      case Downshift.stateChangeTypes.blurInput:
      case Downshift.stateChangeTypes.mouseUp:
        return {
          ...changes,
          inputValue: `${this.props.book} ${this.props.chapter}`
        };
      default:
        return changes;
    }
  };

  render() {
    const { v11n } = this.props;
    const { selectedBook, beingSelected } = this.state;
    const defaultInputValue = `${this.props.book} ${this.props.chapter}`;

    let items: string[];

    if (beingSelected === SelectionType.CHAPTER) {
      const numberOfChapters = v11n[selectedBook].length;
      items = Array.from(Array(numberOfChapters).keys()).map(
        chapterNumber => `${selectedBook} ${chapterNumber + 1}`
      );
    } else {
      items = Object.keys(v11n);
    }

    return (
      <Downshift
        defaultInputValue={defaultInputValue}
        onStateChange={this.onDownshiftStateChange}
        stateReducer={this.downshiftStateReducer}
        onChange={this.onChange}
        render={({
          getInputProps,
          getItemProps,
          isOpen,
          inputValue,
          selectedItem,
          highlightedIndex
        }) => (
          <div>
            <input {...getInputProps({ placeholder: "Book" })} />
            {isOpen ? (
              <div style={{ border: "1px solid #ccc" }}>
                {items
                  .filter(
                    i =>
                      !inputValue ||
                      i.toLowerCase().includes(inputValue.toLowerCase())
                  )
                  .map((item, index) => (
                    <div
                      {...getItemProps({ item })}
                      key={item}
                      style={{
                        backgroundColor:
                          highlightedIndex === index ? "gray" : "white",
                        fontWeight: selectedItem === item ? "bold" : "normal"
                      }}
                    >
                      {item}
                    </div>
                  ))}
              </div>
            ) : null}
          </div>
        )}
      />
    );
  }
}
