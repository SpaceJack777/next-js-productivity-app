"use client";

import { motion } from "framer-motion";

interface CircularProgressProps {
  progress: number; // 0-1
  className?: string;
  circleColor?: string;
  children?: React.ReactNode;
}

export function CircularProgress({
  progress,
  className = "",
  circleColor = "",
  children,
}: CircularProgressProps) {
  const size = 320;
  const strokeWidth = 3;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;

  return (
    <div
      className={`relative ${className}`}
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          className="text-border"
        />

        {/* Animated progress circle - 1px loading bar */}
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

      {/* Center content */}
      {children && (
        <div className="absolute inset-0 flex items-center justify-center">
          {children}
        </div>
      )}
    </div>
  );
}
