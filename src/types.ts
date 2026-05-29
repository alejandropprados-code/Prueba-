export type Role = "doctor" | "patient";

export type AppointmentStatus =
  | "pendiente"
  | "confirmada"
  | "completada"
  | "cancelada";

export type PrescriptionStatus = "activa" | "finalizada";

export interface Doctor {
  id: string;
  role: "doctor";
  name: string;
  specialty: string;
  email: string;
  /** Número de colegiado */
  licenseNumber: string;
}

export interface Patient {
  id: string;
  role: "patient";
  name: string;
  email: string;
  /** Fecha de nacimiento en formato ISO (YYYY-MM-DD) */
  birthDate: string;
  bloodType: string;
  allergies: string[];
  /** Número de la seguridad social / tarjeta sanitaria */
  healthCardNumber: string;
}

export type User = Doctor | Patient;

export interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  /** Fecha y hora en ISO */
  datetime: string;
  reason: string;
  status: AppointmentStatus;
  notes?: string;
}

export interface Prescription {
  id: string;
  patientId: string;
  doctorId: string;
  medication: string;
  dosage: string;
  frequency: string;
  durationDays: number;
  /** Fecha de emisión en ISO (YYYY-MM-DD) */
  issuedDate: string;
  status: PrescriptionStatus;
  instructions?: string;
}
