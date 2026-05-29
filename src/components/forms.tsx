import { useState, type FormEvent } from "react";
import { useApp } from "../store/AppContext";
import { Button, Field, inputStyles } from "./ui";

/** Devuelve el valor para un <input type="datetime-local"> a partir de ahora + offset. */
function defaultDateTimeLocal(daysAhead = 1, hour = 10): string {
  const d = new Date();
  d.setDate(d.getDate() + daysAhead);
  d.setHours(hour, 0, 0, 0);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
    d.getHours(),
  )}:${pad(d.getMinutes())}`;
}

export function AppointmentForm({
  fixedDoctorId,
  fixedPatientId,
  onSubmit,
  onCancel,
}: {
  fixedDoctorId?: string;
  fixedPatientId?: string;
  onSubmit: (data: {
    doctorId: string;
    patientId: string;
    datetime: string;
    reason: string;
  }) => void;
  onCancel: () => void;
}) {
  const { doctors, patients } = useApp();
  const [doctorId, setDoctorId] = useState(fixedDoctorId ?? doctors[0].id);
  const [patientId, setPatientId] = useState(
    fixedPatientId ?? patients[0].id,
  );
  const [datetime, setDatetime] = useState(defaultDateTimeLocal());
  const [reason, setReason] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!reason.trim()) return;
    onSubmit({
      doctorId,
      patientId,
      datetime: new Date(datetime).toISOString(),
      reason: reason.trim(),
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {!fixedPatientId && (
        <Field label="Paciente">
          <select
            className={inputStyles}
            value={patientId}
            onChange={(e) => setPatientId(e.target.value)}
          >
            {patients.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </Field>
      )}
      {!fixedDoctorId && (
        <Field label="Profesional">
          <select
            className={inputStyles}
            value={doctorId}
            onChange={(e) => setDoctorId(e.target.value)}
          >
            {doctors.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name} · {d.specialty}
              </option>
            ))}
          </select>
        </Field>
      )}
      <Field label="Fecha y hora">
        <input
          type="datetime-local"
          className={inputStyles}
          value={datetime}
          onChange={(e) => setDatetime(e.target.value)}
          required
        />
      </Field>
      <Field label="Motivo de la consulta">
        <textarea
          className={inputStyles}
          rows={3}
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Ej. Revisión, dolor, control de tratamiento…"
          required
        />
      </Field>
      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit">Confirmar cita</Button>
      </div>
    </form>
  );
}

export function PrescriptionForm({
  fixedPatientId,
  doctorId,
  onSubmit,
  onCancel,
}: {
  fixedPatientId?: string;
  doctorId: string;
  onSubmit: (data: {
    doctorId: string;
    patientId: string;
    medication: string;
    dosage: string;
    frequency: string;
    durationDays: number;
    instructions?: string;
    issuedDate: string;
  }) => void;
  onCancel: () => void;
}) {
  const { patients } = useApp();
  const [patientId, setPatientId] = useState(
    fixedPatientId ?? patients[0].id,
  );
  const [medication, setMedication] = useState("");
  const [dosage, setDosage] = useState("");
  const [frequency, setFrequency] = useState("");
  const [durationDays, setDurationDays] = useState(7);
  const [instructions, setInstructions] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!medication.trim() || !dosage.trim() || !frequency.trim()) return;
    onSubmit({
      doctorId,
      patientId,
      medication: medication.trim(),
      dosage: dosage.trim(),
      frequency: frequency.trim(),
      durationDays,
      instructions: instructions.trim() || undefined,
      issuedDate: new Date().toISOString().slice(0, 10),
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {!fixedPatientId && (
        <Field label="Paciente">
          <select
            className={inputStyles}
            value={patientId}
            onChange={(e) => setPatientId(e.target.value)}
          >
            {patients.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </Field>
      )}
      <Field label="Medicamento">
        <input
          className={inputStyles}
          value={medication}
          onChange={(e) => setMedication(e.target.value)}
          placeholder="Ej. Paracetamol 1g"
          required
        />
      </Field>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Dosis">
          <input
            className={inputStyles}
            value={dosage}
            onChange={(e) => setDosage(e.target.value)}
            placeholder="Ej. 1 comprimido"
            required
          />
        </Field>
        <Field label="Frecuencia">
          <input
            className={inputStyles}
            value={frequency}
            onChange={(e) => setFrequency(e.target.value)}
            placeholder="Ej. Cada 8 horas"
            required
          />
        </Field>
      </div>
      <Field label="Duración (días)">
        <input
          type="number"
          min={1}
          max={365}
          className={inputStyles}
          value={durationDays}
          onChange={(e) => setDurationDays(Number(e.target.value))}
          required
        />
      </Field>
      <Field label="Instrucciones (opcional)">
        <textarea
          className={inputStyles}
          rows={2}
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
          placeholder="Indicaciones para el paciente"
        />
      </Field>
      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit">Emitir receta</Button>
      </div>
    </form>
  );
}
