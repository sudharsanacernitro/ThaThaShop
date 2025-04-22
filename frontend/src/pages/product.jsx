import { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination } from 'swiper/modules';
import { useNavigate } from 'react-router-dom';

import {styles} from '../styles';


import Navbar from '../components/Navbar';

function Product() {
  return (
    <>
    <Navbar/>
    <div className="h-full mt-20 p-4">
        
      <Cards />
    </div>
    </>
  );
}

function Cards() {

  return (
    <>

    
    <div className='flex  justify-center  h-auto gap-2 flex-wrap w-auto z-20'>
     
        
          <div className='w-[40px]'></div>
          <Prod_canvas width="sm:w-[40%] w-full" img="coca-cola.png" title="drinks" color="bg-transparent"/>
          <Prod_canvas width="sm:w-[50%] w-full" img="detergent.png" title="Cleaner" color="bg-transparent"/>

          <Prod_canvas width="sm:w-[40%] w-full" img="pringles.png" title="snack" color="bg-transparent"/>
          <Prod_canvas width="sm:w-[40%] w-full" img="spice.png" title="COOK" color="bg-transparent"/>

    
          
            
          
            
          
    </div>

    </>

  );
}


function Prod_canvas(props)
{
  const  navigate = useNavigate();

  function route(category) {
    navigate('/subProduct', { state: { category } });
  }

  return (
    <div  className={`${props.width}    gap-y-0 z-20 cursor-pointer`} onClick={ () => route(props.title)}>

        <div className="bg-transparent  ">
          <div className="w-full h-[400px]  relative flex justify-center text-center ">
            <img
              src={props.img}
              className="mt-10 rotate-45 z-10 size-[300px] hover:animate-rotateTo90 transition-transform"  // Moves image slightly above
            />
            <div className="bg-transparent absolute w-full h-full bottom-0  flex border-4 border-white rounded-2xl">

                      <div className={`w-full flex items-end justify-start flex-row ml-20 ${props.color}`}>
                            <h2 className={`${styles.ProductTitle}  text-gray-700  transform -rotate-90 origin-top-left `}>
                              {props.title}
                            </h2>
                      </div>
            </div>
          </div>
        
        </div>

    </div>
  );
}

export default Product;