"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, Eye, EyeOff, ShieldCheck, User } from "lucide-react";
import { setStoredRole, type UserRole } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStoredRole("admin");
    router.push("/");
  }

  function quickLogin(role: UserRole) {
    setStoredRole(role);
    router.push("/");
  }

  return (
    <div className="flex h-screen w-full items-center justify-center bg-[var(--bg-page)] px-4">
      <div className="w-full max-w-sm rounded-xl bg-[var(--bg-card)] p-8 shadow-[var(--shadow-card-strong)]">
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[var(--accent-blue)] shadow-[var(--shadow-card)]">
            <Sparkles className="h-6 w-6 text-white" />
          </div>
          <div>
            <div className="text-lg font-semibold text-[var(--text-primary)]">Sigma</div>
            <div className="text-xs text-[var(--text-muted)]">Quality Station</div>
          </div>
        </div>

        <div className="mt-6 text-center">
          <h1 className="text-base font-semibold text-[var(--text-primary)]">Sign in to your account</h1>
          <p className="mt-1 text-sm text-[var(--text-muted)]">Enter your credentials to continue.</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-medium uppercase tracking-wide text-[var(--text-faint)]">Email</span>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@hul.com"
              className="w-full rounded-lg bg-[var(--bg-page)] px-3 py-2.5 text-sm text-[var(--text-primary)] shadow-[var(--shadow-card)] outline-none placeholder:text-[var(--text-faint)] focus:shadow-[0_0_0_2px_var(--accent-blue)]"
            />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-medium uppercase tracking-wide text-[var(--text-faint)]">Password</span>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-lg bg-[var(--bg-page)] py-2.5 pl-3 pr-10 text-sm text-[var(--text-primary)] shadow-[var(--shadow-card)] outline-none placeholder:text-[var(--text-faint)] focus:shadow-[0_0_0_2px_var(--accent-blue)]"
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-faint)] hover:text-[var(--text-muted)]"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </label>

          <div className="flex justify-end">
            <button type="button" className="text-xs font-medium text-[var(--accent-blue)] hover:underline">
              Forgot password?
            </button>
          </div>

          <button
            type="submit"
            className="mt-2 rounded-lg bg-[var(--accent-blue)] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#0146d1]"
          >
            Sign in
          </button>
        </form>

        <div className="mt-6 flex items-center gap-3">
          <span className="h-px flex-1 bg-[var(--text-faint)]/15" />
          <span className="text-xs text-[var(--text-faint)]">Quick login</span>
          <span className="h-px flex-1 bg-[var(--text-faint)]/15" />
        </div>

        <div className="mt-4 flex flex-col gap-2">
          <button
            type="button"
            onClick={() => quickLogin("admin")}
            className="flex items-center justify-center gap-2 rounded-lg bg-[var(--bg-page)] px-4 py-2.5 text-sm font-medium text-[var(--text-primary)] shadow-[var(--shadow-card)] hover:bg-[var(--bg-inset)]"
          >
            <ShieldCheck className="h-4 w-4 text-[var(--accent-blue)]" />
            Continue as Admin
          </button>
          <button
            type="button"
            onClick={() => quickLogin("user")}
            className="flex items-center justify-center gap-2 rounded-lg bg-[var(--bg-page)] px-4 py-2.5 text-sm font-medium text-[var(--text-primary)] shadow-[var(--shadow-card)] hover:bg-[var(--bg-inset)]"
          >
            <User className="h-4 w-4 text-[var(--text-muted)]" />
            Continue as User (Dashboard only)
          </button>
        </div>
      </div>
    </div>
  );
}
