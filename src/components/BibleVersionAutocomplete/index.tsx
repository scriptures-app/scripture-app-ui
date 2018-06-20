import * as React from "react";
import Downshift from "downshift";

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

  render() {
    const { allVersionIds } = this.props;
    const defaultSelectedItem = {
      value: this.props.versionId,
      text: ""
    };

    // e.g. items = [{ value: "kjv", text: "KJV" }, { value: "bkr", text: "BKR" }, ... ]
    const items = allVersionIds.map(value => ({
      value,
      text: value.toUpperCase()
    }));

    return (
      <Downshift
        defaultSelectedItem={defaultSelectedItem}
        onChange={this.onChange}
        itemToString={item => item.text}
        isOpen
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
              <div style={{ border: "1px solid #ccc" }}>
                {items
                  .filter(
                    item =>
                      !inputValue ||
                      item.text
                        .toLowerCase()
                        .includes(inputValue.toLowerCase()) ||
                      versionsData[item.value].name
                        .toLowerCase()
                        .includes(inputValue.toLocaleLowerCase())
                  )
                  .map((item, index) => (
                    <div
                      {...getItemProps({ item })}
                      key={item.value}
                      style={{
                        backgroundColor:
                          highlightedIndex === index ? "gray" : "white",
                        fontWeight:
                          selectedItem.value === item.value ? "bold" : "normal"
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
