import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';

import {Link } from 'react-router-dom';

const SignupPage = () => {

    const ip=import.meta.env.VITE_API_URL;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate(); //  use this for redirection


  const handleLogin = async (e) => {
    e.preventDefault();
    console.log("Login clicked:", { email, password });

    const response = await fetch(`${ip}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();
    if (response.status === 201) {  
      // navigate('/'); // 👈 Redirect to dashboard

    } else {

      window.alert('User Already exists');

    }

    // Add login logic here (API call, validation, etc.)
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-700 ">
       
    

      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-2xl shadow-lg z-10 ">
        <h2 className="text-3xl font-bold text-center text-gray-800">ThaTha shop</h2>
        <form className="space-y-4" onSubmit={handleLogin}>
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              className="w-full px-4 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              className="w-full px-4 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Repeat-Password</label>
            <input
              type="password"
              className="w-full px-4 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition duration-200"
          >
            Signup
          </button>
        </form>
        <p className="text-sm text-center text-gray-600">
          Already have an account?{" "}
         <Link to='/login' className="text-blue-400">login</Link>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;
