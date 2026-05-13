import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Modal,
  TouchableWithoutFeedback,
  useWindowDimensions
} from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { Feather } from '@expo/vector-icons';

interface LibraryDatePickerProps {
  value: string;
  onSelect: (dateStr: string) => void;
  placeholder?: string;
  style?: any;
}

export default function LibraryDatePicker({
  value,
  onSelect,
  placeholder = 'dd/mm/yyyy',
  style
}: LibraryDatePickerProps) {
  const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = useWindowDimensions();
  const [visible, setVisible] = useState(false);
  const [pickerPos, setPickerPos] = useState({ x: 0, y: 0, width: 320, isAbove: false });
  const triggerRef = useRef<View>(null);

  const parseDateString = (str: string) => {
    if (str) {
      const parts = str.split('/').map(Number);
      if (parts.length === 3) {
        const [d, m, y] = parts;
        if (!isNaN(d) && !isNaN(m) && !isNaN(y)) {
          return new Date(y, m - 1, d);
        }
      }
    }
    return new Date();
  };

  const handleOpen = () => {
    if (Platform.OS === 'android') {
      setVisible(true);
    } else {
      // iOS: Measure to float right underneath
      triggerRef.current?.measureInWindow((x, y, width, height) => {
        let yPos = y + height;
        const pickerHeight = 340; // estimated iOS inline calendar height
        const pickerWidth = 320; // fixed standard inline calendar width
        
        let isAbove = false;
        if (yPos + pickerHeight > SCREEN_HEIGHT - 40) {
          yPos = y - pickerHeight;
          isAbove = true;
        }

        // Ensure horizontal positioning stays within screen bounds
        let xPos = x;
        if (xPos + pickerWidth > SCREEN_WIDTH - 16) {
          xPos = SCREEN_WIDTH - pickerWidth - 16;
        }
        if (xPos < 16) {
          xPos = 16;
        }

        setPickerPos({ x: xPos, y: yPos, width: pickerWidth, isAbove });
        setVisible(true);
      });
    }
  };

  const onChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setVisible(false);
      if (event.type !== 'dismissed' && selectedDate) {
        formatAndSend(selectedDate);
      }
    } else {
      // iOS: In-place inline picker
      if (selectedDate) {
        formatAndSend(selectedDate);
      }
    }
  };

  const formatAndSend = (dateToFormat: Date) => {
    const day = dateToFormat.getDate().toString().padStart(2, '0');
    const month = (dateToFormat.getMonth() + 1).toString().padStart(2, '0');
    const year = dateToFormat.getFullYear();
    onSelect(`${day}/${month}/${year}`);
  };

  return (
    <View ref={triggerRef} style={[{ width: '100%' }, style]} collapsable={false}>
      <TouchableOpacity style={styles.inputWrapper} onPress={handleOpen}>
        <Feather name="calendar" size={16} color="#94a3b8" style={styles.inputIcon} />
        <Text style={[styles.input, !value && { color: '#94a3b8' }]}>
          {value || placeholder}
        </Text>
      </TouchableOpacity>

      {visible && Platform.OS === 'android' && (
        <DateTimePicker
          value={parseDateString(value)}
          mode="date"
          display="default"
          onChange={onChange}
        />
      )}

      {visible && Platform.OS === 'ios' && (
        <Modal
          transparent
          visible={visible}
          animationType="none"
          supportedOrientations={['portrait', 'landscape']}
          onRequestClose={() => setVisible(false)}
        >
          <TouchableWithoutFeedback onPress={() => setVisible(false)}>
            <View style={styles.overlay}>
              <TouchableWithoutFeedback>
                <View
                  style={[
                    styles.floatingContainer,
                    {
                      position: 'absolute',
                      top: pickerPos.y,
                      left: pickerPos.x,
                      width: pickerPos.width,
                    },
                    pickerPos.isAbove ? styles.shadowAbove : styles.shadowBelow
                  ]}
                >
                  <View style={styles.pickerHeader}>
                    <Text style={styles.headerTitle}>Select Date</Text>
                    <TouchableOpacity onPress={() => setVisible(false)} style={styles.doneBtn}>
                      <Text style={styles.doneBtnText}>Done</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.pickerWrapper}>
                    <DateTimePicker
                      value={parseDateString(value)}
                      mode="date"
                      display="inline"
                      onChange={onChange}
                    />
                  </View>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 20,
    paddingHorizontal: '4%',
    paddingVertical: 14,
    backgroundColor: '#f8fafc',
  },
  inputIcon: {
    marginRight: '2%',
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: '#0f172a',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  floatingContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    overflow: 'hidden',
  },
  pickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  headerTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#334155',
  },
  doneBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  doneBtnText: {
    color: '#0ea5e9',
    fontSize: 14,
    fontWeight: 'bold',
  },
  pickerWrapper: {
    padding: 8,
  },
  shadowBelow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  shadowAbove: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
});
