import * as React from "react";

import BibleVersionAutocomplete from "../BibleVersionAutocomplete";
import "./BibleVersionSelect.css";

interface BibleVersionSelectProps {
  allVersionIds: string[];
  versionId: string;
  onChange: (versionId: string) => void;
}

interface BibleVersionSelectState {
  open: boolean;
  wasTouched: boolean;
}

export default class BibleVersionSelect extends React.Component<
  BibleVersionSelectProps,
  BibleVersionSelectState
> {
  state: BibleVersionSelectState = {
    open: false,
    wasTouched: false
  };
  wrapperRef: HTMLDivElement;
  buttonRef: HTMLDivElement;

  handleButtonClick = () => {
    this.setState(oldState => ({ ...oldState, open: !oldState.open }));
  };

  handleOnTouchEnd = () => {
    this.setState({ wasTouched: true });
  };

  handleClose = () => {
    this.setState(oldState => ({ ...oldState, open: false }));
  };

  handleChange = (versionId: string) => {
    this.handleClose();
    this.props.onChange(versionId);
  };

  componentDidMount() {
    document.addEventListener("mousedown", this.handleClickOutside as (
      e: {}
    ) => void);
  }

  componentWillUnmount() {
    document.removeEventListener("mousedown", this.handleClickOutside as (
      e: {}
    ) => void);
  }

  setWrapperRef = (node: HTMLDivElement) => {
    this.wrapperRef = node;
  };

  setButtonRef = (node: HTMLDivElement) => {
    this.buttonRef = node;
  };

  handleClickOutside = (event: React.MouseEvent<HTMLDivElement>) => {
    if (
      this.wrapperRef &&
      !this.wrapperRef.contains(event.target as HTMLElement) &&
      !this.buttonRef.contains(event.target as HTMLElement)
    ) {
      this.handleClose();
    }
  };

  render() {
    return (
      <div className="BibleVersionSelect">
        <div
          onClick={this.handleButtonClick}
          onTouchEnd={this.handleOnTouchEnd}
          ref={this.setButtonRef}
        >
          {this.props.versionId.toUpperCase()}
        </div>
        {this.state.open && (
          <div className="BibleVersionSelect_dropdown" ref={this.setWrapperRef}>
            <BibleVersionAutocomplete
              allVersionIds={this.props.allVersionIds}
              versionId={this.props.versionId}
              onChange={this.handleChange}
              onCancel={this.handleClose}
              touchEnabled={this.state.wasTouched}
            />
          </div>
        )}
      </div>
    );
  }
}
