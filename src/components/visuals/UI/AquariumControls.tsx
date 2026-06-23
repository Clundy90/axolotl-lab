import React, { useState } from "react";
import type { ColorPalette } from "../../../state/aquarium";

// Detailed Comment: Import catalog selections and context states required for managing interactive layers.
import { ACCESSORY_OPTIONS } from "../../Accessories/AccessoryCatalog";
import { AQUARIUM_BACKGROUNDS } from "../../Background/backgroundTypes";
import { DECORATION_OPTIONS } from "../Decorations/DecorationCatalog";
import { BACKGROUND_FISH_OPTIONS } from "../BackgroundFish/BackgroundFishCatalog";
import { getThemePresetIndex } from "../../../state/aquariumState";
import { useAquarium } from "../../../context/AquariumContext";
import { useAquariumUi } from "../../../context/AquariumUiContext";

type AxolotlTab = "care" | "behavior" | "tricks" | "accessories" | "color";
type DecorationsTab = "furniture" | "fish" | "environment" | "background";

export default function AquariumControls() {
  const aquarium = useAquarium();
  const ui = useAquariumUi();

  // Detailed Comment: React local state is used to track the active sub-tab view inside each panel.
  const [axolotlTab, setAxolotlTab] = useState<AxolotlTab>("care");
  const [decorationsTab, setDecorationsTab] =
    useState<DecorationsTab>("furniture");

  const canAddDecoration =
    aquarium.decorations.length < aquarium.maxDecorations;
  const canAddBackgroundFish =
    aquarium.backgroundFish.length < aquarium.maxBackgroundFish;
  const canClearAccessory = aquarium.currentAccessory !== null;
  const furnitureOptions = DECORATION_OPTIONS.filter(
    (item) => item.category === "furniture",
  );

  const bodyParts = [
    { id: "body", label: "Body" },
    { id: "gills", label: "Gills" },
    { id: "fins", label: "Fins" },
    { id: "tail", label: "Tail" },
    { id: "legs", label: "Legs" },
    { id: "toes", label: "Toes" },
    { id: "eyes", label: "Eyes" },
  ] satisfies { id: keyof Omit<ColorPalette, "name">; label: string }[];

  // Detailed Comment: Helper functions to render the grid contents conditionally based on the active tab state.
  const renderAxolotlContent = () => {
    switch (axolotlTab) {
      case "care":
        return (
          <div className="section-button-grid">
            <button className="rainbow-btn btn-primary" onClick={ui.petAxolotl}>
              Pet
            </button>
            <button
              className="rainbow-btn btn-success"
              onClick={aquarium.handleFeed}
            >
              Feed
            </button>
            <button
              className="rainbow-btn btn-info"
              onClick={aquarium.handleDropTreat}
            >
              Treat
            </button>
          </div>
        );
      case "behavior":
        return (
          <div className="section-button-grid">
            <button
              className={`rainbow-btn ${aquarium.mood === "excited" ? "btn-info" : "btn-secondary"}`}
              onClick={() => aquarium.setMood("excited")}
            >
              Excited
            </button>
            <button
              className={`rainbow-btn ${aquarium.mood === "chill" ? "btn-info" : "btn-secondary"}`}
              onClick={() => aquarium.setMood("chill")}
            >
              Chill
            </button>
            <button
              className={`rainbow-btn ${aquarium.mood === "lazy" ? "btn-info" : "btn-secondary"}`}
              onClick={() => aquarium.setMood("lazy")}
            >
              Lazy
            </button>
          </div>
        );
      case "tricks":
        return (
          <div className="section-button-grid">
            <button
              className="rainbow-btn btn-info"
              disabled={ui.trick !== "none"}
              onClick={() => ui.setTrick("barrelRoll")}
            >
              Roll
            </button>
            <button
              className="rainbow-btn btn-info"
              disabled={ui.trick !== "none"}
              onClick={() => ui.setTrick("backflip")}
            >
              Flip
            </button>
            <button
              className="rainbow-btn btn-info"
              disabled={ui.trick !== "none"}
              onClick={() => ui.setTrick("spin")}
            >
              Spin
            </button>
            <button
              className="rainbow-btn btn-info"
              disabled={ui.trick !== "none"}
              onClick={() => ui.setTrick("toot")}
            >
              Toot
            </button>
          </div>
        );
      case "accessories":
        return (
          <div className="section-button-grid">
            {ACCESSORY_OPTIONS.map((option) => (
              <button
                key={option.type}
                className={`rainbow-btn ${aquarium.currentAccessory === option.type ? "btn-info" : "btn-secondary"}`}
                onClick={() => aquarium.setCurrentAccessory(option.type)}
              >
                {option.label}
              </button>
            ))}
            <button
              className="rainbow-btn btn-danger"
              disabled={!canClearAccessory}
              onClick={() => aquarium.setCurrentAccessory(null)}
            >
              Remove
            </button>
          </div>
        );
      case "color":
        return (
          <div className="section-stack">
            <div className="section-button-grid">
              <button
                className={`rainbow-btn ${aquarium.isCustomPalette ? "btn-info" : "btn-secondary"}`}
                onClick={aquarium.selectCustomPalette}
              >
                Custom
              </button>
              {aquarium.themePresets.map((name) => (
                <button
                  key={name}
                  className={`rainbow-btn ${!aquarium.isCustomPalette && aquarium.colorIndex === getThemePresetIndex(name) ? "btn-info" : "btn-secondary"}`}
                  onClick={() => aquarium.applyThemePreset(name)}
                >
                  {name}
                </button>
              ))}
            </div>
            {aquarium.isCustomPalette && (
              <div className="custom-color-list">
                {bodyParts.map((part) => (
                  <div key={part.id} className="color-edit-row">
                    <span>{part.label}</span>
                    <input
                      type="color"
                      value={aquarium.currentColor[part.id]}
                      onChange={(e) =>
                        aquarium.updateCustomColor?.(part.id, e.target.value)
                      }
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  const renderDecorationsContent = () => {
    switch (decorationsTab) {
      case "furniture":
        return (
          <div className="section-button-grid">
            {furnitureOptions.map((option) => (
              <button
                key={option.type}
                className="rainbow-btn btn-secondary"
                disabled={!canAddDecoration}
                onClick={() => aquarium.addDecoration(option.type)}
              >
                + {option.label}
              </button>
            ))}
            <button
              className="rainbow-btn btn-danger"
              disabled={aquarium.decorations.length === 0}
              onClick={aquarium.removeLastDecoration}
            >
              - Remove
            </button>
          </div>
        );
      case "fish":
        return (
          <div className="section-button-grid">
            {BACKGROUND_FISH_OPTIONS.map((option) => (
              <button
                key={option.type}
                className="rainbow-btn btn-secondary"
                disabled={!canAddBackgroundFish}
                onClick={() => aquarium.addBackgroundFish(option.type)}
              >
                + {option.label}
              </button>
            ))}
            <button
              className="rainbow-btn btn-danger"
              disabled={aquarium.backgroundFish.length === 0}
              onClick={aquarium.removeLastBackgroundFish}
            >
              - Remove
            </button>
          </div>
        );
      case "environment":
        return (
          <div className="section-button-grid">
            <button
              className="rainbow-btn btn-success"
              onClick={() =>
                aquarium.setLightMode((mode) =>
                  mode === "day" ? "night" : "day",
                )
              }
            >
              {aquarium.lightMode === "day" ? "Day Mode" : "Night Mode"}
            </button>
            <button
              className="rainbow-btn btn-secondary"
              onClick={aquarium.cycleSubstrate}
            >
              Sand: {aquarium.substrate}
            </button>
            <button
              className="rainbow-btn btn-success"
              disabled={!aquarium.showGrass}
              onClick={ui.cycleFoliage}
            >
              {aquarium.showGrass
                ? `Plants: ${ui.foliageStyle}`
                : "Plants: Off"}
            </button>
          </div>
        );
      case "background":
        return (
          <div className="section-button-grid">
            {AQUARIUM_BACKGROUNDS.map((background) => (
              <button
                key={background.id}
                className={`rainbow-btn ${aquarium.currentBackground.id === background.id ? "btn-info" : "btn-secondary"}`}
                onClick={() => aquarium.setBackgroundTexture(background.id)}
              >
                {background.name}
              </button>
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    // Detailed Comment: Uses standard semantic HTML matching the coordinate styles defined in RainbowButtons.css.
    <div className="ui-split-controls">
      {/* Title Ribbon Bubble (Top Center) */}
      <div className="title-ribbon">
        <input
          type="text"
          className="aquarium-title-input"
          value={ui.petName || ""}
          onChange={(e) => ui.setPetName(e.target.value)}
          placeholder="NAMING YOUR AQUARIUM..."
        />
      </div>

      {/* Left Side Rail: Axolotl Options */}
      <div className="ui-side-rail left-panel">
        <div className="side-panel-header">
          <h3 className="side-title">Axolotl</h3>
        </div>
        <div className="popup-tab-row">
          {/* Detailed Comment: Shortcuts removed; text strings expanded back into complete header terms */}
          <button
            className={`rainbow-btn btn-muted ${axolotlTab === "care" ? "btn-active" : ""}`}
            onClick={() => setAxolotlTab("care")}
          >
            Care
          </button>
          <button
            className={`rainbow-btn btn-muted ${axolotlTab === "behavior" ? "btn-active" : ""}`}
            onClick={() => setAxolotlTab("behavior")}
          >
            Behavior
          </button>
          <button
            className={`rainbow-btn btn-muted ${axolotlTab === "tricks" ? "btn-active" : ""}`}
            onClick={() => setAxolotlTab("tricks")}
          >
            Tricks
          </button>
          <button
            className={`rainbow-btn btn-muted ${axolotlTab === "accessories" ? "btn-active" : ""}`}
            onClick={() => setAxolotlTab("accessories")}
          >
            Accessories
          </button>
          <button
            className={`rainbow-btn btn-muted ${axolotlTab === "color" ? "btn-active" : ""}`}
            onClick={() => setAxolotlTab("color")}
          >
            Color
          </button>
        </div>
        <div className="side-divider" />
        <div className="popup-content">{renderAxolotlContent()}</div>
      </div>

      {/* Right Side Rail: Habitat/Decorations Options */}
      <div className="ui-side-rail right-panel">
        <div className="side-panel-header">
          <h3 className="side-title">Decorations</h3>
        </div>
        <div className="popup-tab-row">
          <button
            className={`rainbow-btn btn-muted ${decorationsTab === "furniture" ? "btn-active" : ""}`}
            onClick={() => setDecorationsTab("furniture")}
          >
            Furniture
          </button>
          <button
            className={`rainbow-btn btn-muted ${decorationsTab === "fish" ? "btn-active" : ""}`}
            onClick={() => setDecorationsTab("fish")}
          >
            Fish
          </button>
          <button
            className={`rainbow-btn btn-muted ${decorationsTab === "environment" ? "btn-active" : ""}`}
            onClick={() => setDecorationsTab("environment")}
          >
            Environment
          </button>
          <button
            className={`rainbow-btn btn-muted ${decorationsTab === "background" ? "btn-active" : ""}`}
            onClick={() => setDecorationsTab("background")}
          >
            Background
          </button>
        </div>
        <div className="side-divider" />
        <div className="popup-content">{renderDecorationsContent()}</div>
      </div>
    </div>
  );
}
