import { useMemo, useState } from "react";
import {
  CalendarDays,
  LayoutDashboard,
  Pill,
  Users,
  Plus,
  Check,
  X,
  ClipboardCheck,
  Stethoscope,
  Droplet,
  AlertTriangle,
  ChevronRight,
} from "lucide-react";
import { useApp } from "../store/AppContext";
import { Layout, type NavItem } from "../components/Layout";
import {
  Button,
  Card,
  EmptyState,
  Field,
  inputStyles,
  Modal,
  SectionTitle,
} from "../components/ui";
import {
  AppointmentCard,
  PrescriptionCard,
  StatCard,
} from "../components/cards";
import { AppointmentForm, PrescriptionForm } from "../components/forms";
import { calcAge, formatDateTime, isSameDay } from "../lib/format";
import type { Doctor, Patient } from "../types";

const nav: NavItem[] = [
  { key: "inicio", label: "Inicio", icon: <LayoutDashboard size={18} /> },
  { key: "agenda", label: "Agenda", icon: <CalendarDays size={18} /> },
  { key: "pacientes", label: "Pacientes", icon: <Users size={18} /> },
  { key: "recetas", label: "Recetas", icon: <Pill size={18} /> },
];

export function DoctorApp({ doctor }: { doctor: Doctor }) {
  const [view, setView] = useState("inicio");

  return (
    <Layout
      nav={nav}
      current={view}
      onNavigate={setView}
      roleLabel="Panel del médico"
    >
      {view === "inicio" && <DoctorHome doctor={doctor} onGo={setView} />}
      {view === "agenda" && <DoctorAgenda doctor={doctor} />}
      {view === "pacientes" && <DoctorPatients doctor={doctor} />}
      {view === "recetas" && <DoctorPrescriptions doctor={doctor} />}
    </Layout>
  );
}

function DoctorHome({
  doctor,
  onGo,
}: {
  doctor: Doctor;
  onGo: (v: string) => void;
}) {
  const { appointments, prescriptions, patients, patientById } = useApp();

  const mine = appointments.filter((a) => a.doctorId === doctor.id);
  const today = mine.filter(
    (a) => isSameDay(a.datetime) && a.status !== "cancelada",
  );
  const pending = mine.filter((a) => a.status === "pendiente");
  const activeRx = prescriptions.filter(
    (r) => r.doctorId === doctor.id && r.status === "activa",
  );

  return (
    <>
      <SectionTitle
        title={`Hola, ${doctor.name}`}
        subtitle={`${doctor.specialty} · nº colegiado ${doctor.licenseNumber}`}
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          icon={<CalendarDays size={22} />}
          label="Citas hoy"
          value={today.length}
        />
        <StatCard
          icon={<ClipboardCheck size={22} />}
          label="Por confirmar"
          value={pending.length}
          tone="amber"
        />
        <StatCard
          icon={<Pill size={22} />}
          label="Recetas activas"
          value={activeRx.length}
          tone="green"
        />
        <StatCard
          icon={<Users size={22} />}
          label="Pacientes"
          value={patients.length}
          tone="slate"
        />
      </div>

      <div className="mt-8">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">
          Agenda de hoy
        </h2>
        {today.length === 0 ? (
          <EmptyState
            icon={<CalendarDays size={32} />}
            title="No hay citas para hoy"
            description="Cuando tengas citas programadas para hoy aparecerán aquí."
          />
        ) : (
          <div className="space-y-3">
            {today
              .sort((a, b) => a.datetime.localeCompare(b.datetime))
              .map((a) => {
                const p = patientById(a.patientId);
                return (
                  <AppointmentCard
                    key={a.id}
                    appointment={a}
                    primaryLabel={p?.name ?? "Paciente"}
                  />
                );
              })}
          </div>
        )}
        <button
          onClick={() => onGo("agenda")}
          className="mt-3 flex items-center gap-1 text-sm font-medium text-brand-600 hover:text-brand-700"
        >
          Ver agenda completa <ChevronRight size={16} />
        </button>
      </div>
    </>
  );
}

function DoctorAgenda({ doctor }: { doctor: Doctor }) {
  const { appointments, patientById, updateAppointmentStatus, addAppointment } =
    useApp();
  const [showForm, setShowForm] = useState(false);
  const [noteFor, setNoteFor] = useState<string | null>(null);
  const [noteText, setNoteText] = useState("");

  const mine = useMemo(
    () =>
      appointments
        .filter((a) => a.doctorId === doctor.id)
        .sort((a, b) => b.datetime.localeCompare(a.datetime)),
    [appointments, doctor.id],
  );

  return (
    <>
      <SectionTitle
        title="Agenda"
        subtitle="Gestiona tus citas: confirma, completa o cancela."
        action={
          <Button onClick={() => setShowForm(true)}>
            <Plus size={16} /> Nueva cita
          </Button>
        }
      />

      {mine.length === 0 ? (
        <EmptyState
          icon={<CalendarDays size={32} />}
          title="Sin citas"
          description="Crea una nueva cita para empezar."
        />
      ) : (
        <div className="space-y-3">
          {mine.map((a) => {
            const p = patientById(a.patientId);
            return (
              <AppointmentCard
                key={a.id}
                appointment={a}
                primaryLabel={p?.name ?? "Paciente"}
                actions={
                  <>
                    {a.status === "pendiente" && (
                      <Button
                        variant="secondary"
                        onClick={() =>
                          updateAppointmentStatus(a.id, "confirmada")
                        }
                      >
                        <Check size={15} /> Confirmar
                      </Button>
                    )}
                    {(a.status === "pendiente" ||
                      a.status === "confirmada") && (
                      <>
                        <Button
                          onClick={() => {
                            setNoteFor(a.id);
                            setNoteText(a.notes ?? "");
                          }}
                        >
                          <ClipboardCheck size={15} /> Completar
                        </Button>
                        <Button
                          variant="danger"
                          onClick={() =>
                            updateAppointmentStatus(a.id, "cancelada")
                          }
                        >
                          <X size={15} /> Cancelar
                        </Button>
                      </>
                    )}
                  </>
                }
              />
            );
          })}
        </div>
      )}

      <Modal
        open={showForm}
        title="Nueva cita"
        onClose={() => setShowForm(false)}
      >
        <AppointmentForm
          fixedDoctorId={doctor.id}
          onSubmit={(data) => {
            addAppointment(data);
            setShowForm(false);
          }}
          onCancel={() => setShowForm(false)}
        />
      </Modal>

      <Modal
        open={noteFor !== null}
        title="Completar cita"
        onClose={() => setNoteFor(null)}
      >
        <div className="space-y-4">
          <Field label="Notas de la consulta (opcional)">
            <textarea
              className={inputStyles}
              rows={4}
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder="Diagnóstico, evolución, indicaciones…"
            />
          </Field>
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setNoteFor(null)}>
              Cancelar
            </Button>
            <Button
              onClick={() => {
                if (noteFor)
                  updateAppointmentStatus(
                    noteFor,
                    "completada",
                    noteText.trim() || undefined,
                  );
                setNoteFor(null);
              }}
            >
              Marcar como completada
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}

function DoctorPatients({ doctor }: { doctor: Doctor }) {
  const { patients } = useApp();
  const [selected, setSelected] = useState<Patient | null>(null);

  return (
    <>
      <SectionTitle
        title="Pacientes"
        subtitle="Consulta el historial y emite recetas."
      />
      <div className="grid gap-3 sm:grid-cols-2">
        {patients.map((p) => (
          <button
            key={p.id}
            onClick={() => setSelected(p)}
            className="text-left"
          >
            <Card className="flex items-center gap-3 p-4 transition-colors hover:border-brand-400">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-50 font-semibold text-brand-700">
                {p.name
                  .split(" ")
                  .map((w) => w[0])
                  .slice(0, 2)
                  .join("")}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-medium text-slate-900">{p.name}</p>
                <p className="text-sm text-slate-500">
                  {calcAge(p.birthDate)} años · {p.bloodType}
                </p>
              </div>
              <ChevronRight size={18} className="text-slate-300" />
            </Card>
          </button>
        ))}
      </div>

      {selected && (
        <PatientDetailModal
          patient={selected}
          doctor={doctor}
          onClose={() => setSelected(null)}
        />
      )}
    </>
  );
}

function PatientDetailModal({
  patient,
  doctor,
  onClose,
}: {
  patient: Patient;
  doctor: Doctor;
  onClose: () => void;
}) {
  const { appointments, prescriptions, doctorById, addPrescription } = useApp();
  const [showRx, setShowRx] = useState(false);

  const appts = appointments
    .filter((a) => a.patientId === patient.id)
    .sort((a, b) => b.datetime.localeCompare(a.datetime));
  const rx = prescriptions
    .filter((r) => r.patientId === patient.id)
    .sort((a, b) => b.issuedDate.localeCompare(a.issuedDate));

  return (
    <Modal open title={patient.name} onClose={onClose}>
      <div className="space-y-5">
        <div className="grid grid-cols-2 gap-3 text-sm">
          <InfoRow
            icon={<Stethoscope size={15} />}
            label="Edad"
            value={`${calcAge(patient.birthDate)} años`}
          />
          <InfoRow
            icon={<Droplet size={15} />}
            label="Grupo sanguíneo"
            value={patient.bloodType}
          />
          <div className="col-span-2">
            <InfoRow
              icon={<AlertTriangle size={15} />}
              label="Alergias"
              value={
                patient.allergies.length
                  ? patient.allergies.join(", ")
                  : "Sin alergias conocidas"
              }
            />
          </div>
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-700">Recetas</h3>
            <Button onClick={() => setShowRx(true)}>
              <Plus size={15} /> Emitir receta
            </Button>
          </div>
          {rx.length === 0 ? (
            <p className="text-sm text-slate-400">Sin recetas registradas.</p>
          ) : (
            <div className="space-y-2">
              {rx.map((r) => (
                <PrescriptionCard
                  key={r.id}
                  prescription={r}
                  contextLabel={`Dr/a. ${doctorById(r.doctorId)?.name ?? ""}`}
                />
              ))}
            </div>
          )}
        </div>

        <div>
          <h3 className="mb-2 text-sm font-semibold text-slate-700">
            Historial de citas
          </h3>
          {appts.length === 0 ? (
            <p className="text-sm text-slate-400">Sin citas registradas.</p>
          ) : (
            <ul className="space-y-1.5 text-sm">
              {appts.map((a) => (
                <li
                  key={a.id}
                  className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2"
                >
                  <span className="text-slate-700">{a.reason}</span>
                  <span className="text-slate-400">
                    {formatDateTime(a.datetime)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {showRx && (
        <Modal
          open
          title={`Emitir receta · ${patient.name}`}
          onClose={() => setShowRx(false)}
        >
          <PrescriptionForm
            fixedPatientId={patient.id}
            doctorId={doctor.id}
            onSubmit={(data) => {
              addPrescription(data);
              setShowRx(false);
            }}
            onCancel={() => setShowRx(false)}
          />
        </Modal>
      )}
    </Modal>
  );
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-lg bg-slate-50 px-3 py-2">
      <p className="flex items-center gap-1.5 text-xs text-slate-400">
        {icon}
        {label}
      </p>
      <p className="mt-0.5 font-medium text-slate-800">{value}</p>
    </div>
  );
}

function DoctorPrescriptions({ doctor }: { doctor: Doctor }) {
  const { prescriptions, patientById, addPrescription, finishPrescription } =
    useApp();
  const [showForm, setShowForm] = useState(false);

  const mine = prescriptions
    .filter((r) => r.doctorId === doctor.id)
    .sort((a, b) => b.issuedDate.localeCompare(a.issuedDate));

  return (
    <>
      <SectionTitle
        title="Recetas"
        subtitle="Recetas que has emitido."
        action={
          <Button onClick={() => setShowForm(true)}>
            <Plus size={16} /> Nueva receta
          </Button>
        }
      />

      {mine.length === 0 ? (
        <EmptyState
          icon={<Pill size={32} />}
          title="Sin recetas emitidas"
          description="Emite una receta para uno de tus pacientes."
        />
      ) : (
        <div className="space-y-3">
          {mine.map((r) => (
            <PrescriptionCard
              key={r.id}
              prescription={r}
              contextLabel={`Paciente: ${patientById(r.patientId)?.name ?? ""}`}
              actions={
                r.status === "activa" ? (
                  <Button
                    variant="secondary"
                    onClick={() => finishPrescription(r.id)}
                  >
                    Finalizar
                  </Button>
                ) : undefined
              }
            />
          ))}
        </div>
      )}

      <Modal
        open={showForm}
        title="Nueva receta"
        onClose={() => setShowForm(false)}
      >
        <PrescriptionForm
          doctorId={doctor.id}
          onSubmit={(data) => {
            addPrescription(data);
            setShowForm(false);
          }}
          onCancel={() => setShowForm(false)}
        />
      </Modal>
    </>
  );
}
