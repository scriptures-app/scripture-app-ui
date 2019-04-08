import * as React from "react";

import * as AppStateContext from "./contexts/AppState";
import * as BibleContext from "./contexts/BibleData";

import { MainLayout } from "./containers/MainLayout";

class App extends React.Component {
  render() {
    return (
      <BibleContext.Provider>
        <BibleContext.Consumer>
          {({ bibles, defaultPassage, loadBibleVersionDescriptor }) => (
            <AppStateContext.Provider
              bibles={bibles}
              defaultPassage={defaultPassage}
              loadBibleVersionDescriptor={loadBibleVersionDescriptor}
            >
              <MainLayout />
            </AppStateContext.Provider>
          )}
        </BibleContext.Consumer>
      </BibleContext.Provider>
    );
  }
}

export default App;
