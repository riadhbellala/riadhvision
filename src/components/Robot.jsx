import { useRef, useMemo, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { Float, useGLTF } from "@react-three/drei";
import * as THREE from "three";

const Robot = ({ scale = 0.02, position = [0, -0.2, 0], modelPath = "/models/mini_robot.glb", isHero = false }) => {
  const { scene } = useGLTF(modelPath);
  const robotRef = useRef();

  // Manually clone the scene and ensure all materials render on both sides
  const clonedScene = useMemo(() => {
    const cloned = scene.clone(true);
    cloned.traverse((child) => {
      if (child.isMesh) {
        // If the model is inside-out, this makes sure we can still see it
        child.material.side = THREE.DoubleSide;
      }
    });
    return cloned;
  }, [scene]);

  useEffect(() => {
    // Log the bounding box to the browser console so we can see how big the model natively is
    const box = new THREE.Box3().setFromObject(clonedScene);
    console.log("ROBOT NATIVE BOUNDING BOX:", box);
  }, [clonedScene]);

  useFrame((state) => {
    if (robotRef.current) {
      const time = state.clock.elapsedTime;

      // Look at cursor interactively
      const targetX = (state.pointer.x * Math.PI) / 4;
      const targetY = (state.pointer.y * Math.PI) / 4;
      
      // Interpolate rotation towards cursor
      robotRef.current.rotation.y += 0.05 * (targetX - robotRef.current.rotation.y);
      robotRef.current.rotation.x += 0.05 * (-targetY - robotRef.current.rotation.x);
      
      // Add a slow ambient turn so it looks alive even when not moving mouse
      robotRef.current.rotation.y += Math.sin(time * 0.5) * 0.01;

      // Physical drifting animation
      if (isHero) {
        // Hero Section: Massive drifting across the screen
        robotRef.current.position.x = Math.sin(time * 0.5) * 2.0; 
        robotRef.current.position.y = Math.cos(time * 0.4) * 1.0; 
        robotRef.current.position.z = Math.sin(time * 0.6) * 1.5; 
      } else {
        // Journey Section: Just a subtle, calm hover in place
        robotRef.current.position.y = Math.sin(time * 2) * 0.05;
        robotRef.current.position.x = 0;
        robotRef.current.position.z = 0;
      }
    }
  });

  return (
    <Float speed={3} rotationIntensity={0.5} floatIntensity={1}>
      <group position={position} scale={scale}>
        <primitive ref={robotRef} object={clonedScene} />
      </group>
    </Float>
  );
};

useGLTF.preload("/models/mini_robot.glb");

export default Robot;
