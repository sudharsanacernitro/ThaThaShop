import React, { Suspense, useEffect, useState, useLayoutEffect, useRef} from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Preload, useGLTF } from "@react-three/drei";
import CanvasLoader from "../Loader";

import gsap from 'gsap';
import { useThree } from "@react-three/fiber";
import { ScrollTrigger } from "gsap/all";

import { useControls } from "leva";

gsap.registerPlugin(ScrollTrigger);

const Cola = ({ isMobile }) => {
  const { scene } = useGLTF("./cheez/scene.gltf");
  const { camera } = useThree();
  const modelRef = useRef(scene);

  useFrame(() => {
    scene.rotation.x += 0.002; // Adjust speed if needed
  });

  // Rotate the model
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.refresh();

      gsap.timeline({
        scrollTrigger: {
          scrub: true,
          markers: true,
        }
      })
        .to(camera.position, {
          x: 15.20,               //7.80 3.05 5.65
          y: 1.25,
          z: 9.60,
          immediateRender: false,
          ease: "none"
        })
        .to(modelRef.current.position, {
          x: isMobile ? -12.75 : -12.10,  //  -10.10 1.45 -1.75
          y: isMobile ? -1 :0.30,
          z: isMobile?0.95:-1.5,
          immediateRender: false,
          ease: "none"
        }, "<")
        .to(modelRef.current.rotation, {
          x: 33.03,  //2.24 0.27 0.36
          y: 12.70,
          z: 30.36,
          immediateRender: false,
          ease: "none"
        }, "<")

        .to(camera.position, {
          x: 15.20,               //7.80 3.05 5.65
          y: -15.25,
          z: 5.60,
          immediateRender: false,
          ease: "none"
        })
        .to(modelRef.current.position, {
          x: isMobile ? -12.75 : 0.10,  //  -10.10 1.45 -1.75
          y: isMobile ? -1 :0.30,
          z: isMobile?0.95:-3.5,
          immediateRender: false,
          ease: "none"
        }, "<")
        .to(modelRef.current.rotation, {
          x: 30.03,  //2.24 0.27 0.36
          y: 12.70,
          z: 30.36,
          immediateRender: false,
          ease: "none"
        }, "<");

    }, []);

    return () => ctx.revert();
  }, [isMobile]);

          
        // const { cameraPosition, scenePosition, sceneRotation } = useControls({
        //   cameraPosition: {
        //     value: {
        //       x: 20,
        //     y: 4,
        //     z: 15,
        //     },
        //     step: 0.05,
        //   },
        //   scenePosition: {
        //     value: { 
        //       x: -12.10,  //  5.65 0.85 -7.90
        //       y: 1.55,
        //       z: -8.35,

        //     }, //-0.90 1.15 -17.70
        //     step: 0.05,
        //   },

        //   sceneRotation: {
        //     value: {
              
        //       x: 30,  //0.00 -2.04 -0.33
        //       y: 12.22,
        //       z: 30,
        //     },
        //     step: 0.01,
        //   },
        // });

        //   useFrame(() => {
        //   camera.position.x = cameraPosition.x;
        //   camera.position.y = cameraPosition.y;
        //   camera.position.z = cameraPosition.z;
        //   scene.position.x = scenePosition.x;
        //   scene.position.y = scenePosition.y;
        //   scene.position.z = scenePosition.z;
        //   scene.rotation.x = sceneRotation.x;
        //   scene.rotation.y = sceneRotation.y;
        //   scene.rotation.z = sceneRotation.z;
        // });

  return (
    <mesh>
      <hemisphereLight intensity={1} groundColor="black" />

      <spotLight
        position={[-20, 50, 10]}
        angle={0.12}
        penumbra={1}
        intensity={1}
        castShadow
        shadow-mapSize={1024}
      />

      <ambientLight intensity={7} />

      <pointLight intensity={20} />
      
      

      <primitive
        object={scene}
        scale={isMobile ? 0.3 : 3.5}
        position={isMobile ? [0, 1.5, -0.2] : [-12.10, 0, -8.35]}
        rotation={[30, 12.22, 30]}
      />
    </mesh>
  );
};

const ColaCanvas = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width:500px)");
    setIsMobile(mediaQuery.matches);

    const handleMediaQueryChange = (event) => {
      setIsMobile(event.matches);
    };
    mediaQuery.addEventListener("change", handleMediaQueryChange);

    return () => {
      mediaQuery.removeEventListener("change", handleMediaQueryChange);
    };
  }, []);

  return (
    <Canvas
      frameLoop="demand"
      shadows
      camera={{ position: [20, 4, 15], fov: 20 }}
      gl={{ preserveDrawingBuffer: true }}
      
    >
      <Suspense fallback={<CanvasLoader />}>
        <OrbitControls
          enableZoom={false}
          enableRotate={false} // Disable manual rotation
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 2}
        />

        <Cola isMobile={isMobile} />
      </Suspense>
      <Preload all />
    </Canvas>
  );
};

export default ColaCanvas;
