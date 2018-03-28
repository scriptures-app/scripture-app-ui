import * as React from "react";
import Downshift, { StateChangeOptions } from "downshift";

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
  inputValue: string;
  isOpen: boolean;
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
      selectedChapter: props.chapter,
      inputValue: `${props.book} ${props.chapter}`,
      isOpen: false
    };
  }

  onChange = (selectedItem: string) => {
    if (this.state.beingSelected === SelectionType.BOOK) {
      this.setState({
        beingSelected: SelectionType.CHAPTER,
        selectedBook: selectedItem,
        inputValue: selectedItem,
        isOpen: true
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

  onInputValueChange = (inputValue: string, isOpen: boolean) => {
    if (inputValue.indexOf(this.state.selectedBook) !== 0) {
      this.setState(oldState => ({
        ...oldState,
        beingSelected: SelectionType.BOOK
      }));
    }
    this.setState(oldState => ({
      ...oldState,
      inputValue,
      isOpen
    }));
  };

  onBlur = () => {
    this.setState(oldState => ({
      beingSelected: SelectionType.CHAPTER,
      selectedBook: this.props.book,
      selectedChapter: this.props.chapter,
      inputValue: `${this.props.book} ${this.props.chapter}`
    }));
  };

  onDownshiftStateChange = (changes: StateChangeOptions) => {
    switch (changes.type) {
      case Downshift.stateChangeTypes.changeInput:
        this.onInputValueChange(changes.inputValue, changes.isOpen);
        break;
      case Downshift.stateChangeTypes.blurInput:
      case Downshift.stateChangeTypes.mouseUp:
        this.onBlur();
        break;
      default:
    }
  };

  render() {
    const { v11n } = this.props;
    const { selectedBook, beingSelected, isOpen, inputValue } = this.state;

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
        isOpen={isOpen}
        inputValue={inputValue}
        onStateChange={this.onDownshiftStateChange}
        onChange={this.onChange}
        render={({
          getInputProps,
          getItemProps,
          isOpen,
          inputValue,
          selectedItem,
          highlightedIndex
        }) => (
          <span>
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
          </span>
        )}
      />
    );
  }
}
