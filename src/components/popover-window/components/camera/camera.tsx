import { useDetection } from "@/hooks/use-detection";
import { useAppStore } from "@/stores/app-store";
import { useEffect, useMemo, useRef } from "react";
import { StatusBadge } from "./components/status-badge";
import { useDrawOverlay } from "./hooks/use-draw-overlay";

export function Camera() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayCanvasRef = useRef<HTMLCanvasElement>(null);

  const { mouthRect, handInMouth, warningDelay, detectionElapsed } = useAppStore();

  const status = useMemo(() => {
    if (!mouthRect) return "off";
    if (!handInMouth) return "clear";
    if (detectionElapsed >= warningDelay) return "alert";

    return "warning";
  }, [mouthRect, handInMouth, warningDelay, detectionElapsed]);

  useDetection({ videoRef, canvasRef });
  useDrawOverlay({ videoRef, overlayCanvasRef });

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const ensurePlaying = () => {
      if (video.paused && video.srcObject) {
        video.play().catch(() => {});
      }
    };

    const interval = setInterval(ensurePlaying, 500);

    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        ensurePlaying();
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);

  return (
    <div className="relative w-full h-full overflow-hidden bg-surface-alt shadow-app">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="w-full h-full object-cover -scale-x-100"
      />
      <canvas ref={canvasRef} className="hidden" />
      <canvas
        ref={overlayCanvasRef}
        className="absolute top-0 left-0 w-full h-full pointer-events-none -scale-x-100"
      />

      <StatusBadge
        status={status}
        countdown={
          handInMouth && detectionElapsed < warningDelay
            ? (warningDelay - detectionElapsed) / 1000
            : null
        }
      />
    </div>
  );
}
