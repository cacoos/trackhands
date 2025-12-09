import type { DetectionSpeed } from "@/stores/app-store";

interface SettingsProps {
  detectionSpeed: DetectionSpeed;
  cameraResolution: "low" | "medium" | "high";
  warningDelay: number;
  autoDismissDelay: number;
  onSpeedChange: (speed: DetectionSpeed) => void;
  onResolutionChange: (resolution: "low" | "medium" | "high") => void;
  onWarningDelayChange: (delay: number) => void;
  onAutoDismissDelayChange: (delay: number) => void;
}

export function Settings({
  detectionSpeed,
  cameraResolution,
  warningDelay,
  autoDismissDelay,
  onSpeedChange,
  onResolutionChange,
  onWarningDelayChange,
  onAutoDismissDelayChange,
}: SettingsProps) {
  return (
    <div className="flex flex-col gap-3 p-3 bg-surface-alt rounded-xl">
      <div className="flex items-center justify-between gap-2">
        <label className="text-xs text-muted">Detection</label>
        <div className="flex gap-1 p-1 bg-surface-elevated rounded-lg w-[140px]">
          <button
            className={`flex-1 py-1 rounded text-[11px] font-medium ${
              detectionSpeed === "slow"
                ? "bg-surface text-foreground shadow-sm"
                : "text-muted hover:text-foreground"
            }`}
            onClick={() => onSpeedChange("slow")}
          >
            Slow
          </button>
          <button
            className={`flex-1 py-1 rounded text-[11px] font-medium ${
              detectionSpeed === "medium"
                ? "bg-surface text-foreground shadow-sm"
                : "text-muted hover:text-foreground"
            }`}
            onClick={() => onSpeedChange("medium")}
          >
            Med
          </button>
          <button
            className={`flex-1 py-1 rounded text-[11px] font-medium ${
              detectionSpeed === "fast"
                ? "bg-surface text-foreground shadow-sm"
                : "text-muted hover:text-foreground"
            }`}
            onClick={() => onSpeedChange("fast")}
          >
            Fast
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between gap-2">
        <label className="text-xs text-muted">Resolution</label>
        <div className="flex gap-1 p-1 bg-surface-elevated rounded-lg w-[140px]">
          <button
            className={`flex-1 py-1 rounded text-[11px] font-medium ${
              cameraResolution === "low"
                ? "bg-surface text-foreground shadow-sm"
                : "text-muted hover:text-foreground"
            }`}
            onClick={() => onResolutionChange("low")}
          >
            Low
          </button>
          <button
            className={`flex-1 py-1 rounded text-[11px] font-medium ${
              cameraResolution === "medium"
                ? "bg-surface text-foreground shadow-sm"
                : "text-muted hover:text-foreground"
            }`}
            onClick={() => onResolutionChange("medium")}
          >
            Med
          </button>
          <button
            className={`flex-1 py-1 rounded text-[11px] font-medium ${
              cameraResolution === "high"
                ? "bg-surface text-foreground shadow-sm"
                : "text-muted hover:text-foreground"
            }`}
            onClick={() => onResolutionChange("high")}
          >
            High
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between gap-2">
        <label className="text-xs text-muted flex items-center gap-1 group relative">
          Alert threshold
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="opacity-50"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M12 16v-4" />
            <path d="M12 8h.01" />
          </svg>
          <span className="absolute left-0 bottom-full mb-2 px-2 py-1 text-[10px] text-white bg-black/90 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            How long fingers must be near mouth to trigger
          </span>
        </label>
        <div className="flex gap-1 p-1 bg-surface-elevated rounded-lg w-[140px]">
          <button
            className={`flex-1 py-1 rounded text-[11px] font-medium ${
              warningDelay === 1000
                ? "bg-surface text-foreground shadow-sm"
                : "text-muted hover:text-foreground"
            }`}
            onClick={() => onWarningDelayChange(1000)}
          >
            1s
          </button>
          <button
            className={`flex-1 py-1 rounded text-[11px] font-medium ${
              warningDelay === 2000
                ? "bg-surface text-foreground shadow-sm"
                : "text-muted hover:text-foreground"
            }`}
            onClick={() => onWarningDelayChange(2000)}
          >
            2s
          </button>
          <button
            className={`flex-1 py-1 rounded text-[11px] font-medium ${
              warningDelay === 3000
                ? "bg-surface text-foreground shadow-sm"
                : "text-muted hover:text-foreground"
            }`}
            onClick={() => onWarningDelayChange(3000)}
          >
            3s
          </button>
          <button
            className={`flex-1 py-1 rounded text-[11px] font-medium ${
              warningDelay === 5000
                ? "bg-surface text-foreground shadow-sm"
                : "text-muted hover:text-foreground"
            }`}
            onClick={() => onWarningDelayChange(5000)}
          >
            5s
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between gap-2">
        <label className="text-xs text-muted flex items-center gap-1 group relative">
          Auto-dismiss
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="opacity-50"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M12 16v-4" />
            <path d="M12 8h.01" />
          </svg>
          <span className="absolute left-0 bottom-full mb-2 px-2 py-1 text-[10px] text-white bg-black/90 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            How long before warning auto-dismisses
          </span>
        </label>
        <div className="flex gap-1 p-1 bg-surface-elevated rounded-lg w-[140px]">
          <button
            className={`flex-1 py-1 rounded text-[11px] font-medium ${
              autoDismissDelay === 1000
                ? "bg-surface text-foreground shadow-sm"
                : "text-muted hover:text-foreground"
            }`}
            onClick={() => onAutoDismissDelayChange(1000)}
          >
            1s
          </button>
          <button
            className={`flex-1 py-1 rounded text-[11px] font-medium ${
              autoDismissDelay === 2000
                ? "bg-surface text-foreground shadow-sm"
                : "text-muted hover:text-foreground"
            }`}
            onClick={() => onAutoDismissDelayChange(2000)}
          >
            2s
          </button>
          <button
            className={`flex-1 py-1 rounded text-[11px] font-medium ${
              autoDismissDelay === 3000
                ? "bg-surface text-foreground shadow-sm"
                : "text-muted hover:text-foreground"
            }`}
            onClick={() => onAutoDismissDelayChange(3000)}
          >
            3s
          </button>
          <button
            className={`flex-1 py-1 rounded text-[11px] font-medium ${
              autoDismissDelay === 5000
                ? "bg-surface text-foreground shadow-sm"
                : "text-muted hover:text-foreground"
            }`}
            onClick={() => onAutoDismissDelayChange(5000)}
          >
            5s
          </button>
        </div>
      </div>
    </div>
  );
}
