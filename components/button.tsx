import { useState, useRef, useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import { Moon } from "lucide-react";

export function Button({ children }: { children: React.ReactNode }) {
  return (
    <button className="bg-[#1A9FA5] hover:bg-[#28B6C1] text-white px-4 py-2 text-sm rounded-md transition-colors hover:cursor-pointer">
      {children}
    </button>
  );
}

export function ButtonDeep() {
  const scale = 1.2;

  const [active, setActive] = useState(false);
  const [holding, setHolding] = useState(false);
  const timeoutRef = useRef<number | undefined>(undefined);
  const controls = useAnimation();

  // Base sizes
  const BASE_CONTAINER = 56;
  const BASE_WRAPPER = 48;
  const BASE_ICON = 34;
  const STROKE = 3;

  // Scaled
  const containerSize = BASE_CONTAINER * scale;
  const wrapperSize = BASE_WRAPPER * scale;
  const iconSize = BASE_ICON * scale;
  const R = wrapperSize / 2;
  const C = 2 * Math.PI * R;
  const center = containerSize / 2;

  // Long press handlers
  function handlePointerDown() {
    if (active) return;
    setHolding(true);
    timeoutRef.current = window.setTimeout(() => {
      setActive(true);
      setHolding(false);
    }, 2000);
  }
  function handlePointerUp() {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = undefined;
    }
    setHolding(false);
  }

  // One-time scale pulse on activation
  useEffect(() => {
    if (active) {
      controls.start({
        scale: [1, 1.1, 1],
        transition: { duration: 0.6, ease: "easeOut" },
      });
    }
  }, [active, controls]);

  return (
    <div
      className="relative flex items-center justify-center cursor-pointer"
      style={{ width: containerSize, height: containerSize }}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
    >
      {/* Static border */}
      <svg
        width={containerSize}
        height={containerSize}
        className="absolute top-0 left-0"
      >
        <circle
          cx={center}
          cy={center}
          r={R}
          stroke="#24d3ee"
          strokeWidth={STROKE}
          fill="transparent"
          opacity={0.3}
        />
        {/* Progress arc on long press */}
        {holding && (
          <motion.circle
            cx={center}
            cy={center}
            r={R}
            stroke="#24d3ee"
            strokeWidth={STROKE}
            fill="transparent"
            strokeDasharray={C}
            strokeDashoffset={C}
            transform={`rotate(-90 ${center} ${center})`}
            animate={{ strokeDashoffset: 0 }}
            transition={{ duration: 2, ease: "linear" }}
          />
        )}
        {/* {!active && (
          <motion.circle
            cx={center}
            cy={center}
            r={R}
            stroke="#24d3ee"
            strokeWidth={STROKE}
            fill="transparent"
            strokeDasharray={C}
            strokeDashoffset={C}
            transform={`rotate(-90 ${center} ${center})`}
            animate={{ strokeDashoffset: holding ? 0 : C }}
            transition={{ duration: 2, ease: "linear" }}
          />
        )} */}{" "}
      </svg>

      {/* Icon wrapper with completion pulse */}
      <motion.div
        className={`rounded-full flex items-center justify-center transition-colors duration-200
          ${
            active
              ? "bg-gradient-to-tr from-[#24d3ee] to-[#24d3ee] shadow-[0_0_10px_0_rgba(0,255,255,0.7)]"
              : "bg-transparent"
          }`}
        style={{ width: wrapperSize, height: wrapperSize }}
        animate={controls}
      >
        <Moon
          size={iconSize}
          color={active ? "#fff" : "#24d3ee"}
          fill={active ? "#fff" : "none"}
        />
      </motion.div>
    </div>
  );
}
