import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
  Dimensions
} from 'react-native';
import DateTimePicker from 'react-native-ui-datepicker';
import dayjs from 'dayjs';
import { Feather } from '@expo/vector-icons';

interface LibraryDatePickerProps {
  value: string;
  onSelect: (dateStr: string) => void;
  placeholder?: string;
  style?: any;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function LibraryDatePicker({
  value,
  onSelect,
  placeholder = 'dd/mm/yyyy',
  style
}: LibraryDatePickerProps) {
  const [visible, setVisible] = useState(false);

  // Convert string DD/MM/YYYY to dayjs object with validation
  const parsedDate = dayjs(value, 'DD/MM/YYYY');
  const dateValue = (value && parsedDate.isValid()) ? parsedDate : dayjs();

  const handleOpen = () => setVisible(true);
  const handleClose = () => setVisible(false);

  const onDateChange = (params: any) => {
    if (params.date) {
      const formattedDate = dayjs(params.date).format('DD/MM/YYYY');
      onSelect(formattedDate);
      handleClose();
    }
  };

  return (
    <View style={[{ width: '100%' }, style]}>
      <TouchableOpacity style={styles.inputWrapper} onPress={handleOpen}>
        <Text style={[styles.input, !value && { color: '#94a3b8' }]}>
          {value || placeholder}
        </Text>
        <Feather name="calendar" size={16} color="#1e293b" />
      </TouchableOpacity>

      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={handleClose}
      >
        <TouchableWithoutFeedback onPress={handleClose}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.calendarContainer}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Select Date</Text>
                  <TouchableOpacity onPress={handleClose}>
                    <Feather name="x" size={20} color="#64748b" />
                  </TouchableOpacity>
                </View>
                
                <View style={styles.pickerWrapper}>
                  <DateTimePicker
                    mode="single"
                    date={dateValue.toDate()}
                    onChange={onDateChange}
                    navigationPosition="around"
                    styles={{
                      header: styles.headerText,
                      day_label: styles.calendarText,
                      weekday_label: styles.weekDaysText,
                      selected: { backgroundColor: '#0ea5e9', borderRadius: 10 },
                      selected_label: { color: '#ffffff' },
                    }}
                  />
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
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
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#0f172a',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  calendarContainer: {
    width: Math.min(SCREEN_WIDTH - 40, 400),
    backgroundColor: '#ffffff',
    borderRadius: 24,
    overflow: 'hidden',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0f172a',
  },
  pickerWrapper: {
    padding: 10,
    paddingBottom: 20,
  },
  headerText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  calendarText: {
    fontSize: 14,
    color: '#334155',
  },
  weekDaysText: {
    fontSize: 13,
    color: '#94a3b8',
    fontWeight: '600',
  },
});

