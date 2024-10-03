/* eslint-disable import/no-unresolved */
/* eslint-disable react-hooks/rules-of-hooks */
"use client";
import { MapContainer, TileLayer, ZoomControl, LayersControl, useMap } from "react-leaflet";
import { useState, useEffect } from "react";
import "leaflet/dist/leaflet.css";

export default function WorldMap() {
  const [userLocation, setUserLocation] = useState<[number, number]>([51.505, -0.09]); // Default to London
  const [mapReady, setMapReady] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(5); // Default zoom level

  // Get user's location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.latitude, position.coords.longitude]);
          setMapReady(true);
        },
        () => {
          alert("Could not fetch location, defaulting to London.");
          setMapReady(true);
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
      setMapReady(true);
    }
  }, []);

  // Dynamically update zoom based on user location
  const handleZoom = () => {
    const map = useMap();
    map.setView(userLocation, zoomLevel); // Set zoom to current user location and specified zoom level
  };

  return (
    <>
      {mapReady && (
        <MapContainer
          center={userLocation}
          zoom={zoomLevel}
          scrollWheelZoom={true}
          zoomControl={false} // Disable default zoom control
          style={{ height: "100vh", width: "100vw", position: "absolute", top: 0, left: 0, zIndex: -1 }}
        >
          {/* Custom Zoom Control */}
          <ZoomControl position="topright" />

          {/* Layers Control for changing map modes */}
          <LayersControl position="topright">
            {/* OpenStreetMap (Default Layer) */}
            <LayersControl.BaseLayer checked name="OpenStreetMap">
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
            </LayersControl.BaseLayer>

            {/* Satellite Layer */}
            <LayersControl.BaseLayer name="Satellite">
              <TileLayer
                url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://opentopomap.org/">OpenTopoMap</a> contributors'
              />
            </LayersControl.BaseLayer>

            {/* Terrain Layer */}
            <LayersControl.BaseLayer name="Terrain">
              <TileLayer
                url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://opentopomap.org/">OpenTopoMap</a> contributors'
              />
            </LayersControl.BaseLayer>

            {/* Landsat Layer Example (replace with your Landsat tile provider) */}
            <LayersControl.BaseLayer name="Landsat">
              <TileLayer
                url="https://tileserver.url/path/to/landsat/tiles/{z}/{x}/{y}.png"
                attribution="&copy; Landsat"
              />
            </LayersControl.BaseLayer>
          </LayersControl>
        </MapContainer>
      )}
    </>
  );
}
