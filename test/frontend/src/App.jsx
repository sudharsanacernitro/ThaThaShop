import { useEffect } from 'react';

export default function App() {
  useEffect(() => {
    // Connect to WebSocket backend
    const socket = new WebSocket('ws://192.168.1.37:4000'); // replace with your server URL

    socket.onopen = () => {
      console.log('✅ WebSocket connected');

      // Start watching location
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;

          const gpsData = {
            lat: latitude,
            lng: longitude,
            timestamp: Date.now(),
          };

          // Send to server
          socket.send(JSON.stringify(gpsData));
          console.log('📤 Sent:', gpsData);
        },
        (error) => {
          console.error('❌ GPS Error:', error);
        },
        {
          enableHighAccuracy: true,     // for GPS-level precision
          timeout: 10000,
          maximumAge: 0,
        }
      );

      // Cleanup
      return () => {
        navigator.geolocation.clearWatch(watchId);
        socket.close();
      };
    };
  }, []);

  return (<h1>Location Tracking</h1>) // no UI needed
}

