import { NavigatorScreenParams } from '@react-navigation/native';

export type MainTabParamList = {
  Patients: undefined;
  Appointments: undefined;
};

export type RootStackParamList = {
  Login: undefined;
  MainTabs: NavigatorScreenParams<MainTabParamList>;
  AddPatient: undefined;
  PatientDetails: { patientId: string };
  EditPatient: { patientId: string };
  AddAppointment: { patientId?: string };
  AppointmentDetails: { appointmentId: string };
  EditAppointment: { appointmentId: string };
};

// Global typing for react navigation
declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
