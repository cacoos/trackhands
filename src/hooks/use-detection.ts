import { useCamera } from "@/hooks/use-camera";
import { useMediaPipe } from "@/hooks/use-mediapipe";
import { getFingerPositions, getMouthRect, isFingerInMouth } from "@/lib/detection/geometry";
import { STORAGE_KEYS } from "@/lib/storage-keys";
import { detectionIntervals, useAppStore } from "@/stores/app-store";
import { invoke } from "@tauri-apps/api/core";
import { listen } from "@tauri-apps/api/event";
import { useCallback, useEffect, useRef } from "react";

export function useDetection({
  videoRef,
  canvasRef,
}: {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
}) {
  const intervalRef = useRef<number | null>(null);
  const fingerInMouthStartRef = useRef<number | null>(null);
  const warningShownRef = useRef<boolean>(false);

  const {
    initialize: initModels,
    cleanup: cleanupModels,
    detectFace,
    detectHands,
    isReady: isMediaPipeReady,
  } = useMediaPipe();
  const { start: startCamera, stop: stopCamera, isActive: isCameraActive } = useCamera(videoRef);

  const { setHandInMouth, setMouthRect, setFingerPositions, setDetectionElapsed } = useAppStore();

  const captureScreenshot = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return null;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    if (!ctx) return null;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0);

    return canvas.toDataURL("image/jpeg", 0.7);
  }, [videoRef, canvasRef]);

  const handleWarning = useCallback(
    async ({
      isInMouth,
      now,
      wasInMouth,
    }: {
      isInMouth: boolean;
      now: number;
      wasInMouth: boolean;
    }) => {
      if (isInMouth) {
        if (!fingerInMouthStartRef.current) {
          fingerInMouthStartRef.current = now;
        }

        if (!wasInMouth) {
          const screenshot = captureScreenshot();
          if (screenshot) {
            localStorage.setItem(STORAGE_KEYS.DETECTION_IMAGE, screenshot);
          }
        }

        const timeInMouth = now - fingerInMouthStartRef.current;
        const warningDelayMs = useAppStore.getState().warningDelay;

        // Update elapsed time in store
        setDetectionElapsed(timeInMouth);

        if (timeInMouth >= warningDelayMs && !warningShownRef.current) {
          warningShownRef.current = true;

          const isPopoverVisible = await invoke<boolean>("is_popover_visible").catch(() => false);

          if (!isPopoverVisible) {
            invoke("show_warning").catch(console.error);
          }
        }
      } else {
        fingerInMouthStartRef.current = null;
        warningShownRef.current = false;
        setDetectionElapsed(0);
      }
    },
    [captureScreenshot, setDetectionElapsed]
  );

  const processFrame = useCallback(async () => {
    const video = videoRef.current;

    if (!video || !isMediaPipeReady()) {
      return;
    }

    const now = performance.now();

    try {
      const { videoWidth, videoHeight } = video;

      const faceResults = detectFace({ video, timestamp: now });
      if (!faceResults?.faceLandmarks?.length) {
        setMouthRect(null);

        return;
      }

      const mouthRect = getMouthRect({
        landmarks: faceResults.faceLandmarks[0],
        videoWidth,
        videoHeight,
      });

      setMouthRect(mouthRect);

      const handResults = detectHands({ video, timestamp: now });
      if (!handResults?.landmarks?.length) {
        setFingerPositions([]);
        setHandInMouth(false);

        fingerInMouthStartRef.current = null;
        warningShownRef.current = false;

        return;
      }

      const fingers = getFingerPositions({
        handLandmarks: handResults.landmarks,
        videoWidth,
        videoHeight,
      });

      setFingerPositions(fingers);

      const wasInMouth = useAppStore.getState().handInMouth;
      const isInMouth = isFingerInMouth({ fingers, mouth: mouthRect });

      await handleWarning({ isInMouth, now, wasInMouth });

      if (wasInMouth !== isInMouth) {
        setHandInMouth(isInMouth);
      }
    } catch (error) {
      console.error("Detection error:", error);
    }
  }, [
    videoRef,
    isMediaPipeReady,
    detectFace,
    detectHands,
    handleWarning,
    setMouthRect,
    setFingerPositions,
    setHandInMouth,
  ]);

  const startDetection = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    const intervalMs = detectionIntervals[useAppStore.getState().detectionSpeed] * 1000;

    intervalRef.current = window.setInterval(processFrame, intervalMs);
  }, [processFrame]);

  const stopDetection = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const cleanup = useCallback(() => {
    stopDetection();
    stopCamera();
    cleanupModels();
  }, [stopDetection, stopCamera, cleanupModels]);

  useEffect(() => {
    const init = async () => {
      await initModels();
      await startCamera();
    };

    init();

    return cleanup;
  }, [cleanup, initModels, startCamera]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) {
      return;
    }

    const handleLoadedData = () => startDetection();

    video.addEventListener("loadeddata", handleLoadedData);

    return () => video.removeEventListener("loadeddata", handleLoadedData);
  }, [videoRef, startDetection]);

  useEffect(() => {
    const unsubscribe = useAppStore.subscribe((state, prevState) => {
      if (state.cameraResolution !== prevState.cameraResolution && isCameraActive()) {
        startCamera();
      }

      if (state.detectionSpeed !== prevState.detectionSpeed && intervalRef.current) {
        startDetection();
      }
    });

    return unsubscribe;
  }, [isCameraActive, startCamera, startDetection]);

  useEffect(() => {
    const unlisten = listen<boolean>("warning-state", (event) => {
      if (!event.payload) {
        startCamera();
      }
    });

    return () => {
      unlisten.then((fn) => fn());
    };
  }, [startCamera]);

  return {
    startCamera,
    startDetection,
    stopDetection,
    cleanup,
  };
}
