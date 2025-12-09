import { useDetection } from "@/hooks/use-detection";
import { useAppStore } from "@/stores/app-store";
import { useEffect, useRef } from "react";

export function Camera() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayCanvasRef = useRef<HTMLCanvasElement>(null);

  const { mouthRect, fingerPositions, handInMouth, warningDelay, detectionElapsed } = useAppStore();

  useDetection({ videoRef, canvasRef });

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

  useEffect(() => {
    const canvas = overlayCanvasRef.current;
    const video = videoRef.current;
    if (!canvas || !video) {
      return;
    }

    const container = video.parentElement;
    if (!container) {
      return;
    }

    const drawOverlay = () => {
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        return;
      }

      const videoWidth = video.videoWidth || 640;
      const videoHeight = video.videoHeight || 480;

      const containerWidth = container.clientWidth;
      const containerHeight = container.clientHeight;

      if (containerWidth === 0 || containerHeight === 0) {
        return;
      }

      const videoAspect = videoWidth / videoHeight;
      const containerAspect = containerWidth / containerHeight;

      let displayedVideoWidth: number;
      let displayedVideoHeight: number;
      let offsetX = 0;
      let offsetY = 0;

      if (videoAspect > containerAspect) {
        displayedVideoHeight = containerHeight;
        displayedVideoWidth = displayedVideoHeight * videoAspect;
        offsetX = (containerWidth - displayedVideoWidth) / 2;
      } else {
        displayedVideoWidth = containerWidth;
        displayedVideoHeight = displayedVideoWidth / videoAspect;
        offsetY = (containerHeight - displayedVideoHeight) / 2;
      }

      canvas.width = containerWidth;
      canvas.height = containerHeight;

      const scaleX = displayedVideoWidth / videoWidth;
      const scaleY = displayedVideoHeight / videoHeight;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.save();
      ctx.translate(offsetX, offsetY);
      ctx.scale(scaleX, scaleY);

      if (mouthRect) {
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 2 / Math.min(scaleX, scaleY);
        ctx.strokeRect(mouthRect.x, mouthRect.y, mouthRect.width, mouthRect.height);

        ctx.save();
        const labelX = mouthRect.x + mouthRect.width / 2;
        const labelY = mouthRect.y - 10;
        ctx.translate(labelX, labelY);
        ctx.scale(-1, 1);

        ctx.font = "bold 16px -apple-system, BlinkMacSystemFont, sans-serif";
        ctx.textAlign = "center";
        ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
        ctx.fillText("Mouth", 1, 1);
        ctx.fillStyle = "#ffffff";
        ctx.fillText("Mouth", 0, 0);
        ctx.restore();
      }

      fingerPositions.forEach((point) => {
        ctx.beginPath();
        const radius = 3 / Math.min(scaleX, scaleY);
        ctx.arc(point.x, point.y, radius, 0, Math.PI * 2);
        ctx.fillStyle = "#1a1a1a";
        ctx.fill();
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 1.5 / Math.min(scaleX, scaleY);
        ctx.stroke();
      });

      ctx.restore();
    };

    drawOverlay();

    const resizeObserver = new ResizeObserver(() => {
      drawOverlay();
    });

    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
    };
  }, [mouthRect, fingerPositions]);

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

      <div
        className={`absolute top-2 left-2 flex items-center gap-1.5 px-2 py-1 rounded-md text-[10px] font-medium backdrop-blur-sm ${
          handInMouth
            ? detectionElapsed >= warningDelay
              ? "bg-red-500/80 text-white"
              : "bg-yellow-500/80 text-black"
            : "bg-black/40 text-white/70"
        }`}
      >
        <span className="relative flex h-1.5 w-1.5">
          {handInMouth && (
            <span
              className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                detectionElapsed >= warningDelay ? "bg-white" : "bg-black"
              }`}
            />
          )}
          <span
            className={`relative inline-flex rounded-full h-1.5 w-1.5 ${
              handInMouth
                ? detectionElapsed >= warningDelay
                  ? "bg-white"
                  : "bg-yellow-300"
                : "bg-emerald-400"
            }`}
          />
        </span>

        {handInMouth ? (
          detectionElapsed >= warningDelay ? (
            "Triggered!"
          ) : (
            <span className="tabular-nums">
              {(Math.max(0, warningDelay - detectionElapsed) / 1000).toFixed(1)}s
            </span>
          )
        ) : (
          "Clear"
        )}
      </div>
    </div>
  );
}
