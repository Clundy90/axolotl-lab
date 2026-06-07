import React, { useState } from "react";
import type { ColorPalette } from "../../../types/aquarium";

import { DECORATION_OPTIONS } from "../Decorations/DecorationCatalog";
import { BACKGROUND_FISH_OPTIONS } from "../BackgroundFish/BackgroundFishCatalog";
import { getThemePresetIndex } from "../../../state/aquariumState";
import { useAquarium } from "../../../context/AquariumContext";
import { useAquariumUi } from "../../../context/AquariumUiContext";

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

export default function AquariumControls() {
  const aquarium = useAquarium();
  const ui = useAquariumUi();
  const [showColorLab, setShowColorLab] = useState(true);

  const canAddDecoration =
    aquarium.decorations.length < aquarium.maxDecorations;
  const canAddBackgroundFish =
    aquarium.backgroundFish.length < aquarium.maxBackgroundFish;
  const furnitureOptions = DECORATION_OPTIONS.filter(
    (item) => item.category === "furniture",
  );

  const canRemoveDecoration = aquarium.decorations.length > 0;

  // Descriptive list for mapping color part pickers
  const bodyParts = [
    { id: "body", label: "Body" },
    { id: "gills", label: "Gills" },
    { id: "fins", label: "Fins" },
    { id: "tail", label: "Tail" },
    { id: "legs", label: "Legs" },
    { id: "toes", label: "Toes" },
    { id: "eyes", label: "Eyes" },
  ] satisfies {
    id: keyof Omit<ColorPalette, "name" | "glowIntensity">;
    label: string;
  }[];

  return (
    <>
      {/* HEADER: Pet Naming */}
      <div className="title-ribbon">
        <input
          type="text"
          value={ui.petName}
          onChange={(event) => ui.setPetName(event.target.value)}
          placeholder="Name your axolotl"
          className="aquarium-title-input"
          spellCheck={false}
          maxLength={30}
        />
      </div>

      {/* LEFT PANEL: Decoration Controls */}
      <section className="side-panel left-panel">
        <span className="side-count">
          Furniture {aquarium.decorations.length}/{aquarium.maxDecorations}
        </span>
        <p className="side-subtitle">Furniture</p>
        {furnitureOptions.map((option) => (
          <button
            key={option.type}
            className={`rainbow-btn side-btn ${option.buttonClass}`}
            disabled={!canAddDecoration}
            onClick={() => aquarium.addDecoration(option.type)}
          >
            + {option.label}
          </button>
        ))}

        <button
          className="rainbow-btn side-btn btn-danger"
          disabled={!canRemoveDecoration}
          onClick={aquarium.removeLastDecoration}
        >
          - Furniture
        </button>

        <div className="side-divider" />
        <span className="side-count">
          Fish {aquarium.backgroundFish.length}/{aquarium.maxBackgroundFish}
        </span>
        <p className="side-subtitle">Background Fish</p>
        {BACKGROUND_FISH_OPTIONS.map((option) => (
          <button
            key={option.type}
            className={`rainbow-btn side-btn ${option.buttonClass}`}
            disabled={!canAddBackgroundFish}
            onClick={() => aquarium.addBackgroundFish(option.type)}
          >
            + {option.label}
          </button>
        ))}
        <button
          className="rainbow-btn side-btn btn-danger"
          disabled={aquarium.backgroundFish.length === 0}
          onClick={aquarium.removeLastBackgroundFish}
        >
          - Fish
        </button>
      </section>

      {/* RIGHT PANEL: Color Lab */}
      <section className="side-panel right-panel">
        <button
          className="rainbow-btn side-btn btn-secondary"
          onClick={() => setShowColorLab(!showColorLab)}
        >
          Color Options {showColorLab ? "^" : "v"}
        </button>

        {showColorLab && (
          <>
            <div className="theme-preset-list">
              <button
                type="button"
                className={`rainbow-btn side-btn btn-secondary ${aquarium.isCustomPalette ? "btn-active" : ""}`}
                onClick={aquarium.selectCustomPalette}
              >
                Custom
              </button>

              {aquarium.themePresets.map((name) => (
                <button
                  key={name}
                  className={`rainbow-btn side-btn btn-secondary ${
                    !aquarium.isCustomPalette &&
                    aquarium.colorIndex === getThemePresetIndex(name)
                      ? "btn-active"
                      : ""
                  }`}
                  onClick={() => aquarium.applyThemePreset(name)}
                >
                  {name}
                </button>
              ))}
            </div>

            <div className="side-divider" />
            <p className="side-subtitle">
              {aquarium.isCustomPalette ? "Custom Palette" : "Theme Palette"}
            </p>

            <div className="custom-color-list">
              {bodyParts.map((part) => (
                <label key={part.id} className="color-edit-row">
                  <span>{part.label}</span>
                  <input
                    type="color"
                    value={aquarium.currentColor[part.id]}
                    onChange={(e) =>
                      aquarium.updateCustomPalette(part.id, e.target.value)
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
                  value={aquarium.currentColor.glowIntensity}
                  onChange={(e) =>
                    aquarium.updateCustomPalette(
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
          <button onClick={ui.petAxolotl} className="rainbow-btn btn-primary">
            Pet
          </button>
          <button
            onClick={aquarium.handleFeed}
            className="rainbow-btn btn-success"
          >
            Feed
          </button>
          <button
            onClick={aquarium.handleDropTreat}
            className="rainbow-btn btn-info"
          >
            Treat
          </button>
        </Group>

        <div className="main-separator" />

        <Group title="Behavior">
          <button
            onClick={() => aquarium.setMood("excited")}
            className={`rainbow-btn btn-secondary ${aquarium.mood === "excited" ? "btn-active" : ""}`}
          >
            Excited
          </button>
          <button
            onClick={() => aquarium.setMood("chill")}
            className={`rainbow-btn btn-secondary ${aquarium.mood === "chill" ? "btn-active" : ""}`}
          >
            Chill
          </button>
          <button
            onClick={() => aquarium.setMood("lazy")}
            className={`rainbow-btn btn-secondary ${aquarium.mood === "lazy" ? "btn-active" : ""}`}
          >
            Lazy
          </button>
        </Group>

        <div className="main-separator" />

        <Group title="Environment">
          <button
            onClick={() =>
              aquarium.setLightMode((mode) =>
                mode === "day" ? "night" : "day",
              )
            }
            className="rainbow-btn btn-success"
          >
            {aquarium.lightMode === "day" ? "Day" : "Night"}
          </button>
          <button
            onClick={aquarium.cycleSubstrate}
            className="rainbow-btn btn-secondary"
          >
            {aquarium.substrate}
          </button>
          <button
            onClick={ui.cycleFoliage}
            className="rainbow-btn btn-success"
            disabled={!aquarium.showGrass}
          >
            {aquarium.showGrass ? ui.foliageStyle : "Off"}
          </button>
        </Group>

        <div className="main-separator" />

        <Group title="Tricks">
          <button
            onClick={() => ui.setTrick("barrelRoll")}
            disabled={ui.trick !== "none"}
            className="rainbow-btn btn-info"
          >
            Roll
          </button>
          <button
            onClick={() => ui.setTrick("backflip")}
            disabled={ui.trick !== "none"}
            className="rainbow-btn btn-info"
          >
            Flip
          </button>
          <button
            onClick={() => ui.setTrick("spin")}
            disabled={ui.trick !== "none"}
            className="rainbow-btn btn-info"
          >
            Spin
          </button>
        </Group>
      </section>
    </>
  );
}
