import React, { useState } from "react";
import type { ColorPalette } from "../../../state/aquarium";

import { ACCESSORY_OPTIONS } from "../../Accessories/AccessoryCatalog";
import { DECORATION_OPTIONS } from "../Decorations/DecorationCatalog";
import { BACKGROUND_FISH_OPTIONS } from "../BackgroundFish/BackgroundFishCatalog";
import { getThemePresetIndex } from "../../../state/aquariumState";
import { useAquarium } from "../../../context/AquariumContext";
import { useAquariumUi } from "../../../context/AquariumUiContext";

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
  const [showOptions, setShowOptions] = useState(false);

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
  ] satisfies {
    id: keyof Omit<ColorPalette, "name">;
    label: string;
  }[];

  return (
    <>
      <div className="title-ribbon">
        <input
          type="text"
          value={ui.petName}
          onChange={(event) => ui.setPetName(event.target.value)}
          placeholder="Name Your Axolotl"
          className="aquarium-title-input"
          spellCheck={false}
          maxLength={30}
        />
      </div>

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
          disabled={aquarium.decorations.length === 0}
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

      <section className="side-panel right-panel">
        <button
          className="rainbow-btn side-btn btn-secondary"
          onClick={() => setShowOptions((value) => !value)}
        >
          Options {showOptions ? "^" : "v"}
        </button>

        {showOptions && (
          <>
            <span className="side-count">Wearables</span>
            <p className="side-subtitle">Accessories</p>
            <div className="theme-preset-list">
              {ACCESSORY_OPTIONS.map((option) => (
                <button
                  key={option.type}
                  className={`rainbow-btn side-btn ${option.buttonClass} ${aquarium.currentAccessory === option.type ? "btn-active" : ""}`}
                  onClick={() => aquarium.setCurrentAccessory(option.type)}
                >
                  {option.label}
                </button>
              ))}
              <button
                className="rainbow-btn side-btn btn-danger"
                disabled={!canClearAccessory}
                onClick={() => aquarium.setCurrentAccessory(null)}
              >
                Remove Accessory
              </button>
            </div>

            <div className="side-divider" />
            <p className="side-subtitle">Color Palette</p>
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

            {!aquarium.isCustomPalette ? (
              <p className="side-hint">
                Pick Custom to edit individual colors.
              </p>
            ) : (
              <>
                <div className="side-divider" />
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
                </div>
              </>
            )}
          </>
        )}
      </section>

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
