import { useDetection } from "@/hooks/use-detection";
import { useRef } from "react";
import { Camera } from "./camera";

function DetectionRunner({
  videoRef,
  canvasRef,
}: {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
}) {
  useDetection({ videoRef, canvasRef });

  return null;
}

export function CameraWithDetection() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  return (
    <>
      <DetectionRunner videoRef={videoRef} canvasRef={canvasRef} />
      <Camera videoRef={videoRef} canvasRef={canvasRef} />
    </>
  );
}
