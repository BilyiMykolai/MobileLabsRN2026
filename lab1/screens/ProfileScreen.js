import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';

export default function ProfileScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [lastName, setLastName] = useState('');
  const [firstName, setFirstName] = useState('');

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>Реєстрація</Text>

      <Text style={styles.label}>Електронна пошта</Text>
      <TextInput style={styles.input} value={email} onChangeText={setEmail} keyboardType="email-address" />

      <Text style={styles.label}>Пароль</Text>
      <TextInput style={styles.input} value={password} onChangeText={setPassword} secureTextEntry />

      <Text style={styles.label}>Пароль (ще раз)</Text>
      <TextInput style={styles.input} value={password2} onChangeText={setPassword2} secureTextEntry />

      <Text style={styles.label}>Прізвище</Text>
      <TextInput style={styles.input} value={lastName} onChangeText={setLastName} />

      <Text style={styles.label}>Ім'я</Text>
      <TextInput style={styles.input} value={firstName} onChangeText={setFirstName} />

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Зареєструватися</Text>
      </TouchableOpacity>

      <Text style={styles.footer}>Білий Микола Миколайович, ІПЗ 22-2</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 16 },
  heading: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginVertical: 16 },
  label: { fontSize: 14, color: '#333', marginTop: 12 },
  input: { borderBottomWidth: 1, borderColor: '#ccc', paddingVertical: 6, marginTop: 4, fontSize: 14 },
  button: { backgroundColor: '#007AFF', borderRadius: 8, padding: 14, marginTop: 24, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  footer: { textAlign: 'center', color: '#888', fontStyle: 'italic', padding: 24 },
});