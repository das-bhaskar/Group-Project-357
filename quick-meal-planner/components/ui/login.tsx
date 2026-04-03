// LoginScreen.tsx
import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';
import { LoginScreenProps } from './types';
import { ThemedText } from '../themed-text';

const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // In a real app, you would handle authentication (API calls, validation) here.
    // Assuming a successful login:
    const mockUserToken = 'mock-user-token-123';
    
    // Call the parent's callback function with the updated data
    onLoginSuccess(true, mockUserToken);
  };

  return (

    <View style={styles.container}>
    <ThemedText style={styles.title}>Login</ThemedText>
      <TextInput
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        style={styles.input}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />
      <Button title="Log In" onPress={handleLogin} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: 'center', 
    backgroundColor: '#F5EBDD', 
    padding: 50 },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    borderColor: 'white',
    padding: 10,
    color: 'white'
  },

  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#5A3726',
    marginBottom: 8,
  },

  input: {
    height: 52,
    borderWidth: 1,
    borderColor: '#E8DDD0',
    borderRadius: 14,
    paddingHorizontal: 16,
    backgroundColor: '#FCFAF7',
    marginBottom: 14,
    fontSize: 16,
    color: '#333333',
  },

});

export default LoginScreen;