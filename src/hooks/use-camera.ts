import { resolutionConstraints, useAppStore } from "@/stores/app-store";
import { useCallback, useRef } from "react";

export function useCamera(videoRef: React.RefObject<HTMLVideoElement | null>) {
  const streamRef = useRef<MediaStream | null>(null);

  const start = useCallback(async () => {
    try {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }

      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }

      const cameraResolution = useAppStore.getState().cameraResolution;
      const constraints = resolutionConstraints[cameraResolution];

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          ...constraints,
          facingMode: "user",
        },
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;

        await Promise.race([
          new Promise<void>((resolve) => {
            if (videoRef.current) {
              videoRef.current.onloadeddata = () => resolve();
            }
          }),
          new Promise<void>((resolve) => setTimeout(resolve, 3000)),
        ]);

        await videoRef.current.play();
      }

      return true;
    } catch (error) {
      console.error("Failed to start camera:", error);
      return false;
    }
  }, [videoRef]);

  const stop = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  }, []);

  const isActive = useCallback(() => {
    if (!streamRef.current) return false;
    const track = streamRef.current.getVideoTracks()[0];
    return track?.readyState === "live";
  }, []);

  const getStream = useCallback(() => streamRef.current, []);

  return { start, stop, isActive, getStream };
}
