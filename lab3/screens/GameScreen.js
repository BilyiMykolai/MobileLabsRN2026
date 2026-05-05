import React, { useState, useRef } from 'react';
import styled from 'styled-components/native';
import { Dimensions } from 'react-native';
import {
  GestureDetector, Gesture, GestureHandlerRootView,
} from 'react-native-gesture-handler';
import { Animated } from 'react-native';

const { width, height } = Dimensions.get('window');

const Container = styled.View`
  flex: 1;
  background-color: ${props => props.bg || '#f5f5f5'};
`;

const ScoreBox = styled.View`
  align-items: center;
  padding-top: 40px;
`;

const ScoreLabel = styled.Text`
  font-size: 12px;
  letter-spacing: 2px;
  color: #888;
`;

const ScoreValue = styled.Text`
  font-size: 64px;
  font-weight: bold;
  color: #000;
`;

const FloatText = styled.Text`
  position: absolute;
  top: 35%;
  align-self: center;
  font-size: 28px;
  font-weight: bold;
`;

const LegendBox = styled.View`
  position: absolute;
  bottom: 24px;
  left: 16px;
  background-color: #fff;
  border-radius: 12px;
  padding: 12px;
  elevation: 4;
`;

const LegendText = styled.Text`
  font-size: 13px;
  color: #333;
  margin-vertical: 2px;
`;

const ClickerEmoji = styled.Text`
  font-size: 36px;
`;

const ClickerLabel = styled.Text`
  color: #fff;
  font-size: 11px;
  font-weight: bold;
  margin-top: 2px;
`;

export default function GameScreen({ score, setScore, challenges, updateChallenge, theme }) {
  const [floats, setFloats] = useState([]);

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

  const tapGesture = Gesture.Tap()
    .runOnJS(true)
    .onEnd(() => {
      addScore(1);
      addFloat('+1');
      tapCount.current += 1;
      if (tapCount.current <= 10) updateChallenge('tap10', tapCount.current);
    });

  const doubleTapGesture = Gesture.Tap()
    .numberOfTaps(2)
    .runOnJS(true)
    .onEnd(() => {
      addScore(2);
      addFloat('+2 🎯', '#ff9500');
      doubleTapCount.current += 1;
      if (doubleTapCount.current <= 5) updateChallenge('doubleTap5', doubleTapCount.current);
    });

  const longPressGesture = Gesture.LongPress()
    .minDuration(3000)
    .runOnJS(true)
    .onEnd(() => {
      addScore(5);
      addFloat('+5 🔥', '#ff3b30');
      updateChallenge('longPress', true);
    });

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

  const flingRightGesture = Gesture.Fling()
    .direction(1)
    .runOnJS(true)
    .onEnd(() => {
      const pts = Math.floor(Math.random() * 10) + 1;
      addScore(pts);
      addFloat(`+${pts} 👉`, '#34c759');
      updateChallenge('swipeRight', true);
    });

  const flingLeftGesture = Gesture.Fling()
    .direction(2)
    .runOnJS(true)
    .onEnd(() => {
      const pts = Math.floor(Math.random() * 10) + 1;
      addScore(pts);
      addFloat(`+${pts} 👈`, '#5856d6');
      updateChallenge('swipeLeft', true);
    });

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

  const composed = Gesture.Simultaneous(
    Gesture.Exclusive(doubleTapGesture, tapGesture),
    longPressGesture,
    panGesture,
    Gesture.Exclusive(flingRightGesture, flingLeftGesture),
    pinchGesture,
  );

  return (
    <Container bg={theme?.bg}>
      <ScoreBox>
        <ScoreLabel>SCORE</ScoreLabel>
        <ScoreValue>{score}</ScoreValue>
      </ScoreBox>

      <GestureDetector gesture={composed}>
        <Animated.View style={{
          width: 120, height: 120, borderRadius: 60,
          backgroundColor: '#007AFF', justifyContent: 'center',
          alignItems: 'center', elevation: 8,
          position: 'absolute',
          transform: [
            { translateX: posX },
            { translateY: posY },
            { scale: scaleAnim },
          ],
        }}>
          <ClickerEmoji>👆</ClickerEmoji>
          <ClickerLabel>TAP ME</ClickerLabel>
        </Animated.View>
      </GestureDetector>

      {floats.map(f => (
        <FloatText key={f.id} style={{ color: f.color }}>{f.text}</FloatText>
      ))}

      <LegendBox>
        {[
          ['👆', 'Tap: +1 point'],
          ['👆', 'Double-tap: +2 points'],
          ['🔥', 'Long-press (3s): +5 points'],
          ['👋', 'Swipe: +1-10 random points'],
          ['🔍', 'Pinch: +3 points'],
        ].map(([icon, text], i) => (
          <LegendText key={i}>{icon} {text}</LegendText>
        ))}
      </LegendBox>
    </Container>
  );
}