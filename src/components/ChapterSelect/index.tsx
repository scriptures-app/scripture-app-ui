import * as React from "react";
import Downshift from "downshift";

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
}

export default class ChapterSelect extends React.Component<
  ChapterSelectProps,
  ChapterSelectState
> {
  constructor(props: ChapterSelectProps) {
    super(props);
    this.state = {
      beingSelected: SelectionType.CHAPTER,
      selectedBook: props.book
    };
  }

  onChange = (selectedItem: string) => {
    if (this.state.beingSelected !== SelectionType.CHAPTER) {
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
      this.setState({
        beingSelected: SelectionType.BOOK
      });
    }
  };

  render() {
    const { chapter, v11n } = this.props;
    const { selectedBook, beingSelected } = this.state;

    let items: string[];
    const defaultValue = `${selectedBook} ${chapter}`;

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
        defaultSelectedItem={defaultValue}
        onChange={this.onChange}
        onInputValueChange={this.onInputValueChange}
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
