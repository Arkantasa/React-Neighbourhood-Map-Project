import React, { Component } from "react";
import Places from "./components/Places.js";

function loadMapJS(src) {
  let ref = window.document.getElementsByTagName("script")[0];
  let script = window.document.createElement("script");
  script.src = src;
  script.async = true;
  script.onerror = function() {
    document.write("Huston, we have a problem. The map isn't loading");
  };
  ref.parentNode.insertBefore(script, ref);
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      totalPlaces: require("./components/Coordinates.json"),
      map: "",
      infoWindow: "",
      displayMarker: ""
    };

    this.initMap = this.initMap.bind(this);
    this.showInfoWindow = this.showInfoWindow.bind(this);
    this.hideInfoWindow = this.hideInfoWindow.bind(this);
  }

// running the map with the key

  componentDidMount() {
    window.initMap = this.initMap;
    loadMapJS(
      "https://maps.googleapis.com/maps/api/js?key=AIzaSyB_wYVQQGi-KSUUPMPy_NsIGJFuNtDpyGM&callback=initMap"
    );
  }

// The logic behind running the map and where to center it

  initMap() {
    let self = this;

    let mapview = document.getElementById("map");
    mapview.style.height = window.innerHeight + "px";
    let map = new window.google.maps.Map(mapview, {
      center: { lat: 32.074077, lng: 34.792203 },
      zoom: 14,
      mapTypeControl: false
    });

// Enabling InfoWindow and all the logistics around it (clicking etc)

    let InfoWindow = new window.google.maps.InfoWindow({});

    window.google.maps.event.addListener(map, "click", function() {
      self.hideInfoWindow();
    });

    window.google.maps.event.addListener(InfoWindow, "closeclick", function() {
      self.hideInfoWindow();
    });

    this.setState({
      map: map,
      infowindow: InfoWindow
    });

    window.google.maps.event.addDomListener(window, "resize", function() {
      let center = map.getCenter();
      self.state.map.setCenter(center);
      window.google.maps.event.trigger(map, "resize");
    });


    let totalPlaces = [];
    this.state.totalPlaces.forEach(function(place) {
      let label = place.name;
      let marker = new window.google.maps.Marker({
        position: new window.google.maps.LatLng(
          place.lat,
          place.lng
        ),
        map: map
      });

      marker.addListener("click", function() {
        self.showInfoWindow(marker);
      });

      place.label = label;
      place.display = true;
      place.marker = marker;
      totalPlaces.push(place);
    });
    this.setState({
      totalPlaces: totalPlaces
    });
  }


// Running foursquare with the client id and secret
  runFourSquare(marker) {
    let self = this;
    let clientId = "SEM5JJDQKMP54NPSGEE5IYMBFV4V4VDID34XGXMMC2JKEOBB";
    let clientSecret = "TXIILQ3NF5DJBGSM1VSRPYHMVJVTFZWNRY3RBBJLC0Q4SIN0";
    let url =
      "https://api.foursquare.com/v2/venues/search?client_id=" +
      clientId +
      "&client_secret=" +
      clientSecret +
      "&v=20180213&ll=" +
      marker.getPosition().lat() +
      "," +
      marker.getPosition().lng() +
      "&limit=1";
    fetch(url)
      .then(function(response) {
        if (response.status !== 200) {
          self.state.infowindow.setContent("Whoops! Something went wrong. Try again!");
          return;
        }
// After Foursquare runs properly, display the following text in the infowindow
        response.json().then(function(data) {
          console.log(data);

          let location_data = data.response.venues[0];
          let spot = `<h3>${location_data.name}</h3>`;
          let street = `<p>${location_data.location.formattedAddress[0]}</p>`;
          let contact = "";
          if (location_data.contact.phone)
            contact = `<p><small>${location_data.contact.phone}</small></p>`;
          self.state.infowindow.setContent(
            spot + street + contact
          );
        });
      })
      .catch(function(err) {
        self.state.infowindow.setContent("Whoops! Something went wrong. Try again!");
      });
  }

  showInfoWindow(marker) {
    this.hideInfoWindow();
    this.state.infowindow.open(this.state.map, marker);
    marker.setAnimation(window.google.maps.Animation.BOUNCE);
    this.setState({
      displayMarker: marker
    });
    this.state.infowindow.setContent("L O A D I N G");
    this.state.map.setCenter(marker.getPosition());
    this.state.map.panBy(0, -200);
    this.runFourSquare(marker);
  }

  hideInfoWindow() {
    if (this.state.displayMarker) {
      this.state.displayMarker.setAnimation(null);
    }
    this.setState({
      displayMarker: ""
    });
    this.state.infowindow.close();
  }

  render() {
    return (
      <div>
        <Places
          totalPlaces={this.state.totalPlaces}
          showInfoWindow={this.showInfoWindow}
          hideInfoWindow={this.hideInfoWindow}
        />
        <div id="map" />
      </div>
    );
  }
}


export default App;
