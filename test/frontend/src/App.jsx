import { useEffect } from 'react';

import { Routes, Route } from 'react-router-dom';

import {StreamUpdates} from './client';
import MapView from './map';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<DeliveryMan />} />
      <Route path="/client" element={<StreamUpdates />} />
      <Route path="/map" element={<MapView/>} />
    </Routes>
  );
}

function DeliveryMan() {
  useEffect(() => {
    const socket = new WebSocket('ws://192.168.1.37:4000');
    let watchId;

    socket.onopen = () => {
      console.log('✅ WebSocket connected');

      watchId = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;

          const gpsData = {
            lat: latitude,
            lng: longitude,
            timestamp: Date.now(),
          };

          socket.send(JSON.stringify(gpsData));
          console.log('📤 Sent:', gpsData);
        },
        (error) => {
          console.error('❌ GPS Error:', error);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    };

    // ✅ Proper cleanup
    return () => {
      if (watchId !== undefined) {
        navigator.geolocation.clearWatch(watchId);
      }
      socket.close();
      console.log('🧹 Cleaned up WebSocket and GPS watch');
    };
  }, []);

  return <h1>Location Tracking</h1>;
}
