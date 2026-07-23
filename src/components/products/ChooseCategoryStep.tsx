import { CATEGORY_OPTIONS, type CategoryName } from "./data";

export default function ChooseCategoryStep({
  selected,
  onSelect,
}: {
  selected: CategoryName | null;
  onSelect: (category: CategoryName) => void;
}) {
  return (
    <div className="flex min-h-0 flex-1 flex-col rounded-xl bg-[var(--bg-card)] p-6 shadow-[var(--shadow-card)]">
      <h2 className="text-base font-semibold text-[var(--text-primary)]">Choose Category</h2>
      <p className="mt-1 text-sm text-[var(--text-muted)]">
        Pick the packaging format for the new product.
      </p>
      <div className="mt-6 grid grid-cols-3 content-start gap-4">
        {CATEGORY_OPTIONS.map((cat) => {
          const Icon = cat.icon;
          const active = cat.value === selected;
          return (
            <button
              key={cat.value}
              type="button"
              onClick={() => onSelect(cat.value)}
              className={`flex flex-col items-center gap-3 rounded-2xl px-3.5 py-6 shadow-[var(--shadow-card)] transition-colors ${
                active
                  ? "bg-[var(--info-bg)] shadow-[0_0_0_2px_var(--accent-blue)]"
                  : "bg-[var(--bg-card-hover)] hover:bg-[var(--bg-inset)]"
              }`}
            >
              <span className="text-xl font-semibold text-[var(--text-primary)]">{cat.label}</span>
              <span className="flex h-[110px] w-full items-center justify-center">
                {cat.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={cat.image} alt="" className="h-full w-full object-contain" />
                ) : (
                  <span className="flex h-[76px] w-[76px] items-center justify-center rounded-2xl bg-[var(--bg-inset)] text-[var(--text-muted)]">
                    {Icon && <Icon className="h-9 w-9" strokeWidth={1.5} />}
                  </span>
                )}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
