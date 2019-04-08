import * as React from "react";
import { Chapter } from "@bible-reader/types";

import { BibleVersionsMap } from "../../types";
import initialData from "../../initialDataGenerated";

interface BibleDataState {
  defaultPassage: Chapter;
  bibles: BibleVersionsMap;
}

interface ContextValue extends BibleDataState {
  loadBibleVersionDescriptor: (versionId: string) => Promise<void>;
}

const { Provider, Consumer } = React.createContext<ContextValue>({
  ...initialData,
  loadBibleVersionDescriptor: () => new Promise(() => null)
});

class BibleDataProvider extends React.Component<{}, BibleDataState> {
  state = initialData;

  loadBibleVersionDescriptor = async (versionId: string) => {
    const { bibles } = this.state;
    if (!bibles[versionId].hashes.chaptersHashes) {
      // the chaptersHashes and v11n do not exist
      try {
        const response = await fetch(
          `bibles/${versionId}/descriptor.${
            bibles[versionId].hashes.descriptorHash
          }.json`
        );
        const descriptor = await response.json();
        this.setState(prevState => ({
          ...prevState,
          bibles: {
            ...prevState.bibles,
            [versionId]: {
              ...prevState.bibles[versionId],
              hashes: {
                ...prevState.bibles[versionId].hashes,
                chaptersHashes: descriptor.chapters
              },
              v11n: descriptor.v11n
            }
          }
        }));
      } catch (err) {
        throw new Error(
          `Failed at downloading descriptor file of ${versionId}.\n Error: ${
            err.message
          }`
        );
      }
    }
  };

  async componentDidMount() {
    const { defaultPassage } = this.state;
    const { versionId } = defaultPassage;
    await this.loadBibleVersionDescriptor(versionId);
  }

  render() {
    return (
      <Provider
        value={{
          ...this.state,
          loadBibleVersionDescriptor: this.loadBibleVersionDescriptor
        }}
      >
        {this.props.children}
      </Provider>
    );
  }
}

export { BibleDataProvider as Provider, Consumer };
