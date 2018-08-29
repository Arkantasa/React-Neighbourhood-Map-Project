import React, { Component } from "react";
import Spot from "./Spot";



class Places extends Component {
  constructor(props) {
    super(props);
    this.state = {
      places: "",
      mapSearch: "",
      options: true,
    };

    this.filterPlaces = this.filterPlaces.bind(this);
  }

// filtering the markers and infowindow visibility and appearances accross the map

  filterPlaces(event) {
    this.props.hideInfoWindow();
    const { value } = event.target;
    let places = [];
    this.props.totalPlaces.forEach(function(location) {
      if (location.label.toLowerCase().indexOf(value.toLowerCase()) >= 0) {
        location.marker.setVisible(true);
        places.push(location);
      } else {
        location.marker.setVisible(false);
      }
    });

    this.setState({
      places: places,
      mapSearch: value
    });
  }

  componentWillMount() {
    this.setState({
      places: this.props.totalPlaces
    });
  }

  render() {
    let places = this.state.places.map(function(list, index) {
      return (
        <Spot
          key={index}
          data={list}
          showInfoWindow={this.props.showInfoWindow.bind(this)}
        />
      );
    }, this);

// search box

    return (
      <div className="search-box">
        <input
          placeholder="Search..."
          className="search-input"
          aria-labelledby="filter"
          onChange={this.filterPlaces}
          value={this.state.mapSearch} />
        <ul className="place-list">
          {this.state.options && places}
        </ul>
      </div>
    );
  }
}

export default Places;
