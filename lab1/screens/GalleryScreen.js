import React from 'react';
import { View, ScrollView, StyleSheet, Dimensions, Text } from 'react-native';

const { width } = Dimensions.get('window');
const ITEM_SIZE = width / 2 - 16;

export default function GalleryScreen() {
  const items = Array(10).fill(null);
  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.grid}>
          {items.map((_, i) => (
            <View key={i} style={[styles.cell, { width: ITEM_SIZE, height: ITEM_SIZE }]} />
          ))}
        </View>
        <Text style={styles.footer}>Білий Микола Миколайович, ІПЗ 22-2</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', padding: 8, gap: 8 },
  cell: { backgroundColor: '#f0f0f0', borderRadius: 8, borderWidth: 0.5, borderColor: '#ccc' },
  footer: { textAlign: 'center', color: '#888', fontStyle: 'italic', padding: 16 },
});