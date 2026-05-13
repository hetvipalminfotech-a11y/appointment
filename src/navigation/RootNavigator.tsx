import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './types';
import { getCurrentUser, logout } from '../store/authStore';

// Navigators
import MainTabNavigator from './MainTabNavigator';

// Screens
import LoginScreen from '../screens/Auth/LoginScreen';
import AddPatientScreen from '../screens/Patients/AddPatientScreen';
import PatientDetailsScreen from '../screens/Patients/PatientDetailsScreen';
import EditPatientScreen from '../screens/Patients/EditPatientScreen';
import AddAppointmentScreen from '../screens/Appointments/AddAppointmentScreen';
import AppointmentDetailsScreen from '../screens/Appointments/AppointmentDetailsScreen';
import EditAppointmentScreen from '../screens/Appointments/EditAppointmentScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // TEMPORARY FORCED LOGOUT: Calling logout() here ensures that 
    // next time the app loads, the MMKV user session is cleared so you 
    // can see, style, and test the Login screen.
    // (When ready to go to production, simply remove this logout() call!)
    logout();

    // Check if user is already logged in
    const user = getCurrentUser();
    if (user) {
      setIsAuthenticated(true);
    }
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isAuthenticated ? (
          <Stack.Screen name="Login">
            {(props) => <LoginScreen {...props} onLogin={() => setIsAuthenticated(true)} />}
          </Stack.Screen>
        ) : (
          <>
            <Stack.Screen name="MainTabs" component={MainTabNavigator} />
            <Stack.Screen name="AddPatient" component={AddPatientScreen} />
            <Stack.Screen name="PatientDetails" component={PatientDetailsScreen} />
            <Stack.Screen name="EditPatient" component={EditPatientScreen} />
            <Stack.Screen name="AddAppointment" component={AddAppointmentScreen} />
            <Stack.Screen name="AppointmentDetails" component={AppointmentDetailsScreen} />
            <Stack.Screen name="EditAppointment" component={EditAppointmentScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
