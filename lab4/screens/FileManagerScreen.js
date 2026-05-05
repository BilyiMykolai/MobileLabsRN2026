import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, StyleSheet,
  Alert, Modal, TextInput, ActivityIndicator,
} from 'react-native';
import * as FileSystem from 'expo-file-system/legacy';
import { SafeAreaView } from 'react-native-safe-area-context';

const ROOT = FileSystem.documentDirectory;

export default function FileManagerScreen({ navigation }) {
  const [currentPath, setCurrentPath] = useState(ROOT);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [storage, setStorage] = useState({ total: 0, free: 0 });
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState(''); // 'folder' | 'file'
  const [inputName, setInputName] = useState('');
  const [inputContent, setInputContent] = useState('');
  const [infoModal, setInfoModal] = useState(null);

  const loadDirectory = useCallback(async (path) => {
    if (!path) return;
    setLoading(true);
    try {
      const contents = await FileSystem.readDirectoryAsync(path);
      const detailed = await Promise.all(
        contents.map(async (name) => {
          const uri = path + name;
          const info = await FileSystem.getInfoAsync(uri, { size: true });
          return { name, uri, isDirectory: info.isDirectory, size: info.size, modTime: info.modificationTime };
        })
      );
      detailed.sort((a, b) => {
        if (a.isDirectory && !b.isDirectory) return -1;
        if (!a.isDirectory && b.isDirectory) return 1;
        return a.name.localeCompare(b.name);
      });
      setItems(detailed);
    } catch (e) {
      console.error(e);
      Alert.alert('Помилка', e.message);
    }
    setLoading(false);
  }, []);

  const loadStorage = useCallback(async () => {
    try {
      const free = await FileSystem.getFreeDiskStorageAsync();
      const total = await FileSystem.getTotalDiskCapacityAsync();
      setStorage({ free, total });
    } catch (e) {
      console.error(e);
    }
  }, []);

  useEffect(() => {
    if (currentPath) {
      loadDirectory(currentPath);
    }
    loadStorage();
  }, [currentPath, loadDirectory, loadStorage]);

  const goUp = () => {
    if (currentPath === ROOT) return;
    const parts = currentPath.slice(0, -1).split('/');
    parts.pop();
    setCurrentPath(parts.join('/') + '/');
  };

  const openItem = (item) => {
    if (item.isDirectory) {
      setCurrentPath(item.uri + '/');
    } else if (item.name.endsWith('.txt')) {
      navigation.navigate('FileViewer', { uri: item.uri, name: item.name });
    } else {
      showInfo(item);
    }
  };

  const showInfo = async (item) => {
    const info = await FileSystem.getInfoAsync(item.uri, { size: true });
    setInfoModal({
      name: item.name,
      type: item.isDirectory ? 'Папка' : item.name.split('.').pop().toUpperCase(),
      size: item.isDirectory ? '—' : formatSize(info.size || 0),
      modTime: info.modificationTime
        ? new Date(info.modificationTime * 1000).toLocaleString()
        : '—',
    });
  };

  const deleteItem = (item) => {
    Alert.alert(
      'Видалення',
      `Видалити "${item.name}"?`,
      [
        { text: 'Скасувати', style: 'cancel' },
        {
          text: 'Видалити', style: 'destructive',
          onPress: async () => {
            try {
              await FileSystem.deleteAsync(item.uri, { idempotent: true });
              loadDirectory(currentPath);
              loadStorage();
            } catch (e) {
              Alert.alert('Помилка', e.message);
            }
          },
        },
      ]
    );
  };

  const createItem = async () => {
    if (!inputName.trim()) {
      Alert.alert('Помилка', 'Введіть назву');
      return;
    }
    try {
      if (modalType === 'folder') {
        await FileSystem.makeDirectoryAsync(currentPath + inputName.trim(), { intermediates: true });
      } else {
        await FileSystem.writeAsStringAsync(currentPath + inputName.trim() + '.txt', inputContent || '');
      }
      setModalVisible(false);
      setInputName('');
      setInputContent('');
      loadDirectory(currentPath);
      loadStorage();
    } catch (e) {
      Alert.alert('Помилка', e.message);
    }
  };

  const formatSize = (bytes) => {
    if (!bytes || bytes === 0) return '0 B';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  // Безпечний breadcrumb — перевіряємо, що currentPath існує
  const breadcrumb = currentPath ? currentPath.replace(ROOT, '~/') : '~/';
  
  const usedStorage = storage.total - storage.free;
  const usedPct = storage.total ? (usedStorage / storage.total) * 100 : 0;

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => openItem(item)}
      onLongPress={() => showInfo(item)}
    >
      <Text style={styles.itemIcon}>{item.isDirectory ? '📁' : item.name.endsWith('.txt') ? '📄' : '📎'}</Text>
      <View style={styles.itemInfo}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemMeta}>
          {item.isDirectory ? 'Папка' : formatSize(item.size)}
        </Text>
      </View>
      <View style={styles.itemActions}>
        {!item.isDirectory && item.name.endsWith('.txt') && (
          <TouchableOpacity
            onPress={() => navigation.navigate('FileEditor', { uri: item.uri, name: item.name })}
            style={styles.actionBtn}
          >
            <Text>✏️</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity onPress={() => showInfo(item)} style={styles.actionBtn}>
          <Text>ℹ️</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => deleteItem(item)} style={styles.actionBtn}>
          <Text>🗑️</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
      {/* Storage stats */}
      <View style={styles.storageBox}>
        <Text style={styles.storageTitle}>💾 Пам'ять пристрою</Text>
        <View style={styles.storageRow}>
          <Text style={styles.storageStat}>Всього: {formatSize(storage.total)}</Text>
          <Text style={styles.storageStat}>Вільно: {formatSize(storage.free)}</Text>
          <Text style={styles.storageStat}>Зайнято: {formatSize(usedStorage)}</Text>
        </View>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${usedPct}%` }]} />
        </View>
      </View>

      {/* Breadcrumb */}
      <View style={styles.breadcrumb}>
        <Text style={styles.breadcrumbText} numberOfLines={1}>{breadcrumb}</Text>
      </View>

      {/* Go up */}
      {currentPath && currentPath !== ROOT && (
        <TouchableOpacity style={styles.upBtn} onPress={goUp}>
          <Text style={styles.upBtnText}>⬆️ Назад</Text>
        </TouchableOpacity>
      )}

      {/* File list */}
      {loading
        ? <ActivityIndicator size="large" color="#007AFF" style={{ marginTop: 40 }} />
        : (
          <FlatList
            data={items}
            keyExtractor={(item) => item.uri}
            renderItem={renderItem}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            ListEmptyComponent={<Text style={styles.empty}>Папка порожня</Text>}
          />
        )
      }

      {/* Create buttons */}
      <View style={styles.fab}>
        <TouchableOpacity
          style={[styles.fabBtn, { marginRight: 12 }]}
          onPress={() => { setModalType('folder'); setModalVisible(true); }}
        >
          <Text style={styles.fabText}>+ Папка</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.fabBtn}
          onPress={() => { setModalType('file'); setModalVisible(true); }}
        >
          <Text style={styles.fabText}>+ Файл</Text>
        </TouchableOpacity>
      </View>

      {/* Create modal */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>
              {modalType === 'folder' ? '📁 Нова папка' : '📄 Новий файл'}
            </Text>
            <TextInput
              style={styles.input}
              placeholder={modalType === 'folder' ? 'Назва папки' : 'Назва файлу (без .txt)'}
              value={inputName}
              onChangeText={setInputName}
            />
            {modalType === 'file' && (
              <TextInput
                style={[styles.input, { height: 100, textAlignVertical: 'top' }]}
                placeholder="Вміст файлу..."
                value={inputContent}
                onChangeText={setInputContent}
                multiline
              />
            )}
            <View style={styles.modalBtns}>
              <TouchableOpacity onPress={() => { setModalVisible(false); setInputName(''); setInputContent(''); }} style={styles.cancelBtn}>
                <Text>Скасувати</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={createItem} style={styles.confirmBtn}>
                <Text style={{ color: '#fff', fontWeight: 'bold' }}>Створити</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Info modal */}
      <Modal visible={!!infoModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>ℹ️ Інформація</Text>
            {infoModal && (
              <>
                <Text style={styles.infoRow}>📌 Назва: {infoModal.name}</Text>
                <Text style={styles.infoRow}>🗂 Тип: {infoModal.type}</Text>
                <Text style={styles.infoRow}>📦 Розмір: {infoModal.size}</Text>
                <Text style={styles.infoRow}>🕐 Змінено: {infoModal.modTime}</Text>
              </>
            )}
            <TouchableOpacity onPress={() => setInfoModal(null)} style={[styles.confirmBtn, { marginTop: 16 }]}>
              <Text style={{ color: '#fff', fontWeight: 'bold' }}>Закрити</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  storageBox: { backgroundColor: '#fff', padding: 12, margin: 12, borderRadius: 12, elevation: 2 },
  storageTitle: { fontWeight: 'bold', fontSize: 14, marginBottom: 6 },
  storageRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  storageStat: { fontSize: 12, color: '#555' },
  progressBar: { height: 6, backgroundColor: '#eee', borderRadius: 3 },
  progressFill: { height: 6, backgroundColor: '#007AFF', borderRadius: 3 },
  breadcrumb: { backgroundColor: '#e8f0fe', paddingHorizontal: 16, paddingVertical: 8 },
  breadcrumbText: { fontSize: 13, color: '#3355aa', fontFamily: 'monospace' },
  upBtn: { padding: 12, borderBottomWidth: 1, borderColor: '#ddd', backgroundColor: '#fff' },
  upBtnText: { fontSize: 15, color: '#007AFF' },
  item: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', padding: 12 },
  itemIcon: { fontSize: 28, marginRight: 12 },
  itemInfo: { flex: 1 },
  itemName: { fontSize: 15, fontWeight: '500' },
  itemMeta: { fontSize: 12, color: '#888', marginTop: 2 },
  itemActions: { flexDirection: 'row' },
  actionBtn: { padding: 6, marginLeft: 4 },
  separator: { height: 1, backgroundColor: '#eee' },
  empty: { textAlign: 'center', color: '#aaa', marginTop: 40, fontSize: 16 },
  fab: { flexDirection: 'row', justifyContent: 'center', padding: 16, backgroundColor: '#fff', borderTopWidth: 1, borderColor: '#eee' },
  fabBtn: { backgroundColor: '#007AFF', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 24, elevation: 4 },
  fabText: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', padding: 24 },
  modalBox: { backgroundColor: '#fff', borderRadius: 16, padding: 20 },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 16 },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 10, marginBottom: 12, fontSize: 15 },
  modalBtns: { flexDirection: 'row', justifyContent: 'flex-end', gap: 12 },
  cancelBtn: { padding: 10 },
  confirmBtn: { backgroundColor: '#007AFF', borderRadius: 8, paddingHorizontal: 20, paddingVertical: 10 },
  infoRow: { fontSize: 15, marginBottom: 8, color: '#333' },
});