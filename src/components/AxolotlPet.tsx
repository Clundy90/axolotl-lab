import React, { useState } from "react";
import AxolotlSprite from "./visuals/AxolotlSprite";
import { motion, AnimatePresence } from "framer-motion";

export default function AxolotlPet() {
  const [name, setName] = useState("Lottie");
  const [color, setColor] = useState("#ffccd5"); // Classic Pink
  const [isHappy, setIsHappy] = useState(false);
  const [showHeart, setShowHeart] = useState(false);

  const petAxolotl = () => {
    setIsHappy(true);
    setShowHeart(true);
    setTimeout(() => {
      setIsHappy(false);
      setShowHeart(false);
    }, 2000);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "20px",
      }}
    >
      <h1 style={{ color: "white", fontSize: "2.5rem" }}>{name}'s Aquarium</h1>

      <div
        onMouseEnter={petAxolotl}
        style={{ cursor: "pointer", position: "relative" }}
      >
        <AnimatePresence>
          {showHeart && (
            <motion.div
              initial={{ opacity: 0, y: 0 }}
              animate={{ opacity: 1, y: -50 }}
              exit={{ opacity: 0 }}
              style={{ position: "absolute", top: 0, fontSize: "2rem" }}
            >
              💖
            </motion.div>
          )}
        </AnimatePresence>

        <AxolotlSprite color={color} isHappy={isHappy} />
      </div>

      <div style={{ display: "flex", gap: "10px" }}>
        <button onClick={() => setName("Bubbles")}>Rename</button>
        <button onClick={() => setColor("#bde0fe")}>Blue Mode</button>
        <button onClick={() => setColor("#ffccd5")}>Pink Mode</button>
      </div>
    </div>
  );
}
