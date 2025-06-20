import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Remove default marker icon globally
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: '',
  iconUrl: '',
  shadowUrl: '',
});

// Custom vehicle icon (e.g., red truck)
const vehicleIcon = new L.Icon({
  iconUrl: 'https://down-yuantu.pngtree.com/original_origin_pic/19/03/12/bebdc96c76cf45117e8e7903fbcd1ffc.png?e=1750348667&st=ZDUyZDY0ZjQxZDJhYzA0NDdlYzVhYjgwOGFiZGE1NDc&n=%E2%80%94Pngtree%E2%80%94cartoon+large+car+free+map_4446587.png',
  iconSize: [55, 55],
  iconAnchor: [17, 35],
});

function RecenterMap({ position }) {
  const map = useMap();
  useEffect(() => {
    if (position) {
      map.setView(position, map.getZoom());
    }
  }, [position, map]);
  return null;
}

function MovingVehicleMap() {
  const [position, setPosition] = useState(null);

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8080');

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.lat && data.lng) {
        setPosition([data.lat, data.lng]);
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    ws.onclose = () => {
      console.warn('WebSocket closed');
    };

    return () => {
      ws.close();
    };
  }, []);

  return (
    <MapContainer center={[51.505, -0.09]} zoom={15} style={{ height: '100vh', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; OpenStreetMap contributors'
      />
      {position && (
        <>
          <RecenterMap position={position} />
          <Marker position={position} icon={vehicleIcon} />
        </>
      )}
    </MapContainer>
  );
}

export default MovingVehicleMap;
