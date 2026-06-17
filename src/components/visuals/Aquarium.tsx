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

function AquariumUiOverlay() {
  // Bypassing strict types locally to use safe optional chaining mapped to your actual hooks
  const aquarium = useAquarium() as any;
  const ui = useAquariumUi() as any;

  // Navigation and view state toggles
  const [activeAxolotlTab, setActiveAxolotlTab] = useState<string | null>(null);
  const [activeDecoTab, setActiveDecoTab] = useState<string | null>(null);
  const [showCustomColors, setShowCustomColors] = useState<boolean>(false);

  const bodyParts: PartConfig[] = [
    { id: "body", label: "Body" },
    { id: "gills", label: "Gills" },
    { id: "fins", label: "Fins" },
    { id: "tail", label: "Tail" },
    { id: "legs", label: "Legs" },
    { id: "toes", label: "Toes" },
    { id: "eyes", label: "Eyes" },
  ];

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        pointerEvents: "none", // Allows dragging and orbital controls on the 3D Canvas underneath
        display: "flex",
        justifyContent: "space-between",
        padding: "30px",
        boxSizing: "border-box",
        fontFamily: "sans-serif",
        zIndex: 10,
      }}
    >
      {/* LEFT CONTROL PANEL: AXOLOTL CONFIGURATIONS */}
      <div
        className="ui-panel"
        style={{
          background: "rgba(20, 30, 50, 0.75)",
          backdropFilter: "blur(14px)",
          borderRadius: "16px",
          padding: "20px",
          width: "290px",
          height: "fit-content",
          pointerEvents: "auto",
          boxShadow: "0 12px 40px rgba(0, 0, 0, 0.4)",
          color: "white",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
        }}
      >
        <h3
          style={{
            margin: "0 0 4px 0",
            letterSpacing: "1px",
            fontSize: "16px",
            color: "#69d2ff",
          }}
        >
          AXOLOTL CONTROLS
        </h3>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "8px",
          }}
        >
          <button
            style={{ padding: "8px", cursor: "pointer" }}
            onClick={() =>
              setActiveAxolotlTab(activeAxolotlTab === "CARE" ? null : "CARE")
            }
          >
            CARE
          </button>
          <button
            style={{ padding: "8px", cursor: "pointer" }}
            onClick={() =>
              setActiveAxolotlTab(
                activeAxolotlTab === "BEHAVE" ? null : "BEHAVE",
              )
            }
          >
            BEHAVE
          </button>
          <button
            style={{ padding: "8px", cursor: "pointer" }}
            onClick={() =>
              setActiveAxolotlTab(
                activeAxolotlTab === "TRICKS" ? null : "TRICKS",
              )
            }
          >
            TRICKS
          </button>
          <button
            style={{ padding: "8px", cursor: "pointer" }}
            onClick={() =>
              setActiveAxolotlTab(
                activeAxolotlTab === "ACCESSORY" ? null : "ACCESSORY",
              )
            }
          >
            ACCESSORIES
          </button>
          <button
            style={{ padding: "8px", gridColumn: "span 2", cursor: "pointer" }}
            onClick={() =>
              setActiveAxolotlTab(activeAxolotlTab === "COLOR" ? null : "COLOR")
            }
          >
            COLOR METER
          </button>
        </div>

        {/* CARE OPTIONS */}
        {activeAxolotlTab === "CARE" && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "6px",
              background: "rgba(0,0,0,0.2)",
              padding: "8px",
              borderRadius: "8px",
            }}
          >
            <button
              style={{ padding: "6px" }}
              onClick={() => aquarium.handleFeed?.()}
            >
              FEED FOOD
            </button>
            <button
              style={{ padding: "6px" }}
              onClick={() => aquarium.handleDropTreat?.()}
            >
              GIVE TREAT
            </button>

            {/* Action Pet Trigger: Momentary regular button instead of a toggle */}
            <button
              style={{
                padding: "6px",
                backgroundColor: ui.isPetting
                  ? "#ff69b4"
                  : "rgba(255,255,255,0.15)",
                fontWeight: ui.isPetting ? "bold" : "normal",
              }}
              onClick={() => {
                if (ui.setIsPetting) {
                  ui.setIsPetting(true);
                  // Detailed Comment: Automatically resets petting back to false after animation duration
                  setTimeout(() => ui.setIsPetting(false), 2500);
                }
              }}
            >
              {ui.isPetting ? "🐾 PETTING..." : "PET AXOLOTL"}
            </button>
          </div>
        )}

        {/* BEHAVIOR MOODS */}
        {activeAxolotlTab === "BEHAVE" && (
          <div
            style={{
              display: "flex",
              gap: "6px",
              background: "rgba(0,0,0,0.2)",
              padding: "8px",
              borderRadius: "8px",
            }}
          >
            {["chill", "excited", "lazy"].map((mood) => (
              <button
                key={mood}
                style={{
                  flex: 1,
                  padding: "6px",
                  fontSize: "11px",
                  backgroundColor: aquarium.mood === mood ? "#2a6bbd" : "",
                }}
                onClick={() => aquarium.setMood?.(mood)}
              >
                {mood.toUpperCase()}
              </button>
            ))}
          </div>
        )}

        {/* ANIMATION TRICKS */}
        {activeAxolotlTab === "TRICKS" && (
          <div
            style={{
              display: "flex",
              gap: "6px",
              background: "rgba(0,0,0,0.2)",
              padding: "8px",
              borderRadius: "8px",
            }}
          >
            <button
              style={{ flex: 1, padding: "6px", fontSize: "11px" }}
              onClick={() => ui.setTrick?.("barrelRoll")}
            >
              ROLL
            </button>
            <button
              style={{ flex: 1, padding: "6px", fontSize: "11px" }}
              onClick={() => ui.setTrick?.("backflip")}
            >
              FLIP
            </button>
            <button
              style={{ flex: 1, padding: "6px", fontSize: "11px" }}
              onClick={() => ui.setTrick?.("spin")}
            >
              SPIN
            </button>
          </div>
        )}

        {/* VISUAL ACCESSORIES */}
        {activeAxolotlTab === "ACCESSORY" && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "6px",
              background: "rgba(0,0,0,0.2)",
              padding: "8px",
              borderRadius: "8px",
            }}
          >
            {["crown", "glasses", "headphones", "topHat", "none"].map((acc) => (
              <button
                key={acc}
                style={{
                  padding: "6px",
                  fontSize: "11px",
                  gridColumn: acc === "none" ? "span 2" : "auto",
                  backgroundColor:
                    aquarium.currentAccessory === acc ? "#2a6bbd" : "",
                }}
                onClick={() =>
                  aquarium.setCurrentAccessory?.(acc === "none" ? null : acc)
                }
              >
                {acc.toUpperCase()}
              </button>
            ))}
          </div>
        )}

        {/* COLOR SCHEMES & PICKERS */}
        {activeAxolotlTab === "COLOR" && (
          <div
            style={{
              background: "rgba(0,0,0,0.2)",
              padding: "8px",
              borderRadius: "8px",
              display: "flex",
              flexDirection: "column",
              gap: "6px",
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "6px",
              }}
            >
              <button
                style={{
                  padding: "6px",
                  fontSize: "11px",
                  backgroundColor: aquarium.isCustomPalette ? "#2a6bbd" : "",
                }}
                onClick={() => {
                  setShowCustomColors(!showCustomColors);
                  aquarium.selectCustomPalette?.();
                }}
              >
                CUSTOM
              </button>
              <button
                style={{ padding: "6px", fontSize: "11px" }}
                onClick={() => {
                  setShowCustomColors(false);
                  aquarium.applyThemePreset?.("Bubblegum");
                }}
              >
                BUBBLEGUM
              </button>
              <button
                style={{ padding: "6px", fontSize: "11px" }}
                onClick={() => {
                  setShowCustomColors(false);
                  aquarium.applyThemePreset?.("Cosmo");
                }}
              >
                COSMO
              </button>
              <button
                style={{ padding: "6px", fontSize: "11px" }}
                onClick={() => {
                  setShowCustomColors(false);
                  aquarium.applyThemePreset?.("Deep Sea");
                }}
              >
                DEEP SEA
              </button>
            </div>

            {showCustomColors && (
              <div
                style={{
                  maxHeight: "140px",
                  overflowY: "auto",
                  marginTop: "6px",
                  borderTop: "1px solid rgba(255,255,255,0.2)",
                  paddingTop: "6px",
                }}
              >
                {bodyParts.map((part) => (
                  <div
                    key={part.id}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      margin: "4px 0",
                    }}
                  >
                    <span style={{ fontSize: "12px" }}>{part.label}</span>
                    <input
                      type="color"
                      value={aquarium.currentColor?.[part.id] || "#ffffff"}
                      onChange={(e) =>
                        aquarium.updateCustomColor?.(part.id, e.target.value)
                      }
                      style={{
                        border: "none",
                        width: "30px",
                        height: "20px",
                        cursor: "pointer",
                      }}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* RIGHT CONTROL PANEL: ENVIRONMENTS & OBJECT SPAWNERS */}
      <div
        className="ui-panel"
        style={{
          background: "rgba(20, 30, 50, 0.75)",
          backdropFilter: "blur(14px)",
          borderRadius: "16px",
          padding: "20px",
          width: "290px",
          height: "fit-content",
          pointerEvents: "auto",
          boxShadow: "0 12px 40px rgba(0, 0, 0, 0.4)",
          color: "white",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
        }}
      >
        <h3
          style={{
            margin: "0 0 4px 0",
            letterSpacing: "1px",
            fontSize: "16px",
            color: "#69d2ff",
          }}
        >
          TANK DECORATIONS
        </h3>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "8px",
          }}
        >
          <button
            style={{ padding: "8px", cursor: "pointer" }}
            onClick={() =>
              setActiveDecoTab(
                activeDecoTab === "FURNITURE" ? null : "FURNITURE",
              )
            }
          >
            FURNITURE
          </button>
          <button
            style={{ padding: "8px", cursor: "pointer" }}
            onClick={() =>
              setActiveDecoTab(activeDecoTab === "ENV" ? null : "ENV")
            }
          >
            ENVIRONMENT
          </button>
          <button
            style={{ padding: "8px", gridColumn: "span 2", cursor: "pointer" }}
            onClick={() =>
              setActiveDecoTab(activeDecoTab === "BG" ? null : "BG")
            }
          >
            BACKGROUNDS
          </button>
        </div>

        {/* ITEM MESH SPAWNING AND REMOVAL */}
        {activeDecoTab === "FURNITURE" && (
          <div
            style={{
              background: "rgba(0,0,0,0.2)",
              padding: "8px",
              borderRadius: "8px",
              display: "flex",
              flexDirection: "column",
              gap: "6px",
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "6px",
              }}
            >
              <button
                style={{ padding: "6px", fontSize: "11px" }}
                onClick={() => aquarium.addDecoration?.("castle")}
              >
                + CASTLE
              </button>
              <button
                style={{ padding: "6px", fontSize: "11px" }}
                onClick={() => aquarium.addDecoration?.("log")}
              >
                + LOG
              </button>
              <button
                style={{ padding: "6px", fontSize: "11px" }}
                onClick={() => aquarium.addDecoration?.("treasureChest")}
              >
                + CHEST
              </button>
              <button
                style={{ padding: "6px", fontSize: "11px" }}
                onClick={() => aquarium.addDecoration?.("brainCoral")}
              >
                + CORAL
              </button>
            </div>
            <button
              style={{
                padding: "6px",
                marginTop: "4px",
                backgroundColor: ui.deleteMode
                  ? "#cc3333"
                  : "rgba(255,255,255,0.15)",
                fontWeight: ui.deleteMode ? "bold" : "normal",
              }}
              onClick={() => ui.setDeleteMode?.(!ui.deleteMode)}
            >
              {ui.deleteMode ? "EXIT REMOVE MODE" : "REMOVE MESH OBJECT"}
            </button>
          </div>
        )}

        {/* SUBSTRATE MATERIALS, LIGHTING, FOLIAGE, AND BACKGROUND FISH */}
        {activeDecoTab === "ENV" && (
          <div
            style={{
              background: "rgba(0,0,0,0.2)",
              padding: "8px",
              borderRadius: "8px",
              display: "flex",
              flexDirection: "column",
              gap: "8px",
            }}
          >
            <button
              style={{
                padding: "8px",
                fontWeight: "bold",
                backgroundColor: "rgba(105, 210, 255, 0.2)",
              }}
              onClick={() =>
                aquarium.setLightMode?.(
                  aquarium.lightMode === "day" ? "night" : "day",
                )
              }
            >
              TOGGLE LIGHTS ({String(aquarium.lightMode || "day").toUpperCase()}
              )
            </button>

            <div>
              <span
                style={{
                  fontSize: "11px",
                  color: "#aaa",
                  display: "block",
                  marginBottom: "4px",
                }}
              >
                SUBSTRATE MATERIAL:{" "}
                {String(aquarium.substrate || "GRAVEL").toUpperCase()}
              </span>
              <button
                style={{ width: "100%", padding: "6px", fontSize: "11px" }}
                onClick={() => aquarium.cycleSubstrate?.()}
              >
                CYCLE SUBSTRATE
              </button>
            </div>

            {/* Detailed Comment: Added clean controls for the ambient background school of fish */}
            <div>
              <span
                style={{
                  fontSize: "11px",
                  color: "#aaa",
                  display: "block",
                  marginBottom: "4px",
                }}
              >
                BACKGROUND FISH ({aquarium.backgroundFish?.length || 0} /{" "}
                {aquarium.maxBackgroundFish || 5})
              </span>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr",
                  gap: "4px",
                }}
              >
                <button
                  style={{ padding: "5px", fontSize: "10px" }}
                  onClick={() => aquarium.addBackgroundFish?.("blue")}
                >
                  + BLUE
                </button>
                <button
                  style={{ padding: "5px", fontSize: "10px" }}
                  onClick={() => aquarium.addBackgroundFish?.("green")}
                >
                  + GREEN
                </button>
                <button
                  style={{
                    padding: "5px",
                    fontSize: "10px",
                    backgroundColor: "rgba(200,50,50,0.2)",
                  }}
                  onClick={() => aquarium.removeLastBackgroundFish?.()}
                >
                  - REMOVE
                </button>
              </div>
            </div>

            <div>
              <span
                style={{
                  fontSize: "11px",
                  color: "#aaa",
                  display: "block",
                  marginBottom: "4px",
                }}
              >
                PLANT STRAND TYPE:{" "}
                {String(ui.foliageStyle || "GRASS").toUpperCase()}
              </span>
              <button
                style={{ width: "100%", padding: "6px", fontSize: "11px" }}
                onClick={() => ui.cycleFoliage?.()}
              >
                CYCLE PLANT STYLE
              </button>
            </div>

            <button
              style={{ padding: "6px", marginTop: "2px" }}
              onClick={() => aquarium.setShowGrass?.(!aquarium.showGrass)}
            >
              TOGGLE VEGETATION ({aquarium.showGrass ? "ON" : "OFF"})
            </button>
          </div>
        )}

        {/* DYNAMIC BACKGROUND SCENE MAPPING */}
        {activeDecoTab === "BG" && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "6px",
              background: "rgba(0,0,0,0.2)",
              padding: "8px",
              borderRadius: "8px",
              maxHeight: "180px",
              overflowY: "auto",
            }}
          >
            {/* Detailed Comment: Loops dynamically over the valid context configuration list to prevent name mismatches */}
            {(aquarium.backgroundOptions || []).map((bg: any) => (
              <button
                key={bg.id}
                onClick={() => aquarium.setBackgroundTexture?.(bg.id)}
                style={{
                  fontSize: "11px",
                  padding: "6px",
                  backgroundColor:
                    aquarium.currentBackground?.id === bg.id
                      ? "#2a6bbd"
                      : "rgba(255,255,255,0.08)",
                  border:
                    aquarium.currentBackground?.id === bg.id
                      ? "1px solid #69d2ff"
                      : "1px solid transparent",
                  color: "white",
                  cursor: "pointer",
                }}
              >
                {bg.name || String(bg.id).toUpperCase()}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function AquariumShell() {
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
      <AquariumScene />
      <AquariumUiOverlay />
    </div>
  );
}

export default function Aquarium() {
  return (
    <AquariumProvider>
      <AquariumUiProvider>
        <AquariumShell />
      </AquariumUiProvider>
    </AquariumProvider>
  );
}
