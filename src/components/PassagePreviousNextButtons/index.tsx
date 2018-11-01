import * as React from "react";

import "./PassagePreviousNextButtons.css";

interface PassagePreviousNextButtonsProps {
  onPrevious: () => void;
  onNext: () => void;
}

export const PassagePreviousNextButtons = ({
  onPrevious,
  onNext
}: PassagePreviousNextButtonsProps) => (
  <div className="PassagePreviousNextButtons">
    <div className="PassagePreviousNextButtons__button">
      <button onClick={onPrevious}>&lt; Previous</button>
    </div>
    <div className="PassagePreviousNextButtons__button">
      <button onClick={onNext}>Next &gt;</button>
    </div>
  </div>
);
