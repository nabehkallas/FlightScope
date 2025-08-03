import React from 'react';
import { Platform, StyleSheet, TouchableOpacity, View } from 'react-native';
import { ThemedText } from './ThemedText';

interface RadioButtonProps {
  label: string;
  value: string | null;
  selectedValue: string | null;
  onValueChange: (value: string | null) => void;
}

const RadioButton: React.FC<RadioButtonProps> = ({ label, value, selectedValue, onValueChange }) => {
  const isSelected = selectedValue === value;

  return (
    <TouchableOpacity style={styles.radioButtonContainer} onPress={() => onValueChange(value)}>
      <View style={[styles.radioButton, isSelected && styles.radioButtonSelected]}>
        {isSelected && <View style={styles.radioButtonInner} />}
      </View>
      <ThemedText style={styles.radioButtonLabel}>{label}</ThemedText>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  radioButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  radioButton: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#050955',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioButtonSelected: {
    borderColor: '#050955',
  },
  radioButtonInner: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: '#050955',
  },
  radioButtonLabel: {
    marginLeft: 10,
    fontSize: 16,
    ...Platform.select({
      web: {
        color: '#050955',
      },
    }),
  },
});

export default RadioButton;