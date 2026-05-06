import React, { useState } from "react";
import type {
  AxolotlMood,
  AxolotlTrick,
  ColorPalette,
  DecorationType,
  FoliageType,
  LightMode,
} from "../../../types/aquarium";
import { DECORATION_OPTIONS } from "../Decorations/DecorationCatalog";

/**
 * Props for the AquariumControls component
 * Includes state and handlers for the axolotl, environment, and UI theme.
 */
interface AquariumControlsProps {
  petName: string;
  setPetName: (name: string) => void;
  mood: AxolotlMood;
  lightMode: LightMode;
  substrate: string;
  foliageStyle: FoliageType;
  showGrass: boolean;
  trick: AxolotlTrick;
  canAddDecoration: boolean;
  decorationCount: number;
  maxDecorations: number;
  deleteMode: boolean;
  currentColor: ColorPalette;
  isCustomPalette: boolean;
  themePresets: readonly string[];
  onSetDeleteMode: (value: boolean) => void;
  onSetMood: (mood: AxolotlMood) => void;
  onToggleLightMode: () => void;
  onCycleSubstrate: () => void;
  onCycleFoliage: () => void;
  onSetTrick: (trick: AxolotlTrick) => void;
  onPet: () => void;
  onFeed: () => void;
  onTreat: () => void;
  onAddDecoration: (type: DecorationType) => void;
  onUpdateCustomPalette: (
    field: "main" | "light" | "dark",
    value: string,
  ) => void;
  onApplyThemePreset: (name: string) => void;
}

/**
 * Helper component for grouping UI buttons into logical categories.
 */
function Group({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="main-group">
      <p className="main-group-title">{title}</p>
      <div className="main-group-row">{children}</div>
    </div>
  );
}

export default function AquariumControls({
  petName,
  setPetName,
  mood,
  lightMode,
  substrate,
  foliageStyle,
  showGrass,
  trick,
  canAddDecoration,
  decorationCount,
  maxDecorations,
  deleteMode,
  currentColor,
  isCustomPalette,
  themePresets,
  onSetDeleteMode,
  onSetMood,
  onToggleLightMode,
  onCycleSubstrate,
  onCycleFoliage,
  onSetTrick,
  onPet,
  onFeed,
  onTreat,
  onAddDecoration,
  onUpdateCustomPalette,
  onApplyThemePreset,
}: AquariumControlsProps) {
  const [showColorLab, setShowColorLab] = useState(true);

  // Categorize decorations for side-panel organization
  const decorOptions = DECORATION_OPTIONS.filter(
    (item) => item.category === "decor",
  );
  const furnitureOptions = DECORATION_OPTIONS.filter(
    (item) => item.category === "furniture",
  );

  return (
    <>
      {/* Dynamic Header for Aquarium Naming */}
      <div className="title-ribbon">
        <input
          type="text"
          value={petName}
          onChange={(event) => setPetName(event.target.value)}
          placeholder="Chelsea's Aquarium"
          className="aquarium-title-input"
          spellCheck={false}
          maxLength={30}
        />
      </div>

      {/* LEFT SIDE: Decoration & Furniture Management */}
      <section className="side-panel left-panel">
        <p className="side-title">Decorations</p>
        <span className="side-count">
          {decorationCount}/{maxDecorations}
        </span>

        <p className="side-subtitle">Decor</p>
        {decorOptions.map((option) => (
          <button
            key={option.type}
            className={`rainbow-btn side-btn btn-teal`} // Environment/Object category (Teal)
            disabled={!canAddDecoration}
            onClick={() => onAddDecoration(option.type)}
          >
            + {option.label}
          </button>
        ))}

        <div className="side-divider" />
        <p className="side-subtitle">Furniture</p>
        {furnitureOptions.map((option) => (
          <button
            key={option.type}
            className={`rainbow-btn side-btn btn-blue`} // Structural category (Blue)
            disabled={!canAddDecoration}
            onClick={() => onAddDecoration(option.type)}
          >
            + {option.label}
          </button>
        ))}

        {/* Delete Mode Toggle: Uses btn-rose as a standout warning color */}
        <button
          className={`rainbow-btn side-btn ${deleteMode ? "btn-rose" : "btn-indigo"}`}
          onClick={() => onSetDeleteMode(!deleteMode)}
        >
          {deleteMode ? "Done Deleting" : "Delete Mode"}
        </button>
      </section>

      {/* RIGHT SIDE: Color Lab & Custom Palettes */}
      <section className="side-panel right-panel">
        <button
          className="rainbow-btn side-btn btn-teal"
          onClick={() => setShowColorLab((open) => !open)}
        >
          Color Lab {showColorLab ? "^" : "v"}
        </button>
        {showColorLab && (
          <>
            <div className="theme-preset-list">
              {themePresets.map((name) => (
                <button
                  key={name}
                  className="rainbow-btn side-btn btn-blue"
                  onClick={() => onApplyThemePreset(name)}
                >
                  {name}
                </button>
              ))}
            </div>

            <div className="side-divider" />
            <p className="side-subtitle">
              {isCustomPalette ? "Custom Palette" : "Theme Palette"}
            </p>
            <div className="custom-color-list">
              <label className="color-edit-row">
                <span>Body</span>
                <input
                  type="color"
                  value={currentColor.main}
                  onChange={(event) =>
                    onUpdateCustomPalette("main", event.target.value)
                  }
                />
              </label>
              <label className="color-edit-row">
                <span>Light</span>
                <input
                  type="color"
                  value={currentColor.light}
                  onChange={(event) =>
                    onUpdateCustomPalette("light", event.target.value)
                  }
                />
              </label>
              <label className="color-edit-row">
                <span>Dark</span>
                <input
                  type="color"
                  value={currentColor.dark}
                  onChange={(event) =>
                    onUpdateCustomPalette("dark", event.target.value)
                  }
                />
              </label>
            </div>
          </>
        )}
      </section>

      {/* BOTTOM CENTER: Main Functional Controls */}
      <section className="main-controls-bar">
        {/* Care Group: Consolidated to Tropical Blue (Primary Interaction) */}
        <Group title="Care">
          <button onClick={onPet} className="rainbow-btn btn-red">
            Pet
          </button>
          <button onClick={onFeed} className="rainbow-btn btn-orange">
            Feed
          </button>
          <button onClick={onTreat} className="rainbow-btn btn-yellow">
            Treat
          </button>
        </Group>

        <div className="main-separator" />

        {/* Behavior Group: Consolidated to Deep Sea Purple (Internal State) */}
        <Group title="Behavior">
          <button
            onClick={() => onSetMood("excited")}
            className={`rainbow-btn ${mood === "excited" ? "btn-pink" : "btn-purple"}`}
          >
            Excited
          </button>
          <button
            onClick={() => onSetMood("chill")}
            className={`rainbow-btn ${mood === "chill" ? "btn-indigo" : "btn-purple"}`}
          >
            Chill
          </button>
          <button
            onClick={() => onSetMood("lazy")}
            className={`rainbow-btn ${mood === "lazy" ? "btn-purple" : "btn-indigo"}`}
          >
            Lazy
          </button>
        </Group>

        <div className="main-separator" />

        {/* Environment Group: Consolidated to Mint/Teal (Global Setting) */}
        <Group title="Environment">
          <button onClick={onToggleLightMode} className="rainbow-btn btn-green">
            {lightMode === "day" ? "Day" : "Night"}
          </button>
          <button onClick={onCycleSubstrate} className="rainbow-btn btn-teal">
            {substrate}
          </button>
          <button
            onClick={onCycleFoliage}
            className="rainbow-btn btn-green"
            disabled={!showGrass}
          >
            {showGrass ? foliageStyle : "Plants Off"}
          </button>
        </Group>

        <div className="main-separator" />

        {/* Tricks Group: Consolidated to Cyan (Action/Skill) */}
        <Group title="Tricks">
          <button
            onClick={() => onSetTrick("barrelRoll")}
            disabled={trick !== "none"}
            className="rainbow-btn btn-blue"
          >
            Roll
          </button>
          <button
            onClick={() => onSetTrick("backflip")}
            disabled={trick !== "none"}
            className="rainbow-btn btn-blue"
          >
            Flip
          </button>
          <button
            onClick={() => onSetTrick("spin")}
            disabled={trick !== "none"}
            className="rainbow-btn btn-blue"
          >
            Spin
          </button>
        </Group>
      </section>
    </>
  );
}
