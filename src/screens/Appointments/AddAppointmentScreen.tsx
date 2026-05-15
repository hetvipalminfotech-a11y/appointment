import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Alert, KeyboardAvoidingView, Platform, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation/types';
import { addAppointment } from '../../store/appointmentStore';
import LibraryDatePicker from '../../components/LibraryDatePicker';
import LibraryTimePicker from '../../components/LibraryTimePicker';
import LibraryDropdown from '../../components/LibraryDropdown';

type AddApptRouteProp = RouteProp<RootStackParamList, 'AddAppointment'>;

export default function AddAppointmentScreen() {
  const navigation = useNavigation();
  const route = useRoute<AddApptRouteProp>();

  // Use passed patientId if navigated from patient profile
  const [patientName, setPatientName] = useState(route.params?.patientName || '');
  const [branch, setBranch] = useState('');
  const [doctor, setDoctor] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [type, setType] = useState('');



  const BRANCH_OPTIONS = ['Main Branch', 'Downtown Clinic', 'East Wing', 'West Wing'];
  const APPOINTMENT_TYPES = ['Consultation', 'Regular Checkup', 'Emergency', 'Surgery', 'Follow-up'];

  const handleBook = () => {
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

    addAppointment({
      patientId: route.params.patientId || 'unknown',
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
                  <Feather name="plus" size={20} color="#0ea5e9" />
                </View>
                <View>
                  <Text style={styles.title}>Book Appointment</Text>
                  <Text style={styles.subtitle}>SCHEDULE NEW VISIT</Text>
                </View>
              </View>
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Feather name="x" size={20} color="#64748b" />
              </TouchableOpacity>
            </View>

            <ScrollView
              style={styles.formContainer}
              contentContainerStyle={{ paddingBottom: 40 }}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >

              {/* Patient */}
              <View style={styles.labelRow}>
                <Feather name="users" size={14} color="#0ea5e9" />
                <Text style={styles.labelText}>PATIENT *</Text>
              </View>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  placeholder="Search patient by name or phone..."
                  value={patientName}
                  onChangeText={setPatientName}
                  placeholderTextColor="#94a3b8"
                />
                <Feather name="chevron-down" size={16} color="#94a3b8" />
              </View>

              {/* Branch */}
              <View style={styles.labelRow}>
                <MaterialCommunityIcons name="office-building" size={14} color="#0ea5e9" />
                <Text style={styles.labelText}>BRANCH *</Text>
              </View>
              <LibraryDropdown
                value={branch}
                onSelect={setBranch}
                options={BRANCH_OPTIONS}
                placeholder="Select branch"
                style={{ marginBottom: '6%' }}
              />

              {/* Doctor */}
              <View style={styles.labelRow}>
                <Feather name="user" size={14} color="#0ea5e9" />
                <Text style={styles.labelText}>DOCTOR *</Text>
              </View>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  placeholder="Select doctor"
                  value={doctor}
                  onChangeText={setDoctor}
                  placeholderTextColor="#94a3b8"
                />
                <Feather name="chevron-down" size={16} color="#94a3b8" />
              </View>

              {/* Date */}
              <View style={styles.labelRow}>
                <Feather name="calendar" size={14} color="#0ea5e9" />
                <Text style={styles.labelText}>APPOINTMENT DATE *</Text>
              </View>
              <LibraryDatePicker
                value={date}
                onSelect={setDate}
                placeholder="dd/mm/yyyy"
                style={{ marginBottom: '6%' }}
              />

              {/* Time */}
              <View style={styles.labelRow}>
                <Feather name="clock" size={14} color="#0ea5e9" />
                <Text style={styles.labelText}>PREFERRED TIME *</Text>
              </View>
              <LibraryTimePicker
                value={time}
                onSelect={setTime}
                placeholder="TAP TO PICK SLOT"
                style={{ marginBottom: '6%' }}
              />

              {/* Type */}
              <View style={styles.labelRow}>
                <MaterialCommunityIcons name="stethoscope" size={14} color="#0ea5e9" />
                <Text style={styles.labelText}>APPOINTMENT TYPE (OPTIONAL)</Text>
              </View>
              <LibraryDropdown
                value={type}
                onSelect={setType}
                options={APPOINTMENT_TYPES}
                placeholder="Select appointment type"
                style={{ marginBottom: '8%' }}
              />

            </ScrollView>

            <View style={styles.footerRow}>
              <TouchableOpacity style={styles.createBtn} onPress={handleBook}>
                <Text style={styles.createBtnText}>CONFIRM BOOKING</Text>
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
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: '5%',
    paddingVertical: '4%',
    borderBottomWidth: 1,
    borderBottomColor: '#f8fafc',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 44,
    height: 44,
    backgroundColor: '#f0f9ff',
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: '900',
    color: '#1e293b',
  },
  subtitle: {
    fontSize: 10,
    color: '#94a3b8',
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  formContainer: {
    flex: 1,
    paddingHorizontal: '5%',
    paddingTop: '5%',
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: '3%',
  },
  labelText: {
    fontSize: 11,
    fontWeight: '900',
    color: '#94a3b8',
    marginLeft: 8,
    letterSpacing: 0.5,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0f2fe',
    borderRadius: 16,
    paddingHorizontal: '4%',
    height: 56,
    backgroundColor: '#fbfcfe',
    marginBottom: '6%',
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#1e293b',
    fontWeight: '500',
  },
  footerRow: {
    flexDirection: 'row',
    paddingHorizontal: '5%',
    paddingVertical: '4%',
    borderTopWidth: 1,
    borderTopColor: '#f8fafc',
    backgroundColor: 'white',
  },
  createBtn: {
    flex: 2,
    backgroundColor: '#bae6fd',
    height: 56,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: '3%',
  },
  createBtnText: {
    color: 'white',
    fontWeight: '900',
    fontSize: 14,
    letterSpacing: 0.5,
  },
  cancelBtn: {
    flex: 1,
    backgroundColor: '#f1f5f9',
    height: 56,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelBtnText: {
    color: '#64748b',
    fontWeight: '900',
    fontSize: 13,
    letterSpacing: 0.5,
  },
});

