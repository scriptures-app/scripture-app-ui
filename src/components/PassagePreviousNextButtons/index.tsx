import * as React from "react";
import { getPreviousChapter, getNextChapter } from "@bible-reader/v11n-utils";

import { bibleBookNames } from "../../lang/bibleBookNames.en";

import * as BibleContext from "../../contexts/BibleData";

import "./PassagePreviousNextButtons.css";

interface PassagePreviousNextButtonsProps {
  book: string;
  chapter: number;
  versionId: string;
  onPassageChange: (book: string, chapter: number) => void;
}

export const PassagePreviousNextButtons = ({
  book,
  chapter,
  versionId,
  onPassageChange
}: PassagePreviousNextButtonsProps) => (
  <BibleContext.Consumer>
    {({ bibles }) => {
      const v11n = bibles[versionId].v11n;
      const previousChapterRef = getPreviousChapter(v11n, {
        book,
        chapter
      });
      const nextChapterRef = getNextChapter(v11n, { book, chapter });

      return (
        <div className="PassagePreviousNextButtons">
          <div className="PassagePreviousNextButtons__button">
            {previousChapterRef !== null && (
              <button
                onClick={event =>
                  onPassageChange(
                    previousChapterRef.book,
                    previousChapterRef.chapter
                  )
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
                {bibleBookNames[nextChapterRef.book]} {nextChapterRef.chapter}{" "}
                &gt;
              </button>
            )}
          </div>
        </div>
      );
    }}
  </BibleContext.Consumer>
);
