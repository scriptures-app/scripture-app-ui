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

class Generator extends React.Component {
  state = {
    bibles: bibles.reduce(
      (previous, { id, lang, name }) => ({
        ...previous,
        [id]: {
          id,
          lang,
          name,
          progress: 0,
          status: ""
        }
      }),
      {}
    )
  };
  handleUpdateProgress = (bibleId: string, progress: Number) => {
    this.setState(state => ({
      ...state,
      [bibleId]: {
        ...state[bibleId],
        progress
      }
    }));
  };
  handleUpdateStatus = (bibleId: string, status: string) => {
    this.setState(state => ({
      ...state,
      [bibleId]: {
        ...state[bibleId],
        status
      }
    }));
  };
  componentDidMount() {
    Promise.all(
      bibles.map((bible: BibleInputConfig) => {
        const parseData = xml2json.getParser(bible.type);
        return readSource(
          path.join(bible.input || ""),
          this.handleUpdateProgress.bind(bible.id),
          this.handleUpdateStatus.bind(bible.id),
          bible.pathInArchive
        )
          .then(data => parseData(data, bible.id, bible.name, bible.lang))
          .then((bibleObj: BibleVersionContent) => {
            const pathOut = path.join(publicBiblesPath, bible.id);
            return xml2json.generate(pathOut, bibleObj);
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
      <Box>
        {Object.keys(bibles).map(id => (
          <Box key={id}>
            <Color green>{`${id} - ${bibles[id].name} ${
              bibles[id].status
            }`}</Color>
          </Box>
        ))}
      </Box>
    );
  }
}

render(<Generator />);
