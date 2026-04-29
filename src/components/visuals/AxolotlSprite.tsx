import { motion } from "framer-motion";

interface Props {
  color: string;
  isHappy?: boolean;
}

export default function AxolotlSprite({ color, isHappy }: Props) {
  return (
    <motion.svg
      viewBox="0 0 200 100"
      width="200"
      height="100"
      initial={false}
      animate={{ y: [0, -5, 0] }} // Gentle floating
      transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
    >
      {/* Tail - Using a sine-wave wiggle */}
      <motion.path
        d="M 140,50 Q 170,30 190,50 Q 170,70 140,50"
        fill={color}
        opacity={0.7}
        animate={{ scaleX: [1, 1.1, 1], rotate: [-2, 2, -2] }}
        transition={{ repeat: Infinity, duration: 1.5 }}
      />

      {/* Body */}
      <ellipse cx="80" cy="50" rx="60" ry="35" fill={color} />

      {/* Gills (The signature look) */}
      {[45, 60, 75].map((x, i) => (
        <motion.path
          key={i}
          d={`M ${x},30 Q ${x - 10},10 ${x - 20},25`}
          stroke="#ff4d6d"
          strokeWidth="4"
          strokeLinecap="round"
          fill="none"
          animate={{ rotate: [-10, 10, -10] }}
          transition={{ repeat: Infinity, duration: 2, delay: i * 0.2 }}
        />
      ))}

      {/* Face */}
      <circle cx="60" cy="45" r="4" fill="black" />
      <circle cx="100" cy="45" r="4" fill="black" />

      {/* Smile - changes based on 'isHappy' state */}
      <motion.path
        d={isHappy ? "M 70,65 Q 80,75 90,65" : "M 70,70 Q 80,70 90,70"}
        stroke="black"
        strokeWidth="2"
        fill="none"
      />
    </motion.svg>
  );
}
