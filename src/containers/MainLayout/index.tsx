import * as React from "react";
import MediaQuery from "react-responsive";

import "./MainLayout.css";

import { BibleVersionsMap } from "../../types";

import { Passages } from "../Passages";
import { PassagesNavbar } from "../PassagesNavbar";

interface MainLayoutProps {
  bibles: BibleVersionsMap;
}

const MOBILE_BREAKPOINT = 825;

export class MainLayout extends React.Component<MainLayoutProps> {
  props: MainLayoutProps;
  render() {
    const { bibles } = this.props;

    return (
      <div className="container">
        <div className="toolbar">
          <div className="header">
            <header>
              <h1>{process.env.APP_NAME || "Bible Reader"}</h1>
            </header>
          </div>
        </div>
        <div className="content">
          <MediaQuery query={`(min-device-width: ${MOBILE_BREAKPOINT + 1}px)`}>
            <Passages bibles={bibles} isForMobile={false} />
          </MediaQuery>
          <MediaQuery query={`(max-device-width: ${MOBILE_BREAKPOINT}px)`}>
            <Passages bibles={bibles} isForMobile={true} />
          </MediaQuery>
        </div>
        <MediaQuery query={`(max-device-width: ${MOBILE_BREAKPOINT}px)`}>
          <PassagesNavbar />
        </MediaQuery>
      </div>
    );
  }
}
