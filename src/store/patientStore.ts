import { storage } from './mmkv';
import { Patient } from './types';

const PATIENTS_KEY = 'patients';

export const getPatients = (): Patient[] => {
  const patientsStr = storage.getString(PATIENTS_KEY);
  if (patientsStr) {
    return JSON.parse(patientsStr) as Patient[];
  }
  return [];
};

export const getPatientById = (id: string): Patient | undefined => {
  const patients = getPatients();
  return patients.find(p => p.id === id);
};

export const addPatient = (patient: Omit<Patient, 'id'>) => {
  const patients = getPatients();
  const newPatient: Patient = {
    ...patient,
    id: Date.now().toString(),
  };
  patients.push(newPatient);
  storage.set(PATIENTS_KEY, JSON.stringify(patients));
};

export const updatePatient = (id: string, updatedData: Partial<Omit<Patient, 'id'>>) => {
  let patients = getPatients();
  patients = patients.map(p => p.id === id ? { ...p, ...updatedData } : p);
  storage.set(PATIENTS_KEY, JSON.stringify(patients));
};

export const deletePatient = (id: string) => {
  let patients = getPatients();
  patients = patients.filter(p => p.id !== id);
  storage.set(PATIENTS_KEY, JSON.stringify(patients));
};
