import * as React from "react";
import Scrollbars from "react-custom-scrollbars";
import { style } from "typestyle";

class ShadowScrollbars extends React.Component<
  IShadowScrollbarProps,
  IShadowScrollbarState
> {
  constructor(props: IShadowScrollbarProps) {
    super(props);
    this.state = {
      shadowBottomOpacity: 1,
      shadowTopOpacity: 1
    };
    this.handleUpdate = this.handleUpdate.bind(this);
  }

  handleUpdate(values: IScrollbarValues) {
    const { scrollTop, scrollHeight, clientHeight } = values;
    const shadowTopOpacity = 1 / 20 * Math.min(scrollTop, 20);
    const bottomScrollTop = scrollHeight - clientHeight;
    const shadowBottomOpacity =
      1 / 20 * (bottomScrollTop - Math.max(scrollTop, bottomScrollTop - 20));
    this.setState({
      shadowBottomOpacity,
      shadowTopOpacity
    });
  }

  render() {
    const { style: styleProp, ...props } = this.props;
    const containerStyle = {
      ...styleProp,
      position: "relative"
    };
    const shadowTopClass = style({
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      height: 10,
      background:
        "linear-gradient(to bottom, rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0) 100%)",
      opacity: this.state.shadowTopOpacity
    });
    const shadowBottomClass = style({
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      height: 10,
      background:
        "linear-gradient(to top, rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0) 100%)",
      opacity: this.state.shadowBottomOpacity
    });
    return (
      <div style={containerStyle}>
        <Scrollbars onUpdate={this.handleUpdate} {...props} />
        <div className={shadowTopClass} />
        <div className={shadowBottomClass} />
      </div>
    );
  }
}

export default ShadowScrollbars;
