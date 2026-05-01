import React, { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { ContactShadows } from "@react-three/drei";
import AxolotlController from "./AxolotlController.tsx";
import Substrate, { SUBSTRATE_TYPES } from "./Substrate.tsx";
import { BubbleStream } from "./EnvironmentEffects.tsx";
import Worm from "./Food.tsx";
import { AXOLOTL_COLORS } from "./AxolotlPet.tsx";
// NEW: Import Lighting
import Lighting, { type LightMode } from "./Lighting.tsx";

export default function Aquarium() {
  const [substrate, setSubstrate] =
    useState<keyof typeof SUBSTRATE_TYPES>("gravel");
  const [lightMode, setLightMode] = useState<LightMode>("day");
  const [isFeeding, setIsFeeding] = useState(false);
  const [isPetting, setIsPetting] = useState(false);

  const currentPalette = AXOLOTL_COLORS[0];

  const handleFeed = () => {
    if (isFeeding) return;
    setIsFeeding(true);
    setTimeout(() => setIsFeeding(false), 4500);
  };

  const toggleLighting = () => {
    setLightMode((prev) => (prev === "day" ? "night" : "day"));
  };

  // Dynamic Background based on LightMode
  const backgroundStyle = {
    background:
      lightMode === "day"
        ? "linear-gradient(180deg, #6a7fdf 0%, #6a7fdf  100%)"
        : "linear-gradient(180deg, #290bd6 0%, #023e8a 100%)",
  };

  return (
    <div style={{ ...aquariumContainerStyle, ...backgroundStyle }}>
      {/* UI Overlay */}
      <div style={uiContainerStyle}>
        <section style={uiGroupStyle}>
          <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
            {/* Substrate Controls */}
            <div>
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
            </div>

            {/* Lighting Toggle */}
            <div>
              <small style={labelStyle}>TIME OF DAY</small>
              <button
                onClick={toggleLighting}
                style={lightToggleStyle(lightMode === "night")}
              >
                {lightMode === "day" ? "☀️ DAY" : "🌙 NIGHT"}
              </button>
            </div>
          </div>
        </section>

        <button onClick={handleFeed} style={feedButtonStyle(isFeeding)}>
          {isFeeding ? "CHOMPING..." : "DROP WORM 🪱"}
        </button>
      </div>

      <Canvas shadows camera={{ position: [0, 0, 8], fov: 35 }}>
        {/* New Lighting Component handles environment colors and caustics */}
        <Lighting mode={lightMode} />

        <BubbleStream />
        <Substrate type={substrate} />
        <Worm active={isFeeding} />

        {/* The Star of the Show */}
        <AxolotlController
          isPetting={isPetting}
          setIsPetting={setIsPetting}
          isFeeding={isFeeding}
          colorPalette={currentPalette}
        />

        {/* Water Volume: This gives the air "thickness" */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[20, 20, 20]} />
          <meshStandardMaterial
            color={lightMode === "day" ? "#90e0ef" : "#0077b6"}
            transparent
            opacity={0.05}
            side={2} // THREE.BackSide: we are inside the box
          />
        </mesh>

        <ContactShadows
          position={[0, -2.45, 0]}
          opacity={lightMode === "day" ? 0.3 : 0.15}
          scale={15}
          blur={2.5}
          color={lightMode === "day" ? "#0077b6" : "#000000"}
        />
      </Canvas>
    </div>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────

const aquariumContainerStyle: React.CSSProperties = {
  width: "100vw",
  height: "100vh",
  position: "relative",
  overflow: "hidden",
  transition: "background 1.5s ease", // Smooth background transition
};

const lightToggleStyle = (isNight: boolean): React.CSSProperties => ({
  padding: "8px 16px",
  borderRadius: "20px",
  border: "none",
  cursor: "pointer",
  background: isNight ? "#03045e" : "#ffb703",
  color: "#fff",
  fontSize: "10px",
  fontWeight: "bold",
  transition: "all 0.3s ease",
  marginTop: "5px",
  display: "block",
});

// Preserving your previous UI styles...
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
  border: "1px solid rgba(0, 119, 182, 0.2)",
  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
  pointerEvents: "auto",
};

const buttonRowStyle: React.CSSProperties = {
  display: "flex",
  gap: "8px",
  marginTop: "5px",
};

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
