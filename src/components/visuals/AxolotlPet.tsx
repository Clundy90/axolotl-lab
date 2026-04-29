import React, { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { ContactShadows, Environment } from "@react-three/drei";
import ToyAxolotl from "./ToyAxolotl.tsx"; // Explicit extension for Astro

export default function AxolotlPet() {
  const [isHappy, setIsHappy] = useState(false);

  return (
    /* This container MUST have a fixed height for the Canvas to appear */
    <div
      style={{
        width: "100vw",
        height: "100vh",
        background: "radial-gradient(circle, #2a5298 0%, #1e3c72 100%)",
        position: "relative",
      }}
    >
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
        <ambientLight intensity={0.7} />
        <pointLight position={[10, 10, 10]} />

        <ToyAxolotl isHappy={isHappy} setIsHappy={setIsHappy} />

        <ContactShadows opacity={0.4} scale={10} blur={2} far={4.5} />
        <Environment preset="city" />
      </Canvas>

      {/* UI Overlay */}
      <div
        style={{
          position: "absolute",
          bottom: "50px",
          width: "100%",
          textAlign: "center",
        }}
      >
        <button
          onMouseEnter={() => setIsHappy(true)}
          onMouseLeave={() => setIsHappy(false)}
          style={{
            padding: "15px 30px",
            borderRadius: "20px",
            fontSize: "1.5rem",
            cursor: "pointer",
            border: "none",
            backgroundColor: "#ffccd5",
          }}
        >
          Feeding Time 🪱
        </button>
      </div>
    </div>
  );
}
