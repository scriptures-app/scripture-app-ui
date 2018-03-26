import * as React from "react";
import { Versification } from "@scripture-app/types";

import { PassageChangeFuncCurried, PassageCloseFuncCurried } from "../../types";

import PassageNavigation from "../../components/PassageNavigation";
import ShadowScrollbar from "../ShadowScrollbar";

interface PassageViewProps {
  allVersionIds: string[];
  versionId: string;
  book: string;
  chapter: number;
  v11n: Versification;
  verses: string[];
  onPassageChange: PassageChangeFuncCurried;
  onPassageClose: PassageCloseFuncCurried;
}

const PassageView: React.SFC<PassageViewProps> = ({
  allVersionIds,
  versionId,
  book,
  chapter,
  v11n,
  verses,
  onPassageChange,
  onPassageClose
}: PassageViewProps) => (
  <div className="passage-wrapper">
    <div className="passage">
      <div className="passage-header">
        <PassageNavigation
          allVersionIds={allVersionIds}
          versionId={versionId}
          book={book}
          chapter={chapter}
          v11n={v11n}
          onPassageChange={onPassageChange}
          onPassageClose={onPassageClose}
        />
      </div>
      <div className="passage-verses">
        <ShadowScrollbar autoHide style={{ height: "100%" }}>
          {verses.map((text, index) => (
            <p key={index + 1}>
              <sup>{index + 1}</sup> {text}
            </p>
          ))}
        </ShadowScrollbar>
      </div>
      <div className="passage-footer">{versionId}</div>
    </div>
  </div>
);

export default PassageView;
