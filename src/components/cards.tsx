import { Pill, CalendarClock, Clock, FileText } from "lucide-react";
import type { Appointment, Prescription } from "../types";
import { Card, StatusBadge } from "./ui";
import { formatDate, formatDateTime } from "../lib/format";

export function AppointmentCard({
  appointment,
  primaryLabel,
  secondaryLabel,
  actions,
}: {
  appointment: Appointment;
  primaryLabel: string;
  secondaryLabel?: string;
  actions?: React.ReactNode;
}) {
  return (
    <Card className="p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 gap-3">
          <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
            <CalendarClock size={20} />
          </div>
          <div className="min-w-0">
            <p className="font-medium text-slate-900">{primaryLabel}</p>
            <p className="truncate text-sm text-slate-500">
              {appointment.reason}
            </p>
            <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-600">
              <Clock size={14} className="text-slate-400" />
              {formatDateTime(appointment.datetime)}
            </p>
            {secondaryLabel && (
              <p className="mt-0.5 text-xs text-slate-400">{secondaryLabel}</p>
            )}
            {appointment.notes && (
              <p className="mt-2 flex items-start gap-1.5 rounded-lg bg-slate-50 px-2.5 py-1.5 text-sm text-slate-600">
                <FileText size={14} className="mt-0.5 shrink-0 text-slate-400" />
                {appointment.notes}
              </p>
            )}
          </div>
        </div>
        <StatusBadge status={appointment.status} />
      </div>
      {actions && (
        <div className="mt-3 flex flex-wrap justify-end gap-2 border-t border-slate-100 pt-3">
          {actions}
        </div>
      )}
    </Card>
  );
}

export function PrescriptionCard({
  prescription,
  contextLabel,
  actions,
}: {
  prescription: Prescription;
  contextLabel?: string;
  actions?: React.ReactNode;
}) {
  return (
    <Card className="p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 gap-3">
          <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-green-50 text-green-600">
            <Pill size={20} />
          </div>
          <div className="min-w-0">
            <p className="font-medium text-slate-900">
              {prescription.medication}
            </p>
            <p className="text-sm text-slate-600">
              {prescription.dosage} · {prescription.frequency}
            </p>
            <p className="mt-0.5 text-sm text-slate-500">
              Durante {prescription.durationDays} días · emitida el{" "}
              {formatDate(prescription.issuedDate)}
            </p>
            {contextLabel && (
              <p className="mt-0.5 text-xs text-slate-400">{contextLabel}</p>
            )}
            {prescription.instructions && (
              <p className="mt-2 rounded-lg bg-slate-50 px-2.5 py-1.5 text-sm text-slate-600">
                {prescription.instructions}
              </p>
            )}
          </div>
        </div>
        <StatusBadge status={prescription.status} />
      </div>
      {actions && (
        <div className="mt-3 flex flex-wrap justify-end gap-2 border-t border-slate-100 pt-3">
          {actions}
        </div>
      )}
    </Card>
  );
}

export function StatCard({
  icon,
  label,
  value,
  tone = "brand",
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  tone?: "brand" | "amber" | "green" | "slate";
}) {
  const tones: Record<string, string> = {
    brand: "bg-brand-50 text-brand-600",
    amber: "bg-amber-50 text-amber-600",
    green: "bg-green-50 text-green-600",
    slate: "bg-slate-100 text-slate-500",
  };
  return (
    <Card className="flex items-center gap-4 p-4">
      <div
        className={`flex h-11 w-11 items-center justify-center rounded-xl ${tones[tone]}`}
      >
        {icon}
      </div>
      <div>
        <p className="text-2xl font-bold leading-none text-slate-900">
          {value}
        </p>
        <p className="mt-1 text-sm text-slate-500">{label}</p>
      </div>
    </Card>
  );
}
