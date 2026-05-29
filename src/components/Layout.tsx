import { useState, type ReactNode } from "react";
import { HeartPulse, LogOut, Menu, X } from "lucide-react";
import { useApp } from "../store/AppContext";

export interface NavItem {
  key: string;
  label: string;
  icon: ReactNode;
}

export function Layout({
  nav,
  current,
  onNavigate,
  roleLabel,
  children,
}: {
  nav: NavItem[];
  current: string;
  onNavigate: (key: string) => void;
  roleLabel: string;
  children: ReactNode;
}) {
  const { currentUser, logout } = useApp();
  const [mobileOpen, setMobileOpen] = useState(false);

  if (!currentUser) return null;

  const initials = currentUser.name
    .replace(/^(Dra?\.?)\s*/i, "")
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const sidebar = (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2.5 px-5 py-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 text-white">
          <HeartPulse size={20} />
        </div>
        <div>
          <p className="font-bold leading-tight text-slate-900">MediApp</p>
          <p className="text-xs text-slate-400">{roleLabel}</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-2">
        {nav.map((item) => {
          const active = item.key === current;
          return (
            <button
              key={item.key}
              onClick={() => {
                onNavigate(item.key);
                setMobileOpen(false);
              }}
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                active
                  ? "bg-brand-50 text-brand-700"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <span className={active ? "text-brand-600" : "text-slate-400"}>
                {item.icon}
              </span>
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="border-t border-slate-100 p-3">
        <div className="flex items-center gap-3 rounded-lg px-2 py-2">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-200 text-sm font-semibold text-slate-600">
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-slate-900">
              {currentUser.name}
            </p>
            <p className="truncate text-xs text-slate-400">
              {currentUser.email}
            </p>
          </div>
        </div>
        <button
          onClick={logout}
          className="mt-1 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100"
        >
          <LogOut size={18} className="text-slate-400" />
          Cerrar sesión
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-full">
      {/* Sidebar escritorio */}
      <aside className="hidden w-64 shrink-0 border-r border-slate-200 bg-white md:block">
        {sidebar}
      </aside>

      {/* Sidebar móvil */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div
            className="absolute inset-0 bg-slate-900/40"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="absolute left-0 top-0 h-full w-64 bg-white shadow-xl">
            {sidebar}
          </aside>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Barra superior móvil */}
        <header className="flex items-center gap-3 border-b border-slate-200 bg-white px-4 py-3 md:hidden">
          <button
            onClick={() => setMobileOpen((o) => !o)}
            className="rounded-md p-1.5 text-slate-600 hover:bg-slate-100"
            aria-label="Menú"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <span className="font-semibold text-slate-900">MediApp</span>
        </header>

        <main className="flex-1 overflow-y-auto bg-slate-50">
          <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
