import { storage } from './mmkv';
import { Appointment } from './types';

const APPOINTMENTS_KEY = 'appointments';

export const getAppointments = (): Appointment[] => {
  const appsStr = storage.getString(APPOINTMENTS_KEY);
  if (appsStr) {
    return JSON.parse(appsStr) as Appointment[];
  }
  return [];
};

export const getAppointmentsByPatientId = (patientId: string): Appointment[] => {
  const apps = getAppointments();
  return apps.filter(a => a.patientId === patientId);
};

export const getAppointmentById = (id: string): Appointment | undefined => {
  const apps = getAppointments();
  return apps.find(a => a.id === id);
};

export const addAppointment = (appointment: Omit<Appointment, 'id'>) => {
  const apps = getAppointments();
  const newAppointment: Appointment = {
    ...appointment,
    id: Date.now().toString(),
  };
  apps.push(newAppointment);
  storage.set(APPOINTMENTS_KEY, JSON.stringify(apps));
};

export const updateAppointment = (id: string, updatedData: Partial<Omit<Appointment, 'id'>>) => {
  let apps = getAppointments();
  apps = apps.map(a => a.id === id ? { ...a, ...updatedData } : a);
  storage.set(APPOINTMENTS_KEY, JSON.stringify(apps));
};

export const deleteAppointment = (id: string) => {
  let apps = getAppointments();
  apps = apps.filter(a => a.id !== id);
  storage.set(APPOINTMENTS_KEY, JSON.stringify(apps));
};
