import React, { useEffect, useState } from "react";
import AquariumScene from "./AquariumScene";
import MusicPlayer from "../Audio/MusicPlayer";
import { AquariumProvider, useAquarium } from "../../context/AquariumContext";
import {
  AquariumUiProvider,
  useAquariumUi,
} from "../../context/AquariumUiContext";

import {
  ACCESSORY_OPTIONS,
  type AccessoryOption,
} from "../Accessories/AccessoryCatalog";

// Detailed Comment: Type union mapping out every possible modular body part on the axolotl model
// that can be targeted for custom color palettes.
type AxolotlPartId =
  | "body"
  | "gills"
  | "fins"
  | "tail"
  | "legs"
  | "toes"
  | "eyes";

// Detailed Comment: Configuration interface to bind the internal technical part IDs to user-friendly UI labels.
interface PartConfig {
  id: AxolotlPartId;
  label: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// DESIGN TOKENS — girly kawaii palette for the aquarium UI
// ─────────────────────────────────────────────────────────────────────────────
const COLORS = {
  // Banner & panel backgrounds
  bannerBg: "linear-gradient(135deg, #FF7FBA 0%, #B98CFF 50%, #7FCBFF 100%)",
  drawerBg: "linear-gradient(160deg, #F3B2DD 0%, #D9B6FF 55%, #B9E5FF 100%)",
  bannerGlow:
    "radial-gradient(circle at top left, rgba(255,218,236,0.28) 0%, rgba(255,218,236,0.08) 22%, transparent 46%)",
  drawerGlow:
    "radial-gradient(circle at top right, rgba(220,204,255,0.24) 0%, rgba(220,204,255,0.08) 22%, transparent 46%)",
  sparkleGradient:
    "linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,232,250,0.9) 30%, rgba(214,238,255,0.88) 70%, rgba(255,255,255,0.95) 100%)",

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
  orange: "#F4925C",
  red: "#F46C5C",
  grey: "#9BBAC4",

  // Active / selected highlight
  active: "#FFCEE4",
  activeText: "#7A2459",
  panelEdge: "rgba(255,255,255,0.96)",

  // Text
  white: "#FFFFFF",
  dark: "#5C3A7A", // deep purple for contrast on light panels
};

const sparkleDots = [
  { top: "7%", left: "7%", size: 18, delay: "0s" },
  { top: "12%", left: "26%", size: 12, delay: "0.7s" },
  { top: "19%", left: "82%", size: 16, delay: "1.1s" },
  { top: "58%", left: "10%", size: 14, delay: "1.6s" },
  { top: "66%", left: "88%", size: 20, delay: "0.4s" },
  { top: "84%", left: "20%", size: 11, delay: "1.8s" },
  { top: "88%", left: "74%", size: 15, delay: "0.9s" },
] as const;

// ─────────────────────────────────────────────────────────────────────────────
// STYLE HELPERS
// ─────────────────────────────────────────────────────────────────────────────

/** * Detailed Comment: Reusable pill-shaped action button styling used throughout the drawer panels.
 * Contains logic to swap styles out entirely based on the 'isActive' boolean parameter.
 */
const pillBtn = (bgColor: string, isActive = false): React.CSSProperties => ({
  padding: "10px 16px",
  cursor: "pointer",
  background: isActive ? COLORS.active : bgColor,
  backgroundImage: isActive
    ? "linear-gradient(135deg, rgba(255,255,255,0.84) 0%, rgba(255,255,255,0.2) 100%)"
    : `linear-gradient(135deg, ${bgColor}, rgba(255,255,255,0.18))`,
  color: isActive ? COLORS.activeText : COLORS.white,
  border: `3px solid ${COLORS.panelEdge}`,
  borderRadius: "50px",
  fontSize: "13px",
  fontWeight: "bold",
  textShadow: isActive ? "none" : "0 1px 2px rgba(0,0,0,0.25)",
  boxShadow: "0 4px 0px rgba(0,0,0,0.12)",
  transition: "transform 0.1s ease, box-shadow 0.1s ease",
  outline: "none",
  whiteSpace: "nowrap" as const,
  position: "relative",
  overflow: "hidden",
});

/** * Detailed Comment: Styling for the top-level tab buttons sitting in the main banner bar.
 * Uses flex-column to stack the emoji directly on top of the text label.
 */
const tabBtn = (
  accentColor: string,
  isActive: boolean,
): React.CSSProperties => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "3px",
  padding: "10px 15px",
  cursor: "pointer",
  background: isActive ? "rgba(255,255,255,0.92)" : "rgba(255,255,255,0.28)",
  color: isActive ? accentColor : COLORS.white,
  border: `3px solid ${isActive ? accentColor : "rgba(255,255,255,0.6)"}`,
  borderRadius: "20px",
  fontSize: "11px",
  fontWeight: "bold",
  textShadow: isActive ? "none" : "0 1px 2px rgba(0,0,0,0.2)",
  boxShadow: isActive
    ? `0 0 0 2px ${accentColor}44, 0 4px 12px rgba(0,0,0,0.15)`
    : "0 2px 8px rgba(0,0,0,0.1)",
  transition: "all 0.18s ease",
  outline: "none",
  letterSpacing: "0.4px",
});

/** * Detailed Comment: The shared styling for the drawer panel container that slides open beneath the banner.
 * Centered exactly on the screen and layered over the game scene via zIndex.
 */
const drawerStyle: React.CSSProperties = {
  position: "absolute",
  top: "88px", // Push down just enough to clear the 80px banner
  left: "50%",
  transform: "translateX(-50%)",
  background: COLORS.drawerBg,
  border: "4px solid rgba(255,255,255,0.9)",
  borderRadius: "28px",
  padding: "18px 20px",
  pointerEvents: "auto",
  boxShadow: "0 18px 44px rgba(160,80,200,0.22), 0 4px 0px rgba(0,0,0,0.08)",
  display: "flex",
  flexWrap: "wrap" as const,
  gap: "10px",
  alignItems: "center",
  justifyContent: "center",
  width: "min(92vw, 820px)",
  maxHeight: "calc(100dvh - 140px)",
  overflowY: "auto",
  zIndex: 20,
  animation: "dropIn 0.18s ease",
  backgroundImage: `${COLORS.drawerGlow}, ${COLORS.drawerBg}`,
};

/** * Detailed Comment: Global inline CSS string. Contains all keyframe animations.
 * Injected once into the DOM so React elements can reference them via classNames.
 */
const globalStyles = `
  @keyframes dropIn {
    from { opacity: 0; transform: translateX(-50%) translateY(-10px); }
    to   { opacity: 1; transform: translateX(-50%) translateY(0); }
  }
  @keyframes riseIn {
    from { opacity: 0; transform: translate(-50%, 12px); }
    to   { opacity: 1; transform: translate(-50%, 0); }
  }
  @keyframes rainbowGlow {
    0%   { box-shadow: 0 0 12px 3px #FF9ECD99, 0 4px 0 #e06aa0; }
    33%  { box-shadow: 0 0 12px 3px #D48FFF99, 0 4px 0 #a86de0; }
    66%  { box-shadow: 0 0 12px 3px #9FC8FF99, 0 4px 0 #6a9de0; }
    100% { box-shadow: 0 0 12px 3px #FF9ECD99, 0 4px 0 #e06aa0; }
  }
  @keyframes twinkle {
    0%, 100% { transform: scale(0.9) rotate(0deg); opacity: 0.55; }
    50% { transform: scale(1.16) rotate(18deg); opacity: 1; }
  }
  @keyframes floatGlow {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-8px); }
  }
  @keyframes shimmerSlide {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
  .ui-split-controls {
    font-family: "Trebuchet MS", "Verdana", sans-serif;
  }
  .sparkle-field {
    position: fixed;
    inset: 0;
    pointer-events: none;
    z-index: 12;
    overflow: hidden;
  }
  .sparkle-orb {
    position: absolute;
    border-radius: 999px;
    background: radial-gradient(circle at 30% 30%, rgba(255,255,255,0.98) 0%, rgba(255,245,252,0.9) 16%, rgba(255,255,255,0.06) 65%, transparent 75%);
    filter: drop-shadow(0 0 12px rgba(255, 197, 229, 0.7));
    animation: twinkle 3.4s ease-in-out infinite, floatGlow 7s ease-in-out infinite;
  }
  .sparkle-star {
    position: absolute;
    font-size: 18px;
    color: #fff9fd;
    text-shadow: 0 0 12px rgba(255, 183, 220, 0.95), 0 0 22px rgba(185, 139, 255, 0.55);
    animation: twinkle 2.6s ease-in-out infinite;
  }
  .axolotl-name-input {
    animation: rainbowGlow 3s ease-in-out infinite;
    background-image: linear-gradient(135deg, rgba(255,255,255,0.98) 0%, rgba(255,243,252,0.98) 36%, rgba(229,242,255,0.98) 100%);
  }
  .pill-btn:hover {
    transform: translateY(-2px) scale(1.01);
    background-size: 180% 180%;
    animation: shimmerSlide 2.8s ease-in-out infinite;
  }
  .pill-btn:active { transform: translateY(1px); box-shadow: 0 2px 0px rgba(0,0,0,0.12); }
  .mobile-menu-layer {
    display: none;
  }
  .mobile-menu-launcher {
    display: none;
  }
  .mobile-menu-backdrop {
    display: none;
  }
  .mobile-menu-sheet {
    display: none;
  }
  .mobile-panel-grid {
    display: none;
  }
  .mobile-panel-card {
    display: none;
  }
  .mobile-menu-header,
  .mobile-menu-footer,
  .mobile-name-card,
  .mobile-name-input,
  .mobile-field-label,
  .mobile-menu-kicker,
  .mobile-menu-title,
  .mobile-menu-close {
    display: none;
  }
  @media (max-width: 920px) {
    .ui-split-controls {
      pointer-events: none;
    }
    .desktop-banner,
    .desktop-drawer {
      display: none !important;
    }
    .mobile-menu-layer {
      display: block;
      position: fixed;
      inset: 0;
      pointer-events: none;
      z-index: 50;
    }
    .mobile-menu-launcher {
      display: inline-flex;
      position: fixed;
      right: max(14px, env(safe-area-inset-right));
      bottom: max(14px, env(safe-area-inset-bottom));
      pointer-events: auto;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 14px 18px;
      border-radius: 999px;
      border: 3px solid rgba(255,255,255,0.9);
      background: linear-gradient(135deg, #ff7fbf 0%, #d48fff 50%, #7bc9ff 100%);
      background-size: 180% 180%;
      animation: shimmerSlide 8s ease-in-out infinite;
      color: #fff;
      box-shadow: 0 16px 38px rgba(142, 52, 136, 0.34);
      font-size: 13px;
      font-weight: 800;
      letter-spacing: 0.4px;
      text-shadow: 0 1px 1px rgba(0,0,0,0.18);
    }
    .mobile-menu-backdrop {
      display: block;
      position: fixed;
      inset: 0;
      pointer-events: auto;
      background: rgba(46, 15, 64, 0.16);
      border: 0;
      padding: 0;
    }
    .mobile-menu-sheet {
      display: flex;
      position: fixed;
      left: 50%;
      bottom: max(12px, env(safe-area-inset-bottom));
      transform: translateX(-50%);
      width: min(calc(100vw - 18px), 380px);
      max-height: calc(100dvh - 22px);
      overflow: hidden;
      flex-direction: column;
      gap: 8px;
      pointer-events: auto;
      padding: 10px 12px 12px;
      border-radius: 22px;
      border: 2px solid rgba(255,255,255,0.9);
      background: linear-gradient(180deg, #f8c5e5 0%, #e9cbff 54%, #cfeeff 100%);
      box-shadow: 0 12px 28px rgba(91, 43, 106, 0.16);
      animation: riseIn 0.22s ease;
      backdrop-filter: none;
      -webkit-backdrop-filter: none;
    }
    .mobile-menu-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 12px;
    }
    .mobile-menu-kicker {
      display: block;
      margin: 0 0 2px;
      font-size: 9px;
      text-transform: uppercase;
      letter-spacing: 1.2px;
      color: #7a3f00;
      opacity: 0.72;
    }
    .mobile-menu-title {
      display: block;
      margin: 0;
      font-size: 18px;
      color: #5c3a7a;
      line-height: 1;
    }
    .mobile-menu-close {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border: 0;
      border-radius: 999px;
      padding: 8px 12px;
      background: rgba(255,255,255,0.6);
      color: #5c3a7a;
      font-weight: 700;
      box-shadow: 0 6px 12px rgba(92, 58, 122, 0.08);
    }
    .mobile-quick-grid {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 6px;
    }
    .mobile-quick-action {
      width: 100%;
      min-height: 46px;
      white-space: normal;
      padding: 8px 10px;
      font-size: 13px;
    }
    .mobile-footer-note {
      display: block;
      width: 100%;
      text-align: center;
      font-size: 10px;
      line-height: 1.25;
      color: #5c3a7a;
      opacity: 0.78;
    }
    .mobile-menu-footer {
      display: flex;
      justify-content: center;
    }
    .sparkle-field {
      z-index: 49;
    }
  }
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
  // Detailed Comment: Pulling global game states using context hooks.
  const aquarium = useAquarium() as any;
  const ui = useAquariumUi() as any;

  // Detailed Comment: activePanel string tracks which top-bar tab is currently opened in the UI.
  // Using null means the drawer is entirely hidden. Both the left and right tab groups share one slot.
  const [activePanel, setActivePanel] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Detailed Comment: Visibility states for sub-menus and toggles
  const [showCustomColors, setShowCustomColors] = useState<boolean>(false);
  const [showSubstrate, setShowSubstrate] = useState<boolean>(true);

  // Detailed Comment: Two-way binding state for the main interactive text input (the axolotl's name)
  const [axolotlName, setAxolotlName] = useState<string>("My Axolotl");

  // Detailed Comment: Structured array mapping out all axolotl parts so we can safely loop over them
  // in the color picking menu rather than hardcoding seven separate inputs.
  const bodyParts: PartConfig[] = [
    { id: "body", label: "Body" },
    { id: "gills", label: "Gills" },
    { id: "fins", label: "Fins" },
    { id: "tail", label: "Tail" },
    { id: "legs", label: "Legs" },
    { id: "toes", label: "Toes" },
    { id: "eyes", label: "Eyes" },
  ];

  const openMobileMenu = () => {
    setActivePanel((prev) => prev ?? "CARE");
    setIsMobileMenuOpen(true);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  useEffect(() => {
    if (!isMobileMenuOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isMobileMenuOpen]);

  // Detailed Comment: Helper to safely toggle menus. If you click the same button twice, it sets the state to null to close it.
  const togglePanel = (id: string) =>
    setActivePanel((prev) => (prev === id ? null : id));

  const renderPanelContent = () => {
    switch (activePanel) {
      case "CARE":
        return (
          <>
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
              onClick={() => ui.petAxolotl?.()}
            >
              {ui.isPetting ? "❤️ Petting..." : "👋 Pet Axolotl"}
            </button>
          </>
        );
      case "MOODS":
        return (
          <>
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
          </>
        );
      case "TRICKS":
        return (
          <>
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
          </>
        );
      case "ACCESS":
        return (
          <>
            <SectionLabel>👑 DRESS YOUR AXOLOTL 👑</SectionLabel>
            {ACCESSORY_OPTIONS.map((acc) => {
              let iconEmoji = "👑";
              if (acc.type.toLowerCase().includes("glasses")) iconEmoji = "🕶️";
              if (acc.type === "headphones") iconEmoji = "🎧";
              if (acc.type === "pearlNecklace") iconEmoji = "📿";
              if (acc.type === "topHat") iconEmoji = "🎩";

              return (
                <button
                  key={acc.type}
                  className="pill-btn"
                  style={pillBtn(
                    COLORS.pink,
                    aquarium.currentAccessory === acc.type,
                  )}
                  onClick={() => aquarium.setCurrentAccessory?.(acc.type)}
                >
                  {iconEmoji} {acc.label}
                </button>
              );
            })}

            <button
              className="pill-btn"
              style={pillBtn(COLORS.grey, !aquarium.currentAccessory)}
              onClick={() => aquarium.setCurrentAccessory?.(null)}
            >
              ❌ No Hat
            </button>
          </>
        );
      case "COLOR":
        return (
          <>
            <SectionLabel>🎨 PICK AXOLOTL COLORS 🎨</SectionLabel>
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
          </>
        );
      case "TOYS":
        return (
          <>
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
              style={pillBtn(COLORS.orange)}
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
          </>
        );
      case "TANK":
        return (
          <>
            <SectionLabel>🌿 TANK SETTINGS 🌿</SectionLabel>
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
              style={pillBtn(showSubstrate ? COLORS.orange : COLORS.grey)}
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
          </>
        );
      case "BG":
        return (
          <>
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
          </>
        );
      default:
        return null;
    }
  };

  return (
    <>
      {/* ── Inject global keyframe animations once right at the top ── */}
      <style>{globalStyles}</style>

      <div className="sparkle-field" aria-hidden="true">
        {sparkleDots.map((dot, index) => (
          <span
            key={`${dot.top}-${dot.left}-${index}`}
            className="sparkle-orb"
            style={{
              top: dot.top,
              left: dot.left,
              width: `${dot.size}px`,
              height: `${dot.size}px`,
              animationDelay: dot.delay,
            }}
          />
        ))}
        <span
          className="sparkle-star"
          style={{ top: "15%", right: "12%", animationDelay: "0.2s" }}
        >
          ✦
        </span>
        <span
          className="sparkle-star"
          style={{ top: "42%", left: "6%", animationDelay: "1.4s" }}
        >
          ✧
        </span>
        <span
          className="sparkle-star"
          style={{ top: "72%", right: "8%", animationDelay: "0.9s" }}
        >
          ✦
        </span>
      </div>

      {/*
        ═══════════════════════════════════════════════════════════════════
        OUTER OVERLAY WRAPPER
        Sets absolute positioning to float over the 3D canvas.
        Pointer-events is set to 'none' here so clicks pass through to the 3D scene,
        but inner panels set it back to 'auto' so buttons remain clickable!
        ═══════════════════════════════════════════════════════════════════
      */}
      <div
        className="ui-split-controls"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100dvh",
          pointerEvents: "none",
          zIndex: 10,
        }}
      >
        {/*
          ─────────────────────────────────────────────────────────────────
          TOP BANNER BAR
          This div acts as the main navigation hub at the top of the screen.
          ─────────────────────────────────────────────────────────────────
        */}
        <div
          className="desktop-banner"
          style={{
            position: "absolute",
            top: "14px",
            left: "50%",
            transform: "translateX(-50%)",
            background: COLORS.bannerBg,
            backgroundImage: `${COLORS.bannerGlow}, ${COLORS.bannerBg}`,
            backgroundBlendMode: "screen",
            borderRadius: "999px",
            border: "4px solid rgba(255,255,255,0.85)",
            padding: "8px 16px",
            pointerEvents: "auto", // Detailed Comment: Restoring clickability for the buttons
            boxShadow:
              "0 8px 0px rgba(180,100,220,0.3), 0 14px 32px rgba(180,80,200,0.22)",
            display: "flex",
            alignItems: "center",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "10px",
            zIndex: 30,
            whiteSpace: "nowrap",
            width: "min(96vw, 1240px)",
            backdropFilter: "none",
            WebkitBackdropFilter: "none",
          }}
        >
          {/* ── LEFT TAB GROUP: AXOLOTL (Pet Interaction) ── */}
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

          {/* ── CENTER: PET NAME INPUT (Includes the animated CSS rainbowGlow border) ── */}
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

          {/* ── RIGHT TAB GROUP: TANK / DECO (World/Environment Interaction) ── */}
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
          <MusicPlayer
            className="pill-btn"
            style={tabBtn(COLORS.teal, false)}
          />
        </div>

        <div
          className="desktop-drawer"
          style={activePanel ? drawerStyle : { display: "none" }}
        >
          {renderPanelContent()}
        </div>

        <div className="mobile-menu-layer" style={{ pointerEvents: "none" }}>
          {isMobileMenuOpen && (
            <button
              type="button"
              aria-label="Close aquarium menu"
              className="mobile-menu-backdrop"
              onClick={closeMobileMenu}
              style={{ pointerEvents: "auto" }}
            />
          )}

          <button
            type="button"
            aria-label="Open aquarium menu"
            className="mobile-menu-launcher"
            onClick={openMobileMenu}
            style={{ pointerEvents: "auto" }}
          >
            ✨ Menu
          </button>

          {isMobileMenuOpen && (
            <div
              className="mobile-menu-sheet"
              style={{ pointerEvents: "auto" }}
            >
              <div className="mobile-menu-header">
                <div>
                  <p className="mobile-menu-kicker">Mobile quick menu</p>
                  <h3 className="mobile-menu-title">Feed, pet, spin</h3>
                </div>
                <button
                  type="button"
                  aria-label="Close menu"
                  className="mobile-menu-close"
                  onClick={closeMobileMenu}
                >
                  Close
                </button>
              </div>

              <div className="mobile-quick-grid">
                <button
                  className="pill-btn mobile-quick-action primary"
                  style={pillBtn(COLORS.green)}
                  onClick={() => aquarium.handleFeed?.()}
                >
                  🍖 Feed
                </button>
                <button
                  className="pill-btn mobile-quick-action primary"
                  style={pillBtn(COLORS.pink)}
                  onClick={() => ui.petAxolotl?.()}
                >
                  👋 Pet
                </button>
                <button
                  className="pill-btn mobile-quick-action primary"
                  style={pillBtn(COLORS.moods)}
                  disabled={ui.trick !== "none"}
                  onClick={() => ui.setTrick?.("spin")}
                >
                  💫 Spin
                </button>
              </div>

              <div className="mobile-menu-footer">
                <span className="mobile-footer-note">
                  Extra controls stay hidden on mobile so the tank stays
                  visible.
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

// Detailed Comment: Structural Shell Component
// Generates the massive background div that wraps the React Three Fiber Canvas and the UI overlays.
// It applies responsive CSS backgrounds or gradients depending on current lighting and selected environments.
function AquariumShell({ children }: { children: React.ReactNode }) {
  const aquarium = useAquarium();
  const hasBackgroundTexture = Boolean(aquarium.currentBackground?.url);

  // Detailed Comment: Provides a tinted hue over custom backgrounds to ensure they always blend naturally into day/night cycles
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
        height: "100dvh",
        position: "relative",
        overflow: "hidden", // Detailed Comment: Critically ensures the canvas and absolutely positioned UI don't generate unwanted scrollbars
      }}
    >
      {children}
    </div>
  );
}

// Detailed Comment: Master Component Export
// Nests the primary context providers and layers the interactive UI over the 3D WebGL scene so both environments can talk to each other.
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
