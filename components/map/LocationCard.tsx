import React from 'react';
import { MapContainer, TileLayer, Polygon } from 'react-leaflet';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

const LocationCard = ({ location }) => {
  const { name, latitude, longitude, geojson } = location;
  const center = [latitude, longitude];
  const polygonPositions = geojson.geometry.coordinates[0].map(coord => [coord[1], coord[0]]);

  return (
    <Card className="mb-4">
      <CardHeader>{name || "Unnamed Location"}</CardHeader>
      <CardContent>
        <MapContainer 
          center={center} 
          zoom={13} 
          style={{ height: '200px', width: '100%' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <Polygon positions={polygonPositions} />
        </MapContainer>
      </CardContent>
    </Card>
  );
};

const LocationCards = ({ locations }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {locations?.map((location) => (
        <LocationCard key={location.id} location={location} />
      ))}
    </div>
  );
};

export default LocationCards;