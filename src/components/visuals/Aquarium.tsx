import React, { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { ContactShadows, Environment } from "@react-three/drei";
import { useAquariumLogic } from "../../hooks/useAquariumLogic";
import AxolotlController from "./Axolotl/AxolotlController.tsx";
import Substrate from "./Environment/Substrate.tsx";
import { BubbleStream } from "./Environment/EnvironmentEffects.tsx";
import Worm from "../Food/Worm.tsx";
import Foliage, { type FoliageType } from "./Environment/CreateFoliage.tsx";
import Lighting from "./Environment/Lighting.tsx";
import type { AxolotlMood, AxolotlTrick } from "../../types/aquarium.ts";

export default function Aquarium() {
  const logic = useAquariumLogic();
  const [trick, setTrick] = useState<AxolotlTrick>("none");
  const [isPetting, setIsPetting] = useState(false);
  const [foliageStyle, setFoliageStyle] = useState<FoliageType>("seagrass");

  // Initial state is blank so she can start fresh, or set a default pet name
  const [petName, setPetName] = useState("");

  const cycleFoliage = () => {
    const types: FoliageType[] = ["seagrass", "kelp", "vines"];
    const nextIndex = (types.indexOf(foliageStyle) + 1) % types.length;
    setFoliageStyle(types[nextIndex]);
  };

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        position: "relative",
        background: logic.lightMode === "day" ? "#a2d2ff" : "#023e8a",
        transition: "background 1s ease",
        overflow: "hidden",
      }}
    >
      {/* Top Bar UI Navigation */}
      <div style={headerContainerStyle}>
        <div style={titleWrapperStyle}>
          <input
            type="text"
            value={petName}
            onChange={(e) => setPetName(e.target.value)}
            placeholder="Name your Axolotl..."
            style={nameInputStyle}
            spellCheck={false}
          />
        </div>

        <nav style={topBarStyle}>
          <div style={navGroupStyle}>
            <button onClick={logic.cycleColor} style={navBtnStyle}>
              🎨 {logic.currentColor.name}
            </button>
            <button
              onClick={() =>
                logic.setLightMode((l) => (l === "day" ? "night" : "day"))
              }
              style={navBtnStyle}
            >
              {logic.lightMode === "day" ? "☀️ DAY" : "🌙 NIGHT"}
            </button>
            <button onClick={logic.cycleSubstrate} style={navBtnStyle}>
              🪨 {logic.substrate.toUpperCase()}
            </button>
            <button
              onClick={cycleFoliage}
              style={navBtnStyle}
              disabled={!logic.showGrass}
            >
              {logic.showGrass ? `🌿 ${foliageStyle.toUpperCase()}` : "🌿 OFF"}
            </button>
            <button
              onClick={() => logic.setShowGrass(!logic.showGrass)}
              style={{ ...navBtnStyle, opacity: logic.showGrass ? 1 : 0.5 }}
            >
              {logic.showGrass ? "HIDE" : "SHOW"}
            </button>
          </div>

          <div style={dividerStyle} />

          <div style={navGroupStyle}>
            <button
              onClick={() =>
                logic.setMood((m: AxolotlMood) =>
                  m === "chill" ? "excited" : "chill",
                )
              }
              style={navBtnStyle}
            >
              {logic.mood === "excited" ? "⚡ FAST" : "🌊 SLOW"}
            </button>
            <button
              onClick={() => setTrick("barrelRoll")}
              disabled={trick !== "none"}
              style={navBtnStyle}
            >
              🌀 ROLL
            </button>
            <button
              onClick={() => setTrick("backflip")}
              disabled={trick !== "none"}
              style={navBtnStyle}
            >
              🤸 FLIP
            </button>
            <button
              onClick={() => setTrick("spin")}
              disabled={trick !== "none"}
              style={navBtnStyle}
            >
              🔄 SPIN
            </button>
          </div>

          <div style={dividerStyle} />

          <button onClick={logic.handleFeed} style={actionBtnStyle}>
            DROP WORM 🪱
          </button>
        </nav>
      </div>

      <Canvas shadows camera={{ position: [0, 0, 8], fov: 35 }}>
        <Lighting mode={logic.lightMode} />
        <BubbleStream />
        <Substrate type={logic.substrate} />
        <Foliage visible={logic.showGrass} type={foliageStyle} count={14} />

        {logic.worms.map((worm) => (
          <Worm key={worm.id} spawnX={0} />
        ))}

        <AxolotlController
          isPetting={isPetting}
          setIsPetting={setIsPetting}
          isFeeding={logic.worms.length > 0}
          colorPalette={logic.currentColor}
          mood={logic.mood}
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

// --- UPDATED STYLES ---

const headerContainerStyle: React.CSSProperties = {
  position: "absolute",
  top: "0",
  left: "0",
  width: "100%",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: "30px 0",
  zIndex: 100,
  pointerEvents: "none",
};

const titleWrapperStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "center",
  width: "100%",
  marginBottom: "15px",
  pointerEvents: "auto",
};

const nameInputStyle: React.CSSProperties = {
  background: "transparent",
  border: "none",
  color: "white",
  fontSize: "42px", // Bigger, more impactful title
  fontWeight: "900",
  textAlign: "center",
  outline: "none",
  width: "80%", // Large hit area for easy clicking
  textShadow: "0 4px 15px rgba(0,0,0,0.4)",
  fontFamily: "system-ui, sans-serif",
  letterSpacing: "-1px",
};

// ... Rest of the styles remain consistent with the capsule bar design
const topBarStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "15px",
  background: "rgba(255, 255, 255, 0.15)",
  backdropFilter: "blur(15px)",
  padding: "10px 25px",
  borderRadius: "50px",
  border: "1px solid rgba(255,255,255,0.2)",
  boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
  pointerEvents: "auto",
};

const navGroupStyle: React.CSSProperties = { display: "flex", gap: "8px" };
const dividerStyle: React.CSSProperties = {
  width: "1px",
  height: "24px",
  background: "rgba(255,255,255,0.3)",
};
const navBtnStyle: React.CSSProperties = {
  padding: "8px 14px",
  borderRadius: "20px",
  border: "none",
  background: "rgba(255,255,255,0.8)",
  color: "#0077b6",
  cursor: "pointer",
  fontSize: "12px",
  fontWeight: "bold",
  transition: "all 0.2s ease",
};
const actionBtnStyle: React.CSSProperties = {
  padding: "10px 20px",
  borderRadius: "25px",
  border: "none",
  background: "linear-gradient(135deg, #ff9ff3, #f368e0)",
  color: "white",
  fontWeight: "bold",
  cursor: "pointer",
  boxShadow: "0 4px 15px rgba(243, 104, 224, 0.4)",
};
