import * as React from "react";
import Downshift, {
  StateChangeOptions,
  DownshiftState,
  GetItemPropsOptions
} from "downshift";
import * as classNames from "classnames";

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

interface BibleVersionAutocompleteProps {
  allVersionIds: string[];
  versionId: string;
  onChange: (versionId: string) => void;
  onCancel: () => void;
}

export default class BibleVersionAutocomplete extends React.Component<
  BibleVersionAutocompleteProps,
  {}
> {
  /**
   * This does not get triggered when the selectedItem remains the same
   * See "case Downshift.stateChangeTypes.keyDownEnter" in downshiftStateReducer
   */
  onChange = (selectedItem: string) => {
    this.props.onChange(selectedItem);
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
          this.props.onCancel();
        }
        return { ...changes };
      case Downshift.stateChangeTypes.keyDownEscape:
        if (state.inputValue === "" && state.highlightedIndex === null) {
          this.props.onCancel();
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
    items: string[],
    inputValue: string | null,
    highlightedIndex: number | null,
    getItemProps: (options: GetItemPropsOptions) => {}
  ) => {
    const list = items
      .filter(
        item =>
          !inputValue ||
          item.toLowerCase().includes(inputValue.toLowerCase()) ||
          versionsData[item].name
            .toLowerCase()
            .includes(inputValue.toLocaleLowerCase())
      )
      .map((item, index) => (
        <div
          {...getItemProps({ item })}
          className={classNames("BibleVersionAutocomplete__list-item", {
            "BibleVersionAutocomplete__list-item--hover":
              highlightedIndex === index,
            "BibleVersionAutocomplete__list-item--active":
              this.props.versionId === item
          })}
          key={item}
        >
          <span className="BibleVersionAutocomplete__list-item-id">
            {item.toUpperCase()}
          </span>
          <span className="BibleVersionAutocomplete__list-item-fullname">
            {versionsData[item].name} ({versionsData[item].lang})
          </span>
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
    return (
      <Downshift
        onChange={this.onChange}
        isOpen
        itemToString={item =>
          item && item.value ? item.value.toUpperCase() : ""
        }
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
              autoFocus
              {...getInputProps({
                placeholder: "Type here to filter versions"
              })}
              className="BibleVersionAutocomplete__input"
            />
            {isOpen ? (
              <div className="BibleVersionAutocomplete__list">
                {this.renderList(
                  this.props.allVersionIds,
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
