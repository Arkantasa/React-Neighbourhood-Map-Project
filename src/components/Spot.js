import React from "react";

class Spot extends React.Component {
  render() {
    return (
      <li
        role="button"
        className="spot"
        tabIndex="0"
        onKeyPress={this.props.showInfoWindow.bind(
          this,
          this.props.data.marker
        )}
        onClick={this.props.showInfoWindow.bind(this, this.props.data.marker)}
      >
        {this.props.data.label}
      </li>
    );
  }
}

export default Spot;
