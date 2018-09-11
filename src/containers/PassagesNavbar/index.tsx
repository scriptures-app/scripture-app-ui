import * as React from "react";
import * as classNames from "classnames";

import "./PassagesNavbar.css";

interface PassagesNavbarProps {
  activePassageIndex: number;
  passages: Array<{
    versionId: string;
    book: string;
    chapter: number;
  }>;
}

export class PassagesNavbar extends React.Component<PassagesNavbarProps> {
  render() {
    return (
      <div className="PassagesNavbar">
        {this.props.passages.map(({ versionId, book, chapter }, index) => (
          <div
            className={classNames("PassagesNavbar__item", {
              "PassagesNavbar__item--active":
                this.props.activePassageIndex === index
            })}
            key={`${versionId}_${book}_${chapter}_${index}`}
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
    );
  }
}
