"use client";
import React, { useEffect, useState, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  GeoJSON,
  LayersControl,
  Polygon,
  Marker,
  FeatureGroup,
  Polyline,
} from "react-leaflet";
import { EditControl } from "react-leaflet-draw";
import "leaflet-draw/dist/leaflet.draw.css";
import "leaflet/dist/leaflet.css";
import { DatePicker, Select, Upload, Button, Input } from "antd";
import moment from "moment";
import L from "leaflet";
// import satellite from "satellite.js";
import {
  twoline2satrec,
  propagate,
  eciToGeodetic,
  degreesLat,
  degreesLong,
  gstime,
} from "satellite.js";
import {
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Separator } from "@/components/ui/separator";
// Optionally set default marker icon if needed
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// Set the default icon for Leaflet markers (if not done already)
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const { Option } = Select;
const { BaseLayer } = LayersControl;

const LANDSAT_DATA_URL =
  "https://landsat.usgs.gov/sites/default/files/landsat_acq/assets/json/cycles_full.json";
const USGS_URL =
  "https://nimbus.cr.usgs.gov/arcgis/rest/services/LLook_Outlines/MapServer/1/query";
// const TLE_API_URL = 'https://www.n2yo.com/sat/gettle.php?s=49260';
const TLE_API_URL = "https://tle.ivanstanojevic.me/api/tle/49260";

// Function to fetch TLE data
const fetchTLEData = async () => {
  try {
    const response = await fetch("/api/landsat?app=TLE_API_URL");
    if (!response.ok) {
      throw new Error(`Error fetching TLE data: ${response.statusText}`);
    }
    const data = await response.json();

    // Ensure that TLE data contains two lines
    if (!data.line1 || !data.line2) {
      throw new Error("Invalid TLE data: Missing line1 or line2");
    }

    return [data.line1, data.line2];
  } catch (error) {
    console.error("Error fetching TLE data:", error.message);
    return null;
  }
};

// Function to calculate satellite position from TLE data
const getSatellitePosition = (tleLine1, tleLine2) => {
  const satrec = twoline2satrec(tleLine1, tleLine2);
  const now = new Date();
  const positionAndVelocity = propagate(satrec, now);
  const positionGd = eciToGeodetic(positionAndVelocity.position, gstime(now));
  const latitude = degreesLat(positionGd.latitude);
  const longitude = degreesLong(positionGd.longitude);
  return [latitude, longitude];
};

// Function to fetch Landsat data
const fetchLandsatData = async () => {
  try {
    const response = await fetch("/api/landsat?app=LANDSAT_DATA_URL");
    return response.json();
  } catch (error) {
    console.error("Error fetching Landsat data:", error.message);
    return null;
  }
};

// Function to fetch USGS path data
const fetchUSGSPathData = async (paths) => {
  const params = {
    returnGeometry: "true",
    where: `PATH IN (${paths.join(",")}) AND MODE='D'`,
    outSr: "4326",
    outFields: "*",
    inSr: "4326",
    geometry:
      '{"xmin":-180,"ymin":-85.0511287798066,"xmax":180,"ymax":85.0511287798066,"spatialReference":{"wkid":4326}}',
    geometryType: "esriGeometryEnvelope",
    spatialRel: "esriSpatialRelIntersects",
    geometryPrecision: "6",
    f: "geojson",
  };
  const queryString = new URLSearchParams(params).toString();

  console.log("Query String:", queryString);

  try {
    // const response = await fetch(
    //   "/api/landsat?app=USGS_URL&query=" + queryString,
    // );
    const response = await fetch(`/api/landsat?app=USGS_URL&${queryString}`);
    if (!response.ok) {
      throw new Error(`Error fetching data: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching USGS path data:", error.message);
    return null;
  }
};

// //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const LANDSAT_PIXEL_SIZE = 0.0002695; // Approximate size in degrees (30 meters)

// Function to create a grid of Landsat pixels
const createLandsatGrid = (lat, lng) => {
  const grid = [];

  // Calculate the top-left corner of the center pixel
  const centerLat = lat - LANDSAT_PIXEL_SIZE / 2;
  const centerLng = lng - LANDSAT_PIXEL_SIZE / 2;

  // Loop through the 3x3 grid (i.e., 9 pixels)
  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      const pixelLat = centerLat + i * LANDSAT_PIXEL_SIZE; // Centered on the input latitude
      const pixelLng = centerLng + j * LANDSAT_PIXEL_SIZE; // Centered on the input longitude

      // Create polygon coordinates for each pixel
      const pixelPolygon = [
        [pixelLat, pixelLng], // Top-left corner
        [pixelLat, pixelLng + LANDSAT_PIXEL_SIZE], // Top-right corner
        [pixelLat + LANDSAT_PIXEL_SIZE, pixelLng + LANDSAT_PIXEL_SIZE], // Bottom-right corner
        [pixelLat + LANDSAT_PIXEL_SIZE, pixelLng], // Bottom-left corner
        [pixelLat, pixelLng], // Closing the loop to the top-left
      ];

      grid.push(pixelPolygon);
    }
  }

  return grid;
};

// Function to convert shapeInfo to GeoJSON
const convertToGeoJSON = (shapeInfo, shapeType) => {
  // Create the GeoJSON structure
  const geojson = {
    type: "FeatureCollection",
    features: [],
  };

  // Handle different shape types
  if (shapeType === "polygon" || shapeType === "rectangle") {
    // Polygon and rectangle shapes need to be converted to [lng, lat] pairs
    const coordinates = shapeInfo[0].map((latlng) => [latlng.lng, latlng.lat]); // Flatten to [lng, lat]

    geojson.features.push({
      type: "Feature",
      geometry: {
        type: "Polygon",
        coordinates: [coordinates], // GeoJSON requires an array of coordinates for polygons
      },
      properties: {},
    });
  } else if (shapeType === "marker") {
    // Marker is a point
    const coordinates = [shapeInfo.lng, shapeInfo.lat]; // Marker is just one latlng pair

    geojson.features.push({
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: coordinates, // A single pair of lng, lat
      },
      properties: {},
    });
  }

  return geojson;
};

const MapComponent = ({
  satellitePosition,
  pathJsonData,
  geoJsonData,
  satellitePath,
  landsatGrid,
  setLandsatGrid,
  markerPosition,
  setMarkerPosition,
}) => {
  const mapRef = useRef(); // Create a reference for the map instance
  const onDrawCreated = (e) => {
    console.log("Draw Created:", e);
    const layer = e.layer;
    const type = e.layerType; // Type of the drawn shape (e.g., rectangle, polygon, marker, etc.)

    let shapeInfo;

    // Get coordinates depending on shape type
    if (layer.getLatLngs) {
      shapeInfo = layer.getLatLngs(); // For shapes like rectangle, polygon, etc.
    } else if (layer.getLatLng) {
      shapeInfo = layer.getLatLng(); // For markers or single points

      // Display latitude and longitude for markers
      const { lat, lng } = shapeInfo;
      // alert(`Marker placed at Latitude: ${lat}, Longitude: ${lng}`);
    }

    // console.log("Shape Type:", type);
    // console.log("Coordinates:", shapeInfo);

    // Convert the shapeInfo to GeoJSON format
    const geojsonData = convertToGeoJSON(shapeInfo, type);

    if (type === "marker") {
      const { lat, lng } = layer.getLatLng();
      alert(`Target Pixel Center: \nLatitude: ${lat}, \nLongitude: ${lng}`);

      // Create a 3x3 Landsat pixel grid around the target pixel
      const landsatGrid = createLandsatGrid(lat, lng);
      setLandsatGrid(landsatGrid); // Directly use setLandsatGrid after destructuring
      setMarkerPosition({ lat, lng }); // Set marker position
    }

    if (type != "marker") {
      // Download the GeoJSON data as a file
      const dataStr =
        "data:text/json;charset=utf-8," +
        encodeURIComponent(JSON.stringify(geojsonData, null, 2));
      const downloadAnchorNode = document.createElement("a");
      downloadAnchorNode.setAttribute("href", dataStr);
      downloadAnchorNode.setAttribute("download", "shapeInfo.geojson");
      document.body.appendChild(downloadAnchorNode); // required for firefox
      downloadAnchorNode.click();
      downloadAnchorNode.remove();
    }
  };

  useEffect(() => {
    // If marker position is updated, place the marker on the map
    if (markerPosition) {
      const { lat, lng } = markerPosition;
      L.marker([lat, lng], {
        // icon: L.icon({
        //   iconUrl: markerIcon,
        //   iconSize: [30, 30],
        // }),
      }).addTo(mapRef.current); // Assume `map` is a reference to your map instance
    }
  }, [markerPosition]);

  return (
    // <MapContainer center={[0, 0]} zoom={2} style={{ height: "100vh" }}>
    <MapContainer
      ref={mapRef}
      center={[0, 0]}
      zoom={2}
      style={{ height: "100vh" }}
      whenCreated={(map) => {
        mapRef.current = map;
      }}
    >
      <LayersControl position="topright">
        <LayersControl.BaseLayer checked name="Google Satellite Hybrid">
          <TileLayer
            url="http://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}"
            attribution="&copy; <a href='https://www.google.com/maps'>Google Maps</a>"
          />
        </LayersControl.BaseLayer>
        <LayersControl.BaseLayer name="OpenTopoMap">
          <TileLayer
            url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
            attribution="&copy; <a href='https://opentopomap.org/'>OpenTopoMap</a>"
          />
        </LayersControl.BaseLayer>
      </LayersControl>

      {/* Render GeoJSON data */}
      {geoJsonData && <GeoJSON data={geoJsonData} />}

      {/* Render USGS Path Data */}
      {pathJsonData && <GeoJSON data={pathJsonData} />}

      {/* Real-time Satellite Position Marker */}
      {satellitePosition && (
        <Marker
          position={[satellitePosition[0], satellitePosition[1]]}
          icon={L.icon({
            iconUrl: "/satellite-svgrepo-com.svg",
            iconSize: [30, 30],
          })}
        />
      )}

      {/* Render the 3x3 Landsat pixel grid */}
      {landsatGrid &&
        landsatGrid.map((pixel, index) => (
          <Polygon key={index} positions={pixel} color="blue" />
        ))}

      <Polyline positions={satellitePath} color="red" />

      {/* Drawing Controls */}
      <FeatureGroup>
        <EditControl
          position="topleft"
          onCreated={onDrawCreated}
          draw={{
            rectangle: true,
            polyline: true,
            circle: true,
            marker: true,
            polygon: true,
          }}
        />
      </FeatureGroup>
    </MapContainer>
  );
};

const Satellite2D = () => {
  const [landsatData, setLandsatData] = useState(null);
  const [selectedSatellite, setSelectedSatellite] = useState("Landsat 9");
  const [selectedNode, setSelectedNode] = useState("D");
  const [selectedDate, setSelectedDate] = useState(moment());
  const [geoJsonData, setGeoJsonData] = useState(null);
  const [pathData, setPathData] = useState(null);
  const [cycleData, setCycleData] = useState(null);
  const [cyclePathData, setCyclePathData] = useState(null);
  const [tleData, setTLEData] = useState(null);
  const [satellitePosition, setSatellitePosition] = useState(null);

  // for drawing satellite path
  const [satellitePath, setSatellitePath] = useState([]);
  const [landsatGrid, setLandsatGrid] = useState([]); // To store 3x3 grid
  const [markerPosition, setMarkerPosition] = useState(null); // New state to hold marker position
  const [latInput, setLatInput] = useState("");
  const [lngInput, setLngInput] = useState("");

  useEffect(() => {
    if (markerPosition) {
      const { lat, lng } = markerPosition;
      setLatInput(lat);
      setLngInput(lng);
    }
  }, [markerPosition]);

  const handleLatLngSearch = () => {
    const lat = parseFloat(latInput);
    const lng = parseFloat(lngInput);
    if (!isNaN(lat) && !isNaN(lng)) {
      setMarkerPosition({ lat, lng });
    } else {
      alert("Please enter valid latitude and longitude values.");
    }
  };

  const handleLatChange = (e) => {
    setLatInput(e.target.value);
  };

  const handleLngChange = (e) => {
    setLngInput(e.target.value);
  };

  useEffect(() => {
    // Fetch Landsat data on load
    const fetchData = async () => {
      const data = await fetchLandsatData();
      setLandsatData(data);
      console.log(data);
    };
    fetchData();
  }, []);

  useEffect(() => {
    // Fetch TLE data every 1 hour
    const fetchTLE = async () => {
      const data = await fetchTLEData();
      setTLEData(data);
    };

    fetchTLE(); // Initial fetch

    const tleFetchInterval = setInterval(fetchTLE, 3600000); // Fetch every hour (3600000 ms)

    return () => clearInterval(tleFetchInterval); // Clean up interval on unmount
  }, []);

  useEffect(() => {
    if (tleData) {
      // Set an interval to update satellite position every second
      const intervalId = setInterval(() => {
        const position = getSatellitePosition(tleData[0], tleData[1]);
        setSatellitePosition(position);
      }, 1000);

      const updatePositions = () => {
        const newPositions = [];
        const now = new Date();

        // Calculate satellite path for the next 90 minutes
        for (let i = 0; i <= 99; i += 1) {
          const time = new Date(now.getTime() + i * 60 * 1000); // 1 minute interval

          // Parse the TLE
          const satelliteRecord = twoline2satrec(tleData[0], tleData[1]);

          const positionAndVelocity = propagate(satelliteRecord, time);
          const positionGd = eciToGeodetic(
            positionAndVelocity.position,
            gstime(time),
          );

          const longitude = degreesLong(positionGd.longitude);
          const latitude = degreesLat(positionGd.latitude);

          newPositions.push([latitude, longitude]);
        }

        setSatellitePath(newPositions);
      };

      updatePositions();

      // Update the path every 10 seconds
      const pathIntervalId = setInterval(updatePositions, 10000);

      // Clear intervals on component unmount
      return () => {
        clearInterval(intervalId);
        clearInterval(pathIntervalId);
      };
    }
  }, [tleData]);

  const handleSelectedNode = (value) => {
    setSelectedNode(value);
  };

  const handleSatelliteChange = (value) => {
    setSelectedSatellite(value);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleFetchPaths = async () => {
    if (!landsatData) {
      console.log("No Landsat data available.");
      return;
    }

    const dateStr = selectedDate.format("M/D/YYYY");
    const satelliteKey = selectedSatellite.toLowerCase().replace(" ", "_");
    const satelliteData = landsatData[satelliteKey];

    if (satelliteData && satelliteData[dateStr]) {
      const paths = satelliteData[dateStr].path.split(",");
      const cycle = satelliteData[dateStr].cycle;
      // console.log(satelliteData[dateStr].path)
      setCyclePathData(satelliteData[dateStr].path);
      setCycleData(cycle);

      const usgsData = await fetchUSGSPathData(paths);
      setPathData(usgsData);
    } else {
      alert("No path data available for the selected date.");
    }
  };

  const handleGeoJSONUpload = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const geoJson = JSON.parse(e.target.result);
      setGeoJsonData(geoJson);
    };
    reader.readAsText(file);
    return false; // Prevent upload behavior
  };

  return (
    <div style={{ display: "flex" }}>
    <div
      style={{ width: "350px", padding: "10px", backgroundColor: "#f0f0f0" }}
    >
      <h3>Landsat Satellite Path and Cycle</h3>
      <Select
        defaultValue="Landsat 9"
        style={{ width: "100%" }}
        onChange={handleSatelliteChange}
      >
        <Option value="Landsat 9">Landsat 9</Option>
        <Option value="Landsat 8">Landsat 8</Option>
        <Option value="Landsat 7">Landsat 7</Option>
      </Select>
      <br />
      <h3>16 Day Acquisition Calender</h3>
      <DatePicker
        style={{ width: "100%" }}
        value={selectedDate}
        onChange={handleDateChange}
      />
      <br />

      <h3>Choose Node</h3>
      <Select
        defaultValue="Descending (daytime)"
        style={{ width: "100%" }}
        onChange={handleSelectedNode}
      >
        <Option value="D">Descending (daytime)</Option>
        <Option value="A">Ascending (Nighttime)</Option>
        <Option value="B">Both</Option>
      </Select>
      <br />
      <br />
      <Button
        type="primary"
        onClick={handleFetchPaths}
        style={{ width: "100%" }}
      >
        Fetch Path Data
      </Button>
      <br />
      <br />
      <h3>Paths on Cycle day:{cycleData}</h3>
      <div style={{ wordWrap: "break-word" }}>{cyclePathData}</div>

      <br />
      <br />
      <Upload
        beforeUpload={handleGeoJSONUpload}
        accept=".geojson"
        showUploadList={false}
      >
        <Button>Upload GeoJSON</Button>
      </Upload>

        {/* Latitude and Longitude Inputs */}
     <h3>Search by Latitude and Longitude</h3>
      <Input
        placeholder="Latitude"
        value={latInput}
        onChange={handleLatChange}
        style={{ marginBottom: "10px" }}
      />
      <Input
        placeholder="Longitude"
        value={lngInput}
        onChange={handleLngChange}
        style={{ marginBottom: "10px" }}
      />
      <Button type="primary" onClick={handleLatLngSearch} style={{ width: "100%" }}>
        Place Marker
      </Button>
    </div>


    <div style={{ flexGrow: 1 }}>
      <MapComponent
        geoJsonData={geoJsonData}
        pathJsonData={pathData}
        satellitePosition={satellitePosition}
        satellitePath={satellitePath}
        landsatGrid={landsatGrid} 
        setLandsatGrid={setLandsatGrid}
        markerPosition={markerPosition} // Pass marker position
        setMarkerPosition={setMarkerPosition} // Pass setMarkerPosition function
      />
    </div>
  </div>
  );
};

export default Satellite2D;
