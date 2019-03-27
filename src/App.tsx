import * as React from "react";

import * as AppStateContext from "./contexts/AppState";
import initialData from "./initialDataGenerated";
const { bibles, defaultPassage } = initialData;

import { MainLayout } from "./containers/MainLayout";

class App extends React.Component {
  render() {
    return (
      <AppStateContext.Provider bibles={bibles} defaultPassage={defaultPassage}>
        <MainLayout bibles={bibles} />
      </AppStateContext.Provider>
    );
  }
}

export default App;
