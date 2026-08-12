import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useApp, type Theme } from "@/lib/app-store";
import { LANGS, UNIT_LABEL, UTILITIES, type Lang } from "@/lib/i18n";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — MeterPay" },
      {
        name: "description",
        content: "Set unit prices, currency, language and light or dark appearance.",
      },
      { property: "og:title", content: "Settings — MeterPay" },
      {
        property: "og:description",
        content: "Customize tariffs, language and theme for your meter calculator.",
      },
    ],
  }),
  component: SettingsPage,
});

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-6 rounded-2xl border border-border bg-card p-5">
      <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
        {title}
      </h2>
      {children}
    </section>
  );
}

function Segmented<T extends string>({
  value,
  options,
  onChange,
}: {
  value: T;
  options: { value: T; label: string }[];
  onChange: (v: T) => void;
}) {
  return (
    <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${options.length}, 1fr)` }}>
      {options.map((o) => (
        <button
          key={o.value}
          onClick={() => onChange(o.value)}
          className={`rounded-xl border px-2 py-2.5 text-sm font-medium transition-colors ${
            value === o.value
              ? "border-primary bg-primary text-primary-foreground"
              : "border-border bg-background text-muted-foreground hover:bg-accent"
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

function SettingsPage() {
  const { t, settings, setTheme, setLang, setPrice, setCurrency, clearAll } = useApp();

  return (
    <AppShell title={t("settings")} back="/">
      <Section title={t("theme")}>
        <Segmented<Theme>
          value={settings.theme}
          onChange={setTheme}
          options={[
            { value: "light", label: t("light") },
            { value: "dark", label: t("dark") },
            { value: "system", label: t("system") },
          ]}
        />
      </Section>

      <Section title={t("language")}>
        <Segmented<Lang>
          value={settings.lang ?? "tk"}
          onChange={setLang}
          options={LANGS.map((l) => ({ value: l.code, label: l.label }))}
        />
      </Section>

      <Section title={t("prices")}>
        <div className="space-y-4">
          {UTILITIES.map((u) => (
            <div key={u} className="space-y-1.5">
              <Label htmlFor={`price-${u}`}>
                {t(u)} — {settings.currency} / {UNIT_LABEL[u]}
              </Label>
              <Input
                id={`price-${u}`}
                inputMode="decimal"
                value={String(settings.prices[u])}
                onChange={(e) => {
                  const n = Number(e.target.value.replace(",", "."));
                  setPrice(u, Number.isNaN(n) ? 0 : n);
                }}
                className="h-11"
              />
            </div>
          ))}
          <div className="space-y-1.5">
            <Label htmlFor="currency">{t("currency")}</Label>
            <Input
              id="currency"
              value={settings.currency}
              onChange={(e) => setCurrency(e.target.value.slice(0, 6))}
              className="h-11"
            />
          </div>
        </div>
      </Section>

      <Section title={t("data")}>
        <Button
          variant="outline"
          className="w-full text-destructive hover:bg-destructive/10 hover:text-destructive"
          onClick={() => {
            if (window.confirm(t("clearAllConfirm"))) {
              clearAll();
              toast.success(t("cleared"));
            }
          }}
        >
          {t("clearAll")}
        </Button>
      </Section>
    </AppShell>
  );
}
