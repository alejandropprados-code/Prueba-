import type {
  Appointment,
  Doctor,
  Patient,
  Prescription,
} from "../types";

/** Devuelve una fecha relativa a hoy (en días) con una hora concreta. */
function dayOffset(days: number, hour = 9, minute = 0): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  d.setHours(hour, minute, 0, 0);
  return d.toISOString();
}

/** Devuelve una fecha (sin hora) relativa a hoy en formato YYYY-MM-DD. */
function dateOffset(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

// Un único perfil de médico y un único perfil de paciente, sincronizados:
// la paciente es paciente de esta médica, así que todo lo que cree uno lo ve
// el otro.
export const doctors: Doctor[] = [
  {
    id: "d1",
    role: "doctor",
    name: "Dra. Elena Ríos",
    specialty: "Medicina de familia",
    email: "elena.rios@mediapp.health",
    licenseNumber: "COL-28-45123",
  },
];

export const patients: Patient[] = [
  {
    id: "p1",
    role: "patient",
    name: "Lucía Fernández",
    email: "lucia.fernandez@email.com",
    birthDate: "1991-04-12",
    bloodType: "A+",
    allergies: ["Penicilina"],
    healthCardNumber: "BDSS 123456789 01",
  },
];

export const appointments: Appointment[] = [
  {
    id: "a1",
    patientId: "p1",
    doctorId: "d1",
    datetime: dayOffset(0, 10, 30),
    reason: "Revisión anual",
    status: "confirmada",
  },
  {
    id: "a2",
    patientId: "p1",
    doctorId: "d1",
    datetime: dayOffset(4, 12, 0),
    reason: "Resultados de analítica",
    status: "pendiente",
  },
  {
    id: "a3",
    patientId: "p1",
    doctorId: "d1",
    datetime: dayOffset(-10, 11, 0),
    reason: "Dolor de garganta persistente",
    status: "completada",
    notes: "Faringitis vírica. Reposo e hidratación. Revisar si empeora.",
  },
];

export const prescriptions: Prescription[] = [
  {
    id: "r1",
    patientId: "p1",
    doctorId: "d1",
    medication: "Paracetamol 1g",
    dosage: "1 comprimido",
    frequency: "Cada 8 horas",
    durationDays: 5,
    issuedDate: dateOffset(-3),
    status: "activa",
    instructions: "Tomar con alimentos. No superar 3 comprimidos al día.",
  },
  {
    id: "r2",
    patientId: "p1",
    doctorId: "d1",
    medication: "Ibuprofeno 600mg",
    dosage: "1 comprimido",
    frequency: "Cada 12 horas",
    durationDays: 7,
    issuedDate: dateOffset(-30),
    status: "finalizada",
  },
];
