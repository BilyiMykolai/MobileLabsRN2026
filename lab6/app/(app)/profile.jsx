import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  Alert, ScrollView, ActivityIndicator, Modal,
} from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '../../context/AuthContext';

export default function ProfileScreen() {
  const { getUserProfile, updateProfile, deleteAccount } = useAuth();
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [city, setCity] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');

  useEffect(() => {
    getUserProfile().then(data => {
      if (data) { setName(data.name || ''); setAge(data.age || ''); setCity(data.city || ''); }
      setLoading(false);
    });
  }, []);

  const handleSave = async () => {
    if (!name) { Alert.alert('Помилка', "Ім'я обов'язкове"); return; }
    setSaving(true);
    try {
      await updateProfile({ name, age, city });
      Alert.alert('✅ Збережено', 'Профіль оновлено успішно', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch (e) {
      Alert.alert('Помилка', e.message);
    }
    setSaving(false);
  };

  const handleDelete = async () => {
    if (!deletePassword) { Alert.alert('Помилка', 'Введіть пароль'); return; }
    try {
      await deleteAccount(deletePassword);
      setDeleteModal(false);
      router.replace('/login');
    } catch (e) {
      Alert.alert('Помилка', e.message);
    }
  };

  if (loading) return <ActivityIndicator size="large" color="#007AFF" style={{ marginTop: 60 }} />;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>✏️ Редагування профілю</Text>

        {[
          { label: "Ім'я", value: name, set: setName, placeholder: 'Микола Білий' },
          { label: 'Вік', value: age, set: setAge, placeholder: '20', keyboard: 'numeric' },
          { label: 'Місто', value: city, set: setCity, placeholder: 'Житомир' },
        ].map(({ label, value, set, placeholder, keyboard }) => (
          <View key={label}>
            <Text style={styles.label}>{label}</Text>
            <TextInput
              style={styles.input}
              value={value}
              onChangeText={set}
              placeholder={placeholder}
              keyboardType={keyboard || 'default'}
            />
          </View>
        ))}

        <TouchableOpacity style={styles.saveBtn} onPress={handleSave} disabled={saving}>
          {saving
            ? <ActivityIndicator color="#fff" />
            : <Text style={styles.saveBtnText}>💾 Зберегти зміни</Text>
          }
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.deleteBtn}
        onPress={() => setDeleteModal(true)}
      >
        <Text style={styles.deleteBtnText}>🗑️ Видалити акаунт</Text>
      </TouchableOpacity>

      {/* Delete confirmation modal */}
      <Modal visible={deleteModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>⚠️ Видалення акаунту</Text>
            <Text style={styles.modalSub}>Це незворотна дія. Введіть пароль для підтвердження.</Text>
            <TextInput
              style={styles.input}
              value={deletePassword}
              onChangeText={setDeletePassword}
              secureTextEntry
              placeholder="Введіть пароль"
            />
            <View style={styles.modalBtns}>
              <TouchableOpacity
                onPress={() => { setDeleteModal(false); setDeletePassword(''); }}
                style={styles.cancelBtn}
              >
                <Text style={styles.cancelBtnText}>Скасувати</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleDelete} style={styles.confirmDeleteBtn}>
                <Text style={styles.confirmDeleteText}>Видалити</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  card: { backgroundColor: '#fff', margin: 16, borderRadius: 16, padding: 16, elevation: 2 },
  cardTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 16 },
  label: { fontSize: 14, color: '#333', marginBottom: 4, marginTop: 12 },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 10, padding: 12, fontSize: 15 },
  saveBtn: { backgroundColor: '#34c759', borderRadius: 12, padding: 16, alignItems: 'center', marginTop: 24 },
  saveBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  deleteBtn: { backgroundColor: '#fff', margin: 16, marginTop: 0, borderRadius: 14, padding: 16, alignItems: 'center', borderWidth: 1, borderColor: '#ff3b30' },
  deleteBtnText: { color: '#ff3b30', fontWeight: 'bold', fontSize: 16 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalBox: { backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 24 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 8 },
  modalSub: { fontSize: 14, color: '#666', marginBottom: 16 },
  modalBtns: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 16 },
  cancelBtn: { flex: 1, padding: 14, alignItems: 'center', borderWidth: 1, borderColor: '#ddd', borderRadius: 10, marginRight: 8 },
  cancelBtnText: { fontSize: 15, color: '#333' },
  confirmDeleteBtn: { flex: 1, backgroundColor: '#ff3b30', padding: 14, alignItems: 'center', borderRadius: 10 },
  confirmDeleteText: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
});