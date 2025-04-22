import React from 'react'
import {styles} from '../styles';
import { Tilt } from 'react-tilt';


import {fadeIn,textVariant} from '../utils/motion';
import {motion} from 'framer-motion';

import {SectionWrapper} from '../hoc';

const CustomerService = ({theme}) => {
  return (
    <div className=' h-screen w-full flex flex-row justify-start items-end z-20 second-section relative'>
            <Tilt className={`md:w-[40%] w-[95%] md:h-[85vh] h-auto md:m-10 bg-transparent  rounded-2xl flex flex-col items-center justify-start p-3 relative border ${theme?'border-black':'border-white'}`}>

              <div className={`${styles.heroSubText} w-[200px] h-auto bg-yellow-500 absolute top-0 right-0 rounded-tr-2xl text-center `}>Ratings</div>


          <img src="https://img.freepik.com/premium-vector/review-recommended-from-customer-template_302792-123.jpg" className='w-[90%] sm:h-[70%] h-[50%] rounded-2xl m-5 '/>
          <h5 className={`${styles.sectionHeadText} w-[90%] text-start`}>
          Rating: ⭐⭐⭐⭐☆
          </h5>
         <p className={`${styles.sectionSubText} sm:w-[90%] w-[100%]`}>
                   Whole Sale Sellers<br></br> Made a history of best seller since 1980 ,Makes the best wholeSale retailer in Coimbatore
         </p>



        </Tilt>

        </div>
  )
}

export default CustomerService;
