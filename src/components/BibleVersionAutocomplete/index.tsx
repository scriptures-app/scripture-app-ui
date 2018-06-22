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
  /**
   * This does not get triggered when the selectedItem remains the same
   * See "case Downshift.stateChangeTypes.keyDownEnter" in downshiftStateReducer
   */
  onChange = (selectedItem: ListItem) => {
    this.props.onChange(selectedItem.value);
  };

  downshiftStateReducer = (
    state: DownshiftState,
    changes: StateChangeOptions
  ): StateChangeOptions => {
    switch (changes.type) {
      case Downshift.stateChangeTypes.keyDownEnter:
        // Enter was pressed, however, onChange was not triggered, as the value remains the same
        //  - we want to keep it the same and close the dropdown
        if (state.selectedItem === null) {
          this.props.onChange(this.props.versionId);
        }
        return { ...changes };
      case Downshift.stateChangeTypes.keyDownEscape:
        if (state.inputValue === "" && state.highlightedIndex === null) {
          this.props.onChange(this.props.versionId);
        }
        return { ...changes };
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
        itemToString={item => (item && item.text ? item.text : "")}
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
              {...getInputProps({
                placeholder: "Type here to filter versions"
              })}
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
