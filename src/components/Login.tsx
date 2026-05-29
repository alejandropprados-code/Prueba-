import { useState } from "react";
import {
  Stethoscope,
  User as UserIcon,
  HeartPulse,
  ArrowRight,
} from "lucide-react";
import { useApp } from "../store/AppContext";
import type { Role } from "../types";
import { calcAge } from "../lib/format";

export function Login() {
  const { doctors, patients, login } = useApp();
  const [role, setRole] = useState<Role>("doctor");

  const list = role === "doctor" ? doctors : patients;

  return (
    <div className="flex min-h-full items-center justify-center bg-gradient-to-br from-brand-50 via-slate-50 to-white px-4 py-10">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-600 text-white shadow-lg shadow-brand-600/20">
            <HeartPulse size={28} />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">MediApp</h1>
          <p className="mt-1 text-sm text-slate-500">
            Portal sanitario · demo de recetas y citas
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="mb-3 text-sm font-medium text-slate-700">
            Accede como
          </p>
          <div className="mb-5 grid grid-cols-2 gap-3">
            <RoleButton
              active={role === "doctor"}
              onClick={() => setRole("doctor")}
              icon={<Stethoscope size={20} />}
              label="Médico"
            />
            <RoleButton
              active={role === "patient"}
              onClick={() => setRole("patient")}
              icon={<UserIcon size={20} />}
              label="Paciente"
            />
          </div>

          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-400">
            Selecciona un perfil de demostración
          </p>
          <ul className="space-y-2">
            {list.map((u) => (
              <li key={u.id}>
                <button
                  onClick={() => login(u.id)}
                  className="group flex w-full items-center justify-between rounded-xl border border-slate-200 px-4 py-3 text-left transition-colors hover:border-brand-400 hover:bg-brand-50/50"
                >
                  <span>
                    <span className="block font-medium text-slate-900">
                      {u.name}
                    </span>
                    <span className="block text-sm text-slate-500">
                      {u.role === "doctor"
                        ? u.specialty
                        : `${calcAge(u.birthDate)} años · ${u.bloodType}`}
                    </span>
                  </span>
                  <ArrowRight
                    size={18}
                    className="text-slate-300 transition-colors group-hover:text-brand-500"
                  />
                </button>
              </li>
            ))}
          </ul>
        </div>

        <p className="mt-6 text-center text-xs text-slate-400">
          Aplicación de prueba. No introduzcas datos médicos reales.
        </p>
      </div>
    </div>
  );
}

function RoleButton({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-1.5 rounded-xl border px-4 py-4 text-sm font-medium transition-colors ${
        active
          ? "border-brand-500 bg-brand-50 text-brand-700"
          : "border-slate-200 text-slate-600 hover:bg-slate-50"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}
