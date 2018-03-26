import * as React from "react";
import Downshift from "downshift";

interface ChapterSelectProps {
  defaultValue: string;
  items: string[];
  onChange: (
    event: React.FormEvent<HTMLSelectElement | HTMLInputElement>
  ) => void;
}

export default ({ defaultValue, items, onChange }: ChapterSelectProps) => (
  <Downshift
    defaultSelectedItem={defaultValue}
    onChange={onChange}
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
