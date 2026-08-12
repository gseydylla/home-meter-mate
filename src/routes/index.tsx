import { createFileRoute, Link } from "@tanstack/react-router";
import { Clock, Droplets, Flame, Settings as SettingsIcon, Zap } from "lucide-react";
import { useApp } from "@/lib/app-store";
import { LANGS, UNIT_LABEL, type UtilityKey } from "@/lib/i18n";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "MeterPay — Gas, Electricity & Water Bill Calculator" },
      {
        name: "description",
        content:
          "Offline calculator for gas, electricity and water bills. Enter meter readings, get usage and cost, and keep a local history.",
      },
      { property: "og:title", content: "MeterPay — Utility Bill Calculator" },
      {
        property: "og:description",
        content: "Calculate gas, electricity and water bills from meter readings. Works offline.",
      },
    ],
  }),
  component: Index,
});

const CARDS: {
  key: UtilityKey;
  icon: typeof Flame;
  bg: string;
  ring: string;
  iconColor: string;
}[] = [
  { key: "gas", icon: Flame, bg: "bg-gas/12", ring: "border-gas/35", iconColor: "text-gas" },
  {
    key: "electric",
    icon: Zap,
    bg: "bg-electric/12",
    ring: "border-electric/35",
    iconColor: "text-electric",
  },
  {
    key: "water",
    icon: Droplets,
    bg: "bg-water/12",
    ring: "border-water/35",
    iconColor: "text-water",
  },
];

function LanguageGate() {
  const { t, setLang } = useApp();
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-5">
      <div className="w-full max-w-sm">
        <h1 className="text-center text-3xl font-bold text-foreground">{t("chooseLanguage")}</h1>
        <p className="mt-2 text-center text-sm text-muted-foreground">{t("chooseLanguageHint")}</p>
        <div className="mt-8 space-y-3">
          {LANGS.map((l) => (
            <button
              key={l.code}
              onClick={() => setLang(l.code)}
              className="flex w-full items-center justify-between rounded-2xl border border-border bg-card px-5 py-4 text-left text-lg font-medium text-card-foreground transition-colors hover:border-primary hover:bg-accent"
            >
              {l.label}
              <span className="text-sm uppercase text-muted-foreground">{l.code}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function Index() {
  const { ready, settings, t, records } = useApp();

  if (!ready) {
    return <div className="min-h-screen bg-background" />;
  }

  if (!settings.lang) return <LanguageGate />;

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto w-full max-w-md px-5 pb-16 pt-8">
        <header className="mb-8 flex items-start justify-between gap-3">
          <div>
            <h1 className="text-3xl font-bold text-foreground">{t("appName")}</h1>
            <p className="mt-1 text-sm text-muted-foreground">{t("tagline")}</p>
          </div>
          <div className="flex gap-2">
            <Link
              to="/history"
              aria-label={t("history")}
              className="inline-flex size-10 items-center justify-center rounded-full border border-border bg-card text-foreground transition-colors hover:bg-accent"
            >
              <Clock className="size-4" />
            </Link>
            <Link
              to="/settings"
              aria-label={t("settings")}
              className="inline-flex size-10 items-center justify-center rounded-full border border-border bg-card text-foreground transition-colors hover:bg-accent"
            >
              <SettingsIcon className="size-4" />
            </Link>
          </div>
        </header>

        <div className="space-y-4">
          {CARDS.map(({ key, icon: Icon, bg, ring, iconColor }) => (
            <Link
              key={key}
              to="/u/$utility"
              params={{ utility: key }}
              className={`flex items-center gap-4 rounded-3xl border ${ring} ${bg} p-5 transition-transform active:scale-[0.99]`}
            >
              <span className="inline-flex size-14 items-center justify-center rounded-2xl bg-card shadow-sm">
                <Icon className={`size-7 ${iconColor}`} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-display text-2xl font-bold text-foreground">
                  {t(key)}
                </span>
                <span className="block text-sm text-muted-foreground">
                  {settings.prices[key]} {settings.currency} {t("perUnit")} {UNIT_LABEL[key]}
                </span>
              </span>
            </Link>
          ))}
        </div>

        <Link
          to="/history"
          className="mt-8 flex items-center justify-between rounded-2xl border border-border bg-card px-5 py-4 transition-colors hover:bg-accent"
        >
          <span className="font-medium text-card-foreground">{t("history")}</span>
          <span className="text-sm text-muted-foreground">{records.length}</span>
        </Link>
      </div>
    </div>
  );
}
