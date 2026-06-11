import React, { useState } from "react";
import type { ColorPalette } from "../../../state/aquarium";

import { ACCESSORY_OPTIONS } from "../../Accessories/AccessoryCatalog";
import { AQUARIUM_BACKGROUNDS } from "../../Background/backgroundTypes";
import { DECORATION_OPTIONS } from "../Decorations/DecorationCatalog";
import { BACKGROUND_FISH_OPTIONS } from "../BackgroundFish/BackgroundFishCatalog";
import { getThemePresetIndex } from "../../../state/aquariumState";
import { useAquarium } from "../../../context/AquariumContext";
import { useAquariumUi } from "../../../context/AquariumUiContext";

type MainPanel = "axolotl" | "decorations" | null;
type AxolotlTab = "care" | "behavior" | "tricks" | "accessories" | "color";
type DecorationsTab = "furniture" | "fish" | "environment" | "background";

function TabButton({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      className={`rainbow-btn btn-secondary popup-tab ${active ? "btn-active" : ""}`}
      onClick={onClick}
    >
      {label}
    </button>
  );
}

function ButtonGrid({ children }: { children: React.ReactNode }) {
  return <div className="section-button-grid">{children}</div>;
}

export default function AquariumControls() {
  const aquarium = useAquarium();
  const ui = useAquariumUi();
  const [activePanel, setActivePanel] = useState<MainPanel>(null);
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
  ] satisfies {
    id: keyof Omit<ColorPalette, "name">;
    label: string;
  }[];

  const togglePanel = (panel: Exclude<MainPanel, null>) => {
    setActivePanel((current) => (current === panel ? null : panel));
  };

  const renderAxolotlTab = () => {
    switch (axolotlTab) {
      case "care":
        return (
          <ButtonGrid>
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
          </ButtonGrid>
        );
      case "behavior":
        return (
          <ButtonGrid>
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
          </ButtonGrid>
        );
      case "tricks":
        return (
          <ButtonGrid>
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
          </ButtonGrid>
        );
      case "accessories":
        return (
          <ButtonGrid>
            {ACCESSORY_OPTIONS.map((option) => (
              <button
                key={option.type}
                className={`rainbow-btn btn-secondary ${option.buttonClass} ${aquarium.currentAccessory === option.type ? "btn-active" : ""}`}
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
              Remove Accessory
            </button>
          </ButtonGrid>
        );
      case "color":
        return (
          <div className="section-stack">
            <ButtonGrid>
              <button
                type="button"
                className={`rainbow-btn btn-secondary ${aquarium.isCustomPalette ? "btn-active" : ""}`}
                onClick={aquarium.selectCustomPalette}
              >
                Custom
              </button>

              {aquarium.themePresets.map((name) => (
                <button
                  key={name}
                  className={`rainbow-btn btn-secondary ${
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
            </ButtonGrid>

            {aquarium.isCustomPalette ? (
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
            ) : null}
          </div>
        );
    }
  };

  const renderDecorationsTab = () => {
    switch (decorationsTab) {
      case "furniture":
        return (
          <div className="section-stack">
            <span className="side-count">
              Furniture {aquarium.decorations.length}/{aquarium.maxDecorations}
            </span>
            <ButtonGrid>
              {furnitureOptions.map((option) => (
                <button
                  key={option.type}
                  className={`rainbow-btn btn-secondary ${option.buttonClass}`}
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
                - Furniture
              </button>
            </ButtonGrid>
          </div>
        );
      case "fish":
        return (
          <div className="section-stack">
            <span className="side-count">
              Fish {aquarium.backgroundFish.length}/{aquarium.maxBackgroundFish}
            </span>
            <ButtonGrid>
              {BACKGROUND_FISH_OPTIONS.map((option) => (
                <button
                  key={option.type}
                  className={`rainbow-btn btn-secondary ${option.buttonClass}`}
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
                - Fish
              </button>
            </ButtonGrid>
          </div>
        );
      case "environment":
        return (
          <ButtonGrid>
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
          </ButtonGrid>
        );
      case "background":
        return (
          <ButtonGrid>
            {AQUARIUM_BACKGROUNDS.map((background) => (
              <button
                key={background.id}
                type="button"
                className={`rainbow-btn btn-secondary ${aquarium.currentBackground.id === background.id ? "btn-active" : ""}`}
                onClick={() => aquarium.setBackgroundTexture(background.id)}
              >
                {background.name}
              </button>
            ))}
          </ButtonGrid>
        );
    }
  };

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

      <section className="main-controls-bar popup-dock">
        <div className="popup-launch-row">
          <button
            type="button"
            className={`rainbow-btn btn-secondary popup-launch ${activePanel === "axolotl" ? "btn-active" : ""}`}
            onClick={() => togglePanel("axolotl")}
          >
            Axolotl
          </button>
          <button
            type="button"
            className={`rainbow-btn btn-secondary popup-launch ${activePanel === "decorations" ? "btn-active" : ""}`}
            onClick={() => togglePanel("decorations")}
          >
            Decorations
          </button>
        </div>

        {activePanel === "axolotl" ? (
          <div className="popup-panel popup-panel-wide">
            <div className="popup-tab-row">
              <TabButton
                label="Care"
                active={axolotlTab === "care"}
                onClick={() => setAxolotlTab("care")}
              />
              <TabButton
                label="Behavior"
                active={axolotlTab === "behavior"}
                onClick={() => setAxolotlTab("behavior")}
              />
              <TabButton
                label="Tricks"
                active={axolotlTab === "tricks"}
                onClick={() => setAxolotlTab("tricks")}
              />
              <TabButton
                label="Accessories"
                active={axolotlTab === "accessories"}
                onClick={() => setAxolotlTab("accessories")}
              />
              <TabButton
                label="Color"
                active={axolotlTab === "color"}
                onClick={() => setAxolotlTab("color")}
              />
            </div>
            <div className="popup-content">{renderAxolotlTab()}</div>
          </div>
        ) : null}

        {activePanel === "decorations" ? (
          <div className="popup-panel popup-panel-narrow">
            <div className="popup-tab-row">
              <TabButton
                label="Furniture"
                active={decorationsTab === "furniture"}
                onClick={() => setDecorationsTab("furniture")}
              />
              <TabButton
                label="Fish"
                active={decorationsTab === "fish"}
                onClick={() => setDecorationsTab("fish")}
              />
              <TabButton
                label="Environment"
                active={decorationsTab === "environment"}
                onClick={() => setDecorationsTab("environment")}
              />
              <TabButton
                label="Background"
                active={decorationsTab === "background"}
                onClick={() => setDecorationsTab("background")}
              />
            </div>
            <div className="popup-content">{renderDecorationsTab()}</div>
          </div>
        ) : null}
      </section>
    </>
  );
}
