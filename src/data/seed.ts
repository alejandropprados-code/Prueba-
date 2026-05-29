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

export const doctors: Doctor[] = [
  {
    id: "d1",
    role: "doctor",
    name: "Dra. Elena Ríos",
    specialty: "Medicina de familia",
    email: "elena.rios@mediapp.health",
    licenseNumber: "COL-28-45123",
  },
  {
    id: "d2",
    role: "doctor",
    name: "Dr. Marcos Vidal",
    specialty: "Cardiología",
    email: "marcos.vidal@mediapp.health",
    licenseNumber: "COL-28-78990",
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
  {
    id: "p2",
    role: "patient",
    name: "Javier Moreno",
    email: "javier.moreno@email.com",
    birthDate: "1978-11-30",
    bloodType: "0-",
    allergies: [],
    healthCardNumber: "BDSS 987654321 02",
  },
  {
    id: "p3",
    role: "patient",
    name: "Carmen Ortega",
    email: "carmen.ortega@email.com",
    birthDate: "1965-07-08",
    bloodType: "B+",
    allergies: ["Ibuprofeno", "Frutos secos"],
    healthCardNumber: "BDSS 456789123 03",
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
    patientId: "p2",
    doctorId: "d1",
    datetime: dayOffset(0, 12, 0),
    reason: "Dolor de garganta persistente",
    status: "pendiente",
  },
  {
    id: "a3",
    patientId: "p3",
    doctorId: "d2",
    datetime: dayOffset(2, 9, 0),
    reason: "Control de tensión arterial",
    status: "confirmada",
  },
  {
    id: "a4",
    patientId: "p1",
    doctorId: "d2",
    datetime: dayOffset(-7, 11, 0),
    reason: "Electrocardiograma de control",
    status: "completada",
    notes: "ECG normal. Repetir en 12 meses.",
  },
  {
    id: "a5",
    patientId: "p3",
    doctorId: "d1",
    datetime: dayOffset(5, 16, 30),
    reason: "Resultados de analítica",
    status: "pendiente",
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
    patientId: "p3",
    doctorId: "d2",
    medication: "Enalapril 10mg",
    dosage: "1 comprimido",
    frequency: "Una vez al día (mañana)",
    durationDays: 90,
    issuedDate: dateOffset(-20),
    status: "activa",
    instructions: "Control de tensión arterial. Tratamiento crónico.",
  },
  {
    id: "r3",
    patientId: "p2",
    doctorId: "d1",
    medication: "Amoxicilina 500mg",
    dosage: "1 cápsula",
    frequency: "Cada 12 horas",
    durationDays: 7,
    issuedDate: dateOffset(-40),
    status: "finalizada",
  },
];
