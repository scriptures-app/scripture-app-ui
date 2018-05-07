import * as React from "react";
import Downshift from "downshift";

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

interface BibleVersionSelectProps {
  allVersionIds: string[];
  versionId: string;
  onChange: (versionId: string) => void;
}

export default class BibleVersionSelect extends React.Component<
  BibleVersionSelectProps,
  {}
> {
  onChange = (selectedItem: ListItem) => {
    this.props.onChange(selectedItem.value);
  };

  render() {
    const { allVersionIds } = this.props;
    const defaultInputValue = this.props.versionId.toUpperCase();
    const defaultSelectedItem = {
      value: this.props.versionId,
      text: defaultInputValue
    };

    // e.g. items = [{ value: "kjv", text: "KJV" }, { value: "bkr", text: "BKR" }, ... ]
    const items = allVersionIds.map(value => ({
      value,
      text: value.toUpperCase()
    }));

    return (
      <Downshift
        defaultSelectedItem={defaultSelectedItem}
        defaultInputValue={defaultInputValue}
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
            <input {...getInputProps({ placeholder: "Version" })} />
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
