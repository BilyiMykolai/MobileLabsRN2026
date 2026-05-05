import React, { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, Animated, Dimensions,
} from 'react-native';
import {
  GestureDetector, Gesture, GestureHandlerRootView,
} from 'react-native-gesture-handler';

const { width, height } = Dimensions.get('window');

export default function GameScreen({ score, setScore, challenges, updateChallenge, theme }) {
  const [floats, setFloats] = useState([]);

  // Використовуємо звичайний Animated замість reanimated
  const posX = useRef(new Animated.Value(width / 2 - 60)).current;
  const posY = useRef(new Animated.Value(height / 2 - 200)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const posXValue = useRef(width / 2 - 60);
  const posYValue = useRef(height / 2 - 200);
  const scaleValue = useRef(1);
  const baseScaleValue = useRef(1);

  posX.addListener(({ value }) => { posXValue.current = value; });
  posY.addListener(({ value }) => { posYValue.current = value; });

  const tapCount = useRef(challenges.tap10);
  const doubleTapCount = useRef(challenges.doubleTap5);

  const addFloat = (text, color = '#007AFF') => {
    const id = Date.now();
    setFloats(prev => [...prev, { id, text, color }]);
    setTimeout(() => setFloats(prev => prev.filter(f => f.id !== id)), 800);
  };

  const addScore = (pts) => {
    setScore(prev => {
      const next = prev + pts;
      if (next >= 100 && !challenges.reach100) updateChallenge('reach100', true);
      return next;
    });
  };

  // Single tap
  const tapGesture = Gesture.Tap()
    .runOnJS(true)
    .onEnd(() => {
      addScore(1);
      addFloat('+1');
      tapCount.current += 1;
      if (tapCount.current <= 10) updateChallenge('tap10', tapCount.current);
    });

  // Double tap
  const doubleTapGesture = Gesture.Tap()
    .numberOfTaps(2)
    .runOnJS(true)
    .onEnd(() => {
      addScore(2);
      addFloat('+2 🎯', '#ff9500');
      doubleTapCount.current += 1;
      if (doubleTapCount.current <= 5) updateChallenge('doubleTap5', doubleTapCount.current);
    });

  // Long press
  const longPressGesture = Gesture.LongPress()
    .minDuration(3000)
    .runOnJS(true)
    .onEnd(() => {
      addScore(5);
      addFloat('+5 🔥', '#ff3b30');
      updateChallenge('longPress', true);
    });

  // Pan (drag)
  const startX = useRef(0);
  const startY = useRef(0);
  const panGesture = Gesture.Pan()
    .runOnJS(true)
    .onStart(() => {
      startX.current = posXValue.current;
      startY.current = posYValue.current;
    })
    .onUpdate((e) => {
      posX.setValue(startX.current + e.translationX);
      posY.setValue(startY.current + e.translationY);
    })
    .onEnd(() => {
      updateChallenge('pan', true);
    });

  // Swipe right
  const flingRightGesture = Gesture.Fling()
    .direction(1)
    .runOnJS(true)
    .onEnd(() => {
      const pts = Math.floor(Math.random() * 10) + 1;
      addScore(pts);
      addFloat(`+${pts} 👉`, '#34c759');
      updateChallenge('swipeRight', true);
    });

  // Swipe left
  const flingLeftGesture = Gesture.Fling()
    .direction(2)
    .runOnJS(true)
    .onEnd(() => {
      const pts = Math.floor(Math.random() * 10) + 1;
      addScore(pts);
      addFloat(`+${pts} 👈`, '#5856d6');
      updateChallenge('swipeLeft', true);
    });

  // Pinch
  const pinchGesture = Gesture.Pinch()
    .runOnJS(true)
    .onUpdate((e) => {
      const newScale = Math.max(0.5, Math.min(2.5, baseScaleValue.current * e.scale));
      scaleValue.current = newScale;
      scaleAnim.setValue(newScale);
    })
    .onEnd(() => {
      baseScaleValue.current = scaleValue.current;
      addScore(3);
      addFloat('+3 🔍', '#ff2d55');
      updateChallenge('pinch', true);
    });

  // Compose gestures
  const composed = Gesture.Simultaneous(
    Gesture.Exclusive(doubleTapGesture, tapGesture),
    longPressGesture,
    panGesture,
    Gesture.Exclusive(flingRightGesture, flingLeftGesture),
    pinchGesture,
  );

  const s = styles(theme);

  return (
    <GestureHandlerRootView style={s.container}>
      <View style={s.scoreBox}>
        <Text style={s.scoreLabel}>SCORE</Text>
        <Text style={s.scoreValue}>{score}</Text>
      </View>

      <GestureDetector gesture={composed}>
        <Animated.View style={[s.clicker, {
          transform: [
            { translateX: posX },
            { translateY: posY },
            { scale: scaleAnim },
          ],
          position: 'absolute',
        }]}>
          <Text style={s.clickerEmoji}>👆</Text>
          <Text style={s.clickerText}>TAP ME</Text>
        </Animated.View>
      </GestureDetector>

      {floats.map(f => (
        <Text key={f.id} style={[s.float, { color: f.color }]}>{f.text}</Text>
      ))}

      <View style={s.legend}>
        {[
          ['👆', 'Tap: +1 point'],
          ['👆', 'Double-tap: +2 points'],
          ['🔥', 'Long-press (3s): +5 points'],
          ['👋', 'Swipe: +1-10 random points'],
          ['🔍', 'Pinch: +3 points'],
        ].map(([icon, text], i) => (
          <Text key={i} style={s.legendText}>{icon} {text}</Text>
        ))}
      </View>
    </GestureHandlerRootView>
  );
}

const styles = (theme) => StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.bg },
  scoreBox: { alignItems: 'center', paddingTop: 40 },
  scoreLabel: { fontSize: 12, color: theme.sub, letterSpacing: 2 },
  scoreValue: { fontSize: 64, fontWeight: 'bold', color: theme.text },
  clicker: {
    width: 120, height: 120, borderRadius: 60,
    backgroundColor: '#007AFF', justifyContent: 'center',
    alignItems: 'center', elevation: 8,
    shadowColor: '#007AFF', shadowOpacity: 0.5, shadowRadius: 10,
  },
  clickerEmoji: { fontSize: 36 },
  clickerText: { color: '#fff', fontSize: 11, fontWeight: 'bold', marginTop: 2 },
  float: { position: 'absolute', top: '35%', alignSelf: 'center', fontSize: 28, fontWeight: 'bold' },
  legend: {
    position: 'absolute', bottom: 24, left: 16,
    backgroundColor: theme.card, borderRadius: 12, padding: 12,
    elevation: 4,
  },
  legendText: { fontSize: 13, color: theme.text, marginVertical: 2 },
});