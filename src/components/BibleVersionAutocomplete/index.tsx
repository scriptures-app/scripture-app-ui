import * as React from "react";
import Downshift, {
  StateChangeOptions,
  DownshiftState,
  GetItemPropsOptions
} from "downshift";

import "./BibleVersionAutocomplete.css";

import { bibles } from "../../config";
const versionsData = bibles.reduce((data, bible) => {
  return {
    ...data,
    [bible.id]: {
      id: bible.id,
      lang: bible.lang,
      name: bible.name
    }
  };
}, {});

interface ListItem {
  value: string;
  text: string;
}

interface BibleVersionAutocompleteProps {
  allVersionIds: string[];
  versionId: string;
  onChange: (versionId: string) => void;
}

export default class BibleVersionAutocomplete extends React.Component<
  BibleVersionAutocompleteProps,
  {}
> {
  onChange = (selectedItem: ListItem) => {
    this.props.onChange(selectedItem.value);
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
      default:
        return changes;
    }
  };

  renderList = (
    items: ListItem[],
    inputValue: string | null,
    highlightedIndex: number | null,
    getItemProps: (options: GetItemPropsOptions) => {}
  ) => {
    const list = items
      .filter(
        item =>
          !inputValue ||
          item.text.toLowerCase().includes(inputValue.toLowerCase()) ||
          versionsData[item.value].name
            .toLowerCase()
            .includes(inputValue.toLocaleLowerCase())
      )
      .map((item, index) => (
        <div
          {...getItemProps({ item })}
          className="BibleVersionAutocomplete__list-item"
          key={item.value}
          style={{
            backgroundColor: highlightedIndex === index ? "gray" : "white",
            fontWeight: this.props.versionId === item.value ? "bold" : "normal"
          }}
        >
          {item.text}
        </div>
      ));
    if (list.length === 0) {
      return (
        <div className="BibleVersionAutocomplete__list-item">
          No items satisfy the filter
        </div>
      );
    }
    return list;
  };

  render() {
    const { allVersionIds } = this.props;

    // e.g. items = [{ value: "kjv", text: "KJV" }, { value: "bkr", text: "BKR" }, ... ]
    const items = allVersionIds.map(value => ({
      value,
      text: value.toUpperCase()
    }));

    return (
      <Downshift
        onChange={this.onChange}
        isOpen
        stateReducer={this.downshiftStateReducer}
        render={({
          getInputProps,
          getItemProps,
          isOpen,
          inputValue,
          selectedItem,
          highlightedIndex
        }) => (
          <div className="BibleVersionAutocomplete">
            <input
              {...getInputProps({ placeholder: "Version" })}
              className="BibleVersionAutocomplete__input"
            />
            {isOpen ? (
              <div className="BibleVersionAutocomplete__list">
                {this.renderList(
                  items,
                  inputValue,
                  highlightedIndex,
                  getItemProps
                )}
              </div>
            ) : null}
          </div>
        )}
      />
    );
  }
}
