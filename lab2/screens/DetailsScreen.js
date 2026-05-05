import React, { useLayoutEffect } from 'react';
import { View, Text, Image, StyleSheet, ScrollView } from 'react-native';

export default function DetailsScreen({ route, navigation }) {
  const { item } = route.params;

  useLayoutEffect(() => {
    navigation.setOptions({ title: item.title });
  }, [navigation, item]);

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.desc}>{item.description}</Text>
      <Text style={styles.fullText}>
        Це повний текст новини. У реальному застосунку тут буде детальний опис події,
        фотографії, коментарі тощо. Наразі це демонстраційні дані для лабораторної роботи.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  image: { width: '100%', height: 200, backgroundColor: '#eee' },
  title: { fontSize: 20, fontWeight: 'bold', padding: 16, paddingBottom: 8 },
  desc: { fontSize: 14, color: '#555', paddingHorizontal: 16, marginBottom: 8 },
  fullText: { fontSize: 14, color: '#333', paddingHorizontal: 16, lineHeight: 22 },
});