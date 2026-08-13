/**
 * Registers the offline service worker only in the published app.
 * Refuses to register in dev, inside iframes, and in Lovable preview hosts,
 * cleaning up any stale registration in those contexts.
 */
export function registerServiceWorker() {
  if (typeof window === "undefined" || !("serviceWorker" in navigator)) return;

  const host = window.location.hostname;
  const inIframe = window.self !== window.top;
  const killSwitch = new URL(window.location.href).searchParams.get("sw") === "off";
  const previewHost =
    host.startsWith("id-preview--") ||
    host.startsWith("preview--") ||
    host === "lovableproject.com" ||
    host.endsWith(".lovableproject.com") ||
    host === "lovableproject-dev.com" ||
    host.endsWith(".lovableproject-dev.com") ||
    host === "beta.lovable.dev" ||
    host.endsWith(".beta.lovable.dev");

  // Inside the native Android/iOS shell the app is already bundled offline,
  // so no service worker is needed.
  const isNative = "Capacitor" in window;

  const refuse =
    !import.meta.env.PROD || inIframe || previewHost || killSwitch || isNative;

  if (refuse) {
    void navigator.serviceWorker.getRegistrations().then((regs) => {
      regs.forEach((reg) => {
        const url = reg.active?.scriptURL ?? reg.installing?.scriptURL ?? "";
        if (url.endsWith("/sw.js")) void reg.unregister();
      });
    });
    return;
  }

  void navigator.serviceWorker.register("/sw.js", { scope: "/" });
}
