"use client";

import { useState } from "react";
import { Check, X } from "lucide-react";
import { MODULES, type AppUser, type ModuleName, type Role } from "./data";

const EMPTY_DRAFT = { name: "", email: "", role: "User" as Role, modules: [] as ModuleName[] };

export default function UserModal({
  user,
  onCancel,
  onSave,
}: {
  user: AppUser | null;
  onCancel: () => void;
  onSave: (draft: { name: string; email: string; role: Role; modules: ModuleName[] }) => void;
}) {
  const [draft, setDraft] = useState(
    user ? { name: user.name, email: user.email, role: user.role, modules: user.modules } : EMPTY_DRAFT
  );

  function toggleModule(mod: ModuleName) {
    setDraft((d) => ({
      ...d,
      modules: d.modules.includes(mod) ? d.modules.filter((m) => m !== mod) : [...d.modules, mod],
    }));
  }

  function handleSave() {
    if (!draft.name.trim() || !draft.email.trim()) return;
    onSave({
      ...draft,
      modules: draft.role === "Admin" ? [...MODULES] : draft.modules,
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="flex max-h-[85vh] w-full max-w-lg flex-col rounded-xl bg-[var(--bg-card)] shadow-[var(--shadow-card-strong)]">
        <div className="flex items-center justify-between px-6 py-4">
          <h3 className="text-base font-semibold text-[var(--text-primary)]">
            {user ? "Edit User" : "Add User"}
          </h3>
          <button
            type="button"
            onClick={onCancel}
            className="flex h-7 w-7 items-center justify-center rounded-md text-[var(--text-muted)] hover:bg-[var(--bg-inset)] hover:text-[var(--text-primary)]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex flex-col gap-4 overflow-y-auto px-6 pb-2">
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-medium uppercase tracking-wide text-[var(--text-faint)]">Name</span>
            <input
              type="text"
              value={draft.name}
              onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))}
              placeholder="e.g. Rohit Kumar"
              className="w-full rounded-lg bg-[var(--bg-page)] px-3 py-2 text-sm text-[var(--text-primary)] shadow-[var(--shadow-card)] outline-none focus:shadow-[0_0_0_2px_var(--accent-blue)]"
            />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-medium uppercase tracking-wide text-[var(--text-faint)]">Email</span>
            <input
              type="email"
              value={draft.email}
              onChange={(e) => setDraft((d) => ({ ...d, email: e.target.value }))}
              placeholder="e.g. rohit.kumar@hul.com"
              className="w-full rounded-lg bg-[var(--bg-page)] px-3 py-2 text-sm text-[var(--text-primary)] shadow-[var(--shadow-card)] outline-none focus:shadow-[0_0_0_2px_var(--accent-blue)]"
            />
          </label>

          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-medium uppercase tracking-wide text-[var(--text-faint)]">Role</span>
            <div className="flex items-center gap-1 rounded-lg bg-[var(--bg-page)] p-1">
              {(["Admin", "User"] as Role[]).map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => setDraft((d) => ({ ...d, role }))}
                  className={`flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                    draft.role === role
                      ? "bg-[var(--accent-blue)] text-white shadow-[var(--shadow-card)]"
                      : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                  }`}
                >
                  {role}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-medium uppercase tracking-wide text-[var(--text-faint)]">
              Module Access
            </span>
            {draft.role === "Admin" ? (
              <p className="rounded-lg bg-[var(--bg-page)] px-3 py-2.5 text-sm text-[var(--text-muted)]">
                Admins have access to all modules.
              </p>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                {MODULES.map((mod) => {
                  const checked = draft.modules.includes(mod);
                  return (
                    <button
                      key={mod}
                      type="button"
                      onClick={() => toggleModule(mod)}
                      className={`flex items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm transition-colors ${
                        checked
                          ? "bg-[var(--info-bg)] text-[var(--accent-blue)]"
                          : "bg-[var(--bg-page)] text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                      }`}
                    >
                      <span
                        className={`flex h-4 w-4 shrink-0 items-center justify-center rounded ${
                          checked ? "bg-[var(--accent-blue)] text-white" : "bg-[var(--bg-inset)]"
                        }`}
                      >
                        {checked && <Check className="h-3 w-3" />}
                      </span>
                      {mod}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-2 px-6 py-4">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg bg-[var(--bg-inset)] px-4 py-2 text-sm font-medium text-[var(--text-muted)] hover:text-[var(--text-primary)]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={!draft.name.trim() || !draft.email.trim()}
            className="flex items-center gap-1.5 rounded-lg bg-[var(--accent-blue)] px-4 py-2 text-sm font-medium text-white hover:bg-[#0146d1] disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Check className="h-3.5 w-3.5" />
            {user ? "Save changes" : "Add user"}
          </button>
        </div>
      </div>
    </div>
  );
}
