import { FaceLandmarker, FilesetResolver, HandLandmarker } from "@mediapipe/tasks-vision";

// Constants
export const MOUTH_LANDMARKS = [
  61, 146, 91, 181, 84, 17, 314, 405, 321, 375, 291, 308, 324, 318, 402, 317, 14, 87, 178, 88, 95,
  78, 61,
];

export const FINGER_TIP_INDICES = [4, 8, 12, 16, 20];

export const FACE_LANDMARKER_MODEL =
  "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task";

export const HAND_LANDMARKER_MODEL =
  "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task";

export const VISION_WASM_PATH = "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/wasm";

export const MOUTH_PADDING_RATIO = 0.02;

// Types
export interface Point {
  x: number;
  y: number;
}

export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

// Geometry functions
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

// MediaPipe initialization
export async function initializeMediaPipe() {
  const vision = await FilesetResolver.forVisionTasks(VISION_WASM_PATH);

  const faceLandmarker = await FaceLandmarker.createFromOptions(vision, {
    baseOptions: {
      modelAssetPath: FACE_LANDMARKER_MODEL,
      delegate: "GPU",
    },
    runningMode: "VIDEO",
    numFaces: 1,
    outputFacialTransformationMatrixes: false,
    outputFaceBlendshapes: false,
  });

  const handLandmarker = await HandLandmarker.createFromOptions(vision, {
    baseOptions: {
      modelAssetPath: HAND_LANDMARKER_MODEL,
      delegate: "GPU",
    },
    runningMode: "VIDEO",
    numHands: 2,
  });

  return { faceLandmarker, handLandmarker };
}


