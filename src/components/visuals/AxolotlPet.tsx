import React, { useState, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows, Environment } from "@react-three/drei";
import * as THREE from "three";
import ToyAxolotl from "./ToyAxolotl.tsx";

// ─── Constants for Themes & Customisation ─────────────────────────────────────
// We define our aquarium themes and axolotl color palettes here so they can be
// easily toggled via the UI buttons.
const TANK_THEMES = [
  {
    name: "Ocean Blue",
    bg: "radial-gradient(ellipse at 50% 30%, #1a4a72 0%, #0a1e35 60%, #050e1a 100%)",
    ambient: "#a8d4f5",
    mainLight: "#c8e8ff",
  },
  {
    name: "Midnight Purple",
    bg: "radial-gradient(ellipse at 50% 30%, #2b1a72 0%, #120a35 60%, #08051a 100%)",
    ambient: "#d4a8f5",
    mainLight: "#e8c8ff",
  },
  {
    name: "Swamp Green",
    bg: "radial-gradient(ellipse at 50% 30%, #1a724a 0%, #0a351e 60%, #051a0e 100%)",
    ambient: "#a8f5d4",
    mainLight: "#c8ffe8",
  },
];

export const AXOLOTL_COLORS = [
  { name: "Pink", main: "#ffb3c6", light: "#ffd6e0", dark: "#ff6b8a" },
  { name: "Blue", main: "#8ae0f5", light: "#c4f0fc", dark: "#2cb8db" },
  { name: "Gold", main: "#f5d48a", light: "#fae7bc", dark: "#db9a2c" },
  { name: "Wild", main: "#6b8a4a", light: "#8ca86e", dark: "#4a6331" }, // Earthy green
];

// ─── Individual Bubble ────────────────────────────────────────────────────────
// Each bubble has its own randomised starting position, speed, and wobble,
// so they never all move in sync.
interface BubbleData {
  x: number;
  z: number;
  startY: number;
  speed: number;
  wobbleFreq: number;
  wobbleAmp: number;
  size: number;
}

function Bubble({ data }: { data: BubbleData }) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.getElapsedTime();

    // Rise at individual speed, wrapping when above tank top
    ref.current.position.y = ((data.startY + t * data.speed) % 8) - 4;

    // Gentle horizontal wobble — makes them look buoyant, not mechanical
    ref.current.position.x =
      data.x + Math.sin(t * data.wobbleFreq + data.startY) * data.wobbleAmp;
    ref.current.position.z =
      data.z +
      Math.cos(t * data.wobbleFreq * 0.7 + data.startY) * data.wobbleAmp * 0.5;
  });

  return (
    <mesh ref={ref} position={[data.x, data.startY, data.z]}>
      <sphereGeometry args={[data.size, 8, 8]} />
      <meshStandardMaterial
        color="#ffffff"
        transparent
        opacity={0.3}
        roughness={0.0}
        metalness={0.1}
      />
    </mesh>
  );
}

function Bubbles() {
  // Generate stable bubble data once — useMemo prevents re-randomising on re-render
  const bubbles = useMemo<BubbleData[]>(() => {
    return Array.from({ length: 35 }, () => ({
      x: (Math.random() - 0.5) * 10,
      z: (Math.random() - 0.5) * 4,
      startY: (Math.random() - 0.5) * 8,
      speed: 0.3 + Math.random() * 0.5,
      wobbleFreq: 0.8 + Math.random() * 1.2,
      wobbleAmp: 0.04 + Math.random() * 0.12,
      size: 0.015 + Math.random() * 0.025,
    }));
  }, []);

  return (
    <>
      {bubbles.map((data, i) => (
        <Bubble key={i} data={data} />
      ))}
    </>
  );
}

// ─── Aquarium glass walls (subtle box outline) ────────────────────────────────
function TankWalls({ theme }: { theme: any }) {
  // We use useMemo to generate the gravel so it doesn't shift when we change themes
  const gravel = useMemo(
    () =>
      Array.from({ length: 50 }, () => ({
        x: (Math.random() - 0.5) * 13,
        z: (Math.random() - 0.5) * 5,
        size: 0.04 + Math.random() * 0.08,
        color: ["#4a7c99", "#5a8fa8", "#3d6b8a", "#2d5570"][
          Math.floor(Math.random() * 4)
        ],
      })),
    [],
  );

  return (
    <>
      {/* Tank floor */}
      <mesh position={[0, -2.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[14, 6]} />
        {/* The floor color slightly adapts to the ambient light of the theme */}
        <meshStandardMaterial color={theme.ambient} roughness={1} />
      </mesh>

      {/* Gravel / substrate texture — row of rounded pebbles */}
      {gravel.map((rock, i) => (
        <mesh key={i} position={[rock.x, -2.42, rock.z]}>
          <sphereGeometry args={[rock.size, 6, 6]} />
          <meshStandardMaterial color={rock.color} roughness={0.9} />
        </mesh>
      ))}
    </>
  );
}

// ─── Main Application Wrapper ──────────────────────────────────────────────────
export default function AxolotlPet() {
  const [isPetting, setIsPetting] = useState(false);
  const [isFeeding, setIsFeeding] = useState(false);

  // Customization States
  const [themeIndex, setThemeIndex] = useState(0);
  const [colorIndex, setColorIndex] = useState(0);

  const currentTheme = TANK_THEMES[themeIndex];
  const currentColor = AXOLOTL_COLORS[colorIndex];

  // Feeding logic: trigger the animation and disable button temporarily
  const handleFeed = () => {
    if (isFeeding) return;
    setIsFeeding(true);
    // The worm falling animation takes about 2.5 seconds, then we turn feeding off
    setTimeout(() => setIsFeeding(false), 2500);
  };

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        background: currentTheme.bg,
        position: "relative",
        transition: "background 1s ease-in-out", // Smooth fade between themes
      }}
    >
      <Canvas camera={{ position: [0, 0, 6], fov: 45 }}>
        {/* ── Dynamic Lighting based on Theme ── */}
        <ambientLight intensity={0.55} color={currentTheme.ambient} />
        <pointLight
          position={[0, 6, 2]}
          intensity={1.2}
          color={currentTheme.mainLight}
        />

        {/* Rim lights to make the axolotl pop against the background */}
        <pointLight
          position={[6, 2, 4]}
          intensity={0.5}
          color={currentColor.dark}
        />
        <pointLight
          position={[-6, 2, 4]}
          intensity={0.5}
          color={currentColor.dark}
        />

        <TankWalls theme={currentTheme} />
        <Bubbles />

        {/* ── The Axolotl ── */}
        {/* We pass the active color palette and states down to the model */}
        <ToyAxolotl
          isPetting={isPetting}
          setIsPetting={setIsPetting}
          isFeeding={isFeeding}
          colorPalette={currentColor}
        />

        <ContactShadows
          opacity={0.3}
          scale={12}
          blur={2.5}
          far={4.5}
          color="#0a2a4a"
        />
        <Environment preset="sunset" />
      </Canvas>

      {/* ── Interactive UI Overlay ── */}
      <div
        style={{
          position: "absolute",
          bottom: "30px",
          width: "100%",
          display: "flex",
          justifyContent: "center",
          gap: "15px",
        }}
      >
        <button
          onClick={handleFeed}
          disabled={isFeeding}
          style={buttonStyle(currentColor.light)}
        >
          Feed 🪱
        </button>

        <button
          onClick={() =>
            setColorIndex((prev) => (prev + 1) % AXOLOTL_COLORS.length)
          }
          style={buttonStyle(currentColor.light)}
        >
          Gene Splicer 🎨
        </button>

        <button
          onClick={() =>
            setThemeIndex((prev) => (prev + 1) % TANK_THEMES.length)
          }
          style={buttonStyle(currentColor.light)}
        >
          Lighting 💡
        </button>
      </div>
    </div>
  );
}

// Helper for UI styling to keep the JSX clean
const buttonStyle = (bgColor: string): React.CSSProperties => ({
  padding: "12px 24px",
  borderRadius: "20px",
  fontSize: "1.2rem",
  cursor: "pointer",
  border: "2px solid rgba(255,255,255,0.3)",
  backgroundColor: bgColor,
  backdropFilter: "blur(8px)",
  color: "#333",
  fontWeight: 600,
  boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
  transition: "transform 0.1s ease",
});
