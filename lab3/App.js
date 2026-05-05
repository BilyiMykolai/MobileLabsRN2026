import 'react-native-gesture-handler';
import React, { useState, useRef } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import GameScreen from './screens/GameScreen';
import ChallengesScreen from './screens/ChallengesScreen';
import SettingsScreen from './screens/SettingsScreen';

const Tab = createBottomTabNavigator();

export default function App() {
  const [score, setScore] = useState(0);
  const [challenges, setChallenges] = useState({
    tap10: 0,
    doubleTap5: 0,
    longPress: false,
    pan: false,
    swipeRight: false,
    swipeLeft: false,
    pinch: false,
    reach100: false,
    custom: false,
  });
  const [darkMode, setDarkMode] = useState(false);

  const updateChallenge = (key, value) => {
    setChallenges(prev => ({ ...prev, [key]: value }));
  };

  const theme = {
    bg: darkMode ? '#121212' : '#f5f5f5',
    card: darkMode ? '#1e1e1e' : '#ffffff',
    text: darkMode ? '#ffffff' : '#000000',
    sub: darkMode ? '#aaaaaa' : '#666666',
    accent: '#007AFF',
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={{
            headerStyle: { backgroundColor: theme.card },
            headerTintColor: theme.text,
            tabBarStyle: { backgroundColor: theme.card },
            tabBarActiveTintColor: theme.accent,
            tabBarInactiveTintColor: theme.sub,
          }}
        >
          <Tab.Screen
            name="Gesture Clicker"
            options={{ tabBarIcon: () => <Text>▶️</Text> }}
          >
            {props => (
              <GameScreen
                {...props}
                score={score}
                setScore={setScore}
                challenges={challenges}
                updateChallenge={updateChallenge}
                theme={theme}
              />
            )}
          </Tab.Screen>

          <Tab.Screen
            name="Challenges"
            options={{ tabBarIcon: () => <Text>📋</Text> }}
          >
            {props => (
              <ChallengesScreen
                {...props}
                score={score}
                challenges={challenges}
                theme={theme}
              />
            )}
          </Tab.Screen>

          <Tab.Screen
            name="Settings"
            options={{ tabBarIcon: () => <Text>⚙️</Text> }}
          >
            {props => (
              <SettingsScreen
                {...props}
                darkMode={darkMode}
                setDarkMode={setDarkMode}
                theme={theme}
              />
            )}
          </Tab.Screen>
        </Tab.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}