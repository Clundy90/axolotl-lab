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
  onUpdateCustomPalette: (field: "main" | "light" | "dark", value: string) => void;
  onApplyThemePreset: (name: string) => void;
}

function Group({ title, children }: { title: string; children: React.ReactNode }) {
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
  const decorOptions = DECORATION_OPTIONS.filter((item) => item.category === "decor");
  const furnitureOptions = DECORATION_OPTIONS.filter(
    (item) => item.category === "furniture",
  );

  return (
    <>
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

      <section className="side-panel left-panel">
        <p className="side-title">Decorations</p>
        <span className="side-count">
          {decorationCount}/{maxDecorations}
        </span>
        <p className="side-subtitle">Decor</p>
        {decorOptions.map((option) => (
          <button
            key={option.type}
            className={`rainbow-btn side-btn ${option.colorClass}`}
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
            className={`rainbow-btn side-btn ${option.colorClass}`}
            disabled={!canAddDecoration}
            onClick={() => onAddDecoration(option.type)}
          >
            + {option.label}
          </button>
        ))}

        <button
          className={`rainbow-btn side-btn ${deleteMode ? "btn-red" : "btn-indigo"}`}
          onClick={() => onSetDeleteMode(!deleteMode)}
        >
          {deleteMode ? "Done Deleting" : "Delete Mode"}
        </button>
      </section>

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

      <section className="main-controls-bar">
        <Group title="Care">
          <button onClick={onPet} className="rainbow-btn btn-pink">
            Pet
          </button>
          <button onClick={onFeed} className="rainbow-btn btn-rose">
            Feed
          </button>
          <button onClick={onTreat} className="rainbow-btn btn-red">
            Treat
          </button>
        </Group>

        <div className="main-separator" />

        <Group title="Behavior">
          <button
            onClick={() => onSetMood("excited")}
            className={`rainbow-btn ${mood === "excited" ? "btn-orange" : "btn-blue"}`}
          >
            Excited
          </button>
          <button
            onClick={() => onSetMood("chill")}
            className={`rainbow-btn ${mood === "chill" ? "btn-green" : "btn-teal"}`}
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
          <button onClick={onToggleLightMode} className="rainbow-btn btn-yellow">
            {lightMode === "day" ? "Day" : "Night"}
          </button>
          <button onClick={onCycleSubstrate} className="rainbow-btn btn-green">
            {substrate}
          </button>
          <button
            onClick={onCycleFoliage}
            className="rainbow-btn btn-blue"
            disabled={!showGrass}
          >
            {showGrass ? foliageStyle : "Plants Off"}
          </button>
        </Group>

        <div className="main-separator" />

        <Group title="Tricks">
          <button
            onClick={() => onSetTrick("barrelRoll")}
            disabled={trick !== "none"}
            className="rainbow-btn btn-indigo"
          >
            Roll
          </button>
          <button
            onClick={() => onSetTrick("backflip")}
            disabled={trick !== "none"}
            className="rainbow-btn btn-purple"
          >
            Flip
          </button>
          <button
            onClick={() => onSetTrick("spin")}
            disabled={trick !== "none"}
            className="rainbow-btn btn-teal"
          >
            Spin
          </button>
        </Group>
      </section>
    </>
  );
}
