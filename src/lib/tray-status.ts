import { invoke } from "@tauri-apps/api/core";

export type TrayStatus = "off" | "clear" | "warning" | "alert";

let lastStatus: TrayStatus | null = null;

export function setTrayStatus(status: TrayStatus) {
  if (status !== lastStatus) {
    lastStatus = status;

    invoke("set_tray_status", { status }).catch(console.error);
  }
}

export const statusStyles: Record<TrayStatus, { badge: string; dot: string; pingDot: string }> = {
  off: {
    badge: "bg-black/40 text-white/70",
    dot: "bg-gray-400",
    pingDot: "",
  },
  clear: {
    badge: "bg-black/40 text-white/70",
    dot: "bg-emerald-400",
    pingDot: "",
  },
  warning: {
    badge: "bg-yellow-500/80 text-black",
    dot: "bg-yellow-300",
    pingDot: "bg-black",
  },
  alert: {
    badge: "bg-red-500/80 text-white",
    dot: "bg-white",
    pingDot: "bg-white",
  },
};
