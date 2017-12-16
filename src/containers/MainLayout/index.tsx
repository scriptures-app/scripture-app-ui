import * as React from "react";
import PassageView from "../PassageView";

class MainLayout extends React.Component<IMainLayoutProps> {
  props: IMainLayoutProps;

  render() {
    const {
      bibles,
      passages,
      onPassageAdd,
      onPassageChange,
      onPassageClose
    } = this.props;

    return (
      <div className="container">
        <div className="toolbar">
          <div className="header">
            <header>
              <h1>Scripure App</h1>
            </header>
          </div>
        </div>
        <div className="content">
          <div className="main">
            {passages.map(
              ({ bibleId, book, chapter, verses }: IPassage, index: number) => (
                <PassageView
                  key={`${bibleId}_${book}_${chapter}_${index}`}
                  allBibleIds={Object.keys(bibles)}
                  bibleId={bibleId}
                  book={book}
                  chapter={chapter}
                  stats={bibles[bibleId].stats}
                  verses={verses}
                  onPassageChange={(
                    bibleId: string,
                    book: string,
                    chapter: number
                  ) => onPassageChange(index, bibleId, book, chapter)}
                  onPassageClose={() => onPassageClose(index)}
                />
              )
            )}
            <div className="passage-wrapper add-passage">
              <button onClick={onPassageAdd}>Add</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default MainLayout;
