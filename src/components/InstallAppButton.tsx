import { useEffect, useState } from "react";
import { Download } from "lucide-react";

export default function InstallAppButton() {
  const [prompt, setPrompt] = useState<any>(null);
  const [installed, setInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSHint, setShowIOSHint] = useState(false);

  useEffect(() => {
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as any).standalone === true;
    if (standalone) {
      setInstalled(true);
      return;
    }
    const ios = /iphone|ipad|ipod/i.test(window.navigator.userAgent);
    setIsIOS(ios);

    const handler = (e: Event) => {
      e.preventDefault();
      setPrompt(e);
    };
    window.addEventListener("beforeinstallprompt", handler);
    window.addEventListener("appinstalled", () => setInstalled(true));
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  if (installed) return null;

  const onClick = async () => {
    if (prompt) {
      prompt.prompt();
      await prompt.userChoice;
      setPrompt(null);
    } else if (isIOS) {
      setShowIOSHint(true);
    }
  };

  if (!prompt && !isIOS) return null;

  return (
    <>
      <button
        onClick={onClick}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white text-primary text-xs font-semibold shadow-sm hover:opacity-90 transition"
        title="Install App"
      >
        <Download size={14} /> <span>Install</span>
      </button>
      {showIOSHint && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-4"
          onClick={() => setShowIOSHint(false)}
        >
          <div
            className="bg-card text-foreground rounded-2xl p-5 max-w-sm w-full shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-bold text-lg mb-2">Install StudyTracker</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Safari me niche <b>Share</b> button dabao, phir <b>“Add to Home Screen”</b> select karo.
            </p>
            <button
              onClick={() => setShowIOSHint(false)}
              className="w-full py-2 rounded-lg bg-primary text-primary-foreground font-medium"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </>
  );
}
