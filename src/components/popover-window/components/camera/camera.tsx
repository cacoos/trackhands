import { OverlayCanvas } from "@/components/popover-window/components/camera/components/overlay-canvas";
import { useEffect, useRef } from "react";
import { StatusBadge } from "./components/status-badge";

interface CameraProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  canvasRef: React.RefObject<HTMLCanvasElement>;
}

export function Camera({ videoRef, canvasRef }: CameraProps) {
  const overlayCanvasRef = useRef<HTMLCanvasElement>(null);

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
  }, [videoRef]);

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

      <OverlayCanvas videoRef={videoRef} overlayCanvasRef={overlayCanvasRef} />

      <StatusBadge />
    </div>
  );
}
