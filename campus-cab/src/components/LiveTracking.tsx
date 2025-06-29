"use client";

import React, { useEffect, useState } from "react";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
  Polyline,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";

delete (L.Icon.Default.prototype as { _getIconUrl?: () => string })._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png",
});

type LatLng = { lat: number; lng: number };

type Props = {
  pickup?: LatLng;
  destination?: LatLng;
};

const RecenterMap = ({ position }: { position: LatLng }) => {
  const map = useMap();
  useEffect(() => {
    map.setView([position.lat, position.lng], 15);
  }, [position, map]);
  return null;
};

const FitRouteBounds = ({ route }: { route: LatLng[] }) => {
  const map = useMap();
  useEffect(() => {
    if (route.length > 0) {
      const bounds = L.latLngBounds(route.map((p) => [p.lat, p.lng]));
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [route, map]);
  return null;
};

const LiveTracking: React.FC<Props> = ({ pickup, destination }) => {
  const [currentPosition, setCurrentPosition] = useState<LatLng | null>(null);
  const [routePath, setRoutePath] = useState<LatLng[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (pickup && destination) {
      axios
        .get(`${process.env.NEXT_PUBLIC_API_URL}/maps/get-route`, {
          params: {
            origin: `${pickup.lat},${pickup.lng}`,
            destination: `${destination.lat},${destination.lng}`,
          },
        })
        .then((res) => {
          setRoutePath(res.data);
          console.log("Route received:", res.data);
        })
        .catch(() => setError("Could not fetch route"));
    }
  }, [pickup, destination]);

  useEffect(() => {
    if (typeof window !== "undefined" && navigator.geolocation) {
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentPosition({ lat: latitude, lng: longitude });
        },
        (err) => {
          console.error("Error:", err);
          setError("Unable to fetch current location.");
        },
        { enableHighAccuracy: true }
      );
      return () => navigator.geolocation.clearWatch(watchId);
    } else {
      setError("Geolocation not supported.");
    }
  }, []);

  if (error) {
    return <div className="text-red-500 p-4">Error: {error}</div>;
  }

  if (!currentPosition) {
    return (
      <div className="flex items-center justify-center h-screen w-full text-lg">
        Fetching current location...
      </div>
    );
  }

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <MapContainer
        center={[currentPosition.lat, currentPosition.lng]}
        zoom={15}
        scrollWheelZoom
        style={{ width: "100%", height: "100vh" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
        />
        <Marker position={[currentPosition.lat, currentPosition.lng]}>
          <Popup>You are here</Popup>
        </Marker>
        {pickup && (
          <Marker position={[pickup.lat, pickup.lng]}>
            <Popup>Pickup</Popup>
          </Marker>
        )}
        {destination && (
          <Marker position={[destination.lat, destination.lng]}>
            <Popup>Destination</Popup>
          </Marker>
        )}
        {routePath.length > 0 && (
          <>
            <Polyline
              positions={routePath}
              pathOptions={{ color: "blue", weight: 5, opacity: 0.8 }}
            />
            <FitRouteBounds route={routePath} />
          </>
        )}
        <RecenterMap position={currentPosition} />
      </MapContainer>
    </div>
  );
};

export default LiveTracking;
