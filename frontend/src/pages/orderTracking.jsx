import React, { useEffect, useState } from 'react';
import MovingVehicleMap from './map';

const OrderStatusPage = () => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [cartItems, setCartItems] = useState([]);
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  const ip = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetch(`${ip}/order/myorder`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include'
    })
      .then(res => res.json())
      .then(data => {
        setCartItems(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load cart', err);
        setError('Failed to load orders');
        setLoading(false);
      });
  }, []);

  const handleOrderClick = (orderId) => {
    setSelectedOrderId((prevId) => (prevId === orderId ? null : orderId));
  };

  const selectedOrder = cartItems.find(
    (item) => item._id === selectedOrderId && item.status === 'shipped'
  );

  return (
    <div className="w-full h-screen flex justify-between items-start gap-6 p-6 ">
      {/* Orders List */}
      <div className="w-1/2 bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl text-gray-700 font-bold mb-4">📦 Order Status</h2>

        {cartItems.map((item) => (
          <div
            key={item._id}
            className="bg-gray-900 rounded mb-4 p-4 flex flex-col gap-4"
          >
            {/* Product Info */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className="h-16 w-16 rounded-full object-cover"
                />
                <div>
                  <p className="text-sm text-gray-400">{item.product.category || 'Category'}</p>
                  <h3 className="text-lg font-bold tracking-widest text-white">{item.product.name}</h3>
                </div>
              </div>

              <div className="text-right text-white">
                <span className="block text-xs">{item.quantity}X</span>
                <span className="block text-xl font-bold">${item.product.price}</span>
              </div>
            </div>

            {/* Status Badge + Track Button */}
            <div className="flex items-center justify-between">
              <span className={`px-3 py-1 rounded-full text-sm font-semibold w-fit ${
                item.status === 'shipped'
                  ? 'bg-blue-100 text-blue-800'
                  : item.status === 'delivered'
                  ? 'bg-green-100 text-green-800'
                  : item.status === 'pending'
                  ? 'bg-yellow-100 text-yellow-800'
                  : item.status === 'processed'
                  ? 'bg-purple-100 text-purple-800'
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {item.status}
              </span>

              {item.status === "shipped" && (
                <button
                  onClick={() => handleOrderClick(item._id)}
                  className="text-sm text-blue-500 underline hover:text-blue-700"
                >
                  {selectedOrderId === item._id ? 'Hide Map' : 'Track your order'}
                </button>
              )}
            </div>
          </div>
        ))}

        {loading && <p className="text-blue-500">Loading...</p>}
        {error && <p className="text-red-600">{error}</p>}
      </div>

      {/* Map Section */}
      <div className="w-1/2">
        {selectedOrder ? (
          <div className="bg-white p-4 rounded-lg shadow h-full">
            <h3 className="text-lg font-bold mb-2 text-gray-700">🗺️ Order Tracking</h3>
            <MovingVehicleMap />
          </div>
        ): (
            <div className="bg-white p-4 rounded-lg shadow h-screen  flex items-center justify-center">
          <h2 className="text-3xl font-bold text-gray-800">ThaThaShop</h2>
        </div>
    )

        }
      </div>
    </div>
  );
};

export default OrderStatusPage;
