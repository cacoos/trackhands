import { STORAGE_KEYS } from "@/lib/storage-keys";
import { invoke } from "@tauri-apps/api/core";
import { useSyncExternalStore } from "react";

function subscribeToDetectionImage(callback: () => void) {
  const handleVisibilityChange = () => {
    if (document.visibilityState === "visible") {
      callback();
    }
  };
  document.addEventListener("visibilitychange", handleVisibilityChange);
  return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
}

function getDetectionImage() {
  return localStorage.getItem(STORAGE_KEYS.DETECTION_IMAGE);
}

export function WarningWindow() {
  const detectionImage = useSyncExternalStore(subscribeToDetectionImage, getDetectionImage);

  const handleDismiss = async () => {
    void invoke("hide_warning");
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/90 z-[9999] select-none">
      <div className="flex flex-col items-center gap-2 text-center p-10">
        <h1 className="text-[64px] font-extrabold text-white m-0 tracking-[-2px]">Hands down!</h1>
        <p className="text-2xl font-normal text-white/70 m-0">
          Please don't bite your fingers. Look at yourself.
        </p>

        {detectionImage ? (
          <div className="mt-5 rounded-2xl overflow-hidden border-2 border-white/20">
            <img
              src={detectionImage}
              alt="Fingers near mouth detected"
              className="block w-[360px] h-[270px] object-cover -scale-x-100"
            />
          </div>
        ) : (
          <div className="mt-5 w-[360px] h-[270px] rounded-2xl overflow-hidden border-2 border-white/20 bg-black relative">
            <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-black via-gray-900 to-black opacity-60" />
          </div>
        )}

        <button
          className="mt-[30px] py-4 px-10 text-lg font-semibold text-white bg-gradient-to-b from-white/20 to-white/5 border border-white/30 rounded-full cursor-pointer shadow-[inset_0_1px_0_rgba(255,255,255,0.15)] backdrop-blur-sm transition-all duration-150 ease-out hover:from-white/25 hover:to-white/10 hover:border-white/40 hover:shadow-[0_0_12px_rgba(255,255,255,0.08),inset_0_1px_0_rgba(255,255,255,0.2)] active:scale-95 active:shadow-none"
          onClick={handleDismiss}
        >
          I'll stop, dismiss this
        </button>
      </div>
    </div>
  );
}
