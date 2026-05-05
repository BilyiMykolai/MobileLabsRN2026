import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, View } from 'react-native';

import HomeScreen from './screens/HomeScreen';
import GalleryScreen from './screens/GalleryScreen';
import ProfileScreen from './screens/ProfileScreen';

const Tab = createBottomTabNavigator();

const icon = (label) => ({ focused }) => (
  <Text style={{ fontSize: 20, color: focused ? '#007AFF' : '#888' }}>
    {label === 'Головна' ? '🏠' : label === 'Фотогалерея' ? '🖼️' : '👤'}
  </Text>
);

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator screenOptions={{ headerShown: true, headerTitle: 'FirstMobileApp' }}>
        <Tab.Screen name="Головна" component={HomeScreen} options={{ tabBarIcon: icon('Головна') }} />
        <Tab.Screen name="Фотогалерея" component={GalleryScreen} options={{ tabBarIcon: icon('Фотогалерея') }} />
        <Tab.Screen name="Профіль" component={ProfileScreen} options={{ tabBarIcon: icon('Профіль') }} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}