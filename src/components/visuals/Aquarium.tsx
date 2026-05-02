import React, { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { ContactShadows, Environment } from "@react-three/drei";
import AxolotlController from "./AxolotlController.tsx";
import Substrate, { SUBSTRATE_TYPES } from "./Substrate.tsx";
import { BubbleStream } from "./EnvironmentEffects.tsx";
import Worm from "./Food.tsx";
import Foliage from "./CreateFoliage.tsx";
import Lighting, { type LightMode } from "./Lighting.tsx";
import { AXOLOTL_COLORS } from "./AxolotlStyles.ts";

export default function Aquarium() {
  const [substrate] = useState<keyof typeof SUBSTRATE_TYPES>("gravel");
  const [lightMode, setLightMode] = useState<LightMode>("day");
  // We now use an array to track multiple active worms
  const [worms, setWorms] = useState<{ id: number }[]>([]);
  const [showGrass, setShowGrass] = useState(true);
  const [isPetting, setIsPetting] = useState(false);
  const [mood, setMood] = useState<"chill" | "excited">("chill");
  const [trick, setTrick] = useState<"none" | "barrelRoll">("none");
  const [colorIndex, setColorIndex] = useState(0);

  const currentColor = AXOLOTL_COLORS[colorIndex];

  const handleFeed = () => {
    const newId = Date.now();
    setWorms((prev) => [...prev, { id: newId }]);
    setMood("excited");

    // Reduce this cleanup timer.
    // If the worm drops from 2.5 at speed 1.2, it hits the center in ~2 seconds.
    setTimeout(() => {
      setWorms((prev) => prev.filter((w) => w.id !== newId));
    }, 2100); // Worm vanishes right after passing the "mouth" zone

    setTimeout(() => setMood("chill"), 4000);
  };

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        position: "relative",
        background: lightMode === "day" ? "#a2d2ff" : "#023e8a",
        transition: "background 1s ease",
      }}
    >
      <div
        style={{
          position: "absolute",
          bottom: "30px",
          right: "30px",
          zIndex: 10,
        }}
      >
        <section style={glassCardStyle}>
          <div style={groupStyle}>
            <small style={labelStyle}>GENETICS & ENVIRONMENT</small>
            <div style={rowStyle}>
              <button
                onClick={() =>
                  setColorIndex((c) => (c + 1) % AXOLOTL_COLORS.length)
                }
                style={btnStyle}
              >
                🎨 {currentColor.name}
              </button>
              <button
                onClick={() =>
                  setLightMode((l) => (l === "day" ? "night" : "day"))
                }
                style={btnStyle}
              >
                {lightMode === "day" ? "☀️ DAY" : "🌙 NIGHT"}
              </button>
              <button onClick={() => setShowGrass(!showGrass)} style={btnStyle}>
                {showGrass ? "🌿 ON" : "🌿 OFF"}
              </button>
            </div>
          </div>

          <div style={groupStyle}>
            <small style={labelStyle}>BEHAVIOR</small>
            <div style={rowStyle}>
              <button
                onClick={() =>
                  setMood((m) => (m === "chill" ? "excited" : "chill"))
                }
                style={btnStyle}
              >
                {mood === "excited" ? "⚡ FAST" : "🌊 SLOW"}
              </button>
              <button
                onClick={() => setTrick("barrelRoll")}
                disabled={trick !== "none"}
                style={btnStyle}
              >
                {trick !== "none" ? "🌀..." : "✨ DO TRICK"}
              </button>
            </div>
          </div>

          {/* No longer disabled, so you can spam! */}
          <button onClick={handleFeed} style={feedBtnStyle}>
            DROP WORM 🪱
          </button>
        </section>
      </div>

      <Canvas shadows camera={{ position: [0, 0, 8], fov: 35 }}>
        <Lighting mode={lightMode} />
        <BubbleStream />
        <Substrate type={substrate} />
        <Foliage visible={showGrass} />

        {/* Map through the worms array to render multiple worms */}
        {worms.map((worm) => (
          <Worm key={worm.id} spawnX={0} />
        ))}

        <AxolotlController
          isPetting={isPetting}
          setIsPetting={setIsPetting}
          // If there is at least one worm in the water, she is in feeding mode
          isFeeding={worms.length > 0}
          colorPalette={currentColor}
          mood={mood}
          trick={trick}
          onTrickComplete={() => setTrick("none")}
        />

        <Environment preset="sunset" />
        <ContactShadows
          position={[0, -2.45, 0]}
          opacity={0.3}
          scale={15}
          blur={2.5}
        />
      </Canvas>
    </div>
  );
}

// Styles remain the same
const glassCardStyle: React.CSSProperties = {
  background: "rgba(255, 255, 255, 0.85)",
  backdropFilter: "blur(12px)",
  padding: "20px",
  borderRadius: "24px",
  display: "flex",
  flexDirection: "column",
  gap: "15px",
  width: "240px",
  border: "1px solid rgba(255,255,255,0.4)",
  boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
};
const groupStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "6px",
};
const rowStyle: React.CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  gap: "8px",
};
const labelStyle: React.CSSProperties = {
  fontSize: "10px",
  fontWeight: "bold",
  color: "#0077b6",
  letterSpacing: "0.5px",
};
const btnStyle: React.CSSProperties = {
  padding: "8px 12px",
  borderRadius: "10px",
  border: "none",
  background: "#f0f9ff",
  color: "#0077b6",
  cursor: "pointer",
  fontSize: "11px",
  fontWeight: "bold",
  boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
};
const feedBtnStyle: React.CSSProperties = {
  padding: "14px",
  borderRadius: "15px",
  border: "none",
  background: "linear-gradient(135deg, #0077b6, #00b4d8)",
  color: "white",
  fontWeight: "bold",
  cursor: "pointer",
  boxShadow: "0 4px 15px rgba(0,119,182,0.3)",
};
