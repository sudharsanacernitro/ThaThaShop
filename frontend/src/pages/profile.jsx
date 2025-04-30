import React from 'react';

const user = {
  name: "John Doe",
  email: "john@example.com",
  phone: "123-456-7890"
};

const orders = [
  { id: 1, item: "Shoes", date: "2025-04-28", amount: "$50" },
  { id: 2, item: "T-shirt", date: "2025-04-20", amount: "$20" },
];

const cartItems = [
  { id: 1, item: "Watch", quantity: 1, price: "$80" },
  { id: 2, item: "Backpack", quantity: 2, price: "$120" },
];

export default function ProfilePage() {
  return (
    <div className="flex min-h-screen p-6 bg-gray-700 text-black">
      {/* Left: User Info */}
      <div className="w-1/3 bg-white rounded-2xl shadow p-6 mr-6 z-20 ">
        <h2 className="text-2xl font-semibold mb-4">User Details</h2>
        <img
          src="user.png"
          alt="User Avatar"
          className="rounded-full mb-4" />
        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Phone:</strong> {user.phone}</p>
      </div>

      {/* Right: Orders + Cart */}
      <div className="flex-1 flex flex-col gap-6 z-20">
        {/* Orders */}
        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-2xl font-semibold mb-4">Order Details</h2>
          <ul className="space-y-2">
            {orders.map(order => (
              <li key={order.id} className="border-b pb-2">
                <p><strong>Item:</strong> {order.item}</p>
                <p><strong>Date:</strong> {order.date}</p>
                <p><strong>Amount:</strong> {order.amount}</p>
              </li>
            ))}
          </ul>
        </div>

        {/* Cart */}
        <div className="bg-white rounded-2xl shadow p-6 z-20">
          <h2 className="text-2xl font-semibold mb-4">Cart Details</h2>
          <ul className="space-y-2">
            {cartItems.map(item => (
              <li key={item.id} className="border-b pb-2">
                <p><strong>Item:</strong> {item.item}</p>
                <p><strong>Quantity:</strong> {item.quantity}</p>
                <p><strong>Price:</strong> {item.price}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
