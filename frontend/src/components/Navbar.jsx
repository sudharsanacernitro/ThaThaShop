import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { styles } from '../styles';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Navbar = () => {

  const userRole = useSelector((state) => state.user.userRole);
  const navigate =useNavigate();

  function handleLogin()
  {
    if(userRole==="Guest")
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

        {userRole=="admin" && <li>
            <Link to="/admin" className="text-white font-medium cursor-pointer">
              Dashboard
            </Link>
          </li>}

          { userRole != "admin" && 
          <>
          <li>
            <Link to="/products" className="text-white font-medium cursor-pointer">
              Product
            </Link>
          </li>
          <li>
            <Link to="/cart" className="text-white font-medium cursor-pointer">
              Cart
            </Link>
          </li>
          </>
        }
          
          <li onClick={handleLogin} className='cursor-pointer' >
            {userRole=="Guest"?"Login":"Logout" }
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;