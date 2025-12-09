import { STORAGE_KEYS } from "@/lib/storage-keys";
import { invoke } from "@tauri-apps/api/core";
import { listen } from "@tauri-apps/api/event";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { load } from "@tauri-apps/plugin-store";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";

const DEFAULT_AUTO_DISMISS_DELAY = 2000;

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
  const [autoDismissDelay, setAutoDismissDelay] = useState(DEFAULT_AUTO_DISMISS_DELAY);
  const animationKeyRef = useRef(0);
  const [animationKey, setAnimationKey] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const startTimer = (delay: number) => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      animationKeyRef.current += 1;
      setAnimationKey(animationKeyRef.current);

      timerRef.current = setTimeout(async () => {
        const window = getCurrentWindow();
        await window.setFocus();
        await window.hide();

        invoke("hide_warning");
      }, delay);
    };

    const loadSettingsAndStartTimer = async () => {
      try {
        const store = await load("settings.json");
        const savedDelay = await store.get<number>("autoDismissDelay");
        const delay = savedDelay ?? DEFAULT_AUTO_DISMISS_DELAY;

        setAutoDismissDelay(delay);
        startTimer(delay);
      } catch (error) {
        console.error("Failed to load autoDismissDelay:", error);
        startTimer(DEFAULT_AUTO_DISMISS_DELAY);
      }
    };

    loadSettingsAndStartTimer();

    const unlisten = listen<boolean>("warning-state", (event) => {
      if (event.payload) {
        loadSettingsAndStartTimer();
      }
    });

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      unlisten.then((fn) => fn());
    };
  }, []);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-surface z-[9999] select-none">
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

        <div className="mt-[30px] relative rounded-full p-[2px] overflow-hidden">
          <div
            key={animationKey}
            className="absolute inset-0 rounded-full"
            style={{
              background:
                "conic-gradient(from 0deg, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0.6) var(--progress), transparent var(--progress))",
              animation: `timer-border ${autoDismissDelay}ms linear forwards`,
            }}
          />
          <style>{`
            @keyframes timer-border {
              from { --progress: 100%; }
              to { --progress: 0%; }
            }
            @property --progress {
              syntax: '<percentage>';
              initial-value: 100%;
              inherits: false;
            }
          `}</style>
          <button
            className="relative z-10 py-4 px-10 text-lg font-semibold text-white rounded-full cursor-pointer border border-white/30 shadow-[inset_0_1px_0_rgba(255,255,255,0.15)] backdrop-blur-sm transition-all duration-150 ease-out hover:border-white/40 hover:shadow-[0_0_12px_rgba(255,255,255,0.08),inset_0_1px_0_rgba(255,255,255,0.2)] active:scale-95 active:shadow-none [background:linear-gradient(to_bottom,rgba(255,255,255,0.2),rgba(255,255,255,0.05)),#000]"
            onClick={() => invoke("hide_warning")}
          >
            I'll stop, dismiss this
          </button>
        </div>
      </div>
    </div>
  );
}
