import React from 'react';
import { View, Text, SectionList, StyleSheet } from 'react-native';

const contacts = [
  {
    title: 'Викладачі',
    data: [
      { id: '1', name: 'Іваненко Іван Іванович', phone: '+380 50 111 2233' },
      { id: '2', name: 'Петренко Петро Петрович', phone: '+380 67 222 3344' },
      { id: '3', name: 'Сидоренко Олена Василівна', phone: '+380 73 333 4455' },
    ],
  },
  {
    title: 'Студенти ІПЗ 22-2',
    data: [
      { id: '4', name: 'Білий Микола', phone: '+380 50 999 0011' },
      { id: '5', name: 'Коваленко Андрій', phone: '+380 67 888 9900' },
      { id: '6', name: 'Мельник Юлія', phone: '+380 93 777 8899' },
    ],
  },
  {
    title: 'Адміністрація',
    data: [
      { id: '7', name: 'Деканат ФІТ', phone: '+380 412 44 55 66' },
      { id: '8', name: 'Бібліотека ЖДУ', phone: '+380 412 77 88 99' },
    ],
  },
];

export default function ContactsScreen() {
  return (
    <SectionList
      sections={contacts}
      keyExtractor={(item) => item.id}
      renderSectionHeader={({ section: { title } }) => (
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{title}</Text>
        </View>
      )}
      renderItem={({ item }) => (
        <View style={styles.contactItem}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{item.name[0]}</Text>
          </View>
          <View>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.phone}>{item.phone}</Text>
          </View>
        </View>
      )}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
      ListFooterComponent={
        <Text style={styles.footer}>Білий Микола, ІПЗ 22-2</Text>
      }
    />
  );
}

const styles = StyleSheet.create({
  sectionHeader: { backgroundColor: '#f0f4ff', paddingHorizontal: 16, paddingVertical: 8 },
  sectionTitle: { fontWeight: 'bold', fontSize: 14, color: '#3355aa' },
  contactItem: { flexDirection: 'row', padding: 12, alignItems: 'center', backgroundColor: '#fff' },
  avatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#007AFF', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  avatarText: { color: '#fff', fontWeight: 'bold', fontSize: 18 },
  name: { fontSize: 15, fontWeight: '500' },
  phone: { fontSize: 13, color: '#888' },
  separator: { height: 1, backgroundColor: '#eee', marginLeft: 68 },
  footer: { textAlign: 'center', color: '#888', fontStyle: 'italic', padding: 16 },
});