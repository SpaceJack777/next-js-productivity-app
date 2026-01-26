"use client";

import { motion } from "framer-motion";

interface HabitsTrackerProgressProps {
  progress: number; // 0-1
  className?: string;
  circleColor?: string;
}

export function HabitsTrackerProgress({
  progress,
  className = "",
  circleColor = "",
}: HabitsTrackerProgressProps) {
  const size = 24;
  const strokeWidth = 4;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;

  return (
    <div
      className={`relative ${className}`}
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          className="text-border"
        />

        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          className={`${circleColor}`}
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{
            strokeDashoffset: circumference - progress * circumference,
          }}
          transition={{
            duration: 1,
            ease: "easeInOut",
          }}
        />
      </svg>
    </div>
  );
}
