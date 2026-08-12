import { createFileRoute, useParams } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useApp } from "@/lib/app-store";
import { UNIT_LABEL, UTILITIES, type UtilityKey } from "@/lib/i18n";

export const Route = createFileRoute("/u/$utility")({
  head: () => ({
    meta: [
      { title: "Meter calculation — MeterPay" },
      {
        name: "description",
        content:
          "Enter previous and current meter readings to calculate gas, electricity or water usage and cost.",
      },
      { property: "og:title", content: "Meter calculation — MeterPay" },
      {
        property: "og:description",
        content: "Calculate utility usage and cost from your meter readings, offline.",
      },
    ],
  }),
  component: UtilityPage,
});

const ACCENT: Record<UtilityKey, string> = {
  gas: "bg-gas/15 text-gas-foreground border-gas/40",
  electric: "bg-electric/15 text-electric-foreground border-electric/40",
  water: "bg-water/15 text-water-foreground border-water/40",
};

function UtilityPage() {
  const { utility } = useParams({ from: "/u/$utility" });
  const key = (UTILITIES.includes(utility as UtilityKey) ? utility : "gas") as UtilityKey;
  const { t, settings, ready, addRecord, lastReading } = useApp();

  const [prev, setPrev] = useState("");
  const [curr, setCurr] = useState("");
  const [result, setResult] = useState<{ used: number; total: number } | null>(null);

  const last = ready ? lastReading(key) : null;

  useEffect(() => {
    setPrev(last != null ? String(last) : "");
    setCurr("");
    setResult(null);
  }, [key, last]);

  const price = settings.prices[key];
  const unit = UNIT_LABEL[key];

  const parsed = useMemo(() => {
    const p = Number(prev.replace(",", "."));
    const c = Number(curr.replace(",", "."));
    return { p, c, valid: prev !== "" && curr !== "" && !Number.isNaN(p) && !Number.isNaN(c) };
  }, [prev, curr]);

  function compute() {
    if (prev === "" || curr === "") {
      toast.error(t("needCalc"));
      return null;
    }
    if (!parsed.valid) {
      toast.error(t("errNumbers"));
      return null;
    }
    if (parsed.c < parsed.p) {
      toast.error(t("errCurrentLower"));
      return null;
    }
    const used = Number((parsed.c - parsed.p).toFixed(3));
    const total = Number((used * price).toFixed(2));
    return { used, total };
  }

  function onCalculate() {
    const r = compute();
    if (r) setResult(r);
  }

  function onSave() {
    const r = compute();
    if (!r) return;
    addRecord({
      utility: key,
      previous: parsed.p,
      current: parsed.c,
      used: r.used,
      price,
      total: r.total,
    });
    setResult(r);
    toast.success(t("saved"));
  }

  return (
    <AppShell title={t(key)} subtitle={`${price} ${settings.currency} ${t("perUnit")} ${unit}`} back="/">
      <div className={`mb-6 rounded-2xl border p-4 ${ACCENT[key]}`}>
        <p className="text-sm font-medium opacity-80">{t("unitPrice")}</p>
        <p className="font-display text-2xl font-bold">
          {price} {settings.currency}
          <span className="text-base font-medium opacity-70"> / {unit}</span>
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="prev">{t("previousReading")}</Label>
          <Input
            id="prev"
            inputMode="decimal"
            value={prev}
            onChange={(e) => setPrev(e.target.value)}
            placeholder="0"
            className="h-12 text-lg"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="curr">{t("currentReading")}</Label>
          <Input
            id="curr"
            inputMode="decimal"
            value={curr}
            onChange={(e) => setCurr(e.target.value)}
            placeholder="0"
            className="h-12 text-lg"
          />
        </div>

        <div className="grid grid-cols-2 gap-3 pt-2">
          <Button variant="outline" className="h-12" onClick={onSave}>
            {t("save")}
          </Button>
          <Button className="h-12" onClick={onCalculate}>
            {t("calculate")}
          </Button>
        </div>
      </div>

      {result ? (
        <div className="mt-6 rounded-2xl border border-border bg-card p-5">
          <div className="flex items-baseline justify-between">
            <span className="text-sm text-muted-foreground">{t("used")}</span>
            <span className="font-display text-xl font-semibold text-card-foreground">
              {result.used} {unit}
            </span>
          </div>
          <div className="mt-3 flex items-baseline justify-between border-t border-border pt-3">
            <span className="text-sm text-muted-foreground">{t("total")}</span>
            <span className="font-display text-3xl font-bold text-primary">
              {result.total.toFixed(2)} {settings.currency}
            </span>
          </div>
        </div>
      ) : null}
    </AppShell>
  );
}
