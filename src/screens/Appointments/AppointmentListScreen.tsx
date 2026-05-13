import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, SafeAreaView } from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { getAppointments } from '../../store/appointmentStore';
import { Appointment } from '../../store/types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function AppointmentListScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setAppointments(getAppointments());
    });
    return unsubscribe;
  }, [navigation]);

  const filteredAppointments = appointments.filter(a => 
    a.patientName.toLowerCase().includes(search.toLowerCase())
  );

  const renderItem = ({ item }: { item: Appointment }) => (
    <TouchableOpacity 
      style={styles.card}
      onPress={() => navigation.navigate('AppointmentDetails', { appointmentId: item.id })}
    >
      <View style={styles.avatar}>
        <Feather name="calendar" size={24} color="#0ea5e9" />
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.name}>{item.patientName}</Text>
        <Text style={styles.caseId}>{item.date} at {item.time}</Text>
        <View style={styles.phoneContainer}>
          <Feather name="user" size={12} color="#0ea5e9" />
          <Text style={styles.phoneText}>Dr. {item.doctor}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <View style={styles.titleRow}>
            <Text style={styles.title}>Appointments</Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{appointments.length}</Text>
            </View>
          </View>
          <Text style={styles.subtitle}>• CLINIC PORTAL</Text>
        </View>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => navigation.navigate('AddAppointment', {})}
        >
          <Feather name="plus" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <View style={styles.searchRow}>
        <View style={styles.searchContainer}>
          <Feather name="search" size={20} color="#94a3b8" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search appointments..."
            placeholderTextColor="#94a3b8"
            value={search}
            onChangeText={setSearch}
          />
        </View>
        <TouchableOpacity style={styles.filterButton}>
          <Ionicons name="filter-outline" size={24} color="#64748b" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredAppointments}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 20, paddingBottom: 10 },
  titleRow: { flexDirection: 'row', alignItems: 'center' },
  title: { fontSize: 28, fontWeight: '900', color: '#0f172a' },
  badge: { backgroundColor: '#0ea5e9', borderRadius: 12, paddingHorizontal: 8, paddingVertical: 2, marginLeft: 10 },
  badgeText: { color: 'white', fontWeight: 'bold', fontSize: 12 },
  subtitle: { fontSize: 12, color: '#94a3b8', fontWeight: 'bold', marginTop: 5, letterSpacing: 1 },
  addButton: { backgroundColor: '#0ea5e9', width: 45, height: 45, borderRadius: 22.5, alignItems: 'center', justifyContent: 'center', shadowColor: '#0ea5e9', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 5, elevation: 5 },
  searchRow: { flexDirection: 'row', paddingHorizontal: 20, marginBottom: 15 },
  searchContainer: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', borderRadius: 20, paddingHorizontal: 15, height: 50, borderWidth: 1, borderColor: '#e2e8f0', marginRight: 10 },
  searchIcon: { marginRight: 10 },
  searchInput: { flex: 1, fontSize: 16, color: '#0f172a' },
  filterButton: { width: 50, height: 50, backgroundColor: 'white', borderRadius: 25, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#e2e8f0' },
  listContainer: { paddingHorizontal: 20, paddingBottom: 20 },
  card: { backgroundColor: 'white', borderRadius: 20, padding: 15, flexDirection: 'row', alignItems: 'center', marginBottom: 15, borderWidth: 1, borderColor: '#e2e8f0' },
  avatar: { width: 50, height: 50, backgroundColor: '#e0f2fe', borderRadius: 15, alignItems: 'center', justifyContent: 'center', marginRight: 15 },
  infoContainer: { flex: 1 },
  name: { fontSize: 16, fontWeight: 'bold', color: '#0f172a' },
  caseId: { fontSize: 12, color: '#94a3b8', fontWeight: '600', marginTop: 2 },
  phoneContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  phoneText: { fontSize: 12, color: '#0f172a', fontWeight: 'bold', marginLeft: 5 },
});
