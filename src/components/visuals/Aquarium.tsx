import React from "react";
import AquariumControls from "./UI/AquariumControls";
import AquariumScene from "./AquariumScene";
import { AquariumProvider, useAquarium } from "../../context/AquariumContext";
import { AquariumUiProvider } from "../../context/AquariumUiContext";
import "./RainbowButtons.css";

function AquariumShell() {
  const aquarium = useAquarium();
  const hasBackgroundTexture = Boolean(aquarium.currentBackground.url);
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
    <div className="aquarium-container" style={backgroundStyle}>
      <div className="header-container">
        <AquariumControls />
      </div>
      <AquariumScene />
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
