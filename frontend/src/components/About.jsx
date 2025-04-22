import React from 'react'
import {styles} from '../styles';
import { Tilt } from 'react-tilt';


import {fadeIn,textVariant} from '../utils/motion';
import {motion} from 'framer-motion';

import {SectionWrapper} from '../hoc';

const About = ({theme}) => {
  return (
    <div className=' h-screen w-full flex flex-row justify-end items-end z-20 second-section relative'>
            <Tilt className={`md:w-[40%] w-[95%] md:h-[85vh] h-auto md:m-10 bg-transparent  rounded-2xl flex flex-col items-center justify-start p-3 relative border ${theme?'border-black':'border-white'}`}>

              <div className={`${styles.heroSubText} w-[200px] h-auto bg-yellow-500 absolute top-0 right-0 rounded-tr-2xl text-center `}>Location</div>


          <img src="https://static.vecteezy.com/system/resources/thumbnails/031/410/359/small/map-location-marker-generative-ai-photo.jpg" className='w-[90%] sm:h-[70%] h-[50%] rounded-2xl m-5 '/>
          <h5 className={`${styles.sectionHeadText} w-[90%] text-start`}>
              Kovil Theru
          </h5>
         <p className={`${styles.sectionSubText} sm:w-[90%] w-[100%]`}>
                    KovilPatti ,Coimbatore<br></br><br></br> consectetur adipisicing elit. Distinctio numquam id fugit at, animi repellat tempore ex natus ad impedit inventore quae illo reiciendis deserunt laboriosam? Perferendis eveniet incidunt asperiores!
         </p>



        </Tilt>

        </div>
  )
}

export default About;
