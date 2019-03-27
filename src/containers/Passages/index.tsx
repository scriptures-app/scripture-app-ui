import * as React from "react";

import { BibleVersionsMap } from "../../types";
import * as AppStateContext from "../../contexts/AppState";
import { renderPassagesColumns } from "../PassagesColumns";
import { SwipeWrapper } from "../../components/SwipeWrapper";

interface PassagesProps {
  isForMobile: boolean;
  bibles: BibleVersionsMap;
}

export class Passages extends React.Component<PassagesProps> {
  render() {
    return (
      <AppStateContext.Consumer>
        {({
          passages,
          activePassage,
          onAddPassage,
          onClosePassage,
          onChangePassage,
          onChangeActivePassage
        }) => {
          const columnsClass = `passages_${
            passages.length < 6 ? passages.length : "many"
          }_columns`;

          // @TODO: memoize
          const passagesColumns = renderPassagesColumns({
            bibles: this.props.bibles,
            passages: passages,
            isForMobile: this.props.isForMobile,
            onPassageAdd: onAddPassage,
            onPassageClose: onClosePassage,
            onPassageChange: onChangePassage
          });

          return (
            <div className={`main ${columnsClass}`}>
              {this.props.isForMobile ? (
                <SwipeWrapper
                  index={activePassage}
                  length={passages.length}
                  onChange={onChangeActivePassage}
                >
                  {passagesColumns}
                </SwipeWrapper>
              ) : (
                passagesColumns
              )}
            </div>
          );
        }}
      </AppStateContext.Consumer>
    );
  }
}
