import { useAppStore, type DetectionSpeed } from "@/stores/app-store";
import { load, type Store } from "@tauri-apps/plugin-store";
import { useEffect, useRef } from "react";

export function useSettings() {
  const {
    detectionSpeed,
    cameraResolution,
    warningDelay,
    setDetectionSpeed,
    setCameraResolution,
    setWarningDelay,
  } = useAppStore();
  const storeRef = useRef<Store | null>(null);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const store = await load("settings.json");
        storeRef.current = store;

        const savedSpeed = await store.get<DetectionSpeed>("detectionSpeed");
        const savedResolution = await store.get<"low" | "medium" | "high">("cameraResolution");
        const savedWarningDelay = await store.get<number>("warningDelay");

        if (savedSpeed) {
          setDetectionSpeed(savedSpeed);
        }

        if (savedResolution) {
          setCameraResolution(savedResolution);
        }

        if (savedWarningDelay !== undefined && savedWarningDelay !== null) {
          setWarningDelay(savedWarningDelay);
        }
      } catch (error) {
        console.error("Failed to load settings:", error);
      }
    };

    loadSettings();
  }, [setDetectionSpeed, setCameraResolution, setWarningDelay]);

  const saveDetectionSpeed = async (speed: DetectionSpeed) => {
    setDetectionSpeed(speed);
    if (storeRef.current) {
      await storeRef.current.set("detectionSpeed", speed);
      await storeRef.current.save();
    }
  };

  const saveCameraResolution = async (resolution: "low" | "medium" | "high") => {
    setCameraResolution(resolution);
    if (storeRef.current) {
      await storeRef.current.set("cameraResolution", resolution);
      await storeRef.current.save();
    }
  };

  const saveWarningDelay = async (delay: number) => {
    setWarningDelay(delay);
    if (storeRef.current) {
      await storeRef.current.set("warningDelay", delay);
      await storeRef.current.save();
    }
  };

  return {
    detectionSpeed,
    cameraResolution,
    warningDelay,
    saveDetectionSpeed,
    saveCameraResolution,
    saveWarningDelay,
  };
}
