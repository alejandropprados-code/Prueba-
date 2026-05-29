import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  appointments as seedAppointments,
  doctors as seedDoctors,
  patients as seedPatients,
  prescriptions as seedPrescriptions,
} from "../data/seed";
import type {
  Appointment,
  AppointmentStatus,
  Doctor,
  Patient,
  Prescription,
  User,
} from "../types";

const STORAGE_KEY = "mediapp-state-v1";
const SESSION_KEY = "mediapp-session-v1";

interface PersistedState {
  appointments: Appointment[];
  prescriptions: Prescription[];
}

interface AppContextValue {
  doctors: Doctor[];
  patients: Patient[];
  appointments: Appointment[];
  prescriptions: Prescription[];
  currentUser: User | null;
  // sesión
  login: (userId: string) => void;
  logout: () => void;
  // acciones
  addAppointment: (
    data: Omit<Appointment, "id" | "status">,
  ) => void;
  updateAppointmentStatus: (
    id: string,
    status: AppointmentStatus,
    notes?: string,
  ) => void;
  addPrescription: (data: Omit<Prescription, "id" | "status">) => void;
  finishPrescription: (id: string) => void;
  // helpers
  doctorById: (id: string) => Doctor | undefined;
  patientById: (id: string) => Patient | undefined;
}

const AppContext = createContext<AppContextValue | null>(null);

function loadPersisted(): PersistedState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as PersistedState;
  } catch {
    // ignoramos errores de parseo y caemos al seed
  }
  return {
    appointments: seedAppointments,
    prescriptions: seedPrescriptions,
  };
}

function uid(prefix: string): string {
  return `${prefix}_${Date.now().toString(36)}_${Math.random()
    .toString(36)
    .slice(2, 7)}`;
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [appointments, setAppointments] = useState<Appointment[]>(
    () => loadPersisted().appointments,
  );
  const [prescriptions, setPrescriptions] = useState<Prescription[]>(
    () => loadPersisted().prescriptions,
  );
  const [currentUserId, setCurrentUserId] = useState<string | null>(
    () => localStorage.getItem(SESSION_KEY),
  );

  // Doctores y pacientes son estáticos en esta demo.
  const doctors = seedDoctors;
  const patients = seedPatients;

  useEffect(() => {
    const state: PersistedState = { appointments, prescriptions };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [appointments, prescriptions]);

  useEffect(() => {
    if (currentUserId) localStorage.setItem(SESSION_KEY, currentUserId);
    else localStorage.removeItem(SESSION_KEY);
  }, [currentUserId]);

  const currentUser = useMemo<User | null>(() => {
    if (!currentUserId) return null;
    return (
      doctors.find((d) => d.id === currentUserId) ??
      patients.find((p) => p.id === currentUserId) ??
      null
    );
  }, [currentUserId, doctors, patients]);

  const login = useCallback((userId: string) => setCurrentUserId(userId), []);
  const logout = useCallback(() => setCurrentUserId(null), []);

  const addAppointment = useCallback(
    (data: Omit<Appointment, "id" | "status">) => {
      setAppointments((prev) => [
        { ...data, id: uid("a"), status: "pendiente" },
        ...prev,
      ]);
    },
    [],
  );

  const updateAppointmentStatus = useCallback(
    (id: string, status: AppointmentStatus, notes?: string) => {
      setAppointments((prev) =>
        prev.map((a) =>
          a.id === id
            ? { ...a, status, notes: notes ?? a.notes }
            : a,
        ),
      );
    },
    [],
  );

  const addPrescription = useCallback(
    (data: Omit<Prescription, "id" | "status">) => {
      setPrescriptions((prev) => [
        { ...data, id: uid("r"), status: "activa" },
        ...prev,
      ]);
    },
    [],
  );

  const finishPrescription = useCallback((id: string) => {
    setPrescriptions((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "finalizada" } : r)),
    );
  }, []);

  const doctorById = useCallback(
    (id: string) => doctors.find((d) => d.id === id),
    [doctors],
  );
  const patientById = useCallback(
    (id: string) => patients.find((p) => p.id === id),
    [patients],
  );

  const value: AppContextValue = {
    doctors,
    patients,
    appointments,
    prescriptions,
    currentUser,
    login,
    logout,
    addAppointment,
    updateAppointmentStatus,
    addPrescription,
    finishPrescription,
    doctorById,
    patientById,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp debe usarse dentro de <AppProvider>");
  return ctx;
}
