import React, { useContext } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import PatientListScreen from '../screens/Patients/PatientListScreen';
import AppointmentListScreen from '../screens/Appointments/AppointmentListScreen';
import { MainTabParamList } from './types';
import { Ionicons, Feather } from '@expo/vector-icons';
import { AuthContext } from './RootNavigator';

const EmptyScreen = () => <View />;

const Tab = createBottomTabNavigator<MainTabParamList>();

export default function MainTabNavigator() {
  const { logout } = useContext(AuthContext);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: any = 'help';
          if (route.name === 'Patients') {
            return (
              <View style={[styles.iconContainer, focused && styles.activeIconContainer]}>
                <Ionicons name={focused ? 'people' : 'people-outline'} size={22} color={focused ? '#0ea5e9' : '#94a3b8'} />
              </View>
            );
          } else if (route.name === 'Appointments') {
            return (
              <View style={[styles.iconContainer, focused && styles.activeIconContainer]}>
                <Feather name="calendar" size={20} color={focused ? '#0ea5e9' : '#94a3b8'} />
              </View>
            );
          } else if (route.name === 'Logout') {
            return (
              <View style={[styles.iconContainer, focused && styles.activeIconContainer]}>
                <Feather name="log-out" size={20} color={focused ? '#ef4444' : '#94a3b8'} />
              </View>
            );
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#0ea5e9',
        tabBarInactiveTintColor: '#94a3b8',
        tabBarLabelStyle: styles.labelStyle,
        tabBarStyle: styles.tabBar,
        headerShown: false,
      })}
    >
      <Tab.Screen name="Patients" component={PatientListScreen} />
      <Tab.Screen name="Appointments" component={AppointmentListScreen} />
      <Tab.Screen
        name="Logout"
        component={EmptyScreen}
        listeners={{
          tabPress: (e) => {
            e.preventDefault();
            logout();
          },
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    height: '10%',
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    paddingBottom: '2%',
    paddingTop: '1%',
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeIconContainer: {
    backgroundColor: '#f0f9ff',
  },
  labelStyle: {
    fontSize: 10,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: -5,
  },
});
