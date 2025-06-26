import React, { useState, useEffect } from 'react';

const LocationSender = () => {
  const ip = import.meta.env.VITE_API_URL;
  const [lat, setLat] = useState('');
  const [lon, setLon] = useState('');
  const [status, setStatus] = useState('');
  const [tracking, setTracking] = useState(false);

  const getLocationAndStartTracking = () => {
    if (!navigator.geolocation) {
      setStatus('❌ Geolocation is not supported by your browser');
      return;
    }

    setStatus('📡 Starting location tracking...');
    setTracking(true); // start auto-update loop
  };

  const sendLocation = async (latitude, longitude) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5s timeout

    try {
      const response = await fetch(`${ip}/worker/updateLocation`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          data: {
            location: {
              lat: latitude,
              lon: longitude,
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

  // 📡 Auto-track and send location every 5 seconds
  useEffect(() => {
    let intervalId;

    if (tracking) {
      intervalId = setInterval(() => {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;

            setLat(latitude);
            setLon(longitude);

            sendLocation(latitude, longitude); // send updated location
          },
          (error) => {
            console.error('Geolocation error:', error);
            setStatus(`❌ Error (${error.code}): ${error.message}`);
          },
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0,
          }
        );
      }, 5000);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [tracking]);

  return (
    <div style={{ padding: '1.5rem' }}>
      <h2>📍 GPS Location Sender</h2>
      <button onClick={getLocationAndStartTracking} disabled={tracking}>
        📡 Start Location Tracking
      </button>
      <div style={{ marginTop: '1rem' }}>
        <p>Latitude: {lat}</p>
        <p>Longitude: {lon}</p>
      </div>
      {status && <p style={{ marginTop: '1rem' }}>{status}</p>}
    </div>
  );
};

export default LocationSender;
