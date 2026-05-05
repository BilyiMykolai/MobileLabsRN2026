import React, { useEffect, useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Text, Alert, ActivityIndicator } from 'react-native';
import * as FileSystem from 'expo-file-system/legacy';

export default function FileEditorScreen({ route, navigation }) {
  const { uri, name } = route.params;
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    navigation.setOptions({ title: `✏️ ${name}` });
    FileSystem.readAsStringAsync(uri)
      .then(setContent)
      .catch(() => setContent(''))
      .finally(() => setLoading(false));
  }, []);

  const save = async () => {
    setSaving(true);
    try {
      await FileSystem.writeAsStringAsync(uri, content);
      Alert.alert('✅ Збережено', 'Файл успішно збережено', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (e) {
      Alert.alert('Помилка', e.message);
    }
    setSaving(false);
  };

  if (loading) return <ActivityIndicator size="large" color="#007AFF" style={{ marginTop: 40 }} />;

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.editor}
        value={content}
        onChangeText={setContent}
        multiline
        autoFocus
        textAlignVertical="top"
        placeholder="Введіть текст..."
      />
      <TouchableOpacity style={styles.saveBtn} onPress={save} disabled={saving}>
        <Text style={styles.saveBtnText}>{saving ? 'Збереження...' : '💾 Зберегти'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  editor: { flex: 1, padding: 16, fontSize: 15, lineHeight: 24, fontFamily: 'monospace' },
  saveBtn: { backgroundColor: '#34c759', margin: 16, borderRadius: 12, padding: 14, alignItems: 'center' },
  saveBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});