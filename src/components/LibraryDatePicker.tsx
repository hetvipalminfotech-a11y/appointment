import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import dayjs from 'dayjs';
import { Feather } from '@expo/vector-icons';

interface LibraryDatePickerProps {
  value: string;
  onSelect: (dateStr: string) => void;
  placeholder?: string;
  style?: any;
  error?: boolean;
}

export default function LibraryDatePicker({
  value,
  onSelect,
  placeholder = 'dd/mm/yyyy',
  style,
  error
}: LibraryDatePickerProps) {
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date: Date) => {
    const formattedDate = dayjs(date).format('DD/MM/YYYY');
    onSelect(formattedDate);
    hideDatePicker();
  };

  // Parse current value for the picker, default to current date if invalid
  const parsedDate = dayjs(value, 'DD/MM/YYYY');
  const initialDate = (value && parsedDate.isValid()) ? parsedDate.toDate() : new Date();

  return (
    <View style={[{ width: '100%' }, style]}>
      <TouchableOpacity 
        style={[
          styles.inputWrapper, 
          error && styles.errorInputWrapper,
          !error && value && styles.activeInputWrapper
        ]} 
        onPress={showDatePicker}
      >
        <Text style={[styles.input, !value && { color: '#94a3b8' }]}>
          {value || placeholder}
        </Text>
        <Feather name="calendar" size={16} color={error ? "#ef4444" : "#1e293b"} />
      </TouchableOpacity>

      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        date={initialDate}
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
        maximumDate={new Date()} // Usually birth dates aren't in the future
      />
    </View>
  );
}

const styles = StyleSheet.create({
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0f2fe',
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 56,
    backgroundColor: '#fbfcfe',
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#0f172a',
    fontWeight: '600',
  },
  activeInputWrapper: {
    borderColor: '#38bdf8',
    backgroundColor: '#f0f9ff',
  },
  errorInputWrapper: {
    borderColor: '#ef4444',
    backgroundColor: '#fef2f2',
  },
});
