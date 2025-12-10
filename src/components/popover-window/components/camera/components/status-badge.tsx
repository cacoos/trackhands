import { statusStyles, TrayStatus } from "@/lib/tray-status";
import { useAppStore } from "@/stores/app-store";
import { useMemo } from "react";
import { useShallow } from "zustand/react/shallow";

const statusLabels: Record<TrayStatus, string> = {
  off: "No face",
  clear: "Clear",
  warning: "",
  alert: "Triggered!",
};

export function StatusBadge() {
  const { noFaceVisible, handInMouth, warningDelay, detectionElapsed } = useAppStore(
    useShallow((state) => ({
      noFaceVisible: state.mouthRect == null,
      handInMouth: state.handInMouth,
      warningDelay: state.warningDelay,
      detectionElapsed: state.detectionElapsed,
    }))
  );

  const countdown =
    handInMouth && detectionElapsed < warningDelay
      ? (warningDelay - detectionElapsed) / 1000
      : null;

  const status = useMemo(() => {
    if (noFaceVisible) return "off";
    if (!handInMouth) return "clear";
    if (detectionElapsed >= warningDelay) return "alert";

    return "warning";
  }, [noFaceVisible, handInMouth, warningDelay, detectionElapsed]);

  const styles = statusStyles[status];
  const showPing = status === "warning" || status === "alert";

  return (
    <div
      className={`absolute top-2 left-2 flex items-center gap-1.5 px-2 py-1 rounded-md text-[10px] font-medium backdrop-blur-sm ${styles.badge}`}
    >
      <span className="relative flex h-1.5 w-1.5">
        {showPing && (
          <span
            className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${styles.pingDot}`}
          />
        )}
        <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${styles.dot}`} />
      </span>

      {countdown !== null ? (
        <span className="tabular-nums">{countdown.toFixed(1)}s</span>
      ) : (
        statusLabels[status]
      )}
    </div>
  );
}
