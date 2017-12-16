import * as React from "react";
import PassageSelect from "../../components/PassageSelect";
import ShadowScrollbar from "../ShadowScrollbar";

const PassageView: React.SFC<IPassageViewProps> = ({
  allBibleIds,
  bibleId,
  book,
  chapter,
  stats,
  verses,
  onPassageChange,
  onPassageClose
}: IPassageViewProps) =>
  <div className="passage-wrapper">
    <div className="passage">
      <div className="passage-header">
        <PassageSelect
          allBibleIds={allBibleIds}
          bibleId={bibleId}
          book={book}
          chapter={chapter}
          stats={stats}
          onPassageChange={onPassageChange}
          onPassageClose={onPassageClose}
        />
      </div>
      <div className="passage-verses">
        <ShadowScrollbar autoHide style={{ height: "100%" }}>
          {verses.map((text, index) =>
            <p key={index + 1}><sup>{index + 1}</sup> {text}</p>
          )}
        </ShadowScrollbar>
      </div>
      <div className="passage-footer">
        {bibleId}
      </div>
    </div>
  </div>;

export default PassageView;
