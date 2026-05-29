import { useApp } from "./store/AppContext";
import { Login } from "./components/Login";
import { DoctorApp } from "./apps/DoctorApp";
import { PatientApp } from "./apps/PatientApp";

export function App() {
  const { currentUser } = useApp();

  if (!currentUser) return <Login />;
  if (currentUser.role === "doctor")
    return <DoctorApp doctor={currentUser} />;
  return <PatientApp patient={currentUser} />;
}
