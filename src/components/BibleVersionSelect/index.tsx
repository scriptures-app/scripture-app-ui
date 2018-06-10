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
}

export default class BibleVersionSelect extends React.Component<
  BibleVersionSelectProps,
  BibleVersionSelectState
> {
  state: BibleVersionSelectState = {
    open: false
  };
  handleClick = () => {
    this.setState(oldState => ({ ...oldState, open: !oldState.open }));
  };
  render() {
    return (
      <div className="BibleVersionSelect">
        <div onClick={this.handleClick}>
          {this.props.versionId.toUpperCase()}
        </div>
        {this.state.open && (
          <div className="BibleVersionSelect_dropdown">
            <BibleVersionAutocomplete
              allVersionIds={this.props.allVersionIds}
              versionId={this.props.versionId}
              onChange={this.props.onChange}
            />
          </div>
        )}
      </div>
    );
  }
}
