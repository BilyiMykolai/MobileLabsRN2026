import React from 'react';
import {
  View, Text, FlatList, Image,
  TouchableOpacity, StyleSheet,
} from 'react-native';
import { Link, router } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { products } from '../../data/products';

export default function CatalogScreen() {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.replace('/login');
  };

  const renderItem = ({ item }) => (
    <Link href={`/details/${item.id}`} asChild>
      <TouchableOpacity style={styles.card}>
        <Image source={{ uri: item.image }} style={styles.image} />
        <View style={styles.cardBody}>
          <Text style={styles.category}>{item.category}</Text>
          <Text style={styles.productTitle} numberOfLines={2}>{item.title}</Text>
          <View style={styles.cardFooter}>
            <Text style={styles.price}>{item.price} ₴</Text>
            <Text style={styles.rating}>⭐ {item.rating}</Text>
          </View>
        </View>
      </TouchableOpacity>
    </Link>
  );

  return (
    <FlatList
      data={products}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      numColumns={2}
      columnWrapperStyle={styles.row}
      contentContainerStyle={styles.list}
      ListHeaderComponent={
        <View style={styles.header}>
          <Text style={styles.welcome}>👋 Привіт, {user?.name}!</Text>
          <TouchableOpacity onPress={handleLogout} style={styles.logoutBtn}>
            <Text style={styles.logoutText}>Вийти</Text>
          </TouchableOpacity>
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  list: { padding: 12, backgroundColor: '#f5f5f5' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  welcome: { fontSize: 18, fontWeight: 'bold' },
  logoutBtn: { backgroundColor: '#ff3b30', borderRadius: 8, paddingHorizontal: 14, paddingVertical: 8 },
  logoutText: { color: '#fff', fontWeight: 'bold' },
  row: { justifyContent: 'space-between', marginBottom: 12 },
  card: { backgroundColor: '#fff', borderRadius: 16, width: '48%', elevation: 3, overflow: 'hidden' },
  image: { width: '100%', height: 130, backgroundColor: '#eee' },
  cardBody: { padding: 10 },
  category: { fontSize: 11, color: '#007AFF', fontWeight: '600', marginBottom: 4 },
  productTitle: { fontSize: 13, fontWeight: '600', color: '#222', marginBottom: 8 },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  price: { fontSize: 15, fontWeight: 'bold', color: '#34c759' },
  rating: { fontSize: 12, color: '#888' },
});