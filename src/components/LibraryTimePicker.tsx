import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { Feather } from '@expo/vector-icons';
import dayjs from 'dayjs';

interface LibraryTimePickerProps {
  value: string;
  onSelect: (timeStr: string) => void;
  placeholder?: string;
  style?: any;
}

export default function LibraryTimePicker({
  value,
  onSelect,
  placeholder = 'TAP TO PICK SLOT',
  style
}: LibraryTimePickerProps) {
  const [isPickerVisible, setPickerVisibility] = useState(false);

  const showPicker = () => {
    setPickerVisibility(true);
  };

  const hidePicker = () => {
    setPickerVisibility(false);
  };

  const handleConfirm = (date: Date) => {
    const formattedTime = dayjs(date).format('hh:mm A');
    onSelect(formattedTime);
    hidePicker();
  };

  // Convert current value back to Date for the picker's initial value
  const getInitialDate = () => {
    if (!value) return new Date();
    try {
      const parsed = dayjs(value, 'hh:mm A');
      if (parsed.isValid()) {
        return parsed.toDate();
      }
      return new Date();
    } catch (e) {
      return new Date();
    }
  };

  return (
    <View style={[{ width: '100%' }, style]}>
      <TouchableOpacity 
        style={[styles.inputWrapper, styles.timeWrapper]} 
        onPress={showPicker}
        activeOpacity={0.7}
      >
        <Text style={[styles.input, !value && { color: '#94a3b8' }]}>
          {value || placeholder}
        </Text>
        <View style={styles.timeIconBtn}>
          <Feather name="clock" size={16} color="#94a3b8" />
        </View>
      </TouchableOpacity>

      <DateTimePickerModal
        isVisible={isPickerVisible}
        mode="time"
        date={getInitialDate()}
        onConfirm={handleConfirm}
        onCancel={hidePicker}
        is24Hour={false}
        textColor="#0f172a"
        confirmTextIOS="Confirm"
        cancelTextIOS="Cancel"
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
  timeWrapper: {
    borderStyle: 'dashed',
    backgroundColor: '#fbfcfe',
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#1e293b',
    fontWeight: '500',
  },
  timeIconBtn: {
    width: 36,
    height: 36,
    backgroundColor: '#f1f5f9',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

