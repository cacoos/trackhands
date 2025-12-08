import { FaceLandmarker, FilesetResolver, HandLandmarker } from "@mediapipe/tasks-vision";
import { useCallback, useRef } from "react";
import {
  FACE_LANDMARKER_MODEL,
  HAND_LANDMARKER_MODEL,
  VISION_WASM_PATH,
} from "@/lib/detection/constants";

export function useMediaPipe() {
  const faceLandmarkerRef = useRef<FaceLandmarker | null>(null);
  const handLandmarkerRef = useRef<HandLandmarker | null>(null);

  const initialize = useCallback(async () => {
    try {
      const vision = await FilesetResolver.forVisionTasks(VISION_WASM_PATH);

      faceLandmarkerRef.current = await FaceLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath: FACE_LANDMARKER_MODEL,
          delegate: "GPU",
        },
        runningMode: "VIDEO",
        numFaces: 1,
        outputFacialTransformationMatrixes: false,
        outputFaceBlendshapes: false,
      });

      handLandmarkerRef.current = await HandLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath: HAND_LANDMARKER_MODEL,
          delegate: "GPU",
        },
        runningMode: "VIDEO",
        numHands: 2,
      });

      return true;
    } catch (error) {
      console.error("Failed to initialize MediaPipe models:", error);
      return false;
    }
  }, []);

  const cleanup = useCallback(() => {
    if (faceLandmarkerRef.current) {
      faceLandmarkerRef.current.close();
      faceLandmarkerRef.current = null;
    }
    if (handLandmarkerRef.current) {
      handLandmarkerRef.current.close();
      handLandmarkerRef.current = null;
    }
  }, []);

  const detectFace = useCallback(
    ({ video, timestamp }: { video: HTMLVideoElement; timestamp: number }) => {
      if (!faceLandmarkerRef.current) {
        return null;
      }

      return faceLandmarkerRef.current.detectForVideo(video, timestamp);
    },
    []
  );

  const detectHands = useCallback(
    ({ video, timestamp }: { video: HTMLVideoElement; timestamp: number }) => {
      if (!handLandmarkerRef.current) {
        return null;
      }

      return handLandmarkerRef.current.detectForVideo(video, timestamp);
    },
    []
  );

  return {
    initialize,
    cleanup,
    detectFace,
    detectHands,
    isReady: () => faceLandmarkerRef.current !== null && handLandmarkerRef.current !== null,
  };
}
