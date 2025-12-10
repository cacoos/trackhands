import {
  FONT_SIZE_RATIO,
  LABEL_OFFSET_RATIO,
  SHADOW_OFFSET_RATIO,
} from "@/lib/detection/constants";
import { useAppStore } from "@/stores/app-store";
import { RefObject, useEffect } from "react";

interface UseDrawOverlayProps {
  videoRef: RefObject<HTMLVideoElement | null>;
  overlayCanvasRef: RefObject<HTMLCanvasElement | null>;
}

export function useDrawOverlay({ videoRef, overlayCanvasRef }: UseDrawOverlayProps) {
  const { mouthRect, fingerPositions } = useAppStore();

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
        const labelOffset = videoHeight * LABEL_OFFSET_RATIO;
        const labelY = mouthRect.y - labelOffset;
        ctx.translate(labelX, labelY);
        ctx.scale(-1, 1);

        const fontSize = Math.round(videoHeight * FONT_SIZE_RATIO);
        const shadowOffset = Math.max(1, fontSize * SHADOW_OFFSET_RATIO);
        ctx.font = `bold ${fontSize}px -apple-system, BlinkMacSystemFont, sans-serif`;
        ctx.textAlign = "center";
        ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
        ctx.fillText("Mouth", shadowOffset, shadowOffset);
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
  }, [mouthRect, fingerPositions, videoRef, overlayCanvasRef]);
}

