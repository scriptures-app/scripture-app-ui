import * as React from "react";

import "./PassagesNavbar.css";

interface PassagesNavbarProps {
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
            className="PassagesNavbar__item"
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
