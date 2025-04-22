import React, { Suspense, useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Preload, useGLTF } from "@react-three/drei";
import CanvasLoader from "../Loader";

const Cola = ({ isMobile }) => {
  const { scene } = useGLTF("./pepsi_can/scene.gltf");

  // Rotate the model
  useFrame(() => {
    scene.rotation.y += 0.005; // Adjust speed if needed
  });

  return (
    <mesh>
      <hemisphereLight intensity={100} groundColor="black" />

      <spotLight
        position={[-20, 50, 10]}
        angle={0.12}
        penumbra={1}
        intensity={100}
        castShadow
        shadow-mapSize={1024}
      />

        <pointLight intensity={200} />
      <ambientLight intensity={100} />
      
      

      <primitive
        object={scene}
        scale={isMobile ? 0.3 : 0.02}
        position={isMobile ? [0, 1.5, -0.2] : [-1, 1, -1.5]}
        rotation={[0, 0, 0]}
      />
    </mesh>
  );
};

const ColaCanvas1 = () => {
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

export default ColaCanvas1;
