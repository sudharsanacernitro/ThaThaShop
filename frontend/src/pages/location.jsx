import React, { useState } from 'react';

const LocationSender = () => {
  const ip = import.meta.env.VITE_API_URL;
  const [lat, setLat] = useState('');
  const [lon, setLon] = useState('');
  const [status, setStatus] = useState('');

  const getLocation = () => {
    if (!navigator.geolocation) {
      setStatus('❌ Geolocation is not supported by your browser');
      return;
    }

    setStatus('📡 Getting location...');
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLat(position.coords.latitude);
        setLon(position.coords.longitude);
        setStatus('✅ Location acquired!');
      },
      (error) => {
        console.error('Geolocation error:', error);
        setStatus(`❌ Error (${error.code}): ${error.message}`);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,     // increased timeout
        maximumAge: 0       // no cached position
      }
    );
  };

  const sendLocation = async () => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5s timeout for fetch

    try {
      const response = await fetch(`${ip}/worker/updateLocation`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          data: {
            location: {
              lat: parseFloat(lat),
              lon: parseFloat(lon),
            },
          },
        }),
        credentials: 'include',
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      setStatus(response.ok ? '✅ Location sent!' : '❌ Failed to send location');
    } catch (err) {
      clearTimeout(timeoutId);
      setStatus(err.name === 'AbortError' ? '⏰ Request timed out!' : `❌ Error: ${err.message}`);
    }
  };

  return (
    <div style={{ padding: '1.5rem' }}>
      <h2>📍 GPS Location Sender</h2>
      <button onClick={getLocation}>📡 Get Current Location</button>
      <div style={{ marginTop: '1rem' }}>
        <p>Latitude: {lat}</p>
        <p>Longitude: {lon}</p>
      </div>
      <button
        onClick={sendLocation}
        className="bg-white cursor-pointer"
        disabled={!lat || !lon}
        style={{ marginTop: '1rem' }}
      >
        🚀 Send Location
      </button>
      {status && <p style={{ marginTop: '1rem' }}>{status}</p>}
    </div>
  );
};

export default LocationSender;
