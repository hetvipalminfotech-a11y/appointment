import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, SafeAreaView, Alert, KeyboardAvoidingView, Platform, Keyboard, TouchableWithoutFeedback, Image, Modal } from 'react-native';
import { Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';
import { addPatient } from '../../store/patientStore';
import LibraryDatePicker from '../../components/LibraryDatePicker';
import LibraryDropdown from '../../components/LibraryDropdown';
import LibraryCameraView from '../../components/LibraryCameraView';

export default function AddPatientScreen() {
  const navigation = useNavigation();

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [caseId, setCaseId] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [gender, setGender] = useState<'MALE' | 'FEMALE' | 'OTHER'>('MALE');
  const [referralSource, setReferralSource] = useState('General');
  const [address, setAddress] = useState('');
  const [photoUri, setPhotoUri] = useState<string | undefined>(undefined);
  const [cameraVisible, setCameraVisible] = useState(false);
  const [photoOptionsVisible, setPhotoOptionsVisible] = useState(false);

  const handlePickFromGallery = async () => {
    setPhotoOptionsVisible(false);
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Permission to access library is required to select patient photo!');
        return;
      }

      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setPhotoUri(result.assets[0].uri);
      }
    } catch (err) {
      Alert.alert('Error', 'Failed to pick image from gallery.');
    }
  };



  const REFERRAL_OPTIONS = [
    'General',
    'Google Search',
    'Walk-in',
    'Doctor Referral',
    'Social Media',
    'Friend / Family',
    'Other'
  ];

  const handleCreate = () => {
    const missingFields = [];
    if (!fullName.trim()) missingFields.push('Full Name');
    if (!phone.trim()) missingFields.push('Phone');
    if (!caseId.trim()) missingFields.push('Case ID');
    if (!birthDate) missingFields.push('Birth Date');

    if (missingFields.length > 0) {
      Alert.alert('Required Field Missing', `Please enter the following field(s): ${missingFields.join(', ')}`);
      return;
    }

    addPatient({
      fullName,
      phone,
      caseId,
      birthDate,
      gender,
      referralSource,
      address,
      photoUri,
      billed: 0,
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
          <View style={styles.screenContent}>
              <View style={styles.header}>
                <View style={styles.headerLeft}>
                  <View style={styles.iconContainer}>
                    <Feather name="plus" size={24} color="#0ea5e9" />
                  </View>
                  <View>
                    <Text style={styles.title}>New Patient</Text>
                    <Text style={styles.subtitle}>REGISTRATION FORM</Text>
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
                <View style={styles.row}>
                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>FULL NAME *</Text>
                    <View style={[styles.inputWrapper, styles.activeInputWrapper]}>
                      <Feather name="user" size={16} color="#0ea5e9" style={styles.inputIcon} />
                      <TextInput style={styles.input} placeholder="Name" value={fullName} onChangeText={setFullName} placeholderTextColor="#94a3b8" />
                    </View>
                  </View>
                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>PHONE *</Text>
                    <View style={styles.inputWrapper}>
                      <Feather name="phone" size={16} color="#94a3b8" style={styles.inputIcon} />
                      <TextInput style={styles.input} placeholder="10-digit" keyboardType="phone-pad" value={phone} onChangeText={setPhone} placeholderTextColor="#94a3b8" />
                    </View>
                  </View>
                </View>

                <View style={styles.row}>
                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>CASE ID *</Text>
                    <View style={styles.inputWrapper}>
                      <Feather name="info" size={16} color="#94a3b8" style={styles.inputIcon} />
                      <TextInput style={styles.input} placeholder="ID" value={caseId} onChangeText={setCaseId} placeholderTextColor="#94a3b8" />
                    </View>
                  </View>
                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>BIRTH DATE *</Text>
                    <LibraryDatePicker
                      value={birthDate}
                      onSelect={setBirthDate}
                    />
                  </View>
                </View>

                <Text style={styles.label}>GENDER *</Text>
                <View style={styles.genderRow}>
                  {['MALE', 'FEMALE', 'OTHER'].map((g) => {
                    const isSelected = gender === g;
                    return (
                      <TouchableOpacity
                        key={g}
                        style={[styles.genderOption, isSelected && styles.genderOptionSelected]}
                        onPress={() => setGender(g as any)}
                      >
                        <View style={[styles.radio, isSelected && styles.radioSelected]}>
                          {isSelected && <View style={styles.radioInner} />}
                        </View>
                        <Text style={[styles.genderText, isSelected && styles.genderTextSelected]}>{g}</Text>
                      </TouchableOpacity>
                    )
                  })}
                </View>

                <Text style={styles.label}>REFERRAL SOURCE</Text>
                <LibraryDropdown
                  value={referralSource}
                  onSelect={setReferralSource}
                  options={REFERRAL_OPTIONS}
                  style={{ marginBottom: 20 }}
                />

                <Text style={styles.label}>ADDRESS (OPTIONAL)</Text>
                <View style={[styles.inputWrapper, { marginBottom: 20 }]}>
                  <Feather name="map-pin" size={16} color="#94a3b8" style={styles.inputIcon} />
                  <TextInput style={styles.input} placeholder="Street, Area, City..." value={address} onChangeText={setAddress} placeholderTextColor="#94a3b8" />
                </View>

                <Text style={styles.label}>PROFILE PHOTO (OPTIONAL)</Text>
                {photoUri ? (
                  <View style={styles.photoPreviewContainer}>
                    <Image source={{ uri: photoUri }} style={styles.photoPreview} />
                    <TouchableOpacity 
                      style={styles.removePhotoBtn} 
                      onPress={() => setPhotoUri(undefined)}
                    >
                      <Feather name="trash-2" size={16} color="white" />
                    </TouchableOpacity>
                  </View>
                ) : (
                  <TouchableOpacity style={styles.photoButton} onPress={() => setPhotoOptionsVisible(true)}>
                    <View style={styles.photoButtonInner}>
                      <View style={styles.photoIconCircle}>
                        <Feather name="camera" size={16} color="#0ea5e9" />
                      </View>
                      <Text style={styles.photoButtonText}>CAPTURE PHOTO</Text>
                    </View>
                  </TouchableOpacity>
                )}

                <LibraryCameraView 
                  visible={cameraVisible} 
                  onClose={() => setCameraVisible(false)} 
                  onCapture={(uri) => {
                    setPhotoUri(uri);
                    setCameraVisible(false);
                  }}
                />

                {/* Photo selection options modal */}
                <Modal
                  visible={photoOptionsVisible}
                  animationType="fade"
                  transparent={true}
                  onRequestClose={() => setPhotoOptionsVisible(false)}
                >
                  <TouchableWithoutFeedback onPress={() => setPhotoOptionsVisible(false)}>
                    <View style={styles.modalOverlay}>
                      <TouchableWithoutFeedback>
                        <View style={styles.bottomSheet}>
                          <View style={styles.sheetHeader}>
                            <View style={styles.sheetDragIndicator} />
                            <Text style={styles.sheetTitle}>Profile Photo</Text>
                            <Text style={styles.sheetSubtitle}>Choose an option to set photo</Text>
                          </View>
                          
                          <TouchableOpacity 
                            style={styles.sheetOption} 
                            onPress={() => {
                              setPhotoOptionsVisible(false);
                              setCameraVisible(true);
                            }}
                          >
                            <View style={[styles.sheetOptionIcon, { backgroundColor: '#e0f2fe' }]}>
                              <Feather name="camera" size={20} color="#0ea5e9" />
                            </View>
                            <Text style={styles.sheetOptionText}>Take Photo</Text>
                          </TouchableOpacity>

                          <TouchableOpacity 
                            style={styles.sheetOption} 
                            onPress={handlePickFromGallery}
                          >
                            <View style={[styles.sheetOptionIcon, { backgroundColor: '#f0fdf4' }]}>
                              <Feather name="image" size={20} color="#22c55e" />
                            </View>
                            <Text style={styles.sheetOptionText}>Choose from Gallery</Text>
                          </TouchableOpacity>

                          <TouchableOpacity 
                            style={styles.sheetCancelBtn} 
                            onPress={() => setPhotoOptionsVisible(false)}
                          >
                            <Text style={styles.sheetCancelText}>CANCEL</Text>
                          </TouchableOpacity>
                        </View>
                      </TouchableWithoutFeedback>
                    </View>
                  </TouchableWithoutFeedback>
                </Modal>
              </ScrollView>

              <View style={styles.footerRow}>
                <TouchableOpacity style={styles.createBtn} onPress={handleCreate}>
                  <Text style={styles.createBtnText}>CREATE PROFILE</Text>
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
  screenContent: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: '6%',
    paddingTop: '6%',
    paddingBottom: '4%',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 48,
    height: 48,
    backgroundColor: '#e0f2fe',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0f172a',
  },
  subtitle: {
    fontSize: 10,
    color: '#94a3b8',
    fontWeight: '800',
    letterSpacing: 1,
    marginTop: 2,
  },
  formContainer: {
    flex: 1,
    paddingHorizontal: '6%',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: '5%',
  },
  inputGroup: {
    width: '48%',
  },
  label: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#94a3b8',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#f1f5f9',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 14,
    backgroundColor: '#f8fafc',
  },
  activeInputWrapper: {
    borderColor: '#38bdf8',
    backgroundColor: '#f0f9ff',
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: '#0f172a',
    fontWeight: '600',
  },
  genderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: '6%',
  },
  genderOption: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 20,
    paddingVertical: 14,
    paddingHorizontal: 10,
    flex: 1,
    marginRight: 8,
    backgroundColor: '#f8fafc',
    justifyContent: 'center',
  },
  genderOptionSelected: {
    borderColor: '#38bdf8',
    backgroundColor: '#f0f9ff',
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#cbd5e1',
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioSelected: {
    borderColor: '#0ea5e9',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#0ea5e9',
  },
  genderText: {
    fontSize: 11,
    color: '#64748b',
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  genderTextSelected: {
    color: '#0ea5e9',
  },
  photoButton: {
    borderWidth: 1.5,
    borderColor: '#e2e8f0',
    borderStyle: 'dashed',
    borderRadius: 20,
    paddingVertical: 16,
    backgroundColor: '#f8fafc',
    marginBottom: '8%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoButtonInner: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  photoIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#e0f2fe',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  photoButtonText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#334155',
    letterSpacing: 0.5,
  },
  photoPreviewContainer: {
    position: 'relative',
    width: '30%',
    aspectRatio: 1,
    borderRadius: 20,
    overflow: 'visible',
    marginBottom: '8%',
  },
  photoPreview: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  removePhotoBtn: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#ef4444',
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  footerRow: {
    flexDirection: 'row',
    padding: '5%',
    backgroundColor: 'white',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  createBtn: {
    flex: 2,
    backgroundColor: '#0ea5e9',
    paddingVertical: 16,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: '4%',
    shadowColor: '#0ea5e9',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  createBtnText: {
    color: 'white',
    fontWeight: '800',
    fontSize: 13,
    letterSpacing: 0.5,
  },
  cancelBtn: {
    flex: 1,
    backgroundColor: '#f1f5f9',
    paddingVertical: 16,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelBtnText: {
    color: '#94a3b8',
    fontWeight: '800',
    fontSize: 13,
    letterSpacing: 0.5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.4)',
    justifyContent: 'flex-end',
  },
  bottomSheet: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: '5%',
    paddingBottom: '8%',
    paddingTop: '2%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 10,
  },
  sheetHeader: {
    alignItems: 'center',
    marginBottom: '5%',
  },
  sheetDragIndicator: {
    width: 40,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#e2e8f0',
    marginBottom: '4%',
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  sheetSubtitle: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 4,
  },
  sheetOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: '4%',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  sheetOptionIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: '4%',
  },
  sheetOptionText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#334155',
  },
  sheetCancelBtn: {
    marginTop: '5%',
    backgroundColor: '#f1f5f9',
    paddingVertical: '4%',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sheetCancelText: {
    color: '#64748b',
    fontWeight: 'bold',
    fontSize: 14,
  },
});
