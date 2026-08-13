/**
 * Builds a fully static, offline-capable bundle for the Android (Capacitor) app.
 *
 * 1. Runs the Vite build with CAPACITOR=1 (SPA mode + prerender, no server output)
 * 2. Copies the SPA shell to index.html so the Android WebView has an entry point
 */
import { execSync } from "node:child_process";
import { copyFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const clientDir = resolve(root, "dist/client");

execSync("vite build", {
  cwd: root,
  stdio: "inherit",
  env: { ...process.env, CAPACITOR: "1" },
});

const shell = resolve(clientDir, "_shell.html");
const index = resolve(clientDir, "index.html");

if (existsSync(shell)) {
  copyFileSync(shell, index);
  console.log("[build:apk] index.html created from SPA shell");
} else if (!existsSync(index)) {
  console.error("[build:apk] No _shell.html or index.html found in dist/client");
  process.exit(1);
}

console.log("[build:apk] Static app ready in dist/client");
