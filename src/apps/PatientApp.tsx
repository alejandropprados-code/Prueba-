import { useMemo, useState } from "react";
import {
  CalendarDays,
  LayoutDashboard,
  Pill,
  UserCircle,
  Plus,
  X,
  Droplet,
  AlertTriangle,
  IdCard,
  Cake,
  ChevronRight,
} from "lucide-react";
import { useApp } from "../store/AppContext";
import { Layout, type NavItem } from "../components/Layout";
import {
  Button,
  Card,
  EmptyState,
  Modal,
  SectionTitle,
} from "../components/ui";
import {
  AppointmentCard,
  PrescriptionCard,
  StatCard,
} from "../components/cards";
import { AppointmentForm } from "../components/forms";
import { calcAge, formatDate, isFuture } from "../lib/format";
import type { Patient } from "../types";

const nav: NavItem[] = [
  { key: "inicio", label: "Inicio", icon: <LayoutDashboard size={18} /> },
  { key: "citas", label: "Mis citas", icon: <CalendarDays size={18} /> },
  { key: "recetas", label: "Mis recetas", icon: <Pill size={18} /> },
  { key: "perfil", label: "Mi perfil", icon: <UserCircle size={18} /> },
];

export function PatientApp({ patient }: { patient: Patient }) {
  const [view, setView] = useState("inicio");

  return (
    <Layout
      nav={nav}
      current={view}
      onNavigate={setView}
      roleLabel="Portal del paciente"
    >
      {view === "inicio" && <PatientHome patient={patient} onGo={setView} />}
      {view === "citas" && <PatientAppointments patient={patient} />}
      {view === "recetas" && <PatientPrescriptions patient={patient} />}
      {view === "perfil" && <PatientProfile patient={patient} />}
    </Layout>
  );
}

function PatientHome({
  patient,
  onGo,
}: {
  patient: Patient;
  onGo: (v: string) => void;
}) {
  const { appointments, prescriptions, doctorById } = useApp();

  const mineAppts = appointments.filter((a) => a.patientId === patient.id);
  const upcoming = mineAppts
    .filter((a) => isFuture(a.datetime) && a.status !== "cancelada")
    .sort((a, b) => a.datetime.localeCompare(b.datetime));
  const activeRx = prescriptions.filter(
    (r) => r.patientId === patient.id && r.status === "activa",
  );

  return (
    <>
      <SectionTitle
        title={`Hola, ${patient.name.split(" ")[0]}`}
        subtitle="Este es el resumen de tu salud."
      />

      <div className="grid grid-cols-2 gap-4">
        <StatCard
          icon={<CalendarDays size={22} />}
          label="Próximas citas"
          value={upcoming.length}
        />
        <StatCard
          icon={<Pill size={22} />}
          label="Tratamientos activos"
          value={activeRx.length}
          tone="green"
        />
      </div>

      <div className="mt-8">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">
          Próxima cita
        </h2>
        {upcoming.length === 0 ? (
          <EmptyState
            icon={<CalendarDays size={32} />}
            title="No tienes citas próximas"
            description="Solicita una cita desde la sección «Mis citas»."
          />
        ) : (
          <AppointmentCard
            appointment={upcoming[0]}
            primaryLabel={
              doctorById(upcoming[0].doctorId)?.name ?? "Profesional"
            }
            secondaryLabel={doctorById(upcoming[0].doctorId)?.specialty}
          />
        )}
        <button
          onClick={() => onGo("citas")}
          className="mt-3 flex items-center gap-1 text-sm font-medium text-brand-600 hover:text-brand-700"
        >
          Ver todas mis citas <ChevronRight size={16} />
        </button>
      </div>

      {activeRx.length > 0 && (
        <div className="mt-8">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">
            Tratamientos activos
          </h2>
          <div className="space-y-3">
            {activeRx.map((r) => (
              <PrescriptionCard
                key={r.id}
                prescription={r}
                contextLabel={`Prescrito por ${
                  doctorById(r.doctorId)?.name ?? ""
                }`}
              />
            ))}
          </div>
        </div>
      )}
    </>
  );
}

function PatientAppointments({ patient }: { patient: Patient }) {
  const { appointments, doctorById, addAppointment, updateAppointmentStatus } =
    useApp();
  const [showForm, setShowForm] = useState(false);

  const mine = useMemo(
    () =>
      appointments
        .filter((a) => a.patientId === patient.id)
        .sort((a, b) => b.datetime.localeCompare(a.datetime)),
    [appointments, patient.id],
  );

  return (
    <>
      <SectionTitle
        title="Mis citas"
        subtitle="Solicita y consulta tus citas médicas."
        action={
          <Button onClick={() => setShowForm(true)}>
            <Plus size={16} /> Solicitar cita
          </Button>
        }
      />

      {mine.length === 0 ? (
        <EmptyState
          icon={<CalendarDays size={32} />}
          title="No tienes citas"
          description="Solicita tu primera cita con un profesional."
        />
      ) : (
        <div className="space-y-3">
          {mine.map((a) => (
            <AppointmentCard
              key={a.id}
              appointment={a}
              primaryLabel={doctorById(a.doctorId)?.name ?? "Profesional"}
              secondaryLabel={doctorById(a.doctorId)?.specialty}
              actions={
                a.status === "pendiente" || a.status === "confirmada" ? (
                  <Button
                    variant="danger"
                    onClick={() => updateAppointmentStatus(a.id, "cancelada")}
                  >
                    <X size={15} /> Anular
                  </Button>
                ) : undefined
              }
            />
          ))}
        </div>
      )}

      <Modal
        open={showForm}
        title="Solicitar cita"
        onClose={() => setShowForm(false)}
      >
        <AppointmentForm
          fixedPatientId={patient.id}
          onSubmit={(data) => {
            addAppointment(data);
            setShowForm(false);
          }}
          onCancel={() => setShowForm(false)}
        />
      </Modal>
    </>
  );
}

function PatientPrescriptions({ patient }: { patient: Patient }) {
  const { prescriptions, doctorById } = useApp();

  const mine = prescriptions
    .filter((r) => r.patientId === patient.id)
    .sort((a, b) => b.issuedDate.localeCompare(a.issuedDate));

  return (
    <>
      <SectionTitle
        title="Mis recetas"
        subtitle="Tus tratamientos prescritos."
      />
      {mine.length === 0 ? (
        <EmptyState
          icon={<Pill size={32} />}
          title="No tienes recetas"
          description="Cuando un médico te recete un tratamiento aparecerá aquí."
        />
      ) : (
        <div className="space-y-3">
          {mine.map((r) => (
            <PrescriptionCard
              key={r.id}
              prescription={r}
              contextLabel={`Prescrito por ${doctorById(r.doctorId)?.name ?? ""}`}
            />
          ))}
        </div>
      )}
    </>
  );
}

function PatientProfile({ patient }: { patient: Patient }) {
  return (
    <>
      <SectionTitle title="Mi perfil" subtitle="Tus datos personales y médicos." />
      <Card className="p-6">
        <div className="mb-6 flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-50 text-xl font-bold text-brand-700">
            {patient.name
              .split(" ")
              .map((w) => w[0])
              .slice(0, 2)
              .join("")}
          </div>
          <div>
            <p className="text-lg font-semibold text-slate-900">
              {patient.name}
            </p>
            <p className="text-sm text-slate-500">{patient.email}</p>
          </div>
        </div>

        <dl className="grid gap-4 sm:grid-cols-2">
          <ProfileItem
            icon={<Cake size={16} />}
            label="Fecha de nacimiento"
            value={`${formatDate(patient.birthDate)} (${calcAge(
              patient.birthDate,
            )} años)`}
          />
          <ProfileItem
            icon={<Droplet size={16} />}
            label="Grupo sanguíneo"
            value={patient.bloodType}
          />
          <ProfileItem
            icon={<IdCard size={16} />}
            label="Tarjeta sanitaria"
            value={patient.healthCardNumber}
          />
          <ProfileItem
            icon={<AlertTriangle size={16} />}
            label="Alergias"
            value={
              patient.allergies.length
                ? patient.allergies.join(", ")
                : "Sin alergias conocidas"
            }
          />
        </dl>
      </Card>
    </>
  );
}

function ProfileItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-4">
      <dt className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-slate-400">
        {icon}
        {label}
      </dt>
      <dd className="mt-1 font-medium text-slate-800">{value}</dd>
    </div>
  );
}
