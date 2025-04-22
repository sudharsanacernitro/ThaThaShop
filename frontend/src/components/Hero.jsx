import React from 'react'
import {motion} from 'framer-motion';
import {styles} from '../styles';
import { ColaCanvas } from './canvas';

const Hero = () => {
  return (
    <div className="h-screen w-full fixed  z-20">

        

            

              <div className='z-20 h-screen'>
                 <ColaCanvas />
          </div>    

        </div>
  )
}

export default Hero


