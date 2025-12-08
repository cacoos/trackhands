import { Camera } from "@/components/popover-window/components/camera";
import { Settings } from "@/components/popover-window/components/settings";
import { SettingsButton } from "@/components/popover-window/components/settings-button";
import { WindowControls } from "@/components/popover-window/components/window-controls";
import { useSettings } from "@/hooks/use-settings";
import { invoke } from "@tauri-apps/api/core";
import { useState } from "react";

export function PopoverWindow() {
  const [showSettings, setShowSettings] = useState(false);
  const {
    detectionSpeed,
    cameraResolution,
    warningDelay,
    saveDetectionSpeed,
    saveCameraResolution,
    saveWarningDelay,
  } = useSettings();

  const handleMinimize = async () => {
    await invoke("minimize_popover");
  };

  const handleTerminate = async () => {
    await invoke("quit_app");
  };

  return (
    <div className="flex flex-col h-full p-4 gap-3 bg-surface">
      <div className="flex-1 min-h-0 rounded-xl overflow-hidden">
        <Camera />
      </div>

      {showSettings && (
        <Settings
          detectionSpeed={detectionSpeed}
          cameraResolution={cameraResolution}
          warningDelay={warningDelay}
          onSpeedChange={saveDetectionSpeed}
          onResolutionChange={saveCameraResolution}
          onWarningDelayChange={saveWarningDelay}
        />
      )}

      <div className="flex justify-between gap-3 px-3 py-2 bg-white/5 rounded-[10px] backdrop-blur-[10px]">
        <SettingsButton active={showSettings} onClick={() => setShowSettings(!showSettings)} />
        <WindowControls onMinimize={handleMinimize} onTerminate={handleTerminate} />
      </div>
    </div>
  );
}
