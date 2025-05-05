import { useState } from "react";
import { ChevronDown, Search, User, X } from "lucide-react";
import { Navbar} from "../components";
import { useEffect } from 'react';

export default function CheckoutPage() {
  const [rememberMe, setRememberMe] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [checkedItems, setCheckedItems] = useState({});

  useEffect(() => {
    fetch(`http://localhost:5000/cart/list`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials:"include"
    })
    .then(res => res.json())
    .then(data => {setCartItems(data);
      console.log(data);
    })
    .catch(err => console.error('Failed to load cart', err));
  },[]);

  const handleCheckboxChange = (productId) => {
    setCheckedItems(prev => ({
      ...prev,
      [productId]: !prev[productId]
    }));
  };
  

  const handleBuy = (item) => {
    // Logic to buy item
    console.log("Buying", item.product.name);
    // Optionally send to server
  };
  
  const handleDelete = (itemId) => {
    fetch(`http://localhost:5000/cart/del/${itemId}`, {
      method: 'DELETE',
      credentials: 'include',
    })
      .then(res => {
        if (res.ok) {
          setCartItems(prev => prev.filter(item => item._id !== itemId));
        } else {
          console.error('Delete failed');
        }
      })
      .catch(err => console.error('Delete error', err));
  };
  
  return (
    <div className="bg-black text-white min-h-screen z-20">
      
      <Navbar />
      
      {/* Checkout Title */}
      <div className="px-6">
        <h1 className="text-7xl font-extrabold tracking-wider">CHECKOUT</h1>
      </div>
      
      {/* Main Content */}
      <div className="flex flex-wrap p-6 justify-center">
        {/* Left Column */}
        <div className="w-full md:w-2/5 p-4 bg-gray-800 z-20 border-gray-800 rounded-2xl">
          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex mb-4">
              <div className="w-1/2">
                <p className="font-bold">Shipping Information</p>
                <p className="text-sm text-gray-400">Provide your shipping detail information</p>
              </div>
              <div className="w-1/2">
                <p className="font-bold text-gray-500">Payment</p>
                <p className="text-sm text-gray-500">Finish your order & choose your payment</p>
              </div>
            </div>
            <div className="flex h-1 w-full">
              <div className="h-full bg-red-600 w-1/2"></div>
              <div className="h-full bg-gray-700 w-1/2"></div>
            </div>
          </div>
          
          {/* Contact Form */}
          <div className="mb-8">
            <h2 className="text-xl font-bold tracking-widest mb-4">CONTACT</h2>
            <div className="mb-4">
              <input 
                type="email" 
                placeholder="Your email address" 
                className="w-full bg-gray-900 border border-gray-700 rounded-full py-3 px-4"
              />
            </div>
            <div className="flex items-center mb-4">
            <input 
                type="email" 
                placeholder="Your mobile number" 
                className="w-full bg-gray-900 border border-gray-700 rounded-full py-3 px-4"
              />
            </div>
            <div className="border-b border-gray-700 mb-6"></div>
          </div>
          
          {/* Delivery Address Form */}
          <div className="z-20">
            <h2 className="text-xl font-bold tracking-widest mb-4">DELIVERY ADDRESS</h2>
            <div className="flex flex-wrap -mx-2 mb-4">
              <div className="w-full md:w-1/2 px-2 mb-4">
                <label className="block mb-2">First Name</label>
                <input 
                  type="text" 
                  placeholder="Your first name" 
                  className="w-full bg-gray-900 border border-gray-700 rounded-full py-3 px-4"
                />
              </div>
              <div className="w-full md:w-1/2 px-2 mb-4">
                <label className="block mb-2">Last Name</label>
                <input 
                  type="text" 
                  placeholder="Your last name" 
                  className="w-full bg-gray-900 border border-gray-700 rounded-full py-3 px-4"
                />
              </div>
            </div>
           
            <div className="mb-4">
              <label className="block mb-2">Address</label>
              <input 
                type="text" 
                placeholder="Your address" 
                className="w-full bg-gray-900 border border-gray-700 rounded-full py-3 px-4"
              />
            </div>
            <div className="flex flex-wrap -mx-2">
              <div className="w-full md:w-1/3 px-2 mb-4">
                <label className="block mb-2">Town</label>
                <input 
                  type="text" 
                  className="w-full bg-gray-900 border border-gray-700 rounded-full py-3 px-4"
                />
              </div>
              <div className="w-full md:w-1/3 px-2 mb-4">
                <label className="block mb-2">District</label>
                <input 
                  type="text" 
                  className="w-full bg-gray-900 border border-gray-700 rounded-full py-3 px-4"
                />
              </div>
              <div className="w-full md:w-1/3 px-2 mb-4">
                <label className="block mb-2">Postcode</label>
                <input 
                  type="text" 
                  className="w-full bg-gray-900 border border-gray-700 rounded-full py-3 px-4"
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* Right Column */}
        <div className="w-full md:w-2/4 p-4 z-20 bg-gray-800 m-3 rounded-2xl ">
          <h2 className="text-xl font-bold tracking-widest mb-6">DETAIL PRODUCT</h2>
          
          {/* Product 1 */}
          {cartItems.map((item) => (
            <div key={item._id} className="bg-gray-900 rounded mb-4 p-4 flex items-center">
              <div className="flex flex-col space-y-2 mr-4">
                  <button
                    className="bg-green-600 text-white text-xs px-3 py-1 rounded hover:bg-green-700"
                    onClick={() => handleBuy(item._id)}
                  >
                    Buy
                  </button>
                  <button
                    className="bg-red-600 text-white text-xs px-3 py-1 rounded hover:bg-red-700"
                    onClick={() => handleDelete(item._id)}
                  >
                    Delete
                  </button>
              </div>

              <div className="mr-4">
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className="h-16 w-16 rounded-full object-cover"
                />
              </div>
              <div className="flex-grow">
                <p className="text-sm text-gray-400">{item.product.category || 'Category'}</p>
                <h3 className="text-lg font-bold tracking-widest">{item.product.name}</h3>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-xs">{item.quantity}X</span>
                <span className="text-xl font-bold">${item.product.price}</span>
              </div>
              
            </div>
         ))}
  
          
        </div>
      </div>
    </div>
  );
}