import {
  FINGER_TIP_INDICES,
  MOUTH_LANDMARKS,
  MOUTH_PADDING_RATIO,
} from "@/lib/detection/constants";
import type { Point, Rect } from "@/stores/app-store";

export function getMouthRect({
  landmarks,
  videoWidth,
  videoHeight,
}: {
  landmarks: { x: number; y: number }[];
  videoWidth: number;
  videoHeight: number;
}): Rect {
  const mouthPoints = MOUTH_LANDMARKS.map((idx) => landmarks[idx]);

  const xCoords = mouthPoints.map((p) => p.x * videoWidth);
  const yCoords = mouthPoints.map((p) => p.y * videoHeight);

  const minX = Math.min(...xCoords);
  const maxX = Math.max(...xCoords);
  const minY = Math.min(...yCoords);
  const maxY = Math.max(...yCoords);

  const padding = Math.round(videoHeight * MOUTH_PADDING_RATIO);

  return {
    x: minX - padding,
    y: minY - padding,
    width: maxX - minX + padding * 2,
    height: maxY - minY + padding * 2,
  };
}

export function getFingerPositions({
  handLandmarks,
  videoWidth,
  videoHeight,
}: {
  handLandmarks: { x: number; y: number }[][];
  videoWidth: number;
  videoHeight: number;
}): Point[] {
  const positions: Point[] = [];

  for (const hand of handLandmarks) {
    for (const tipIdx of FINGER_TIP_INDICES) {
      const landmark = hand[tipIdx];
      if (landmark) {
        positions.push({
          x: landmark.x * videoWidth,
          y: landmark.y * videoHeight,
        });
      }
    }
  }

  return positions;
}

export function isFingerInMouth({ fingers, mouth }: { fingers: Point[]; mouth: Rect }): boolean {
  for (const finger of fingers) {
    if (
      finger.x >= mouth.x &&
      finger.x <= mouth.x + mouth.width &&
      finger.y >= mouth.y &&
      finger.y <= mouth.y + mouth.height
    ) {
      return true;
    }
  }
  return false;
}
