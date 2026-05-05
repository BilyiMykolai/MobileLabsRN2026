import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  Alert, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator,
} from 'react-native';
import { Link, router } from 'expo-router';
import { useAuth } from '../../context/AuthContext';

export default function RegisterScreen() {
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!name || !email || !password || !password2) {
      Alert.alert('Помилка', 'Заповніть всі поля'); return;
    }
    if (password !== password2) {
      Alert.alert('Помилка', 'Паролі не співпадають'); return;
    }
    if (password.length < 6) {
      Alert.alert('Помилка', 'Пароль мінімум 6 символів'); return;
    }
    setLoading(true);
    try {
      await register(email, password, name);
      router.replace('/');
    } catch (e) {
      Alert.alert('Помилка реєстрації', e.message);
    }
    setLoading(false);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.card}>
          <Text style={styles.title}>🎉 Реєстрація</Text>
          <Text style={styles.subtitle}>Створіть свій акаунт</Text>

          {[
            { label: "Ім'я", value: name, set: setName, placeholder: "Микола Білий" },
            { label: "Email", value: email, set: setEmail, placeholder: "your@email.com", keyboard: 'email-address' },
            { label: "Пароль", value: password, set: setPassword, placeholder: "мін. 6 символів", secure: true },
            { label: "Підтвердження паролю", value: password2, set: setPassword2, placeholder: "••••••••", secure: true },
          ].map(({ label, value, set, placeholder, keyboard, secure }) => (
            <View key={label}>
              <Text style={styles.label}>{label}</Text>
              <TextInput
                style={styles.input}
                value={value}
                onChangeText={set}
                placeholder={placeholder}
                keyboardType={keyboard || 'default'}
                autoCapitalize="none"
                secureTextEntry={!!secure}
              />
            </View>
          ))}

          <TouchableOpacity style={styles.btn} onPress={handleRegister} disabled={loading}>
            {loading
              ? <ActivityIndicator color="#fff" />
              : <Text style={styles.btnText}>Зареєструватися</Text>
            }
          </TouchableOpacity>

          <Link href="/login" asChild>
            <TouchableOpacity style={styles.link}>
              <Text style={styles.linkText}>Вже є акаунт? <Text style={styles.accent}>Увійти</Text></Text>
            </TouchableOpacity>
          </Link>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f4ff' },
  scroll: { padding: 24, flexGrow: 1, justifyContent: 'center' },
  card: { backgroundColor: '#fff', borderRadius: 20, padding: 24, elevation: 4 },
  title: { fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginBottom: 4 },
  subtitle: { fontSize: 14, color: '#888', textAlign: 'center', marginBottom: 16 },
  label: { fontSize: 14, color: '#333', marginBottom: 4, marginTop: 12 },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 10, padding: 12, fontSize: 15 },
  btn: { backgroundColor: '#007AFF', borderRadius: 12, padding: 16, alignItems: 'center', marginTop: 24 },
  btnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  link: { marginTop: 16, alignItems: 'center' },
  linkText: { fontSize: 14, color: '#666' },
  accent: { color: '#007AFF', fontWeight: 'bold' },
});