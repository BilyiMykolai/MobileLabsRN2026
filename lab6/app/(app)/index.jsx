import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  ActivityIndicator, ScrollView,
} from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '../../context/AuthContext';

export default function HomeScreen() {
  const { user, logout, getUserProfile } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUserProfile().then(data => {
      setProfile(data);
      setLoading(false);
    });
  }, []);

  const handleLogout = async () => {
    await logout();
    router.replace('/login');
  };

  if (loading) return <ActivityIndicator size="large" color="#007AFF" style={{ marginTop: 60 }} />;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.hero}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {profile?.name?.[0]?.toUpperCase() || '?'}
          </Text>
        </View>
        <Text style={styles.name}>{profile?.name || 'Користувач'}</Text>
        <Text style={styles.email}>{user?.email}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>📋 Профіль</Text>
        {[
          { label: "Ім'я", value: profile?.name },
          { label: 'Вік', value: profile?.age || 'не вказано' },
          { label: 'Місто', value: profile?.city || 'не вказано' },
          { label: 'Email', value: user?.email },
        ].map(({ label, value }) => (
          <View key={label} style={styles.row}>
            <Text style={styles.rowLabel}>{label}</Text>
            <Text style={styles.rowValue}>{value}</Text>
          </View>
        ))}
      </View>

      <TouchableOpacity
        style={styles.editBtn}
        onPress={() => router.push('/profile')}
      >
        <Text style={styles.editBtnText}>✏️ Редагувати профіль</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Text style={styles.logoutBtnText}>🚪 Вийти</Text>
      </TouchableOpacity>

      <Text style={styles.footer}>Білий Микола Миколайович, ІПЗ 22-2</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  hero: { backgroundColor: '#007AFF', alignItems: 'center', paddingVertical: 40, paddingHorizontal: 24 },
  avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: 'rgba(255,255,255,0.3)', justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  avatarText: { fontSize: 36, color: '#fff', fontWeight: 'bold' },
  name: { fontSize: 22, fontWeight: 'bold', color: '#fff' },
  email: { fontSize: 14, color: 'rgba(255,255,255,0.8)', marginTop: 4 },
  card: { backgroundColor: '#fff', margin: 16, borderRadius: 16, padding: 16, elevation: 2 },
  cardTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 12 },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, borderBottomWidth: 1, borderColor: '#f0f0f0' },
  rowLabel: { fontSize: 14, color: '#888' },
  rowValue: { fontSize: 14, fontWeight: '500', color: '#222' },
  editBtn: { backgroundColor: '#007AFF', margin: 16, marginTop: 0, borderRadius: 14, padding: 16, alignItems: 'center' },
  editBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  logoutBtn: { backgroundColor: '#fff', margin: 16, marginTop: 0, borderRadius: 14, padding: 16, alignItems: 'center', borderWidth: 1, borderColor: '#ff3b30' },
  logoutBtnText: { color: '#ff3b30', fontWeight: 'bold', fontSize: 16 },
  footer: { textAlign: 'center', color: '#aaa', fontStyle: 'italic', padding: 16 },
});