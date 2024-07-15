import React, { useState } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const MapComponent = () => {
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [inputLat, setInputLat] = useState('');
  const [inputLng, setInputLng] = useState('');

  const handleMapClick = (event) => {
    setSelectedPosition({
      lat: event.latLng.lat(),
      lng: event.latLng.lng(),
    });
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    setSelectedPosition({
      lat: parseFloat(inputLat),
      lng: parseFloat(inputLng),
    });
  };

  return (
    <div>
      <LoadScript googleMapsApiKey="05b18c7215affe368541deec5c60f6cfdacceb93">
        <GoogleMap
          mapContainerStyle={{ width: '100%', height: '400px' }}
          center={selectedPosition || { lat: 21.028511, lng: 105.804817 }}
          zoom={15}
          onClick={handleMapClick}
        >
          {selectedPosition && <Marker position={selectedPosition} />}
        </GoogleMap>
      </LoadScript>
      <form onSubmit={handleFormSubmit}>
        <input
          type="text"
          placeholder="Latitude"
          value={inputLat}
          onChange={(e) => setInputLat(e.target.value)}
        />
        <input
          type="text"
          placeholder="Longitude"
          value={inputLng}
          onChange={(e) => setInputLng(e.target.value)}
        />
        <button type="submit">Go to Coordinates</button>
      </form>
    </div>
  );
};

export default MapComponent;
