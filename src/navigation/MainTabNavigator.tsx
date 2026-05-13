import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import PatientListScreen from '../screens/Patients/PatientListScreen';
import AppointmentListScreen from '../screens/Appointments/AppointmentListScreen';
import { MainTabParamList } from './types';
import { Ionicons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator<MainTabParamList>();

export default function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'help';
          if (route.name === 'Patients') {
            iconName = focused ? 'people' : 'people-outline';
          } else if (route.name === 'Appointments') {
            iconName = focused ? 'calendar' : 'calendar-outline';
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#0ea5e9',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen name="Patients" component={PatientListScreen} />
      <Tab.Screen name="Appointments" component={AppointmentListScreen} />
    </Tab.Navigator>
  );
}
