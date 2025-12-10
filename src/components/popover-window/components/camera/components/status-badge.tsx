import { statusStyles, TrayStatus } from "@/lib/tray-status";

const statusLabels: Record<TrayStatus, string> = {
  off: "No face",
  clear: "Clear",
  warning: "",
  alert: "Triggered!",
};

export function StatusBadge({ status, countdown }: { status: TrayStatus; countdown: number | null }) {
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

