import { create } from "zustand";

export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Point {
  x: number;
  y: number;
}

export type DetectionSpeed = "slow" | "medium" | "fast";

export const detectionIntervals: Record<DetectionSpeed, number> = {
  slow: 1.0,
  medium: 0.4,
  fast: 0.1,
};

interface AppState {
  handInMouth: boolean;
  mouthRect: Rect | null;
  fingerPositions: Point[];
  detectionSpeed: DetectionSpeed;
  cameraResolution: "low" | "medium" | "high";
  warningDelay: number; // in milliseconds
  autoDismissDelay: number; // in milliseconds
  detectionElapsed: number; // ms since detection started
  setHandInMouth: (value: boolean) => void;
  setMouthRect: (rect: Rect | null) => void;
  setFingerPositions: (positions: Point[]) => void;
  setDetectionSpeed: (speed: DetectionSpeed) => void;
  setCameraResolution: (resolution: "low" | "medium" | "high") => void;
  setWarningDelay: (delay: number) => void;
  setAutoDismissDelay: (delay: number) => void;
  setDetectionElapsed: (elapsed: number) => void;
}

export const useAppStore = create<AppState>((set) => ({
  handInMouth: false,
  mouthRect: null,
  fingerPositions: [],
  detectionSpeed: "medium",
  cameraResolution: "medium",
  warningDelay: 2000,
  autoDismissDelay: 2000,
  detectionElapsed: 0,
  setHandInMouth: (value) => set({ handInMouth: value }),
  setMouthRect: (rect) => set({ mouthRect: rect }),
  setFingerPositions: (positions) => set({ fingerPositions: positions }),
  setDetectionSpeed: (speed) => set({ detectionSpeed: speed }),
  setCameraResolution: (resolution) => set({ cameraResolution: resolution }),
  setWarningDelay: (delay) => set({ warningDelay: delay }),
  setAutoDismissDelay: (delay) => set({ autoDismissDelay: delay }),
  setDetectionElapsed: (elapsed) => set({ detectionElapsed: elapsed }),
}));

export const resolutionConstraints: Record<"low" | "medium" | "high", MediaTrackConstraints> = {
  low: { width: 320, height: 240 },
  medium: { width: 640, height: 480 },
  high: { width: 1280, height: 720 },
};
