// File: src/components/StreamUpdates.js
import React, { useEffect, useState } from 'react';

const StreamUpdates = () => {
  const [updates, setUpdates] = useState([]);

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8080');

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setUpdates(prev => [data, ...prev]);
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
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">📡 Live Agent Location Updates</h1>
      <ul className="space-y-2">
        {updates.map((update, index) => (
          <li key={index} className="bg-gray-100 p-3 rounded shadow">
            <strong>Agent:</strong> {update.agentId}<br />
            <strong>Location:</strong> {update.lat}, {update.lng}<br />
            <strong>Timestamp:</strong> {update.timestamp}
          </li>
        ))}
      </ul>
    </div>
  );
};

export {StreamUpdates};
