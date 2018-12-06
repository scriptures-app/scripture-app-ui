import * as React from "react";
import { bibleBookNames } from "../../lang/bibleBookNames.en";

import "./PassagePreviousNextButtons.css";

interface PassagePreviousNextButtonsProps {
  previousChapterRef: { book: string; chapter: number } | null;
  nextChapterRef: { book: string; chapter: number } | null;
  onPassageChange: (book: string, chapter: number) => void;
}

export const PassagePreviousNextButtons = ({
  previousChapterRef,
  nextChapterRef,
  onPassageChange
}: PassagePreviousNextButtonsProps) => (
  <div className="PassagePreviousNextButtons">
    <div className="PassagePreviousNextButtons__button">
      {previousChapterRef !== null && (
        <button
          onClick={event =>
            onPassageChange(previousChapterRef.book, previousChapterRef.chapter)
          }
        >
          &lt; {bibleBookNames[previousChapterRef.book]}{" "}
          {previousChapterRef.chapter}
        </button>
      )}
    </div>
    <div className="PassagePreviousNextButtons__button">
      {nextChapterRef !== null && (
        <button
          onClick={event =>
            onPassageChange(nextChapterRef.book, nextChapterRef.chapter)
          }
        >
          {bibleBookNames[nextChapterRef.book]} {nextChapterRef.chapter} &gt;
        </button>
      )}
    </div>
  </div>
);
