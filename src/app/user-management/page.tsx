"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import Sidebar from "@/components/dashboard/Sidebar";
import ThemeToggle from "@/components/dashboard/ThemeToggle";
import ConfirmModal from "@/components/ConfirmModal";
import UserModal from "@/components/user-management/UserModal";
import { INITIAL_USERS, type AppUser, type ModuleName, type Role } from "@/components/user-management/data";

export default function UserManagementPage() {
  const [users, setUsers] = useState<AppUser[]>(INITIAL_USERS);
  const [modalUser, setModalUser] = useState<AppUser | null | "new">(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  function saveUser(draft: { name: string; email: string; role: Role; modules: ModuleName[] }) {
    if (modalUser && modalUser !== "new") {
      setUsers((prev) => prev.map((u) => (u.id === modalUser.id ? { ...u, ...draft } : u)));
    } else {
      setUsers((prev) => [
        ...prev,
        { id: `u${Date.now()}`, status: "Active", ...draft },
      ]);
    }
    setModalUser(null);
  }

  function confirmDelete() {
    if (!deleteId) return;
    setUsers((prev) => prev.filter((u) => u.id !== deleteId));
    setDeleteId(null);
  }

  const deletingUser = users.find((u) => u.id === deleteId);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[var(--bg-page)]">
      <Sidebar />
      <div className="flex h-screen flex-1 flex-col overflow-y-auto px-8 pb-10 pt-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[var(--text-primary)]">User Management</h1>
            <p className="mt-1 text-sm text-[var(--text-muted)]">
              Manage operator accounts and their module access.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <button
              type="button"
              onClick={() => setModalUser("new")}
              className="flex items-center gap-2 rounded-lg bg-[var(--accent-blue)] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#0146d1]"
            >
              <Plus className="h-4 w-4" />
              Add User
            </button>
          </div>
        </div>

        <div className="mt-6 overflow-x-auto rounded-xl bg-[var(--bg-card)] shadow-[var(--shadow-card)]">
          <table className="w-full min-w-[860px] text-sm">
            <thead>
              <tr className="text-left text-xs font-medium uppercase tracking-wide text-[var(--text-faint)]">
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Modules</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-[var(--bg-card-hover)]">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--accent-blue)]/10 text-xs font-semibold text-[var(--accent-blue)]">
                        {user.name
                          .split(" ")
                          .map((p) => p[0])
                          .join("")
                          .slice(0, 2)
                          .toUpperCase()}
                      </span>
                      <div>
                        <div className="font-medium text-[var(--text-primary)]">{user.name}</div>
                        <div className="text-xs text-[var(--text-muted)]">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${
                        user.role === "Admin"
                          ? "bg-[var(--info-bg)] text-[var(--accent-blue)]"
                          : "bg-[var(--bg-inset)] text-[var(--text-muted)]"
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {user.role === "Admin" ? (
                      <span className="text-xs text-[var(--text-muted)]">All modules</span>
                    ) : (
                      <div className="flex flex-wrap gap-1.5">
                        {user.modules.length === 0 && (
                          <span className="text-xs text-[var(--text-faint)]">No modules assigned</span>
                        )}
                        {user.modules.map((mod) => (
                          <span
                            key={mod}
                            className="rounded-full bg-[var(--bg-inset)] px-2 py-0.5 text-xs text-[var(--text-muted)]"
                          >
                            {mod}
                          </span>
                        ))}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span className="flex items-center gap-1.5 text-xs font-medium">
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          user.status === "Active" ? "bg-[var(--success)]" : "bg-[var(--text-faint)]"
                        }`}
                      />
                      <span className={user.status === "Active" ? "text-[var(--success)]" : "text-[var(--text-faint)]"}>
                        {user.status}
                      </span>
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        type="button"
                        title="Edit user"
                        onClick={() => setModalUser(user)}
                        className="flex h-8 w-8 items-center justify-center rounded-md text-[var(--text-muted)] hover:bg-[var(--bg-inset)] hover:text-[var(--text-primary)]"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        title="Delete user"
                        onClick={() => setDeleteId(user.id)}
                        className="flex h-8 w-8 items-center justify-center rounded-md text-[var(--text-muted)] hover:bg-[var(--danger-bg)] hover:text-[var(--danger)]"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {modalUser && (
        <UserModal
          key={modalUser === "new" ? "new" : modalUser.id}
          user={modalUser === "new" ? null : modalUser}
          onCancel={() => setModalUser(null)}
          onSave={saveUser}
        />
      )}

      {deleteId && deletingUser && (
        <ConfirmModal
          title="Delete this user?"
          description={`${deletingUser.name} will lose access to Sigma. This can't be undone.`}
          onCancel={() => setDeleteId(null)}
          onConfirm={confirmDelete}
        />
      )}
    </div>
  );
}
