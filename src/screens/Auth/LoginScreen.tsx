import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, StatusBar, KeyboardAvoidingView, Platform, Image, ScrollView, Dimensions, SafeAreaView } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { login } from '../../store/authStore';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = () => {
    const trimmedPhone = phone.trim();
    const trimmedPassword = password.trim();

    // Exact Validation for empty fields
    if (trimmedPhone === '') {
      Alert.alert('Validation Error', 'Please enter your phone number');
      return;
    }

    if (trimmedPassword === '') {
      Alert.alert('Validation Error', 'Please enter your password');
      return;
    }

    // Exact Validation for 10 digit phone number
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(trimmedPhone)) {
      Alert.alert('Validation Error', 'Please enter a valid 10-digit phone number');
      return;
    }

    login(trimmedPhone);
    onLogin();
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Absolute Background Canvas: Keeps blue behind status bar and gray behind footer */}
      <View style={styles.bgTop} />
      <View style={styles.bgBottom} />

      {/* Binds the scrollview content area so it can never slide above the status bar! */}
      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
        >
          <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            bounces={false}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* Top Header Section */}
            <View style={styles.topHeader}>
              <View style={styles.logoWrapper}>
                <Image 
                  source={require('../../../assets/dental_logo.png')} 
                  style={styles.logoImage}
                  resizeMode="contain"
                />
              </View>
              <Text style={styles.title}>RAHUL'S DENTAL</Text>
              <Text style={styles.title}>CARE</Text>
              <Text style={styles.subtitle}>& IMPLANT CENTER</Text>
            </View>

            {/* Floating Inset Card */}
            <View style={styles.cardWrapper}>
              <View style={styles.card}>
                <Text style={styles.welcome}>WELCOME BACK</Text>
                <Text style={styles.instruction}>PLEASE SIGN IN TO CONTINUE</Text>

                <Text style={styles.label}>PHONE NUMBER</Text>
                <View style={styles.inputContainer}>
                  <Feather name="phone" size={20} color="#94a3b8" style={styles.icon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Enter phone number"
                    placeholderTextColor="#cbd5e1"
                    keyboardType="phone-pad"
                    value={phone}
                    onChangeText={setPhone}
                    maxLength={10}
                  />
                </View>

                <Text style={styles.label}>PASSWORD</Text>
                <View style={styles.inputContainer}>
                  <Feather name="lock" size={20} color="#94a3b8" style={styles.icon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Enter your password"
                    placeholderTextColor="#cbd5e1"
                    secureTextEntry={!showPassword}
                    value={password}
                    onChangeText={setPassword}
                  />
                  <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                    <Feather name={showPassword ? 'eye-off' : 'eye'} size={20} color="#94a3b8" />
                  </TouchableOpacity>
                </View>

                <TouchableOpacity style={styles.button} onPress={handleLogin}>
                  <Text style={styles.buttonText}>SIGN IN ACCOUNT</Text>
                </TouchableOpacity>

                <View style={styles.footerContainer}>
                  <Text style={styles.footer}>SECURE ACCESS PORTAL - © 2026</Text>
                </View>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f5f9',
  },
  bgTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: SCREEN_HEIGHT * 0.45,
    backgroundColor: '#38bdf8', // Static blue backdrop under status bar!
  },
  bgBottom: {
    position: 'absolute',
    top: SCREEN_HEIGHT * 0.45,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#f1f5f9', // Static gray backdrop under footer!
  },
  topHeader: {
    width: '100%',
    height: SCREEN_HEIGHT * 0.42,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 15, // Minimal top padding as SafeArea handles notch spacing!
    paddingBottom: 40,
  },
  logoWrapper: {
    width: 90,
    height: 90,
    backgroundColor: 'white',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  logoImage: {
    width: '90%',
    height: '90%',
    borderRadius: 16,
  },
  title: {
    color: 'white',
    fontSize: 28,
    fontWeight: '900',
    textAlign: 'center',
    lineHeight: 32,
    letterSpacing: 0.5,
  },
  subtitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: '800',
    marginTop: 6,
    textAlign: 'center',
    letterSpacing: 0.5,
    opacity: 0.95,
  },
  cardWrapper: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 24,
    marginTop: -60, // Elegantly overlaps the floating card over the blue header boundary!
    zIndex: 10,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 36,
    paddingHorizontal: 24,
    paddingVertical: 28,
    width: '100%',
    height: '100%', // Fits the remaining view height seamlessly
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 10,
  },
  welcome: {
    fontSize: 22,
    fontWeight: '900',
    color: '#0f172a',
    marginTop: 8,
    letterSpacing: 0.5,
  },
  instruction: {
    fontSize: 10.5,
    color: '#94a3b8',
    fontWeight: '800',
    letterSpacing: 1,
    marginBottom: 28,
    marginTop: 4,
  },
  label: {
    alignSelf: 'flex-start',
    fontSize: 11,
    fontWeight: '800',
    color: '#64748b',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#f1f5f9',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 20,
    width: '100%',
    backgroundColor: '#f8fafc',
    shadowColor: '#e2e8f0',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#0f172a',
    fontWeight: '600',
  },
  eyeIcon: {
    paddingHorizontal: 4,
  },
  button: {
    backgroundColor: '#0ea5e9',
    width: '100%',
    paddingVertical: 16,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    shadowColor: '#0ea5e9',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  footerContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingBottom: 4,
  },
  footer: {
    fontSize: 9,
    color: '#cbd5e1',
    fontWeight: '800',
    letterSpacing: 1.5,
  },
});
