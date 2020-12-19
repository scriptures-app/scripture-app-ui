import * as React from "react";
import * as classNames from "classnames";

import * as AppStateContext from "../../contexts/AppState";

import "./PassagesNavbar.css";

export class PassagesNavbar extends React.Component {
  render() {
    return (
      <AppStateContext.Consumer>
        {({ passages, activePassage, onAddPassage, onChangeActivePassage }) => {
          if (passages.length > 1) {
            return (
              <div className="PassagesNavbar">
                <div className="PassagesNavbar_items">
                  {passages.map(({ versionId, book, chapter }, index) => (
                    <div
                      className={classNames("PassagesNavbar__item", {
                        "PassagesNavbar__item--active": activePassage === index
                      })}
                      key={`${versionId}_${book}_${chapter}_${index}`}
                      onClick={() => onChangeActivePassage(index)}
                    >
                      <div className="PassagesNavbar__passage">
                        {`${book} ${chapter}`}
                      </div>
                      <div className="PassagesNavbar__version">
                        {versionId.toUpperCase()}
                      </div>
                    </div>
                  ))}
                </div>
                <div
                  onClick={onAddPassage}
                  className="PassagesNavbar__add-button"
                >
                  +
                </div>
              </div>
            );
          } else {
            return (
              <div onClick={onAddPassage} className="fixed-add-button">
                +
              </div>
            );
          }
        }}
      </AppStateContext.Consumer>
    );
  }
}
