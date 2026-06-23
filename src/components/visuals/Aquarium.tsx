import React, { useState } from "react";
import AquariumScene from "./AquariumScene";
import { AquariumProvider, useAquarium } from "../../context/AquariumContext";
import {
  AquariumUiProvider,
  useAquariumUi,
} from "../../context/AquariumUiContext";

type AxolotlPartId =
  | "body"
  | "gills"
  | "fins"
  | "tail"
  | "legs"
  | "toes"
  | "eyes";

interface PartConfig {
  id: AxolotlPartId;
  label: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// DESIGN TOKENS — girly kawaii palette for the aquarium UI
// ─────────────────────────────────────────────────────────────────────────────
const COLORS = {
  // Banner & panel backgrounds
  bannerBg: "linear-gradient(135deg, #FF9ECD 0%, #D48FFF 50%, #9FC8FF 100%)",
  drawerBg: "linear-gradient(160deg, #FFD6F0 0%, #EDD6FF 60%, #D6EEFF 100%)",

  // Tab category accent colors (banner buttons)
  care: "#FF6EB4", // hot pink
  moods: "#B57BEE", // lavender
  tricks: "#7BBEEE", // sky blue
  access: "#F4A261", // peachy-orange
  color: "#EE7BBA", // bubblegum

  toys: "#FF6EB4",
  tank: "#7BCFEE",
  bg: "#B57BEE",

  // Subtle action buttons inside drawers
  green: "#5CCC8E",
  teal: "#3CC9C9",
  pink: "#FF6EB4",
  purple: "#B57BEE",
  blue: "#5BA8E5",
  yellow: "#F9D44A",
  orange: "#F4925C",
  red: "#F46C5C",
  grey: "#9BBAC4",

  // Active / selected highlight
  active: "#FFE66D",
  activeText: "#7A3F00",

  // Text
  white: "#FFFFFF",
  dark: "#5C3A7A", // deep purple for contrast on light panels
};

// ─────────────────────────────────────────────────────────────────────────────
// STYLE HELPERS
// ─────────────────────────────────────────────────────────────────────────────

/** Pill-shaped action button used throughout the drawer panels */
const pillBtn = (bgColor: string, isActive = false): React.CSSProperties => ({
  padding: "9px 14px",
  cursor: "pointer",
  background: isActive ? COLORS.active : bgColor,
  color: isActive ? COLORS.activeText : COLORS.white,
  border: `3px solid ${COLORS.white}`,
  borderRadius: "50px",
  fontSize: "12px",
  fontWeight: "bold",
  textShadow: isActive ? "none" : "0 1px 2px rgba(0,0,0,0.25)",
  boxShadow: "0 4px 0px rgba(0,0,0,0.12)",
  transition: "transform 0.1s ease, box-shadow 0.1s ease",
  outline: "none",
  whiteSpace: "nowrap" as const,
});

/** Tab button sitting in the banner bar */
const tabBtn = (
  accentColor: string,
  isActive: boolean,
): React.CSSProperties => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "3px",
  padding: "8px 14px",
  cursor: "pointer",
  background: isActive ? "rgba(255,255,255,0.92)" : "rgba(255,255,255,0.28)",
  color: isActive ? accentColor : COLORS.white,
  border: `3px solid ${isActive ? accentColor : "rgba(255,255,255,0.6)"}`,
  borderRadius: "20px",
  fontSize: "10px",
  fontWeight: "bold",
  textShadow: isActive ? "none" : "0 1px 2px rgba(0,0,0,0.2)",
  boxShadow: isActive
    ? `0 0 0 2px ${accentColor}44, 0 4px 12px rgba(0,0,0,0.15)`
    : "0 2px 8px rgba(0,0,0,0.1)",
  transition: "all 0.18s ease",
  outline: "none",
  letterSpacing: "0.4px",
});

/** The shared drawer panel that slides open beneath the banner */
const drawerStyle: React.CSSProperties = {
  position: "absolute",
  top: "88px", // just below the 80px banner
  left: "50%",
  transform: "translateX(-50%)",
  background: COLORS.drawerBg,
  border: "4px solid rgba(255,255,255,0.9)",
  borderRadius: "24px",
  padding: "16px 20px",
  pointerEvents: "auto",
  boxShadow: "0 12px 32px rgba(160,80,200,0.18), 0 4px 0px rgba(0,0,0,0.08)",
  display: "flex",
  flexWrap: "wrap" as const,
  gap: "10px",
  alignItems: "center",
  justifyContent: "center",
  maxWidth: "820px",
  zIndex: 20,
  animation: "dropIn 0.18s ease",
};

/** Inline CSS injected once for animations */
const globalStyles = `
  @keyframes dropIn {
    from { opacity: 0; transform: translateX(-50%) translateY(-10px); }
    to   { opacity: 1; transform: translateX(-50%) translateY(0); }
  }
  @keyframes rainbowGlow {
    0%   { box-shadow: 0 0 12px 3px #FF9ECD99, 0 4px 0 #e06aa0; }
    33%  { box-shadow: 0 0 12px 3px #D48FFF99, 0 4px 0 #a86de0; }
    66%  { box-shadow: 0 0 12px 3px #9FC8FF99, 0 4px 0 #6a9de0; }
    100% { box-shadow: 0 0 12px 3px #FF9ECD99, 0 4px 0 #e06aa0; }
  }
  .axolotl-name-input {
    animation: rainbowGlow 3s ease-in-out infinite;
  }
  .pill-btn:hover { transform: translateY(-2px); }
  .pill-btn:active { transform: translateY(1px); box-shadow: 0 2px 0px rgba(0,0,0,0.12); }
`;

// ─────────────────────────────────────────────────────────────────────────────
// SECTION LABEL — small divider label used inside drawers
// ─────────────────────────────────────────────────────────────────────────────
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <span
      style={{
        fontSize: "11px",
        fontWeight: "bold",
        color: COLORS.dark,
        opacity: 0.7,
        letterSpacing: "0.6px",
        width: "100%",
        textAlign: "center",
        userSelect: "none",
      }}
    >
      {children}
    </span>
  );
}

function AquariumUiOverlay() {
  const aquarium = useAquarium() as any;
  const ui = useAquariumUi() as any;

  // Detailed Comment: activePanel tracks which top-bar tab is currently open;
  // null means the drawer is closed. Both the left (axolotl) and right (deco)
  // tab groups share one drawer slot — only one panel is visible at a time.
  const [activePanel, setActivePanel] = useState<string | null>(null);

  const [showCustomColors, setShowCustomColors] = useState<boolean>(false);
  const [showSubstrate, setShowSubstrate] = useState<boolean>(true);

  // Detailed Comment: Tracks the text input for the main interactive floating title banner
  const [axolotlName, setAxolotlName] = useState<string>("My Axolotl");

  const bodyParts: PartConfig[] = [
    { id: "body", label: "Body" },
    { id: "gills", label: "Gills" },
    { id: "fins", label: "Fins" },
    { id: "tail", label: "Tail" },
    { id: "legs", label: "Legs" },
    { id: "toes", label: "Toes" },
    { id: "eyes", label: "Eyes" },
  ];

  // Detailed Comment: Reusable button styling helper to maintain a thick, cartoony, clickable look
  const getGameButtonStyle = (bgColor: string, isActive?: boolean) => ({
    ...pillBtn(bgColor, isActive),
  });

  // Detailed Comment: Toggle helper — clicking the same tab again closes the drawer
  const togglePanel = (id: string) =>
    setActivePanel((prev) => (prev === id ? null : id));

  return (
    <>
      {/* ── Inject global keyframe animations once ── */}
      <style>{globalStyles}</style>

      {/*
        ═══════════════════════════════════════════════════════════════════
        OUTER OVERLAY WRAPPER
        Full-screen, pointer-events: none so the 3D scene stays clickable.
        Only interactive children set pointerEvents: auto.
        ═══════════════════════════════════════════════════════════════════
      */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          pointerEvents: "none",
          fontFamily: '"Arial Rounded MT Bold", "Comic Sans MS", sans-serif',
          zIndex: 10,
        }}
      >
        {/*
          ─────────────────────────────────────────────────────────────────
          TOP BANNER BAR
          A single pill-shaped strip that holds:
            • Left group  — axolotl care tabs (Care, Moods, Tricks, Accessories, Colors)
            • Center      — glowing pet name input (the signature element)
            • Right group — environment/deco tabs (Toys, Tank, Backgrounds)
          ─────────────────────────────────────────────────────────────────
        */}
        <div
          style={{
            position: "absolute",
            top: "14px",
            left: "50%",
            transform: "translateX(-50%)",
            background: COLORS.bannerBg,
            borderRadius: "50px",
            border: "4px solid rgba(255,255,255,0.85)",
            padding: "8px 16px",
            pointerEvents: "auto",
            boxShadow:
              "0 8px 0px rgba(180,100,220,0.3), 0 14px 32px rgba(180,80,200,0.22)",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            zIndex: 30,
            whiteSpace: "nowrap",
          }}
        >
          {/* ── LEFT TAB GROUP: AXOLOTL ── */}
          <button
            className="pill-btn"
            style={tabBtn(COLORS.care, activePanel === "CARE")}
            onClick={() => togglePanel("CARE")}
          >
            <span style={{ fontSize: "16px" }}>🍖</span>
            CARE
          </button>
          <button
            className="pill-btn"
            style={tabBtn(COLORS.moods, activePanel === "MOODS")}
            onClick={() => togglePanel("MOODS")}
          >
            <span style={{ fontSize: "16px" }}>😎</span>
            MOODS
          </button>
          <button
            className="pill-btn"
            style={tabBtn(COLORS.tricks, activePanel === "TRICKS")}
            onClick={() => togglePanel("TRICKS")}
          >
            <span style={{ fontSize: "16px" }}>💫</span>
            TRICKS
          </button>
          <button
            className="pill-btn"
            style={tabBtn(COLORS.access, activePanel === "ACCESS")}
            onClick={() => togglePanel("ACCESS")}
          >
            <span style={{ fontSize: "16px" }}>👑</span>
            DRESS UP
          </button>

          {/* ── CENTER: PET NAME INPUT (signature glowing element) ── */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              margin: "0 6px",
            }}
          >
            <span style={{ fontSize: "20px" }}>🌸</span>
            <input
              type="text"
              value={axolotlName}
              onChange={(e) => setAxolotlName(e.target.value)}
              placeholder="Name your axolotl!"
              className="axolotl-name-input"
              style={{
                background: "rgba(255,255,255,0.88)",
                border: "3px solid #fff",
                borderRadius: "30px",
                color: COLORS.dark,
                fontSize: "16px",
                fontWeight: "bold",
                outline: "none",
                width: "190px",
                padding: "6px 16px",
                textAlign: "center",
                fontFamily: "inherit",
                letterSpacing: "0.3px",
              }}
            />
            <span style={{ fontSize: "20px" }}>🌸</span>
          </div>

          <button
            className="pill-btn"
            style={tabBtn(COLORS.color, activePanel === "COLOR")}
            onClick={() => togglePanel("COLOR")}
          >
            <span style={{ fontSize: "16px" }}>🎨</span>
            COLORS
          </button>

          {/* ── RIGHT TAB GROUP: TANK / DECO ── */}
          <button
            className="pill-btn"
            style={tabBtn(COLORS.toys, activePanel === "TOYS")}
            onClick={() => togglePanel("TOYS")}
          >
            <span style={{ fontSize: "16px" }}>🏰</span>
            TOYS
          </button>
          <button
            className="pill-btn"
            style={tabBtn(COLORS.tank, activePanel === "TANK")}
            onClick={() => togglePanel("TANK")}
          >
            <span style={{ fontSize: "16px" }}>🌿</span>
            TANK
          </button>
          <button
            className="pill-btn"
            style={tabBtn(COLORS.bg, activePanel === "BG")}
            onClick={() => togglePanel("BG")}
          >
            <span style={{ fontSize: "16px" }}>🖼️</span>
            SCENES
          </button>
        </div>

        {/*
          ─────────────────────────────────────────────────────────────────
          DRAWER PANELS
          One shared slot — only the active panel renders, centered under
          the banner. Each panel uses drawerStyle as its base.
          All logic hookups are identical to the original side panels.
          ─────────────────────────────────────────────────────────────────
        */}

        {/* ── CARE PANEL ── */}
        {activePanel === "CARE" && (
          <div style={drawerStyle}>
            <SectionLabel>🌟 LOOK AFTER YOUR AXOLOTL 🌟</SectionLabel>
            <button
              className="pill-btn"
              style={pillBtn(COLORS.green)}
              onClick={() => aquarium.handleFeed?.()}
            >
              🍖 Feed Food
            </button>
            <button
              className="pill-btn"
              style={pillBtn(COLORS.teal)}
              onClick={() => aquarium.handleDropTreat?.()}
            >
              🍬 Give a Treat
            </button>
            <button
              className="pill-btn"
              style={pillBtn(ui.isPetting ? COLORS.care : COLORS.pink)}
              onClick={() => {
                if (ui.setIsPetting) {
                  ui.setIsPetting(true);
                  setTimeout(() => ui.setIsPetting(false), 2500);
                }
              }}
            >
              {ui.isPetting ? "❤️ Petting..." : "👋 Pet Axolotl"}
            </button>
          </div>
        )}

        {/* ── MOODS PANEL ── */}
        {activePanel === "MOODS" && (
          <div style={drawerStyle}>
            <SectionLabel>💜 PICK A MOOD 💜</SectionLabel>
            {["chill", "excited", "lazy"].map((mood) => (
              <button
                key={mood}
                className="pill-btn"
                style={pillBtn(COLORS.blue, aquarium.mood === mood)}
                onClick={() => aquarium.setMood?.(mood)}
              >
                {mood === "chill"
                  ? "😎 Chill"
                  : mood === "excited"
                    ? "🤪 Excited"
                    : "😴 Lazy"}
              </button>
            ))}
          </div>
        )}

        {/* ── TRICKS PANEL ── */}
        {activePanel === "TRICKS" && (
          <div style={drawerStyle}>
            <SectionLabel>✨ TEACH SOME TRICKS ✨</SectionLabel>
            <button
              className="pill-btn"
              style={pillBtn(COLORS.purple)}
              disabled={ui.trick !== "none"}
              onClick={() => ui.setTrick?.("barrelRoll")}
            >
              🌀 Roll
            </button>
            <button
              className="pill-btn"
              style={pillBtn(COLORS.purple)}
              disabled={ui.trick !== "none"}
              onClick={() => ui.setTrick?.("backflip")}
            >
              🤸 Flip
            </button>
            <button
              className="pill-btn"
              style={pillBtn(COLORS.purple)}
              disabled={ui.trick !== "none"}
              onClick={() => ui.setTrick?.("spin")}
            >
              💫 Spin
            </button>
            <button
              className="pill-btn"
              style={pillBtn(COLORS.moods)}
              disabled={ui.trick !== "none"}
              onClick={() => ui.setTrick?.("toot")}
            >
              🎵 Toot
            </button>
          </div>
        )}

        {/* ── ACCESSORIES / DRESS UP PANEL ── */}
        {activePanel === "ACCESS" && (
          <div style={drawerStyle}>
            <SectionLabel>👑 DRESS YOUR AXOLOTL 👑</SectionLabel>
            {["crown", "glasses", "headphones", "topHat", "none"].map((acc) => (
              <button
                key={acc}
                className="pill-btn"
                style={pillBtn(
                  COLORS.yellow,
                  aquarium.currentAccessory === acc,
                )}
                onClick={() =>
                  aquarium.setCurrentAccessory?.(acc === "none" ? null : acc)
                }
              >
                {acc === "crown"
                  ? "👑 Crown"
                  : acc === "glasses"
                    ? "🕶️ Glasses"
                    : acc === "headphones"
                      ? "🎧 Headphones"
                      : acc === "topHat"
                        ? "🎩 Top Hat"
                        : "❌ No Hat"}
              </button>
            ))}
          </div>
        )}

        {/* ── COLORS PANEL ── */}
        {activePanel === "COLOR" && (
          <div style={drawerStyle}>
            <SectionLabel>🎨 PICK AXOLOTL COLORS 🎨</SectionLabel>

            {/* Theme presets */}
            <button
              className="pill-btn"
              style={pillBtn(COLORS.care, aquarium.isCustomPalette)}
              onClick={() => {
                setShowCustomColors(!showCustomColors);
                aquarium.selectCustomPalette?.();
              }}
            >
              🎨 Custom
            </button>
            <button
              className="pill-btn"
              style={pillBtn("#F48FB1")}
              onClick={() => {
                setShowCustomColors(false);
                aquarium.applyThemePreset?.("Bubblegum");
              }}
            >
              🍭 Pink
            </button>
            <button
              className="pill-btn"
              style={pillBtn(COLORS.purple)}
              onClick={() => {
                setShowCustomColors(false);
                aquarium.applyThemePreset?.("Cosmo");
              }}
            >
              ⭐ Galaxy
            </button>
            <button
              className="pill-btn"
              style={pillBtn(COLORS.blue)}
              onClick={() => {
                setShowCustomColors(false);
                aquarium.applyThemePreset?.("Deep Sea");
              }}
            >
              🌊 Ocean
            </button>

            {/* Custom per-part color pickers — shown when "Custom" is toggled */}
            {showCustomColors &&
              bodyParts.map((part) => (
                <div
                  key={part.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    background: "rgba(255,255,255,0.55)",
                    borderRadius: "30px",
                    padding: "5px 14px",
                    border: "2px solid rgba(255,255,255,0.9)",
                  }}
                >
                  <span
                    style={{
                      fontSize: "12px",
                      fontWeight: "bold",
                      color: COLORS.dark,
                      minWidth: "52px",
                    }}
                  >
                    {part.label}
                  </span>
                  <input
                    type="color"
                    value={aquarium.currentColor?.[part.id] || "#ffffff"}
                    onChange={(e) =>
                      aquarium.updateCustomColor?.(part.id, e.target.value)
                    }
                    style={{
                      border: "2px solid white",
                      borderRadius: "6px",
                      width: "34px",
                      height: "24px",
                      cursor: "pointer",
                      padding: 0,
                    }}
                  />
                </div>
              ))}
          </div>
        )}

        {/* ── TOYS PANEL ── */}
        {activePanel === "TOYS" && (
          <div style={drawerStyle}>
            <SectionLabel>🏰 ADD TOYS TO THE TANK 🏰</SectionLabel>
            <button
              className="pill-btn"
              style={pillBtn(COLORS.orange)}
              onClick={() => aquarium.addDecoration?.("castle")}
            >
              🏰 Castle
            </button>
            <button
              className="pill-btn"
              style={pillBtn("#A1816A")}
              onClick={() => aquarium.addDecoration?.("log")}
            >
              Log
            </button>
            <button
              className="pill-btn"
              style={pillBtn(COLORS.yellow)}
              onClick={() => aquarium.addDecoration?.("treasureChest")}
            >
              💎 Treasure Chest
            </button>
            <button
              className="pill-btn"
              style={pillBtn(COLORS.care)}
              onClick={() => aquarium.addDecoration?.("brainCoral")}
            >
              Brain Coral
            </button>
            <button
              className="pill-btn"
              style={pillBtn(ui.deleteMode ? COLORS.red : COLORS.grey)}
              onClick={() => ui.setDeleteMode?.(!ui.deleteMode)}
            >
              {ui.deleteMode ? "✅ Done Removing" : "🗑️ Remove a Toy"}
            </button>
          </div>
        )}

        {/* ── TANK / ENVIRONMENT PANEL ── */}
        {activePanel === "TANK" && (
          <div style={drawerStyle}>
            <SectionLabel>🌿 TANK SETTINGS 🌿</SectionLabel>

            {/* Day / Night toggle */}
            <button
              className="pill-btn"
              style={pillBtn(COLORS.blue)}
              onClick={() =>
                aquarium.setLightMode?.(
                  aquarium.lightMode === "day" ? "night" : "day",
                )
              }
            >
              {aquarium.lightMode === "night" ? "🌙 Night" : "☀️ Day"} — tap to
              switch!
            </button>

            {/* Floor mat */}
            <button
              className="pill-btn"
              style={pillBtn(COLORS.teal)}
              onClick={() => aquarium.cycleSubstrate?.()}
            >
              🔄 Floor Mat:{" "}
              {String(aquarium.substrate || "GRAVEL").toUpperCase()}
            </button>
            <button
              className="pill-btn"
              style={pillBtn(showSubstrate ? COLORS.yellow : COLORS.grey)}
              onClick={() => {
                const nextState = !showSubstrate;
                setShowSubstrate(nextState);
                window.dispatchEvent(
                  new CustomEvent("toggle-substrate", { detail: nextState }),
                );
              }}
            >
              {showSubstrate ? "👁️ Hide Mat" : "👁️ Show Mat"}
            </button>

            {/* Fish */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                background: "rgba(255,255,255,0.45)",
                borderRadius: "30px",
                padding: "6px 14px",
                border: "2px solid rgba(255,255,255,0.8)",
              }}
            >
              <span
                style={{
                  fontSize: "12px",
                  fontWeight: "bold",
                  color: COLORS.dark,
                }}
              >
                🐟 Fish ({aquarium.backgroundFish?.length || 0}/
                {aquarium.maxBackgroundFish || 5}):
              </span>
              <button
                className="pill-btn"
                style={{ ...pillBtn(COLORS.blue), padding: "6px 10px" }}
                onClick={() => aquarium.addBackgroundFish?.("blue")}
              >
                🔵
              </button>
              <button
                className="pill-btn"
                style={{ ...pillBtn(COLORS.green), padding: "6px 10px" }}
                onClick={() => aquarium.addBackgroundFish?.("green")}
              >
                🟢
              </button>
              <button
                className="pill-btn"
                style={{ ...pillBtn("#A1816A"), padding: "6px 10px" }}
                onClick={() => aquarium.addBackgroundFish?.("brown")}
              >
                🟤
              </button>
              <button
                className="pill-btn"
                style={{ ...pillBtn(COLORS.red), padding: "6px 10px" }}
                onClick={() => aquarium.removeLastBackgroundFish?.()}
              >
                ❌
              </button>
            </div>

            {/* Plants */}
            <button
              className="pill-btn"
              style={pillBtn(COLORS.green)}
              onClick={() => ui.cycleFoliage?.()}
            >
              🌿 Leaves: {String(ui.foliageStyle || "GRASS").toUpperCase()}
            </button>
            <button
              className="pill-btn"
              style={pillBtn(COLORS.orange)}
              onClick={() => aquarium.setShowGrass?.(!aquarium.showGrass)}
            >
              🌱 Plants: {aquarium.showGrass ? "ON" : "OFF"}
            </button>
          </div>
        )}

        {/* ── BACKGROUNDS / SCENES PANEL ── */}
        {activePanel === "BG" && (
          <div style={drawerStyle}>
            <SectionLabel>🖼️ PICK A BACKGROUND SCENE 🖼️</SectionLabel>
            {(aquarium.backgroundOptions || []).map((bg: any) => (
              <button
                key={bg.id}
                className="pill-btn"
                onClick={() => aquarium.setBackgroundTexture?.(bg.id)}
                style={pillBtn(
                  COLORS.purple,
                  aquarium.currentBackground?.id === bg.id,
                )}
              >
                {bg.name || String(bg.id).toUpperCase()}
              </button>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

function AquariumShell({ children }: { children: React.ReactNode }) {
  const aquarium = useAquarium();
  const hasBackgroundTexture = Boolean(aquarium.currentBackground?.url);

  const backgroundOverlay =
    aquarium.lightMode === "day"
      ? "linear-gradient(rgba(91, 187, 255, 0.24), rgba(15, 74, 139, 0.28))"
      : "linear-gradient(rgba(5, 11, 31, 0.34), rgba(5, 11, 31, 0.58))";

  const backgroundStyle = hasBackgroundTexture
    ? {
        backgroundImage: `${backgroundOverlay}, url(${aquarium.currentBackground.url})`,
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
      }
    : {
        background:
          aquarium.lightMode === "day"
            ? "radial-gradient(circle at 20% 10%, #9de6ff 0%, #5fc4ff 45%, #2f78cc 100%)"
            : "radial-gradient(circle at 25% 8%, #3d5ca8 0%, #1d2e63 55%, #09152f 100%)",
      };

  return (
    <div
      className="aquarium-container"
      style={{
        ...backgroundStyle,
        width: "100vw",
        height: "100vh",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {children}
    </div>
  );
}

export default function Aquarium() {
  return (
    <AquariumProvider>
      <AquariumUiProvider>
        <AquariumShell>
          <AquariumScene />
          <AquariumUiOverlay />
        </AquariumShell>
      </AquariumUiProvider>
    </AquariumProvider>
  );
}
