import React, { useState, useCallback } from 'react';
import {
  View, Text, FlatList, Image,
  StyleSheet, TouchableOpacity, ActivityIndicator,
} from 'react-native';
import { generateNews } from '../data/newsData';

export default function MainScreen({ navigation }) {
  const [news, setNews] = useState(generateNews(0, 10));
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setNews(generateNews(0, 10));
      setRefreshing(false);
    }, 1500);
  }, []);

  const onEndReached = useCallback(() => {
    if (loadingMore) return;
    setLoadingMore(true);
    setTimeout(() => {
      setNews(prev => [...prev, ...generateNews(prev.length, 10)]);
      setLoadingMore(false);
    }, 1000);
  }, [loadingMore]);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.newsItem}
      onPress={() => navigation.navigate('Details', { item })}
    >
      <Image source={{ uri: item.image }} style={styles.newsImage} />
      <View style={styles.newsText}>
        <Text style={styles.newsTitle}>{item.title}</Text>
        <Text style={styles.newsDesc}>{item.description}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={news}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      refreshing={refreshing}
      onRefresh={onRefresh}
      onEndReached={onEndReached}
      onEndReachedThreshold={0.5}
      initialNumToRender={10}
      maxToRenderPerBatch={10}
      windowSize={5}
      ListHeaderComponent={
        <Text style={styles.heading}>📰 Новини</Text>
      }
      ListFooterComponent={
        loadingMore
          ? <ActivityIndicator style={{ padding: 16 }} />
          : <Text style={styles.footer}>Білий Микола, ІПЗ 22-2</Text>
      }
      ItemSeparatorComponent={() => <View style={styles.separator} />}
    />
  );
}

const styles = StyleSheet.create({
  heading: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', padding: 16 },
  newsItem: { flexDirection: 'row', padding: 12, alignItems: 'center' },
  newsImage: { width: 70, height: 70, borderRadius: 8, marginRight: 12, backgroundColor: '#eee' },
  newsText: { flex: 1 },
  newsTitle: { fontWeight: 'bold', fontSize: 15, marginBottom: 4 },
  newsDesc: { fontSize: 13, color: '#555' },
  separator: { height: 1, backgroundColor: '#e0e0e0', marginHorizontal: 12 },
  footer: { textAlign: 'center', color: '#888', fontStyle: 'italic', padding: 16 },
});