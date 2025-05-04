import { useState } from "react";
import { ChevronDown, Search, User, X } from "lucide-react";
import { Navbar} from "../components";

export default function CheckoutPage() {
  const [rememberMe, setRememberMe] = useState(false);

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
                type="checkbox" 
                id="remember" 
                className="mr-2"
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
              />
              <label htmlFor="remember" className="text-gray-300">Remember me</label>
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
            <div className="mb-4 z-20">
              <label className="block mb-2">Country</label>
              <div className="relative">
                <select className="w-full bg-gray-900 border border-gray-700 rounded-full py-3 px-4 appearance-none">
                  <option>Choose country/region</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none">
                  <ChevronDown size={18} />
                </div>
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
                <label className="block mb-2">State</label>
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
          <div className="bg-gray-900 rounded mb-4 p-4 flex items-center">
            <div className="mr-4">
              <div className="bg-gray-800 rounded-full h-16 w-16 flex items-center justify-center">
                <div className="bg-gray-700 rounded-full h-12 w-12"></div>
              </div>
            </div>
            <div className="flex-grow">
              <p className="text-sm text-gray-400">Protection</p>
              <h3 className="text-lg font-bold tracking-widest">GIRO HELIOS</h3>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-xs">1X</span>
              <span className="text-xl font-bold">$215.00</span>
            </div>
          </div>
          
          {/* Product 2 */}
          <div className="bg-gray-900 rounded mb-6 p-4 flex items-center">
            <div className="mr-4">
              <div className="bg-red-600 h-16 w-16 flex items-center justify-center">
              </div>
            </div>
            <div className="flex-grow">
              <p className="text-sm text-gray-400">Jersey</p>
              <h3 className="text-lg font-bold tracking-widest">ENDURA FS260</h3>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-xs">1X</span>
              <span className="text-xl font-bold">$64.00</span>
            </div>
          </div>
          
          {/* Order Summary */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold tracking-widest">SUB TOTAL</h3>
              <span className="text-xl font-bold">$279.00</span>
            </div>
            <div className="border-b border-gray-700 mb-4"></div>
          </div>
          
          {/* Shipping */}
          <div className="mb-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold tracking-widest">SHIPPING</h3>
              <span className="text-gray-400">ENTER SHIPPING ADDRESS</span>
            </div>
            <div className="border-b border-gray-700 mb-4"></div>
          </div>
          
          {/* Total */}
          <div>
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold tracking-widest">TOTAL</h3>
              <span className="text-xl font-bold">$279.00</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}