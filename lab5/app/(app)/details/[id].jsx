import React from 'react';
import {
  View, Text, Image, ScrollView,
  TouchableOpacity, StyleSheet,
} from 'react-native';
import { useLocalSearchParams, router, useNavigation } from 'expo-router';
import { useLayoutEffect } from 'react';
import { products } from '../../../data/products';

export default function DetailsScreen() {
  const { id } = useLocalSearchParams();
  const navigation = useNavigation();
  const product = products.find(p => p.id === id);

  useLayoutEffect(() => {
    if (product) navigation.setOptions({ title: product.title });
  }, [product]);

  if (!product) {
    return (
      <View style={styles.notFound}>
        <Text style={styles.notFoundText}>Товар не знайдено 😕</Text>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backBtnText}>← Назад</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: product.image }} style={styles.image} />
      <View style={styles.body}>
        <Text style={styles.category}>{product.category}</Text>
        <Text style={styles.title}>{product.title}</Text>
        <View style={styles.row}>
          <Text style={styles.price}>{product.price} ₴</Text>
          <Text style={styles.rating}>⭐ {product.rating}</Text>
        </View>
        <Text style={styles.descLabel}>Опис</Text>
        <Text style={styles.desc}>{product.description}</Text>

        <TouchableOpacity style={styles.buyBtn}>
          <Text style={styles.buyBtnText}>🛒 Додати до кошика</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  image: { width: '100%', height: 280, backgroundColor: '#eee' },
  body: { padding: 20 },
  category: { fontSize: 13, color: '#007AFF', fontWeight: '600', marginBottom: 6 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#222', marginBottom: 12 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  price: { fontSize: 24, fontWeight: 'bold', color: '#34c759' },
  rating: { fontSize: 16, color: '#888' },
  descLabel: { fontSize: 16, fontWeight: 'bold', marginBottom: 8 },
  desc: { fontSize: 15, lineHeight: 24, color: '#444' },
  buyBtn: { backgroundColor: '#007AFF', borderRadius: 14, padding: 16, alignItems: 'center', marginTop: 24 },
  buyBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  notFound: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  notFoundText: { fontSize: 18, marginBottom: 16 },
  backBtn: { backgroundColor: '#007AFF', borderRadius: 10, paddingHorizontal: 20, paddingVertical: 10 },
  backBtnText: { color: '#fff', fontWeight: 'bold' },
});