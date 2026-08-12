import { createFileRoute } from "@tanstack/react-router";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { useApp } from "@/lib/app-store";
import { UNIT_LABEL, UTILITIES, type UtilityKey } from "@/lib/i18n";

export const Route = createFileRoute("/history")({
  head: () => ({
    meta: [
      { title: "Saved records — MeterPay" },
      {
        name: "description",
        content: "Browse your saved gas, electricity and water meter calculations by date.",
      },
      { property: "og:title", content: "Saved records — MeterPay" },
      {
        property: "og:description",
        content: "All your utility calculations stored on this device.",
      },
    ],
  }),
  component: HistoryPage,
});

const DOT: Record<UtilityKey, string> = {
  gas: "bg-gas",
  electric: "bg-electric",
  water: "bg-water",
};

function HistoryPage() {
  const { t, records, settings, deleteRecord, ready, lang } = useApp();
  const [filter, setFilter] = useState<UtilityKey | "all">("all");

  const list = filter === "all" ? records : records.filter((r) => r.utility === filter);

  return (
    <AppShell title={t("history")} back="/">
      <div className="mb-5 flex flex-wrap gap-2">
        {(["all", ...UTILITIES] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
              filter === f
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-card text-muted-foreground hover:bg-accent"
            }`}
          >
            {f === "all" ? t("all") : t(f)}
          </button>
        ))}
      </div>

      {!ready ? null : list.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
          {t("noRecords")}
        </p>
      ) : (
        <ul className="space-y-3">
          {list.map((r) => (
            <li
              key={r.id}
              className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4"
            >
              <span className={`size-2.5 shrink-0 rounded-full ${DOT[r.utility]}`} />
              <div className="min-w-0 flex-1">
                <p className="font-medium text-card-foreground">
                  {t(r.utility)} · {r.used} {UNIT_LABEL[r.utility]}
                </p>
                <p className="text-xs text-muted-foreground">
                  {new Date(r.date).toLocaleDateString(lang === "tk" ? "tr" : lang, {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}{" "}
                  · {r.previous} → {r.current}
                </p>
              </div>
              <div className="text-right">
                <p className="font-display font-semibold text-foreground">
                  {r.total.toFixed(2)} {settings.currency}
                </p>
              </div>
              <button
                onClick={() => {
                  deleteRecord(r.id);
                  toast.success(t("deleted"));
                }}
                aria-label={t("clearAll")}
                className="ml-1 inline-flex size-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
              >
                <Trash2 className="size-4" />
              </button>
            </li>
          ))}
        </ul>
      )}

      {records.length > 0 ? (
        <Button
          variant="ghost"
          className="mt-6 w-full text-destructive hover:bg-destructive/10 hover:text-destructive"
          onClick={() => {
            if (window.confirm(t("clearAllConfirm"))) {
              records.forEach((r) => deleteRecord(r.id));
              toast.success(t("cleared"));
            }
          }}
        >
          {t("clearAll")}
        </Button>
      ) : null}
    </AppShell>
  );
}
