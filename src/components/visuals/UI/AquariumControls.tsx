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
 * Refined [2026-05-07]
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
    field: keyof Omit<ColorPalette, "name">,
    value: string | number,
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

  // Descriptive list for mapping color part pickers
  const bodyParts = [
    { id: "body", label: "Body" },
    { id: "gills", label: "Gills" },
    { id: "fins", label: "Fins" },
    { id: "tail", label: "Tail" },
    { id: "legs", label: "Legs" },
    { id: "toes", label: "Toes" },
    { id: "eyes", label: "Eyes" },
  ] as const;

  return (
    <>
      {/* HEADER: Pet Naming */}
      <div className="title-ribbon">
        <input
          type="text"
          value={petName}
          onChange={(event) => setPetName(event.target.value)}
          placeholder="Name your axolotl"
          className="aquarium-title-input"
          spellCheck={false}
          maxLength={30}
        />
      </div>

      {/* LEFT PANEL: Decoration Controls */}
      <section className="side-panel left-panel">
        <span className="side-count">
          {decorationCount}/{maxDecorations}
        </span>

        <p className="side-subtitle">Decor</p>
        {decorOptions.map((option) => (
          <button
            key={option.type}
            className="rainbow-btn side-btn btn-teal"
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
            className="rainbow-btn side-btn btn-blue"
            disabled={!canAddDecoration}
            onClick={() => onAddDecoration(option.type)}
          >
            + {option.label}
          </button>
        ))}

        <button
          className={`rainbow-btn side-btn ${deleteMode ? "btn-rose" : "btn-indigo"}`}
          onClick={() => onSetDeleteMode(!deleteMode)}
        >
          {deleteMode ? "Done Deleting" : "Delete Mode"}
        </button>
      </section>

      {/* RIGHT PANEL: Color Lab */}
      <section className="side-panel right-panel">
        <button
          className="rainbow-btn side-btn btn-teal"
          onClick={() => setShowColorLab(!showColorLab)}
        >
          Color Options {showColorLab ? "^" : "v"}
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
              {bodyParts.map((part) => (
                <label key={part.id} className="color-edit-row">
                  <span>{part.label}</span>
                  <input
                    type="color"
                    value={
                      currentColor[part.id as keyof ColorPalette] as string
                    }
                    onChange={(e) =>
                      onUpdateCustomPalette(part.id as any, e.target.value)
                    }
                  />
                </label>
              ))}

              <div className="side-divider" />
              <label
                className="color-edit-row"
                style={{ flexDirection: "column", alignItems: "flex-start" }}
              >
                <span>Glow Intensity</span>
                <input
                  type="range"
                  min="0"
                  max="2"
                  step="0.1"
                  style={{ width: "100%" }}
                  value={currentColor.glowIntensity}
                  onChange={(e) =>
                    onUpdateCustomPalette(
                      "glowIntensity",
                      parseFloat(e.target.value),
                    )
                  }
                />
              </label>
            </div>
          </>
        )}
      </section>

      {/* BOTTOM CENTER BAR: Functional Controls */}
      <section className="main-controls-bar">
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
            {showGrass ? foliageStyle : "Off"}
          </button>
        </Group>

        <div className="main-separator" />

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
