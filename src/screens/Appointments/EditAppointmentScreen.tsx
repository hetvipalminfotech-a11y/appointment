import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, SafeAreaView, Alert, KeyboardAvoidingView, Platform, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation/types';
import { getAppointmentById, updateAppointment } from '../../store/appointmentStore';
import LibraryDatePicker from '../../components/LibraryDatePicker';
import LibraryTimePicker from '../../components/LibraryTimePicker';
import LibraryDropdown from '../../components/LibraryDropdown';

type EditApptRouteProp = RouteProp<RootStackParamList, 'EditAppointment'>;

export default function EditAppointmentScreen() {
  const navigation = useNavigation();
  const route = useRoute<EditApptRouteProp>();
  const { appointmentId } = route.params;

  const [patientName, setPatientName] = useState('');
  const [branch, setBranch] = useState('');
  const [doctor, setDoctor] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [type, setType] = useState('');



  const BRANCH_OPTIONS = ['Main Branch', 'Downtown Clinic', 'East Wing', 'West Wing'];
  const APPOINTMENT_TYPES = ['Consultation', 'Regular Checkup', 'Emergency', 'Surgery', 'Follow-up'];

  useEffect(() => {
    const appointment = getAppointmentById(appointmentId);
    if (appointment) {
      setPatientName(appointment.patientName);
      setBranch(appointment.branch);
      setDoctor(appointment.doctor);
      setDate(appointment.date);
      setTime(appointment.time);
      setType(appointment.type || '');
    } else {
      Alert.alert('Error', 'Appointment not found');
      navigation.goBack();
    }
  }, [appointmentId]);

  const handleSave = () => {
    const missingFields = [];
    if (!patientName.trim()) missingFields.push('Patient');
    if (!branch) missingFields.push('Branch');
    if (!doctor.trim()) missingFields.push('Doctor');
    if (!date) missingFields.push('Appointment Date');
    if (!time) missingFields.push('Preferred Time');

    if (missingFields.length > 0) {
      Alert.alert('Required Field Missing', `Please provide the following: ${missingFields.join(', ')}`);
      return;
    }

    updateAppointment(appointmentId, {
      patientName,
      branch,
      doctor,
      date,
      time,
      type
    });

    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={{ flex: 1 }}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.iconContainer}>
              <Feather name="edit" size={24} color="#0ea5e9" />
            </View>
            <View>
              <Text style={styles.title}>Edit Appointment</Text>
              <Text style={styles.subtitle}>UPDATE VISIT SCHEDULE</Text>
            </View>
          </View>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Feather name="x" size={24} color="#64748b" />
            </TouchableOpacity>
          </View>

          <ScrollView 
            style={styles.formContainer} 
            contentContainerStyle={{ paddingBottom: 80 }}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
          >

          <Text style={styles.label}>PATIENT *</Text>
          <View style={[styles.inputWrapper, { marginBottom: 20 }]}>
            <Feather name="users" size={16} color="#94a3b8" style={styles.inputIcon} />
            <TextInput style={styles.input} placeholder="Patient name" value={patientName} onChangeText={setPatientName} />
          </View>

          <Text style={styles.label}>BRANCH *</Text>
          <LibraryDropdown
            value={branch}
            onSelect={setBranch}
            options={BRANCH_OPTIONS}
            placeholder="Select branch"
            icon={<Feather name="box" size={16} color="#94a3b8" style={styles.inputIcon} />}
            style={{ marginBottom: 20 }}
          />

          <Text style={styles.label}>DOCTOR *</Text>
          <View style={[styles.inputWrapper, { marginBottom: 20 }]}>
            <Feather name="user" size={16} color="#94a3b8" style={styles.inputIcon} />
            <TextInput style={styles.input} placeholder="Select doctor" value={doctor} onChangeText={setDoctor} />
            <Feather name="chevron-down" size={16} color="#94a3b8" />
          </View>

          <Text style={styles.label}>APPOINTMENT DATE *</Text>
          <LibraryDatePicker
            value={date}
            onSelect={setDate}
            placeholder="dd/mm/yyyy"
            style={{ marginBottom: 20 }}
          />

          <Text style={styles.label}>PREFERRED TIME *</Text>
          <LibraryTimePicker
            value={time}
            onSelect={setTime}
            style={{ marginBottom: 20 }}
          />

          <Text style={styles.label}>APPOINTMENT TYPE (OPTIONAL)</Text>
          <LibraryDropdown
            value={type}
            onSelect={setType}
            options={APPOINTMENT_TYPES}
            placeholder="Select appointment type"
            style={{ marginBottom: 30 }}
          />

        </ScrollView>

        <View style={styles.footerRow}>
          <TouchableOpacity style={styles.createBtn} onPress={handleSave}>
            <Text style={styles.createBtnText}>SAVE CHANGES</Text>
          </TouchableOpacity>
            <TouchableOpacity style={styles.cancelBtn} onPress={() => navigation.goBack()}>
              <Text style={styles.cancelBtnText}>CANCEL</Text>
            </TouchableOpacity>
          </View>
        </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#ffffff' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: '4%', borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
  headerLeft: { flexDirection: 'row', alignItems: 'center' },
  iconContainer: { width: '10%', aspectRatio: 1, backgroundColor: '#e0f2fe', borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginRight: '3%' },
  title: { fontSize: 20, fontWeight: 'bold', color: '#0f172a' },
  subtitle: { fontSize: 10, color: '#94a3b8', fontWeight: 'bold' },
  formContainer: { flex: 1, padding: '4%' },
  label: { fontSize: 10, fontWeight: 'bold', color: '#64748b', marginBottom: '2%' },
  inputWrapper: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 12, paddingHorizontal: '3%', paddingVertical: '2.5%', backgroundColor: '#f8fafc' },
  inputIcon: { marginRight: '2%' },
  input: { flex: 1, fontSize: 14, color: '#0f172a' },
  timeWrapper: { borderStyle: 'dashed', backgroundColor: '#f8fafc' },
  timeIconBtn: { width: '12%', aspectRatio: 1, backgroundColor: '#f1f5f9', borderRadius: 999, alignItems: 'center', justifyContent: 'center' },
  footerRow: { flexDirection: 'row', padding: '4%', borderTopWidth: 1, borderTopColor: '#f1f5f9', backgroundColor: 'white' },
  createBtn: { flex: 2, backgroundColor: '#0ea5e9', paddingVertical: '3.5%', borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginRight: '3%' },
  createBtnText: { color: 'white', fontWeight: 'bold', fontSize: 14 },
  cancelBtn: { flex: 1, backgroundColor: '#f8fafc', paddingVertical: '3.5%', borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  cancelBtnText: { color: '#94a3b8', fontWeight: 'bold', fontSize: 14 },
});
