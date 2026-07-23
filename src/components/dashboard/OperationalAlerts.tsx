const alerts = [
  { severity: "critical", text: "Camera 2 is not working" },
  { severity: "warning", text: "Bottle Reject Rate increased" },
  { severity: "critical", text: "MRP Mismatch Detected" },
  { severity: "warning", text: "Barcode Recognition Slow" },
] as const;

const severityStyles: Record<
  string,
  { badgeBg: string; text: string; border: string; label: string }
> = {
  critical: {
    badgeBg: "var(--alert-critical-bg)",
    text: "var(--alert-critical)",
    border: "var(--alert-critical)",
    label: "Critical",
  },
  warning: {
    badgeBg: "var(--alert-warning-bg)",
    text: "var(--alert-warning)",
    border: "var(--alert-warning)",
    label: "Warning",
  },
};

export default function OperationalAlerts() {
  return (
    <div className="w-full rounded-[12px] bg-[var(--bg-card)] pb-[24px] shadow-[var(--shadow-card)]">
      <div className="flex items-center gap-[12px] px-[24px] pb-[19px] pt-[18px]">
        <h3 className="text-[18px] font-semibold leading-normal text-[var(--text-primary)]">
          Operational Alerts
        </h3>
        <span
          className="flex items-center justify-center rounded-[99px] px-[12px] py-[4px] text-[12px] leading-[20px]"
          style={{ backgroundColor: "var(--pill-blue-bg)", color: "var(--pill-blue-text)" }}
        >
          5 Active
        </span>
      </div>
      <div className="flex flex-col gap-3 px-[24px] sm:flex-row sm:gap-4">
        {alerts.map((alert, i) => {
          const style = severityStyles[alert.severity];
          return (
            <div
              key={i}
              className="relative flex flex-1 flex-col items-start justify-center gap-[10px] px-[20px] py-[14px]"
              style={{ borderLeft: `3px solid ${style.border}` }}
            >
              <span
                className="relative inline-flex w-fit shrink-0 items-center gap-[6px] rounded-[99px] py-[2px] pl-[10px] pr-[12px] text-[12px] leading-[20px]"
                style={{ backgroundColor: style.badgeBg, color: style.text }}
              >
                <span className="h-[6px] w-[6px] shrink-0 rounded-full" style={{ backgroundColor: style.text }} />
                {style.label}
              </span>
              <div className="flex w-full items-center gap-[12px]">
                <span className="text-[12px] leading-[16px] text-[var(--text-primary)]">{alert.text}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
