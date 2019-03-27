import * as React from "react";
import { Chapter } from "@bible-reader/types";

import {
  BibleVersionsMap,
  PassageChangeFunc,
  PassageCloseFunc,
  PassageAddFunc
} from "../../types";
import { PassageView } from "../PassageView";

interface PassagesColumnsProps {
  bibles: BibleVersionsMap;
  passages: Chapter[];
  onPassageAdd: PassageAddFunc;
  onPassageChange: PassageChangeFunc;
  onPassageClose: PassageCloseFunc;
  isForMobile: boolean;
}

/**
 * This is NOT a React component, but a function that returns an array
 * of React components.
 */
export const renderPassagesColumns = ({
  bibles,
  passages,
  onPassageAdd,
  onPassageChange,
  onPassageClose,
  isForMobile
}: PassagesColumnsProps) => {
  const passagesColumns = passages.map(
    ({ versionId, book, chapter, verses, loading }: Chapter, index: number) => {
      const v11n = bibles[versionId].v11n;
      const passage = (
        <PassageView
          key={`${versionId}_${book}_${chapter}_${index}`}
          allVersionIds={Object.keys(bibles)}
          versionId={versionId}
          book={book}
          chapter={chapter}
          v11n={v11n}
          verses={verses}
          onPassageChange={(versionId: string, book: string, chapter: number) =>
            onPassageChange(index, versionId, book, chapter)
          }
          onPassageClose={() => onPassageClose(index)}
          loading={loading}
        />
      );
      if (isForMobile) {
        // wrap every passage in div
        return <div key={index}>{passage}</div>;
      } else {
        return passage;
      }
    }
  );

  if (!isForMobile) {
    passagesColumns.push(
      <div
        key="new-passage"
        onClick={onPassageAdd}
        className="PassageView add-passage"
        title="Open new passage"
        aria-label="Open new passage"
        role="button"
        tabIndex={0}
      >
        +
      </div>
    );
  }
  return passagesColumns;
};

export const PassagesColumns = ({
  bibles,
  passages,
  onPassageAdd,
  onPassageChange,
  onPassageClose,
  isForMobile
}: PassagesColumnsProps) => (
  <React.Fragment>
    {renderPassagesColumns({
      bibles,
      passages,
      isForMobile,
      onPassageAdd,
      onPassageClose,
      onPassageChange
    })}
  </React.Fragment>
);
