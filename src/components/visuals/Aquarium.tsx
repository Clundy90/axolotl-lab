import React, { useState, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, ContactShadows } from "@react-three/drei";
import ToyAxolotl from "./ToyAxolotl.tsx";

function Bubbles() {
  const ref = useRef<any>();
  useFrame(() => {
    if (ref.current) {
      ref.current.position.y += 0.002; // Very slow bubbles
      if (ref.current.position.y > 4) ref.current.position.y = -4;
    }
  });
  return (
    <group ref={ref}>
      {[...Array(30)].map((_, i) => (
        <mesh
          key={i}
          position={[
            Math.random() * 10 - 5,
            Math.random() * 8 - 4,
            Math.random() * 4 - 2,
          ]}
        >
          <sphereGeometry args={[0.02]} />
          <meshStandardMaterial color="white" transparent opacity={0.2} />
        </mesh>
      ))}
    </group>
  );
}

export default function Aquarium() {
  const [isPetting, setIsPetting] = useState(false);

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        background: "radial-gradient(circle, #1e3c72 0%, #0a192f 100%)",
      }}
    >
      <Canvas camera={{ position: [0, 0, 8], fov: 35 }}>
        <ambientLight intensity={0.8} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <Bubbles />
        <ToyAxolotl isPetting={isPetting} setIsPetting={setIsPetting} />
        <Environment preset="city" />
        <ContactShadows
          position={[0, -2, 0]}
          opacity={0.3}
          scale={15}
          blur={2.5}
        />
      </Canvas>
    </div>
  );
}
