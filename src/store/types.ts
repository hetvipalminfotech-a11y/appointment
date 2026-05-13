export interface User {
  phone: string;
}

export interface Patient {
  id: string;
  fullName: string;
  phone: string;
  caseId: string;
  birthDate: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  referralSource: string;
  address?: string;
  photoUri?: string;
  billed: number;
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  branch: string;
  doctor: string;
  date: string;
  time: string;
  type: string;
}
