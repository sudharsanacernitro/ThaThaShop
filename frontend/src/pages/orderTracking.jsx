import React, { useEffect, useState } from 'react';

// Component to show when order is shipped
const ShippedComponent = () => (
  <div className="p-4 mt-4 bg-green-100 text-green-800 rounded-lg shadow">
    ✅ Your order has been shipped!
  </div>
);

const OrderStatusPage = () => {
  const [status, setStatus] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const apiUrl = import.meta.env.VITE_API_URL; // Or hardcode your backend URL

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await fetch(`${apiUrl}/order/myorder`, {
           method:"GET",
           credentials: 'include'
           }); // Replace 123 with actual order ID
        const data = await res.json();
        console.log(data);
        // setStatus(data.status);
      } catch (err) {
        setError('❌ Failed to fetch order status');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();
  }, []);

  return (
    <div className="p-6 max-w-xl mx-auto bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">📦 Order Status</h2>

      {loading && <p className="text-blue-500">Loading...</p>}

      {error && <p className="text-red-600">{error}</p>}

      {status && (
        <p className="text-gray-700">
          Status: <span className="font-semibold">{status}</span>
        </p>
      )}

      {/* ✅ Show shipped status component */}
      {status === 'shipped' && <ShippedComponent />}
    </div>
  );
};

export default OrderStatusPage;
