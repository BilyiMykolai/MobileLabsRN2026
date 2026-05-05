import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import * as FileSystem from 'expo-file-system/legacy';

export default function FileViewerScreen({ route, navigation }) {
  const { uri, name } = route.params;
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    navigation.setOptions({ title: `👁 ${name}` });
    FileSystem.readAsStringAsync(uri)
      .then(setContent)
      .catch(() => setContent('Помилка читання файлу'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <View style={styles.container}>
      {loading
        ? <ActivityIndicator size="large" color="#007AFF" style={{ marginTop: 40 }} />
        : (
          <ScrollView style={styles.scroll}>
            <Text style={styles.content}>{content || '(файл порожній)'}</Text>
          </ScrollView>
        )
      }
      <TouchableOpacity
        style={styles.editBtn}
        onPress={() => navigation.replace('FileEditor', { uri, name })}
      >
        <Text style={styles.editBtnText}>✏️ Редагувати</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  scroll: { flex: 1, padding: 16 },
  content: { fontSize: 15, lineHeight: 24, color: '#222', fontFamily: 'monospace' },
  editBtn: { backgroundColor: '#007AFF', margin: 16, borderRadius: 12, padding: 14, alignItems: 'center' },
  editBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});