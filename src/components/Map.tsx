"use client";

import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";

// Import Leaflet CSS
import "leaflet/dist/leaflet.css";

interface MapProps {
  position: [number, number];
}

const Map: React.FC<MapProps> = ({ position }) => {
  const [customIcon, setCustomIcon] = useState<L.Icon | null>(null);
  
  useEffect(() => {
    // Define a custom icon using CDN resources
    const icon = L.icon({
      iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });

    setCustomIcon(icon);
  }, []);

  return (
    <MapContainer
      center={position}
      zoom={16}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {customIcon && (
        <Marker position={position} icon={customIcon}>
          <Popup>
            <strong>SERC</strong><br />
            IIIT Hyderabad Campus<br />
            5th Floor, Himalaya Block D
          </Popup>
        </Marker>
      )}
    </MapContainer>
  );
};

export default Map;