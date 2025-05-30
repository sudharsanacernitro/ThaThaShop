import React from 'react'
import {styles} from '../styles';


import {fadeIn,textVariant} from '../utils/motion';
import {motion} from 'framer-motion';

import { Hero, Navbar,About,CustomerService} from "../components";


const Landing = () => {
  return (
    <>

    {/* landing page */}
    <div className=' h-screen w-full  relative flex flex-row justify-between items-end '>
        
                <motion.div variants={textVariant()} className='flex flex-col  mb-20 z-20'>
                      <p className={`${styles.heroHeadText} text-white`}>
                        Give A<span className='text-red-800'>Try</span>
                      </p>
                      <p className={`${styles.sectionSubText}`} >
                      #1 | The Real Thing 
                    </p>
                </motion.div>

                    <div className={`${styles.heroText} absolute w-full h-screen flex justify-center items-center z-10 mix-blend-soft-light`}>  
                      <h1>
                      CRISP
                      </h1>
                    
                    </div>

                    
                
                <div className='flex flex-col mb-20 z-20  '>
                      <p className={`${styles.sectionSubText}`}>
                      Taste It
                      </p>
                    
                </div>

        </div>

        </>
  )
}



const Home=()=>{

  return(
    <div className="relative  bg-gray-900 w-full h-screen text-white">
    <Navbar/>  const ip=process.env.REACT_APP_API;

 
   <Hero/>
 

 <div className=" w-full h-screen  z-100 relative">

    <Landing/>
    <About/>
    <CustomerService/>
 </div>

      

</div>
  )
};

export default Home;
