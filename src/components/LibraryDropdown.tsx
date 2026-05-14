import React, { useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { Feather } from '@expo/vector-icons';

interface LibraryDropdownProps {
  options: string[];
  value: string;
  onSelect: (val: string) => void;
  placeholder?: string;
  icon?: React.ReactNode;
  style?: any;
}

export default function LibraryDropdown({
  options,
  value,
  onSelect,
  placeholder = 'Select option',
  icon,
  style
}: LibraryDropdownProps) {
  const [isFocus, setIsFocus] = useState(false);
  
  const data = options.map((item) => ({
    label: item,
    value: item,
  }));

  return (
    <View style={[{ width: '100%' }, style]}>
      <Dropdown
        style={[
          styles.dropdown,
          isFocus && { borderColor: '#0ea5e9', borderWidth: 2 }
        ]}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        containerStyle={styles.containerStyle}
        itemTextStyle={styles.itemTextStyle}
        activeColor="#f0f9ff"
        data={data}
        maxHeight={300}
        labelField="label"
        valueField="value"
        placeholder={!isFocus ? placeholder : '...'}
        value={value}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        onChange={(item) => {
          onSelect(item.value);
          setIsFocus(false);
        }}
        renderLeftIcon={() => (
          icon ? <View style={styles.iconWrapper}>{icon}</View> : null
        )}
        renderRightIcon={() => (
          <Feather 
            name={isFocus ? "chevron-up" : "chevron-down"} 
            size={18} 
            color={isFocus ? "#0ea5e9" : "#94a3b8"} 
          />
        )}
        renderItem={(item) => (
          <View style={[
            styles.item,
            item.value === value && { backgroundColor: '#e0f2fe' }
          ]}>
            <Text style={[
              styles.itemTextStyle,
              item.value === value && { color: '#0369a1', fontWeight: '700' }
            ]}>
              {item.label}
            </Text>
            {item.value === value && (
              <Feather name="check" size={16} color="#0369a1" />
            )}
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  dropdown: {
    height: 56,
    borderColor: '#e0f2fe',
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 16,
    backgroundColor: '#fbfcfe',
  },
  placeholderStyle: {
    fontSize: 15,
    color: '#94a3b8',
  },
  selectedTextStyle: {
    fontSize: 15,
    color: '#1e293b',
    fontWeight: '500',
  },
  containerStyle: {
    borderRadius: 20,
    marginTop: 8,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  item: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemTextStyle: {
    fontSize: 15,
    color: '#334155',
  },
  iconWrapper: {
    marginRight: 10,
  },
});

