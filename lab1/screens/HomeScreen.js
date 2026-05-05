import React from 'react';
import { View, Text, ScrollView, Image, StyleSheet, FlatList } from 'react-native';

const news = Array(8).fill({
  title: 'Заголовок новини',
  date: 'Дата новини',
  text: 'Короткий текст новини',
});

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <FlatList
        data={news}
        keyExtractor={(_, i) => i.toString()}
        ListHeaderComponent={<Text style={styles.heading}>Новини</Text>}
        renderItem={({ item }) => (
          <View style={styles.newsItem}>
            <View style={styles.newsImage} />
            <View style={styles.newsText}>
              <Text style={styles.newsTitle}>{item.title}</Text>
              <Text style={styles.newsDate}>{item.date}</Text>
              <Text style={styles.newsBody}>{item.text}</Text>
            </View>
          </View>
        )}
        ListFooterComponent={
          <Text style={styles.footer}>Білий Микола Миколайович, ІПЗ 22-2</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  heading: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginVertical: 12 },
  newsItem: { flexDirection: 'row', padding: 10, borderBottomWidth: 0.5, borderColor: '#ccc' },
  newsImage: { width: 60, height: 60, backgroundColor: '#ddd', borderRadius: 4, marginRight: 10 },
  newsText: { flex: 1 },
  newsTitle: { fontWeight: 'bold', fontSize: 14 },
  newsDate: { color: '#888', fontSize: 12 },
  newsBody: { fontSize: 12, color: '#444' },
  footer: { textAlign: 'center', color: '#888', fontStyle: 'italic', padding: 16 },
});