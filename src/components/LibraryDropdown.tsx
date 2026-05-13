import React from 'react';
import { View, StyleSheet } from 'react-native';
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
  
  const data = options.map((item) => ({
    label: item,
    value: item,
  }));

  return (
    <View style={[{ width: '100%' }, style]}>
      <Dropdown
        style={styles.dropdown}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        containerStyle={styles.containerStyle}
        itemTextStyle={styles.itemTextStyle}
        activeColor="#f0f9ff"
        data={data}
        maxHeight={240}
        labelField="label"
        valueField="value"
        placeholder={placeholder}
        value={value}
        onChange={(item) => {
          onSelect(item.value);
        }}
        renderLeftIcon={() => (
          icon ? <View style={styles.iconWrapper}>{icon}</View> : null
        )}
        renderRightIcon={() => (
          <Feather name="chevron-down" size={16} color="#94a3b8" />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  dropdown: {
    height: 52,
    borderColor: '#e2e8f0',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 16,
    backgroundColor: '#f8fafc',
  },
  placeholderStyle: {
    fontSize: 14,
    color: '#94a3b8',
  },
  selectedTextStyle: {
    fontSize: 14,
    color: '#0f172a',
  },
  containerStyle: {
    borderRadius: 20,
    marginTop: 4,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    overflow: 'hidden',
    borderColor: '#e2e8f0',
  },
  itemTextStyle: {
    fontSize: 14,
    color: '#334155',
  },
  iconWrapper: {
    marginRight: 8,
  },
});
