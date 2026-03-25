import React from 'react';
import {StyleSheet, TextInput} from 'react-native';
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';
import { ThemedText } from '../themed-text';
import { Fonts } from '@/constants/theme';

const TextInputExample = () => {
  const [text, onChangeText] = React.useState('');
  const [number, onChangeNumber] = React.useState('');

  return (
    <SafeAreaProvider>
      <SafeAreaView>
        <ThemedText
            type="title"
            style={{
            fontFamily: Fonts.rounded,
            fontSize: 18
            }}>
            Calories
        </ThemedText>
        <TextInput
          style={styles.input}
          onChangeText={onChangeText}
          value={text}
                    placeholder="Enter"
        keyboardType="numeric"
        />
        <ThemedText
            type="title"
            style={{
            fontFamily: Fonts.rounded,
            fontSize: 18
            }}>
            Proteins
        </ThemedText>
        <TextInput
          style={styles.input}
          onChangeText={onChangeNumber}
          value={number}
          placeholder="Enter"
          keyboardType="numeric"
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    borderColor: 'white',
    padding: 10,
    color: 'white'
  },
});

export default TextInputExample;