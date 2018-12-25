import { fs } from "mz";
import * as path from "path";
import * as React from "react";
import { render, Box, Color } from "ink";
import { BibleVersionContent } from "@bible-reader/types";
import * as xml2json from "@bible-reader/bible-converter";
import { BibleInputConfig } from "../types";
import readSource from "./readSource";
import generateCode from "./generateCode";
import { outputPath, bibles, defaultChapter } from "../config";

const publicBiblesPath = path.join(__dirname, "..", "..", outputPath);

interface GeneratorState {
  bibles: {
    [bibleId: string]: {
      id: string;
      lang: string;
      name: string;
      progress: number;
      status: string;
    };
  };
}

class Generator extends React.Component<{}, GeneratorState> {
  state: GeneratorState = {
    bibles: bibles.reduce(
      (previous, { id, lang, name }) => ({
        ...previous,
        [id]: {
          id,
          lang,
          name,
          progress: -1,
          status: "Waiting ..."
        }
      }),
      {}
    )
  };

  handleUpdateProgress = (
    bibleId: string,
    progress: number,
    status: string
  ) => {
    this.setState(state => ({
      ...state,
      bibles: {
        ...state.bibles,
        [bibleId]: {
          ...state.bibles[bibleId],
          progress,
          status
        }
      }
    }));
  };

  componentDidMount() {
    Promise.all(
      bibles.map((bible: BibleInputConfig) => {
        const parseData = xml2json.getParser(bible.type);
        return readSource(
          path.join(bible.input || ""),
          this.handleUpdateProgress.bind(this, bible.id),
          bible.pathInArchive
        )
          .then(data =>
            parseData(
              data,
              bible.id,
              bible.name,
              bible.lang,
              this.handleUpdateProgress.bind(this, bible.id)
            )
          )
          .then((bibleObj: BibleVersionContent) => {
            const pathOut = path.join(publicBiblesPath, bible.id);
            return xml2json.generate(
              pathOut,
              bibleObj,
              this.handleUpdateProgress.bind(this, bible.id)
            );
          })
          .then(() => {
            const biblesMap = bibles.reduce(
              (map, bible) => ({
                ...map,
                [bible.id]: {
                  ...bible,
                  // "un-define" config-specific fields
                  input: undefined,
                  pathInArchive: undefined,
                  type: undefined
                }
              }),
              {}
            );
            return fs.writeFile(
              path.join(publicBiblesPath, "bibles.json"),
              JSON.stringify(biblesMap)
            );
          })
          .catch((err: Error) => {
            throw err;
          });
      })
    )
      .then(() => {
        // console.log("The conversion finished successfully.");
      })
      .then(() => {
        const preBundledFile = "../initialDataGenerated.ts";
        return fs.writeFile(
          path.join(__dirname, preBundledFile),
          generateCode(publicBiblesPath, bibles, defaultChapter)
        );
      })
      .then(() => {
        // console.log("Code generated successfully.");
      })
      .catch(err => {
        throw err;
      });
  }

  render() {
    const { bibles } = this.state;
    return (
      <Box flexDirection="column">
        {Object.keys(bibles).map(id => (
          <Box key={id} justifyContent="flex-start">
            <Box width={40}>
              <Color green>{`${id} - ${bibles[id].name}`}</Color>
            </Box>
            <Box width={30} marginLeft={2}>
              {bibles[id].status}
            </Box>
            <Box marginLeft={2}>
              {bibles[id].progress >= 0
                ? Math.floor(100 * bibles[id].progress) + "%"
                : ""}
            </Box>
          </Box>
        ))}
      </Box>
    );
  }
}

render(<Generator />);
