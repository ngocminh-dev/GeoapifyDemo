// src/components/Map.js
import React, { useEffect, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css'; // Import the Leaflet CSS
import axios from 'axios';

const Map = () => {
  var initialState = {
    lng: 11,
    lat: 49,
    zoom: 4,
  };

  useEffect(() => {
    const map = L.map('my-map').setView(
      [initialState.lng, initialState.lat],
      initialState.zoom
    );

    const myAPIKey = '9b9f891a8a534a84ad96cb16c5aff002';

    const baseUrl =
      'https://maps.geoapify.com/v1/tile/osm-bright/{z}/{x}/{y}.png?apiKey={apiKey}';
    const retinaUrl =
      'https://maps.geoapify.com/v1/tile/osm-bright/{z}/{x}/{y}@2x.png?apiKey={apiKey}';

    const markerIcon = L.icon({
      iconUrl: `https://api.geoapify.com/v1/icon?size=xx-large&type=awesome&color=%233e9cfe&icon=paw&apiKey=${myAPIKey}`,
      iconSize: [31, 46],
      iconAnchor: [15.5, 42],
      popupAnchor: [0, -45],
    });

    var markerPopup = L.popup().setContent('');
    var marker = L.marker([initialState.lng, initialState.lat], {
      icon: markerIcon,
    });

    map.on('click', onMapClick);
    function onMapClick(e) {
      if (marker) {
        marker.remove();
      }

      const reverseGeocodingUrl = `https://api.geoapify.com/v1/geocode/reverse?lat=${e.latlng.lat}&lon=${e.latlng.lng}&apiKey=${myAPIKey}`;

      fetch(reverseGeocodingUrl)
        .then((result) => result.json())
        .then((featureCollection) => {
          if (featureCollection.features.length === 0) {
            console.log('The address is not found');
            return;
          }

          const foundAddress = featureCollection.features[0];
          markerPopup = L.popup().setContent(foundAddress.properties.formatted);
          marker = L.marker(
            new L.LatLng(
              foundAddress.properties.lat,
              foundAddress.properties.lon
            ),
            {
              icon: markerIcon,
            }
          )
            .bindPopup(markerPopup)
            .addTo(map);
        });
    }

    L.tileLayer(L.Browser.retina ? retinaUrl : baseUrl, {
      attribution:
        '<input id="input1" type="text" placeholder="Longitude" />  <input id="input2" type="text"placeholder="Latitude"/> <button id="go-to-coordinates">Go to Coordinates</button>',
      apiKey: myAPIKey,
      maxZoom: 20,
      id: 'osm-bright',
    }).addTo(map);

    document.getElementById('my-map').style.width = '100%';
    document.getElementById('my-map').style.height = '100%';
    document.getElementById('my-map').style.position = 'absolute';
    document.getElementById('my-map').style.left = 0;
    document.getElementById('my-map').style.bottom = '0';
    document.getElementById('input1').onchange = (evt) =>
      (initialState.lng = evt.target.value);
    document.getElementById('input2').onchange = (evt) =>
      (initialState.lat = evt.target.value);
    document.getElementById('go-to-coordinates').onclick = () => {
      map.setView([initialState.lng, initialState.lat], initialState.zoom);
      if (marker) {
        marker.remove();
      }

      const reverseGeocodingUrl = `https://api.geoapify.com/v1/geocode/reverse?lat=${initialState.lat}&lon=${initialState.lng}&apiKey=${myAPIKey}`;

      fetch(reverseGeocodingUrl)
        .then((result) => result.json())
        .then((featureCollection) => {
          if (featureCollection.features.length === 0) {
            console.log('The address is not found');
            return;
          }

          const foundAddress = featureCollection.features[0];
          markerPopup = L.popup().setContent(foundAddress.properties.formatted);
          marker = L.marker(
            new L.LatLng(
              foundAddress.properties.lat,
              foundAddress.properties.lon
            ),
            {
              icon: markerIcon,
            }
          )
            .bindPopup(markerPopup)
            .addTo(map);
        });
    };
  }, []);

  return (
    <div>
      <div id="my-map" />
    </div>
  );
};

export default Map;
