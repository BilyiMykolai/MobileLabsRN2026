import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';

export default function ChallengesScreen({ score, challenges, theme }) {
  const items = [
    { key: 'tap10', icon: '👆', title: 'Tap 10 times', desc: 'Натисни на об\'єкт 10 разів', max: 10, value: challenges.tap10 },
    { key: 'doubleTap5', icon: '👆', title: 'Double-tap 5 times', desc: 'Зроби 5 подвійних кліків', max: 5, value: challenges.doubleTap5 },
    { key: 'longPress', icon: '🔥', title: 'Long press 3 seconds', desc: 'Утримуй об\'єкт 3 секунди', done: challenges.longPress },
    { key: 'pan', icon: '✋', title: 'Drag the object', desc: 'Перетягни об\'єкт по екрану', done: challenges.pan },
    { key: 'swipeRight', icon: '👉', title: 'Swipe right', desc: 'Зроби швидкий свайп вправо', done: challenges.swipeRight },
    { key: 'swipeLeft', icon: '👈', title: 'Swipe left', desc: 'Зроби швидкий свайп вліво', done: challenges.swipeLeft },
    { key: 'pinch', icon: '🔍', title: 'Pinch to resize', desc: 'Збільш або зменш об\'єкт', done: challenges.pinch },
    { key: 'reach100', icon: '🏆', title: 'Reach 100 points', desc: 'Набери 100 очок', done: challenges.reach100 },
    { key: 'custom', icon: '⭐', title: 'Набрати 50 очок за 1 хв', desc: 'Власне завдання', done: score >= 50 },
  ];

  const s = styles(theme);

  return (
    <ScrollView style={s.container}>
      {items.map((item) => {
        const isProgress = item.max !== undefined;
        const isDone = isProgress ? item.value >= item.max : (item.done || false);

        return (
          <View key={item.key} style={s.card}>
            <View style={s.cardLeft}>
              <Text style={s.icon}>{isDone ? '✅' : item.icon}</Text>
            </View>
            <View style={s.cardMid}>
              <Text style={[s.title, isDone && s.done]}>{item.title}</Text>
              <Text style={s.desc}>{item.desc}</Text>
              {isProgress && (
                <View style={s.progressBar}>
                  <View style={[s.progressFill, { width: `${Math.min(100, (item.value / item.max) * 100)}%` }]} />
                </View>
              )}
            </View>
            <Text style={[s.status, isDone && s.statusDone]}>
              {isProgress ? `${Math.min(item.value, item.max)}/${item.max}` : (isDone ? '✓' : '○')}
            </Text>
          </View>
        );
      })}
    </ScrollView>
  );
}

const styles = (theme) => StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.bg, padding: 12 },
  card: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: theme.card, borderRadius: 12,
    padding: 12, marginBottom: 10, elevation: 2,
  },
  cardLeft: { marginRight: 10 },
  cardMid: { flex: 1 },
  icon: { fontSize: 24 },
  title: { fontSize: 15, fontWeight: '600', color: '#000' },
  done: { color: '#34c759' },
  desc: { fontSize: 12, color: '#888', marginTop: 2 },
  progressBar: { height: 4, backgroundColor: '#eee', borderRadius: 2, marginTop: 6 },
  progressFill: { height: 4, backgroundColor: '#007AFF', borderRadius: 2 },
  status: { fontSize: 13, color: '#888', marginLeft: 8 },
  statusDone: { color: '#34c759', fontWeight: 'bold' },
});