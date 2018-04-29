import * as React from "react";
import Downshift, { StateChangeOptions, DownshiftState } from "downshift";

import { Versification } from "@scripture-app/types";

import { bibleBookNames } from "../../lang/bibleBookNames.en";

interface ChapterSelectProps {
  book: string;
  chapter: number;
  v11n: Versification;
  onChange: (book: string, chapter: number) => void;
}

interface ListItem {
  value: string;
  text: string;
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

  onChange = (selectedItem: ListItem) => {
    if (this.state.beingSelected === SelectionType.BOOK) {
      this.setState({
        beingSelected: SelectionType.CHAPTER,
        selectedBook: selectedItem.value
      });
    } else {
      const book = this.state.selectedBook;
      const chapter = selectedItem.value
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
    if (inputValue.indexOf(bibleBookNames[this.state.selectedBook]) !== 0) {
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
      case Downshift.stateChangeTypes.keyDownEscape:
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
      case Downshift.stateChangeTypes.keyDownEscape:
        return {
          ...changes,
          inputValue: `${bibleBookNames[this.props.book]} ${this.props.chapter}`
        };
      default:
        return changes;
    }
  };

  render() {
    const { v11n } = this.props;
    const { selectedBook, beingSelected } = this.state;
    const defaultInputValue = `${bibleBookNames[this.props.book]} ${
      this.props.chapter
    }`;
    const defaultSelectedItem = {
      value: this.props.book,
      text: defaultInputValue
    };

    let items: ListItem[];

    if (beingSelected === SelectionType.CHAPTER) {
      const numberOfChapters = v11n[selectedBook].length;
      items = Array.from(Array(numberOfChapters).keys()).map(chapterNumber => ({
        value: `${selectedBook} ${chapterNumber + 1}`,
        text: `${bibleBookNames[selectedBook]} ${chapterNumber + 1}`
      }));
    } else {
      items = Object.keys(v11n).map(value => ({
        value,
        text: bibleBookNames[value]
      }));
    }

    return (
      <Downshift
        defaultSelectedItem={defaultSelectedItem}
        defaultInputValue={defaultInputValue}
        onStateChange={this.onDownshiftStateChange}
        stateReducer={this.downshiftStateReducer}
        onChange={this.onChange}
        itemToString={item => item.text}
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
                      i.text.toLowerCase().includes(inputValue.toLowerCase())
                  )
                  .map((item, index) => (
                    <div
                      {...getItemProps({ item })}
                      key={item.value}
                      style={{
                        backgroundColor:
                          highlightedIndex === index ? "gray" : "white",
                        fontWeight: selectedItem === item ? "bold" : "normal"
                      }}
                    >
                      {item.text}
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
