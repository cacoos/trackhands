import { useDrawOverlay } from "@/components/popover-window/components/camera/hooks/use-draw-overlay";

export function OverlayCanvas({
  videoRef,
  overlayCanvasRef,
}: {
  videoRef: React.RefObject<HTMLVideoElement>;
  overlayCanvasRef: React.RefObject<HTMLCanvasElement>;
}) {
  useDrawOverlay({ videoRef, overlayCanvasRef });

  return (
    <canvas
      ref={overlayCanvasRef}
      className="absolute top-0 left-0 w-full h-full pointer-events-none -scale-x-100"
    />
  );
}
