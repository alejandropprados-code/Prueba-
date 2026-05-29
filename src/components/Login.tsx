import { Stethoscope, User as UserIcon, HeartPulse } from "lucide-react";
import { useApp } from "../store/AppContext";
import { calcAge } from "../lib/format";

export function Login() {
  const { doctors, patients, login } = useApp();
  const doctor = doctors[0];
  const patient = patients[0];

  return (
    <div className="flex min-h-full items-center justify-center bg-gradient-to-br from-brand-50 via-slate-50 to-white px-4 py-10">
      <div className="w-full max-w-2xl">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-600 text-white shadow-lg shadow-brand-600/20">
            <HeartPulse size={28} />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">MediApp</h1>
          <p className="mt-1 text-sm text-slate-500">
            Portal sanitario · demo
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <AccessCard
            onClick={() => login(doctor.id)}
            icon={<Stethoscope size={28} />}
            role="Acceder como Médico"
            name={doctor.name}
            detail={doctor.specialty}
          />
          <AccessCard
            onClick={() => login(patient.id)}
            icon={<UserIcon size={28} />}
            role="Acceder como Paciente"
            name={patient.name}
            detail={`${calcAge(patient.birthDate)} años · ${patient.bloodType}`}
          />
        </div>

        <p className="mt-6 text-center text-xs text-slate-400">
          Aplicación de prueba. No introduzcas datos médicos reales.
        </p>
      </div>
    </div>
  );
}

function AccessCard({
  onClick,
  icon,
  role,
  name,
  detail,
}: {
  onClick: () => void;
  icon: React.ReactNode;
  role: string;
  name: string;
  detail: string;
}) {
  return (
    <button
      onClick={onClick}
      className="group flex flex-col items-center gap-3 rounded-2xl border border-slate-200 bg-white px-6 py-8 text-center shadow-sm transition-all hover:-translate-y-0.5 hover:border-brand-400 hover:shadow-md"
    >
      <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-50 text-brand-600 transition-colors group-hover:bg-brand-600 group-hover:text-white">
        {icon}
      </span>
      <span className="text-base font-semibold text-slate-900">{role}</span>
      <span className="-mt-1">
        <span className="block font-medium text-slate-700">{name}</span>
        <span className="block text-sm text-slate-500">{detail}</span>
      </span>
    </button>
  );
}
