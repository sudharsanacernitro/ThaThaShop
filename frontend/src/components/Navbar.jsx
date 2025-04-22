import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { styles } from '../styles';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Navbar = () => {

  const username = useSelector((state) => state.user.userName);
  const navigate =useNavigate();

  function handleLogin()
  {
    if(username==="Guest")
    {
      navigate('/login');
    }
    else{
      navigate('/home');
    }
  }
  return (
    <nav className={`${styles.paddingX} w-full flex justify-between py-5 fixed top-0 z-20 bg-transparent relative`}>
      <div className='w-full flex justify-between items-center mx-auto'>
        <div className='flex flex-row'>
          <p className={`${styles.navbarTitle} text-[18px] font-bold cursor-pointer flex`}>
          <Link to="/" >
          ThaTha shop
            </Link>
            
          </p>
        </div>

        <ul className='list-none hidden sm:flex flex-row gap-10'>
          <li>
            <Link to="/products" className="text-white font-medium cursor-pointer">
              Product
            </Link>
          </li>
          <li>
            <Link to="/delivery" className="text-white font-medium cursor-pointer">
              Orders
            </Link>
          </li>
          <li>
            <Link to="/contact" className="text-white font-medium cursor-pointer">
              Contact
            </Link>
          </li>
          <li onClick={handleLogin} className='cursor-pointer' >
            {username=="Guest"?"Login":"Logout" }
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;