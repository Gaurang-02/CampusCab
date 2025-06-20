"use client";

import React, { useEffect, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix Leaflet marker icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png",
});

type LatLng = {
  lat: number;
  lng: number;
};

const defaultCenter: LatLng = {
  lat: 28.6139, // New Delhi
  lng: 77.2090,
};

const RecenterMap = ({ position }: { position: LatLng }) => {
  const map = useMap();
  useEffect(() => {
    map.setView([position.lat, position.lng]);
  }, [position, map]);
  return null;
};

const LiveTracking: React.FC = () => {
  const [currentPosition, setCurrentPosition] = useState<LatLng>(defaultCenter);

  useEffect(() => {
    if (typeof window !== "undefined" && navigator.geolocation) {
      const watchId = navigator.geolocation.watchPosition((position) => {
        const { latitude, longitude } = position.coords;
        setCurrentPosition({ lat: latitude, lng: longitude });
      });
      return () => navigator.geolocation.clearWatch(watchId);
    }
  }, []);

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <MapContainer
        center={[currentPosition.lat, currentPosition.lng]}
        zoom={15}
        scrollWheelZoom={true}
        style={{ width: "100%", height: "100vh" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
        />
        <Marker position={[currentPosition.lat, currentPosition.lng]}>
          <Popup>You are here</Popup>
        </Marker>
        <RecenterMap position={currentPosition} />
      </MapContainer>
    </div>
  );
};

export default LiveTracking;
