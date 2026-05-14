import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, SafeAreaView, Dimensions } from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(customParseFormat);
import { RootStackParamList } from '../../navigation/types';
import { getAppointments } from '../../store/appointmentStore';
import { Appointment } from '../../store/types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const { width: SCREEN_WIDTH } = Dimensions.get('window');

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
      activeOpacity={0.7}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.patientName}>{item.patientName}</Text>
        <View style={styles.statusBadge}>
          <Text style={styles.statusText}>SCHEDULED</Text>
        </View>
      </View>

      <View style={styles.doctorRow}>
        <MaterialCommunityIcons name="stethoscope" size={14} color="#bae6fd" />
        <Text style={styles.doctorName}>DR. {item.doctor.toUpperCase()}</Text>
      </View>

      <View style={styles.dateTimeRow}>
        <Text style={styles.timeText}>{item.time} - 14:15</Text>
        <View style={styles.dot} />
        <Text style={styles.dateText}>
          {item.date && dayjs(item.date, 'DD/MM/YYYY').isValid() 
            ? dayjs(item.date, 'DD/MM/YYYY').format('D MMMM YYYY')
            : item.date}
        </Text>
      </View>

      <View style={styles.locationRow}>
        <Feather name="map-pin" size={14} color="#0ea5e9" />
        <Text style={styles.locationText}>{item.branch.toUpperCase()}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <View style={styles.titleRow}>
            <Text style={styles.title}>Appointments</Text>
            <View style={styles.countBadge}>
              <Text style={styles.countText}>{appointments.length}</Text>
            </View>
          </View>
          <View style={styles.subtitleRow}>
            <View style={styles.blueDot} />
            <Text style={styles.subtitle}>CLINIC PORTAL</Text>
          </View>
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
          <Feather name="search" size={20} color="#94a3b8" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by name or |"
            placeholderTextColor="#94a3b8"
            value={search}
            onChangeText={setSearch}
          />
        </View>
        <TouchableOpacity style={styles.filterButton}>
          <MaterialCommunityIcons name="filter-variant" size={24} color="#64748b" />
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
  container: { flex: 1, backgroundColor: '#fbfcfe' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: '5%', paddingTop: '5%', marginBottom: '2%' },
  titleRow: { flexDirection: 'row', alignItems: 'center' },
  title: { fontSize: 28, fontWeight: '900', color: '#0f172a' },
  countBadge: { backgroundColor: '#0ea5e9', width: 24, height: 24, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginLeft: 10 },
  countText: { color: 'white', fontWeight: 'bold', fontSize: 12 },
  subtitleRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  blueDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#0ea5e9', marginRight: 6 },
  subtitle: { fontSize: 11, color: '#94a3b8', fontWeight: '800', letterSpacing: 1 },
  addButton: { backgroundColor: '#0ea5e9', width: 50, height: 50, borderRadius: 15, alignItems: 'center', justifyContent: 'center', elevation: 4, shadowColor: '#0ea5e9', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 },
  searchRow: { flexDirection: 'row', paddingHorizontal: '5%', marginBottom: '6%', marginTop: '4%' },
  searchContainer: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', borderRadius: 25, paddingHorizontal: '5%', height: 56, borderWidth: 1, borderColor: '#f1f5f9', marginRight: '4%', elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 5 },
  searchInput: { flex: 1, fontSize: 15, color: '#0f172a', marginLeft: 10 },
  filterButton: { width: 56, height: 56, backgroundColor: 'white', borderRadius: 28, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#f1f5f9', elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 5 },
  listContainer: { paddingHorizontal: '5%', paddingBottom: '5%' },
  card: { backgroundColor: 'white', borderRadius: 30, padding: '6%', marginBottom: '5%', borderWidth: 1, borderColor: '#f1f5f9', elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.03, shadowRadius: 10 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2%' },
  patientName: { fontSize: 18, fontWeight: 'bold', color: '#1e293b' },
  statusBadge: { backgroundColor: '#f1f5f9', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 10 },
  statusText: { fontSize: 10, fontWeight: '900', color: '#64748b' },
  doctorRow: { flexDirection: 'row', alignItems: 'center', marginBottom: '3%' },
  doctorName: { fontSize: 12, color: '#94a3b8', fontWeight: '800', marginLeft: 6, letterSpacing: 0.5 },
  dateTimeRow: { flexDirection: 'row', alignItems: 'center', marginBottom: '3%' },
  timeText: { fontSize: 15, color: '#0ea5e9', fontWeight: '900' },
  dot: { width: 4, height: 4, borderRadius: 2, backgroundColor: '#cbd5e1', marginHorizontal: 10 },
  dateText: { fontSize: 14, color: '#94a3b8', fontWeight: '700' },
  locationRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' },
  locationText: { fontSize: 11, color: '#64748b', fontWeight: '800', marginLeft: 5, letterSpacing: 0.5 },
});

