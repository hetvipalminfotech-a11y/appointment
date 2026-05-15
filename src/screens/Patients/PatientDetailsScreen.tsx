import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp, useFocusEffect } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation/types';
import { getPatientById, deletePatient } from '../../store/patientStore';
import { Patient } from '../../store/types';

type DetailsRouteProp = RouteProp<RootStackParamList, 'PatientDetails'>;

export default function PatientDetailsScreen() {
  const navigation = useNavigation();
  const route = useRoute<DetailsRouteProp>();
  const [patient, setPatient] = useState<Patient | undefined>(undefined);

  useFocusEffect(
    useCallback(() => {
      const p = getPatientById(route.params.patientId);
      setPatient(p);
    }, [route.params.patientId])
  );

  if (!patient) return null;

  const handleDelete = () => {
    Alert.alert('Delete Patient', 'Are you sure you want to delete this patient?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete', style: 'destructive', onPress: () => {
          deletePatient(patient.id);
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
          <Text style={styles.title}>Patient Profile</Text>
          <Text style={styles.subtitle}>• CLINIC PORTAL</Text>
        </View>
      </View>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.profileCard}>
          <View style={styles.profileTop}>
            <View style={styles.avatar}>
              {patient.photoUri ? (
                <Image source={{ uri: patient.photoUri }} style={styles.avatarImage} />
              ) : (
                <Feather name="users" size={24} color="#0ea5e9" />
              )}
            </View>
            <View style={styles.infoContainer}>
              <Text style={styles.name}>{patient.fullName}</Text>
              <View style={styles.caseBadge}>
                <Text style={styles.caseBadgeText}>{patient.caseId}</Text>
              </View>
            </View>
            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={styles.actionIconBtn}
                onPress={() => navigation.navigate('AddAppointment', {
                  patientId: patient.id,
                  patientName: patient.fullName
                })}
              >
                <Feather name="calendar" size={16} color="#0ea5e9" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionIconBtn} onPress={() => navigation.navigate('EditPatient', { patientId: patient.id })}>
                <Feather name="edit-2" size={16} color="#64748b" />
              </TouchableOpacity>
              <TouchableOpacity style={[styles.actionIconBtn, { backgroundColor: '#fee2e2' }]} onPress={handleDelete}>
                <Feather name="trash-2" size={16} color="#ef4444" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>BILLED</Text>
              <Text style={styles.statValueGreen}>₹{patient.billed}</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>APPOINTMENTS</Text>
              <Text style={styles.statValueBlue}>0</Text>
            </View>
          </View>
        </View>

        <View style={styles.tabsContainer}>
          <TouchableOpacity style={styles.tabActive}>
            <Text style={styles.tabTextActive}>Info</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tabInactive}>
            <Text style={styles.tabTextInactive}>Appointments 0</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tabInactive}>
            <Text style={styles.tabTextInactive}>Invoices 0</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.detailsCard}>
          <View style={styles.detailsHeaderRow}>
            <Feather name="info" size={16} color="#0ea5e9" />
            <Text style={styles.detailsTitle}>DEMOGRAPHICS & CONTACT</Text>
          </View>

          <View style={styles.detailRow}>
            <View style={styles.iconWrapper}>
              <Feather name="phone" size={16} color="#0ea5e9" />
            </View>
            <View>
              <Text style={styles.detailLabel}>MOBILE</Text>
              <Text style={styles.detailValue}>{patient.phone}</Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <View style={styles.iconWrapper}>
              <Feather name="calendar" size={16} color="#0ea5e9" />
            </View>
            <View>
              <Text style={styles.detailLabel}>DATE OF BIRTH</Text>
              <Text style={styles.detailValue}>{patient.birthDate}</Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <View style={styles.iconWrapper}>
              <Feather name="info" size={16} color="#0ea5e9" />
            </View>
            <View>
              <Text style={styles.detailLabel}>REFERRAL</Text>
              <Text style={styles.detailValue}>{patient.referralSource || 'None'}</Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <View style={styles.iconWrapper}>
              <Feather name="map-pin" size={16} color="#0ea5e9" />
            </View>
            <View>
              <Text style={styles.detailLabel}>ADDRESS</Text>
              <Text style={styles.detailValue}>{patient.address || 'Not Provided'}</Text>
            </View>
          </View>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    backgroundColor: '#e0f2fe',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  headerTitleContainer: {},
  title: {
    fontSize: 24,
    fontWeight: '900',
    color: '#0f172a',
  },
  subtitle: {
    fontSize: 10,
    color: '#94a3b8',
    fontWeight: 'bold',
    marginTop: 2,
    letterSpacing: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  profileCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 20,
  },
  profileTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 60,
    height: 60,
    backgroundColor: '#e0f2fe',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  infoContainer: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  caseBadge: {
    backgroundColor: '#e0f2fe',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginTop: 5,
  },
  caseBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#0ea5e9',
  },
  actionButtons: {
    flexDirection: 'row',
  },
  actionIconBtn: {
    width: 35,
    height: 35,
    backgroundColor: '#f1f5f9',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  statsRow: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    paddingTop: 20,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    backgroundColor: '#f1f5f9',
  },
  statLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#64748b',
    marginBottom: 5,
  },
  statValueGreen: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#10b981',
  },
  statValueBlue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0ea5e9',
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#f1f5f9',
    borderRadius: 12,
    padding: 5,
    marginBottom: 20,
  },
  tabActive: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  tabInactive: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
  },
  tabTextActive: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#0ea5e9',
  },
  tabTextInactive: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#64748b',
  },
  detailsCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 30,
  },
  detailsHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  detailsTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#64748b',
    marginLeft: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  iconWrapper: {
    width: 40,
    height: 40,
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  detailLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#94a3b8',
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0f172a',
  },
});