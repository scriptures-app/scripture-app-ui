import * as React from "react";
import * as ReactSwipe from "react-swipe";

const swipeStyles: ReactSwipe.Style = {
  // using default styles from react-swipe,
  // only height: 100% added to each
  container: {
    overflow: "hidden",
    visibility: "hidden",
    position: "relative",
    height: "100%"
  },

  wrapper: {
    overflow: "hidden",
    position: "relative",
    height: "100%"
  },

  child: {
    float: "left",
    width: "100%",
    position: "relative",
    transitionProperty: "transform",
    height: "100%"
  }
};

interface SwipeWrapperProps {
  index: number;
  length: number;
  onChange: (index: number) => void;
}

export class SwipeWrapper extends React.Component<SwipeWrapperProps> {
  reactSwipe: ReactSwipe | null;

  componentDidUpdate(prevProps: SwipeWrapperProps) {
    if (prevProps.index !== this.props.index) {
      this.handleNavigate(this.props.index);
    }
  }

  handleNavigate = (index: number) => {
    const transitionSpeed = 300; // miliseconds
    if (this.reactSwipe) {
      this.reactSwipe.slide(index, transitionSpeed);
    }
  };
  render() {
    return (
      <ReactSwipe
        ref={element => {
          this.reactSwipe = element;
        }}
        key={this.props.length}
        swipeOptions={{
          startSlide: this.props.index,
          continuous: false,
          callback: this.props.onChange
        }}
        style={swipeStyles}
      >
        {this.props.children}
      </ReactSwipe>
    );
  }
}
