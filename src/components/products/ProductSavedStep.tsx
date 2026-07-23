import { Check } from "lucide-react";

export default function ProductSavedStep({
  productName,
  onAddAnother,
  onGoToProducts,
}: {
  productName: string;
  onAddAnother: () => void;
  onGoToProducts: () => void;
}) {
  return (
    <div className="flex min-h-0 flex-1 items-center justify-center">
      <div className="flex w-full max-w-md flex-col items-center gap-4 rounded-xl bg-[var(--bg-card)] p-10 text-center shadow-[var(--shadow-card-strong)]">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--success)] text-white">
          <Check className="h-8 w-8" />
        </span>
        <div>
          <h2 className="text-lg font-bold text-[var(--text-primary)]">Product added successfully</h2>
          <p className="mt-1 text-sm text-[var(--text-muted)]">
            The product &ldquo;{productName}&rdquo; has been added
          </p>
        </div>
        <div className="mt-2 flex items-center gap-3">
          <button
            type="button"
            onClick={onAddAnother}
            className="rounded-lg bg-[var(--bg-inset)] px-4 py-2.5 text-sm font-medium text-[var(--text-primary)] hover:bg-[var(--bg-card-hover)]"
          >
            Add another
          </button>
          <button
            type="button"
            onClick={onGoToProducts}
            className="rounded-lg bg-[var(--accent-blue)] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#0146d1]"
          >
            Go to Products
          </button>
        </div>
      </div>
    </div>
  );
}
