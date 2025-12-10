import { useAppStore, type DetectionSpeed } from "@/stores/app-store";
import { load, type Store } from "@tauri-apps/plugin-store";
import { useCallback, useEffect, useRef } from "react";
import { useShallow } from "zustand/shallow";

export function useSettings() {
  const {
    detectionSpeed,
    cameraResolution,
    warningDelay,
    autoDismissDelay,
    setDetectionSpeed,
    setCameraResolution,
    setWarningDelay,
    setAutoDismissDelay,
  } = useAppStore(
    useShallow((state) => ({
      detectionSpeed: state.detectionSpeed,
      cameraResolution: state.cameraResolution,
      warningDelay: state.warningDelay,
      autoDismissDelay: state.autoDismissDelay,
      setDetectionSpeed: state.setDetectionSpeed,
      setCameraResolution: state.setCameraResolution,
      setWarningDelay: state.setWarningDelay,
      setAutoDismissDelay: state.setAutoDismissDelay,
    }))
  );

  const storeRef = useRef<Store | null>(null);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const store = await load("settings.json");
        storeRef.current = store;

        const savedSpeed = await store.get<DetectionSpeed>("detectionSpeed");
        const savedResolution = await store.get<"low" | "medium" | "high">("cameraResolution");
        const savedWarningDelay = await store.get<number>("warningDelay");
        const savedAutoDismissDelay = await store.get<number>("autoDismissDelay");

        if (savedSpeed) {
          setDetectionSpeed(savedSpeed);
        }

        if (savedResolution) {
          setCameraResolution(savedResolution);
        }

        if (savedWarningDelay !== undefined && savedWarningDelay !== null) {
          setWarningDelay(savedWarningDelay);
        }

        if (savedAutoDismissDelay !== undefined && savedAutoDismissDelay !== null) {
          setAutoDismissDelay(savedAutoDismissDelay);
        }
      } catch (error) {
        console.error("Failed to load settings:", error);
      }
    };

    loadSettings();
  }, [setDetectionSpeed, setCameraResolution, setWarningDelay, setAutoDismissDelay]);

  const saveDetectionSpeed = useCallback(
    async (speed: DetectionSpeed) => {
      setDetectionSpeed(speed);

      if (storeRef.current) {
        await storeRef.current.set("detectionSpeed", speed);
        await storeRef.current.save();
      }
    },
    [setDetectionSpeed]
  );

  const saveCameraResolution = useCallback(
    async (resolution: "low" | "medium" | "high") => {
      setCameraResolution(resolution);

      if (storeRef.current) {
        await storeRef.current.set("cameraResolution", resolution);
        await storeRef.current.save();
      }
    },
    [setCameraResolution]
  );

  const saveWarningDelay = useCallback(
    async (delay: number) => {
      setWarningDelay(delay);

      if (storeRef.current) {
        await storeRef.current.set("warningDelay", delay);
        await storeRef.current.save();
      }
    },
    [setWarningDelay]
  );

  const saveAutoDismissDelay = useCallback(
    async (delay: number) => {
      setAutoDismissDelay(delay);

      if (storeRef.current) {
        await storeRef.current.set("autoDismissDelay", delay);
        await storeRef.current.save();
      }
    },
    [setAutoDismissDelay]
  );

  return {
    detectionSpeed,
    cameraResolution,
    warningDelay,
    autoDismissDelay,
    saveDetectionSpeed,
    saveCameraResolution,
    saveWarningDelay,
    saveAutoDismissDelay,
  };
}
