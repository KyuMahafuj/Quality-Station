export default function ConfirmModal({
  title,
  description,
  confirmLabel = "Delete",
  onCancel,
  onConfirm,
}: {
  title: string;
  description: string;
  confirmLabel?: string;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="flex w-full max-w-sm flex-col gap-4 rounded-xl bg-[var(--bg-card)] p-6 shadow-[var(--shadow-card-strong)]">
        <h3 className="text-base font-semibold text-[var(--text-primary)]">{title}</h3>
        <p className="text-sm text-[var(--text-muted)]">{description}</p>
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg bg-[var(--bg-inset)] px-4 py-2 text-sm font-medium text-[var(--text-muted)] hover:text-[var(--text-primary)]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="rounded-lg bg-[var(--danger)] px-4 py-2 text-sm font-medium text-white hover:bg-[#c94f45]"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
