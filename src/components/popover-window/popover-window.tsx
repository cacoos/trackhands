import { Camera } from "@/components/popover-window/components/camera/camera";
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
    autoDismissDelay,
    saveDetectionSpeed,
    saveCameraResolution,
    saveWarningDelay,
    saveAutoDismissDelay,
  } = useSettings();

  const handleMinimize = async () => {
    await invoke("minimize_popover");
  };

  const handleTerminate = async () => {
    await invoke("quit_app");
  };

  return (
    <div className="flex flex-col h-full p-2 gap-2 bg-surface rounded-2xl overflow-hidden">
      <div className="flex-1 min-h-0 rounded-lg overflow-hidden">
        <Camera />
      </div>

      {showSettings && (
        <Settings
          detectionSpeed={detectionSpeed}
          cameraResolution={cameraResolution}
          warningDelay={warningDelay}
          autoDismissDelay={autoDismissDelay}
          onSpeedChange={saveDetectionSpeed}
          onResolutionChange={saveCameraResolution}
          onWarningDelayChange={saveWarningDelay}
          onAutoDismissDelayChange={saveAutoDismissDelay}
        />
      )}

      <div className="flex justify-between p-1.5 bg-white/5 rounded-lg backdrop-blur-[10px]">
        <SettingsButton active={showSettings} onClick={() => setShowSettings(!showSettings)} />
        <WindowControls onMinimize={handleMinimize} onTerminate={handleTerminate} />
      </div>
    </div>
  );
}
