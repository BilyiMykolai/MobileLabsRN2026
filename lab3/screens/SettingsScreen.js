import React from 'react';
import { View, Text, Switch, StyleSheet } from 'react-native';

export default function SettingsScreen({ darkMode, setDarkMode, theme }) {
  const s = styles(theme);
  return (
    <View style={s.container}>
      <Text style={s.heading}>Налаштування</Text>

      <View style={s.row}>
        <Text style={s.label}>🌙 Темна тема</Text>
        <Switch value={darkMode} onValueChange={setDarkMode} trackColor={{ true: '#007AFF' }} />
      </View>

      <View style={s.info}>
        <Text style={s.infoText}>👆 Tap — +1 очко</Text>
        <Text style={s.infoText}>👆👆 Double-tap — +2 очки</Text>
        <Text style={s.infoText}>🔥 Long press 3с — +5 очків</Text>
        <Text style={s.infoText}>👋 Swipe — +1-10 очків</Text>
        <Text style={s.infoText}>🔍 Pinch — +3 очки</Text>
      </View>

      <Text style={s.footer}>Білий Микола Миколайович, ІПЗ 22-2</Text>
    </View>
  );
}

const styles = (theme) => StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.bg, padding: 20 },
  heading: { fontSize: 22, fontWeight: 'bold', color: theme.text, marginBottom: 24 },
  row: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: theme.card, borderRadius: 12, padding: 16, marginBottom: 12, elevation: 2,
  },
  label: { fontSize: 16, color: theme.text },
  info: { backgroundColor: theme.card, borderRadius: 12, padding: 16, marginTop: 12, elevation: 2 },
  infoText: { fontSize: 14, color: theme.text, marginBottom: 8 },
  footer: { textAlign: 'center', color: theme.sub, fontStyle: 'italic', marginTop: 'auto', paddingBottom: 16 },
});