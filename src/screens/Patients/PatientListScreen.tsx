import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, SafeAreaView, Image } from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { getPatients } from '../../store/patientStore';
import { Patient } from '../../store/types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function PatientListScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setPatients(getPatients());
    });
    return unsubscribe;
  }, [navigation]);

  const filteredPatients = patients.filter(p =>
    p.fullName.toLowerCase().includes(search.toLowerCase()) ||
    p.phone.includes(search)
  );

  const renderItem = ({ item }: { item: Patient }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('PatientDetails', { patientId: item.id })}
    >
      <View style={styles.avatar}>
        {item.photoUri ? (
          <Image source={{ uri: item.photoUri }} style={styles.avatarImage} />
        ) : (
          <Feather name="users" size={24} color="#0ea5e9" />
        )}
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.name}>{item.fullName}</Text>
        <Text style={styles.caseId}>{item.caseId}</Text>
        <View style={styles.phoneContainer}>
          <Feather name="phone" size={12} color="#0ea5e9" />
          <Text style={styles.phoneText}>{item.phone}</Text>
        </View>
      </View>
      <TouchableOpacity
        style={styles.bookButton}
        onPress={() => navigation.navigate('AddAppointment', { patientId: item.id })}
      >
        <Text style={styles.bookButtonText}>BOOK NOW</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <View style={styles.titleRow}>
            <Text style={styles.title}>Patients</Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{patients.length}</Text>
            </View>
          </View>
          <Text style={styles.subtitle}>• CLINIC PORTAL</Text>
        </View>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('AddPatient')}
        >
          <Feather name="plus" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <View style={styles.searchRow}>
        <View style={styles.searchContainer}>
          <Feather name="search" size={20} color="#94a3b8" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search patients..."
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
        data={filteredPatients}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: '4%',
    paddingTop: '4%',
    paddingBottom: '2%',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: '#0f172a',
  },
  badge: {
    backgroundColor: '#0ea5e9',
    borderRadius: 12,
    paddingHorizontal: '2%',
    paddingVertical: '0.5%',
    marginLeft: '2%',
  },
  badgeText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  subtitle: {
    fontSize: 12,
    color: '#94a3b8',
    fontWeight: 'bold',
    marginTop: '1%',
    letterSpacing: 1,
  },
  addButton: {
    backgroundColor: '#0ea5e9',
    width: '10%',
    aspectRatio: 1,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0ea5e9',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  searchRow: {
    flexDirection: 'row',
    paddingHorizontal: '4%',
    marginBottom: '3%',
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 20,
    paddingHorizontal: '3%',
    paddingVertical: '2.5%',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginRight: '2%',
  },
  searchIcon: {
    marginRight: '2%',
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#0f172a',
  },
  filterButton: {
    width: '12%',
    aspectRatio: 1,
    backgroundColor: 'white',
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  listContainer: {
    paddingHorizontal: '4%',
    paddingBottom: '4%',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: '3%',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: '3%',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  avatar: {
    width: '15%',
    aspectRatio: 1,
    backgroundColor: '#e0f2fe',
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: '3%',
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
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  caseId: {
    fontSize: 12,
    color: '#94a3b8',
    fontWeight: '600',
    marginTop: '0.5%',
  },
  phoneContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: '0.8%',
  },
  phoneText: {
    fontSize: 12,
    color: '#0f172a',
    fontWeight: 'bold',
    marginLeft: '1%',
  },
  bookButton: {
    backgroundColor: '#f0f9ff',
    paddingHorizontal: '3%',
    paddingVertical: '2%',
    borderRadius: 10,
  },
  bookButtonText: {
    color: '#0ea5e9',
    fontWeight: 'bold',
    fontSize: 12,
  },
});
