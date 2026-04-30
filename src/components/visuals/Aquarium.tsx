import React, { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { ContactShadows } from "@react-three/drei";
import ToyAxolotl from "./ToyAxolotl.tsx";
import Substrate, { SUBSTRATE_TYPES } from "./Substrate.tsx";
import { BubbleStream } from "./EnvironmentEffects.tsx";
import Worm from "./Food.tsx"; // Independent component
import { AXOLOTL_COLORS } from "./AxolotlPet.tsx";

export default function Aquarium() {
  const [substrate, setSubstrate] =
    useState<keyof typeof SUBSTRATE_TYPES>("gravel");
  const [isFeeding, setIsFeeding] = useState(false);

  const handleFeed = () => {
    if (isFeeding) return;
    setIsFeeding(true);
    // Worm falls for 4.5 seconds
    setTimeout(() => setIsFeeding(false), 4500);
  };

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        position: "relative",
        background: "linear-gradient(180deg, #caf0f8 0%, #90e0ef 100%)",
        overflow: "hidden",
      }}
    >
      <div style={uiContainerStyle}>
        <section style={uiGroupStyle}>
          <small style={labelStyle}>TANK FLOOR</small>
          <div style={buttonRowStyle}>
            {Object.keys(SUBSTRATE_TYPES).map((s) => (
              <button
                key={s}
                onClick={() => setSubstrate(s as any)}
                style={buttonStyle(substrate === s)}
              >
                {s.toUpperCase()}
              </button>
            ))}
          </div>
        </section>

        <button onClick={handleFeed} style={feedButtonStyle(isFeeding)}>
          {isFeeding ? "CHOMPING..." : "DROP WORM 🪱"}
        </button>
      </div>

      <Canvas shadows camera={{ position: [0, 0, 8], fov: 35 }}>
        <ambientLight intensity={0.8} color="#ffffff" />
        <directionalLight position={[5, 10, 5]} intensity={0.6} castShadow />
        <spotLight
          position={[0, 8, 0]}
          intensity={1.5}
          angle={0.5}
          penumbra={1}
          color="#ffffff"
        />

        <BubbleStream />
        <Substrate type={substrate} />

        {/* Worm is now an independent actor in the scene */}
        <Worm active={isFeeding} />

        <ToyAxolotl
          isPetting={false}
          setIsPetting={() => {}}
          isFeeding={isFeeding}
          colorPalette={AXOLOTL_COLORS[0]}
        />

        <ContactShadows
          position={[0, -2.45, 0]}
          opacity={0.3}
          scale={15}
          blur={2.5}
          color="#0077b6"
        />
      </Canvas>
    </div>
  );
}

// ... (Styles from previous response preserved)
const uiContainerStyle: React.CSSProperties = {
  position: "absolute",
  bottom: "40px",
  left: "50%",
  transform: "translateX(-50%)",
  zIndex: 10,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "15px",
  width: "100%",
  pointerEvents: "none",
};
const uiGroupStyle: React.CSSProperties = {
  background: "rgba(255, 255, 255, 0.85)",
  backdropFilter: "blur(10px)",
  padding: "12px 24px",
  borderRadius: "50px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "5px",
  border: "1px solid rgba(0, 119, 182, 0.2)",
  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
  pointerEvents: "auto",
};
const buttonRowStyle: React.CSSProperties = { display: "flex", gap: "8px" };
const labelStyle: React.CSSProperties = {
  color: "#0077b6",
  fontSize: "9px",
  fontWeight: "bold",
  letterSpacing: "1px",
};
const buttonStyle = (active: boolean): React.CSSProperties => ({
  padding: "8px 16px",
  borderRadius: "20px",
  border: "none",
  cursor: "pointer",
  background: active ? "#0077b6" : "rgba(0, 119, 182, 0.1)",
  color: active ? "#fff" : "#0077b6",
  fontSize: "10px",
  fontWeight: "bold",
  transition: "all 0.2s ease",
});
const feedButtonStyle = (active: boolean): React.CSSProperties => ({
  padding: "14px 32px",
  borderRadius: "50px",
  border: "none",
  cursor: active ? "default" : "pointer",
  background: active ? "#90e0ef" : "linear-gradient(135deg, #0077b6, #00b4d8)",
  color: "#fff",
  fontWeight: "bold",
  fontSize: "14px",
  letterSpacing: "1px",
  pointerEvents: "auto",
  boxShadow: active ? "none" : "0 4px 15px rgba(0, 119, 182, 0.3)",
});
