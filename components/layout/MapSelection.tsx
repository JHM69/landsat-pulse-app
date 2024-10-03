import React, { useState, useRef } from 'react';
import { MapContainer, TileLayer, FeatureGroup } from 'react-leaflet';
import { EditControl } from "react-leaflet-draw";
import * as turf from '@turf/turf';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';

const MapSelection = ({ onGeoJSONChange, onLatLongChange }) => {
  const [geoJSON, setGeoJSON] = useState(null);
  const mapRef = useRef(null);

  const handleCreated = (e) => {
    const layer = e.layer;
    const newGeoJSON = layer.toGeoJSON();
    setGeoJSON(newGeoJSON);

    // Calculate center of the drawn shape
    const center = turf.center(newGeoJSON);
    const [longitude, latitude] = center.geometry.coordinates;

    // Update the form with new values
    onGeoJSONChange(newGeoJSON);
    onLatLongChange(latitude, longitude);

    // Optionally, update map view to center on the selection
    if (mapRef.current) {
      mapRef.current.setView([latitude, longitude]);
    }
  };

  return (
    <div className="h-[400px] w-full">
      <MapContainer 
        center={[23.8103, 90.4125]} 
        zoom={10} 
        style={{ height: '100%', width: '100%' }}
        ref={mapRef}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <FeatureGroup>
          <EditControl
            position="topright"
            onCreated={handleCreated}
            draw={{
              rectangle: true,
              circle: false,
              circlemarker: false,
              marker: false,
              polyline: false,
              polygon: true,
            }}
          />
        </FeatureGroup>
      </MapContainer>
    </div>
  );
};

export default MapSelection;