import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, Alert } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp, useFocusEffect } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation/types';
import { getAppointmentById, deleteAppointment } from '../../store/appointmentStore';
import { Appointment } from '../../store/types';

type DetailsRouteProp = RouteProp<RootStackParamList, 'AppointmentDetails'>;

export default function AppointmentDetailsScreen() {
  const navigation = useNavigation();
  const route = useRoute<DetailsRouteProp>();
  const [appointment, setAppointment] = useState<Appointment | undefined>(undefined);

  useFocusEffect(
    useCallback(() => {
      const a = getAppointmentById(route.params.appointmentId);
      setAppointment(a);
    }, [route.params.appointmentId])
  );

  if (!appointment) return null;

  const handleDelete = () => {
    Alert.alert('Cancel Appointment', 'Are you sure you want to cancel this appointment?', [
      { text: 'No', style: 'cancel' },
      { text: 'Yes, Cancel', style: 'destructive', onPress: () => {
        deleteAppointment(appointment.id);
        navigation.goBack();
      }}
    ]);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Feather name="chevron-left" size={24} color="#0ea5e9" />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.title}>Appointment Info</Text>
          <Text style={styles.subtitle}>• CLINIC PORTAL</Text>
        </View>
      </View>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.profileCard}>
          <View style={styles.profileTop}>
            <View style={styles.avatar}>
              <Feather name="calendar" size={24} color="#0ea5e9" />
            </View>
            <View style={styles.infoContainer}>
              <Text style={styles.name}>{appointment.patientName}</Text>
              <View style={styles.caseBadge}>
                <Text style={styles.caseBadgeText}>Dr. {appointment.doctor}</Text>
              </View>
            </View>
            <View style={styles.actionButtons}>
              <TouchableOpacity style={styles.actionIconBtn} onPress={() => navigation.navigate('EditAppointment', { appointmentId: appointment.id })}>
                <Feather name="edit-2" size={16} color="#64748b" />
              </TouchableOpacity>
              <TouchableOpacity style={[styles.actionIconBtn, { backgroundColor: '#fee2e2' }]} onPress={handleDelete}>
                <Feather name="trash-2" size={16} color="#ef4444" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.detailsCard}>
          <View style={styles.detailsHeaderRow}>
            <Feather name="clock" size={16} color="#0ea5e9" />
            <Text style={styles.detailsTitle}>SCHEDULE DETAILS</Text>
          </View>

          <View style={styles.detailRow}>
            <View style={styles.iconWrapper}>
              <Feather name="calendar" size={16} color="#0ea5e9" />
            </View>
            <View>
              <Text style={styles.detailLabel}>DATE</Text>
              <Text style={styles.detailValue}>{appointment.date}</Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <View style={styles.iconWrapper}>
              <Feather name="clock" size={16} color="#0ea5e9" />
            </View>
            <View>
              <Text style={styles.detailLabel}>TIME</Text>
              <Text style={styles.detailValue}>{appointment.time}</Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <View style={styles.iconWrapper}>
              <Feather name="map-pin" size={16} color="#0ea5e9" />
            </View>
            <View>
              <Text style={styles.detailLabel}>BRANCH</Text>
              <Text style={styles.detailValue}>{appointment.branch}</Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <View style={styles.iconWrapper}>
              <Feather name="info" size={16} color="#0ea5e9" />
            </View>
            <View>
              <Text style={styles.detailLabel}>TYPE</Text>
              <Text style={styles.detailValue}>{appointment.type || 'Regular Visit'}</Text>
            </View>
          </View>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f8fafc' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 20 },
  backButton: { width: 40, height: 40, backgroundColor: '#e0f2fe', borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginRight: 15 },
  headerTitleContainer: {},
  title: { fontSize: 24, fontWeight: '900', color: '#0f172a' },
  subtitle: { fontSize: 10, color: '#94a3b8', fontWeight: 'bold', marginTop: 2, letterSpacing: 1 },
  container: { flex: 1, paddingHorizontal: 20 },
  profileCard: { backgroundColor: 'white', borderRadius: 20, padding: 20, borderWidth: 1, borderColor: '#e2e8f0', marginBottom: 20 },
  profileTop: { flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 60, height: 60, backgroundColor: '#e0f2fe', borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginRight: 15 },
  infoContainer: { flex: 1 },
  name: { fontSize: 18, fontWeight: 'bold', color: '#0f172a' },
  caseBadge: { backgroundColor: '#e0f2fe', alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, marginTop: 5 },
  caseBadgeText: { fontSize: 10, fontWeight: 'bold', color: '#0ea5e9' },
  actionButtons: { flexDirection: 'row' },
  actionIconBtn: { width: 35, height: 35, backgroundColor: '#f1f5f9', borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginLeft: 8 },
  detailsCard: { backgroundColor: 'white', borderRadius: 20, padding: 20, borderWidth: 1, borderColor: '#e2e8f0', marginBottom: 30 },
  detailsHeaderRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  detailsTitle: { fontSize: 12, fontWeight: 'bold', color: '#64748b', marginLeft: 8 },
  detailRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  iconWrapper: { width: 40, height: 40, backgroundColor: '#f8fafc', borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginRight: 15 },
  detailLabel: { fontSize: 10, fontWeight: 'bold', color: '#94a3b8', marginBottom: 2 },
  detailValue: { fontSize: 14, fontWeight: 'bold', color: '#0f172a' },
});
