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
  const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = useWindowDimensions();
  const [visible, setVisible] = useState(false);
  const [pickerPos, setPickerPos] = useState({ x: 0, y: 0, width: 240, isAbove: false });
  const triggerRef = useRef<View>(null);

  const parseTimeString = (str: string) => {
    const date = new Date();
    if (str) {
      const match = str.match(/(\d+):(\d+)\s*(AM|PM)/i);
      if (match) {
        let h = parseInt(match[1], 10);
        const m = parseInt(match[2], 10);
        const ampm = match[3].toUpperCase();
        
        if (ampm === 'PM' && h < 12) h += 12;
        if (ampm === 'AM' && h === 12) h = 0;
        
        date.setHours(h, m, 0, 0);
      }
    }
    return date;
  };

  const handleOpen = () => {
    if (Platform.OS === 'android') {
      setVisible(true);
    } else {
      // iOS: Measure to float right underneath
      triggerRef.current?.measureInWindow((x, y, width, height) => {
        let yPos = y + height;
        const pickerHeight = 240; // compact time picker/spinner height
        const pickerWidth = 240; 
        
        let isAbove = false;
        if (yPos + pickerHeight > SCREEN_HEIGHT - 40) {
          yPos = y - pickerHeight;
          isAbove = true;
        }

        let xPos = x + (width - pickerWidth) / 2; // center below input
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
      if (selectedDate) {
        formatAndSend(selectedDate);
      }
    }
  };

  const formatAndSend = (d: Date) => {
    let hours = d.getHours();
    const minutes = d.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    
    hours = hours % 12;
    hours = hours ? hours : 12; 
    const strHours = hours.toString().padStart(2, '0');
    
    onSelect(`${strHours}:${minutes} ${ampm}`);
  };

  return (
    <View ref={triggerRef} style={[{ width: '100%' }, style]} collapsable={false}>
      <TouchableOpacity style={[styles.inputWrapper, styles.timeWrapper]} onPress={handleOpen}>
        <Text style={[styles.input, !value && { color: '#94a3b8' }]}>
          {value || placeholder}
        </Text>
        <View style={styles.timeIconBtn}>
          <Feather name="clock" size={16} color="#64748b" />
        </View>
      </TouchableOpacity>

      {visible && Platform.OS === 'android' && (
        <DateTimePicker
          value={parseTimeString(value)}
          mode="time"
          is24Hour={false}
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
                    <Text style={styles.headerTitle}>Select Time</Text>
                    <TouchableOpacity onPress={() => setVisible(false)} style={styles.doneBtn}>
                      <Text style={styles.doneBtnText}>Done</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.pickerWrapper}>
                    <DateTimePicker
                      value={parseTimeString(value)}
                      mode="time"
                      is24Hour={false}
                      display="spinner"
                      textColor="#0f172a"
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
    borderRadius: 12,
    paddingHorizontal: '3%',
    paddingVertical: '2.5%',
    backgroundColor: '#f8fafc',
  },
  timeWrapper: {
    borderStyle: 'dashed',
    backgroundColor: '#f8fafc',
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: '#0f172a',
  },
  timeIconBtn: {
    width: '12%',
    aspectRatio: 1,
    backgroundColor: '#f1f5f9',
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
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
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  headerTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#334155',
  },
  doneBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  doneBtnText: {
    color: '#0ea5e9',
    fontSize: 13,
    fontWeight: 'bold',
  },
  pickerWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
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
