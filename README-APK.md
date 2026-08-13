# MeterPay — Build an Android APK

MeterPay is a fully offline app: gas / electric / water readings, prices, history,
language and theme are all stored on the phone itself (no server, no database).

There are two ways to install it on a phone:

1. **Install directly from the browser (PWA)** — no tools needed.
2. **Build a real `.apk` with Capacitor** — installable file you can share.

---

## 1. Install from the browser (fastest)

1. Publish the project in Lovable and open the published link on the phone.
2. Android / Chrome: menu (⋮) → **Add to Home screen** / **Install app**.
3. iPhone / Safari: Share → **Add to Home Screen**.

It then opens full-screen like a normal app and works offline.

---

## 2. Build an APK with Capacitor

Capacitor wraps the built web app into a native Android project.
The project is already configured (`capacitor.config.ts`, build scripts).

### Requirements (on your computer, not in Lovable)

- **Node.js 20+** and **npm** (or bun)
- **Java JDK 21**
- **Android Studio** (includes the Android SDK and Gradle)

### Steps

```bash
# 1. Get the code
git clone <your-github-repo-url>
cd <project-folder>
npm install

# 2. Create the native Android project (only once)
npx cap add android

# 3. Build the static offline web app and copy it into Android
npm run android:sync

# 4a. Build a debug APK from the command line
cd android
./gradlew assembleDebug
# APK -> android/app/build/outputs/apk/debug/app-debug.apk

# 4b. …or open Android Studio instead
npx cap open android
# then: Build > Build Bundle(s) / APK(s) > Build APK(s)
```

Copy `app-debug.apk` to the phone and tap it (allow "install from unknown sources").

### After you change the app

```bash
npm run android:sync     # rebuild web app + copy into android/
cd android && ./gradlew assembleDebug
```

### Release (signed) APK for sharing / Play Store

```bash
keytool -genkey -v -keystore meterpay.keystore -alias meterpay \
  -keyalg RSA -keysize 2048 -validity 10000
```

Add to `android/app/build.gradle` inside `android { }`:

```gradle
signingConfigs {
    release {
        storeFile file("../../meterpay.keystore")
        storePassword "YOUR_PASSWORD"
        keyAlias "meterpay"
        keyPassword "YOUR_PASSWORD"
    }
}
buildTypes {
    release { signingConfig signingConfigs.release }
}
```

Then:

```bash
npm run android:release
# APK -> android/app/build/outputs/apk/release/app-release.apk
```

Never commit the keystore or passwords to git.

---

## Available scripts

| Script | What it does |
| --- | --- |
| `npm run dev` | Local web development server |
| `npm run build` | Normal web/deploy build |
| `npm run build:apk` | Static offline build for the native app (`dist/client`) |
| `npm run android:sync` | `build:apk` + `cap sync android` |
| `npm run android:open` | Open the project in Android Studio |
| `npm run android:apk` | Sync + build debug APK |
| `npm run android:release` | Sync + build release APK |

## App identity

Set in `capacitor.config.ts`:

- `appId`: `com.meterpay.app` (change to your own reverse-domain id before publishing)
- `appName`: `MeterPay`
- `webDir`: `dist/client`

App icons come from `public/icon-192.png` and `public/icon-512.png`. To replace the
native launcher icons, use Android Studio → right-click `res` → **New > Image Asset**.

## How it works technically

- `CAPACITOR=1 vite build` builds the app in SPA mode with prerendering and no
  server output; `scripts/build-apk.mjs` then copies the SPA shell to
  `dist/client/index.html`, which the Android WebView loads.
- All data lives in the device's local storage — no network calls at runtime.
- The offline service worker is only used on the web version; inside the native
  app it is skipped because everything is already bundled locally.
