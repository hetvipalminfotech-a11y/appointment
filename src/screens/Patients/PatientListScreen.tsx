import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Image, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { getPatients } from '../../store/patientStore';
import { Patient } from '../../store/types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const { width: SCREEN_WIDTH } = Dimensions.get('window');

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
      activeOpacity={0.7}
    >
      <View style={styles.avatar}>
        {item.photoUri ? (
          <Image source={{ uri: item.photoUri }} style={styles.avatarImage} />
        ) : (
          <Feather name="user" size={24} color="#0ea5e9" />
        )}
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.name}>{item.fullName}</Text>
        <Text style={styles.caseId}>{item.caseId}</Text>
        <View style={styles.phoneRow}>
          <Feather name="phone" size={12} color="#0ea5e9" />
          <Text style={styles.phoneText}>{item.phone}</Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.bookButton}
        onPress={() => navigation.navigate('AddAppointment', { patientId: item.id, patientName: item.fullName })}
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
            <View style={styles.countBadge}>
              <Text style={styles.countText}>{patients.length}</Text>
            </View>
          </View>
          <View style={styles.subtitleRow}>
            <View style={styles.blueDot} />
            <Text style={styles.subtitle}>CLINIC PORTAL</Text>
          </View>
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
          <Feather name="search" size={20} color="#94a3b8" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search patients..."
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
    backgroundColor: '#fbfcfe',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: '5%',
    paddingTop: '5%',
    marginBottom: '2%',
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
  countBadge: {
    backgroundColor: '#0ea5e9',
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },
  countText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  subtitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  blueDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#0ea5e9',
    marginRight: 6,
  },
  subtitle: {
    fontSize: 11,
    color: '#94a3b8',
    fontWeight: '800',
    letterSpacing: 1,
  },
  addButton: {
    backgroundColor: '#0ea5e9',
    width: 50,
    height: 50,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#0ea5e9',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  searchRow: {
    flexDirection: 'row',
    paddingHorizontal: '5%',
    marginBottom: '6%',
    marginTop: '4%',
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 25,
    paddingHorizontal: '5%',
    height: 56,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    marginRight: '4%',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#0f172a',
    marginLeft: 10,
  },
  filterButton: {
    width: 56,
    height: 56,
    backgroundColor: 'white',
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#f1f5f9',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  listContainer: {
    paddingHorizontal: '5%',
    paddingBottom: '5%',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 30,
    padding: '4.5%',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: '4%',
    borderWidth: 1,
    borderColor: '#f1f5f9',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
  },
  avatar: {
    width: 56,
    height: 56,
    backgroundColor: '#f0f9ff',
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: '4%',
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
    fontSize: 17,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  caseId: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#cbd5e1',
    marginTop: 2,
    textTransform: 'uppercase',
  },
  phoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  phoneText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#475569',
    marginLeft: 6,
  },
  bookButton: {
    backgroundColor: '#f0f9ff',
    paddingHorizontal: '4%',
    paddingVertical: '3%',
    borderRadius: 12,
  },
  bookButtonText: {
    color: '#0ea5e9',
    fontWeight: '900',
    fontSize: 11,
    letterSpacing: 0.5,
  },
});


