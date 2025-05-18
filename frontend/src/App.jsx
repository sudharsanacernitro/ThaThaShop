import { BrowserRouter, Routes, Route } from "react-router-dom";





import {Product ,Home ,Login, Signup , SubProduct ,Cart , AdminOrdersDashboard} from './pages';

import 'swiper/css';

const App=()=> {

  return (
    <>
    <BrowserRouter>
         <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Product />} />
        <Route path="/subProduct" element={<SubProduct />} />
        <Route path="/login" element={<Login/>} />
        <Route path='/signup' element={<Signup/>} />
        <Route path='/cart' element={<Cart/>} />
        <Route path='/admin' element={<AdminOrdersDashboard/>} />

      </Routes>
     </BrowserRouter>

     {/* <div className="fixed  h-full w-[100%] right-0 sm:left-1/4  sm:bottom-2/4 -z-0">
          <svg
            className=""
            viewBox="0 0 500 500"
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            width="100%"
            id="blobSvg"
          >
            <path fill="#FF6666">
              <animate
                attributeName="d"
                dur="5000ms"
                repeatCount="indefinite"
                values="
                  M432,335.5Q421,421,335.5,442.5Q250,464,170.5,436.5Q91,409,59,329.5Q27,250,75.5,187Q124,124,187,97.5Q250,71,329.5,81Q409,91,426,170.5Q443,250,432,335.5Z;
                  M436.5,332Q414,414,332,431Q250,448,188,411Q126,374,71,312Q16,250,45,162Q74,74,162,50Q250,26,314.5,73.5Q379,121,419,185.5Q459,250,436.5,332Z;
                  M441,335.5Q421,421,335.5,428.5Q250,436,175.5,417.5Q101,399,51,324.5Q1,250,43,167.5Q85,85,167.5,60.5Q250,36,330.5,62.5Q411,89,436,169.5Q461,250,441,335.5Z;
                  M424.5,328Q406,406,328,419Q250,432,162,429Q74,426,71.5,338Q69,250,86.5,177Q104,104,177,55.5Q250,7,325.5,53Q401,99,422,174.5Q443,250,424.5,328Z;
                  M432,335.5Q421,421,335.5,442.5Q250,464,170.5,436.5Q91,409,59,329.5Q27,250,75.5,187Q124,124,187,97.5Q250,71,329.5,81Q409,91,426,170.5Q443,250,432,335.5Z"
              />
            </path>
          </svg>
    </div> */}

    </>
  )
};


export default App

