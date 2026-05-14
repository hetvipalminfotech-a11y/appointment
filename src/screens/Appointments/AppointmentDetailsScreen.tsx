import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, Alert, Dimensions } from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp, useFocusEffect } from '@react-navigation/native';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(customParseFormat);
import { RootStackParamList } from '../../navigation/types';
import { getAppointmentById, deleteAppointment } from '../../store/appointmentStore';
import { Appointment } from '../../store/types';

type DetailsRouteProp = RouteProp<RootStackParamList, 'AppointmentDetails'>;

const { width: SCREEN_WIDTH } = Dimensions.get('window');

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
      {
        text: 'Yes, Cancel', style: 'destructive', onPress: () => {
          deleteAppointment(appointment.id);
          navigation.goBack();
        }
      }
    ]);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Feather name="chevron-left" size={24} color="#0ea5e9" />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.title}>Appointment</Text>
          <View style={styles.subtitleRow}>
            <View style={styles.blueDot} />
            <Text style={styles.subtitle}>CLINIC PORTAL</Text>
          </View>
        </View>
      </View>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.scheduledBadge}>
            <Text style={styles.scheduledBadgeText}>SCHEDULED</Text>
          </View>
          <Text style={styles.patientName}>{appointment.patientName.toUpperCase()}</Text>
          <Text style={styles.sessionDetailText}>PATIENT SESSION DETAIL</Text>
        </View>

        {/* Details Card */}
        <View style={styles.detailsCard}>
          <View style={styles.detailsGrid}>
            <View style={styles.detailItem}>
              <View style={styles.labelRow}>
                <MaterialCommunityIcons name="stethoscope" size={16} color="#bae6fd" />
                <Text style={styles.detailLabelText}>CONSULTANT</Text>
              </View>
              <Text style={styles.detailValueText}>Dr. {appointment.doctor}</Text>
            </View>

            <View style={styles.detailItem}>
              <View style={styles.labelRow}>
                <Feather name="map-pin" size={16} color="#bae6fd" />
                <Text style={styles.detailLabelText}>BRANCH</Text>
              </View>
              <Text style={styles.detailValueText}>{appointment.branch}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.detailsGrid}>
            <View style={styles.detailItem}>
              <View style={styles.labelRow}>
                <Feather name="calendar" size={16} color="#bae6fd" />
                <Text style={styles.detailLabelText}>DATE</Text>
              </View>
              <Text style={styles.detailValueText}>
                {appointment.date && dayjs(appointment.date, 'DD/MM/YYYY').isValid()
                  ? dayjs(appointment.date, 'DD/MM/YYYY').format('D MMMM YYYY')
                  : appointment.date}
              </Text>
            </View>

            <View style={styles.detailItem}>
              <View style={styles.labelRow}>
                <Feather name="clock" size={16} color="#bae6fd" />
                <Text style={styles.detailLabelText}>SESSION TIME</Text>
              </View>
              <Text style={styles.detailValueText}>{appointment.time} - {dayjs(appointment.time, 'hh:mm A').add(15, 'minute').format('HH:mm')}</Text>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <TouchableOpacity style={styles.waitButton} activeOpacity={0.8}>
          <Text style={styles.waitButtonText}>WAIT FOR ARRIVAL WINDOW</Text>
        </TouchableOpacity>

        <View style={styles.bottomActions}>
          <TouchableOpacity
            style={styles.rescheduleButton}
            onPress={() => navigation.navigate('EditAppointment', { appointmentId: appointment.id })}
          >
            <Feather name="edit-3" size={18} color="#0f172a" style={styles.btnIcon} />
            <Text style={styles.rescheduleText}>RESCHEDULE</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.cancelButton} onPress={handleDelete}>
            <Feather name="trash-2" size={18} color="#ef4444" style={styles.btnIcon} />
            <Text style={styles.cancelText}>CANCEL</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fbfcfe' },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: '5%', paddingTop: '3%', marginBottom: '4%' },
  backButton: { width: '12%', aspectRatio: 1, backgroundColor: '#f0f7ff', borderRadius: 999, alignItems: 'center', justifyContent: 'center', marginRight: '4%' },
  headerTitleContainer: { flex: 1 },
  title: { fontSize: 26, fontWeight: '900', color: '#0f172a' },
  subtitleRow: { flexDirection: 'row', alignItems: 'center', marginTop: 2 },
  blueDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#0ea5e9', marginRight: 6 },
  subtitle: { fontSize: 11, color: '#94a3b8', fontWeight: '800', letterSpacing: 1 },
  container: { flex: 1, paddingHorizontal: '5%' },
  profileCard: { backgroundColor: 'white', borderRadius: 32, paddingVertical: '8%', alignItems: 'center', marginBottom: '4%', elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10 },
  scheduledBadge: { backgroundColor: '#f1f5f9', paddingHorizontal: '4%', paddingVertical: '1.5%', borderRadius: 12, marginBottom: '3%' },
  scheduledBadgeText: { fontSize: 10, fontWeight: '900', color: '#475569', letterSpacing: 0.5 },
  patientName: { fontSize: 28, fontWeight: '900', color: '#0f172a', marginBottom: '1%' },
  sessionDetailText: { fontSize: 11, fontWeight: '800', color: '#94a3b8', letterSpacing: 1 },
  detailsCard: { backgroundColor: 'white', borderRadius: 32, padding: '6%', marginBottom: '5%', elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10 },
  detailsGrid: { flexDirection: 'row', justifyContent: 'space-between' },
  detailItem: { flex: 1 },
  labelRow: { flexDirection: 'row', alignItems: 'center', marginBottom: '10%' },
  detailLabelText: { fontSize: 11, fontWeight: '900', color: '#94a3b8', marginLeft: 6, letterSpacing: 0.5 },
  detailValueText: { fontSize: 16, fontWeight: 'bold', color: '#1e293b' },
  divider: { height: 1, backgroundColor: '#f1f5f9', marginVertical: '4%' },
  waitButton: { backgroundColor: '#cbd5e1', borderRadius: 999, height: 56, alignItems: 'center', justifyContent: 'center', marginBottom: '3%' },
  waitButtonText: { color: 'white', fontWeight: '900', fontSize: 13, letterSpacing: 0.5 },
  bottomActions: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: '5%' },
  rescheduleButton: { flex: 1, flexDirection: 'row', height: 56, backgroundColor: 'white', borderRadius: 28, borderWidth: 1, borderColor: '#e2e8f0', alignItems: 'center', justifyContent: 'center', marginRight: '3%' },
  rescheduleText: { fontSize: 12, fontWeight: '900', color: '#0f172a', letterSpacing: 0.5 },
  cancelButton: { flex: 1, flexDirection: 'row', height: 56, backgroundColor: '#fff1f2', borderRadius: 28, alignItems: 'center', justifyContent: 'center' },
  cancelText: { fontSize: 12, fontWeight: '900', color: '#ef4444', letterSpacing: 0.5 },
  btnIcon: { marginRight: 8 },
});

