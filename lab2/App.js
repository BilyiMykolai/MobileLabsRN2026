import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Text } from 'react-native';

import MainScreen from './screens/MainScreen';
import DetailsScreen from './screens/DetailsScreen';
import ContactsScreen from './screens/ContactsScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function NewsStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Main" component={MainScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Details" component={DetailsScreen} />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator screenOptions={{ headerTitle: 'FirstMobileApp' }}>
        <Tab.Screen
          name="Новини"
          component={NewsStack}
          options={{ tabBarIcon: () => <Text>📰</Text> }}
        />
        <Tab.Screen
          name="Контакти"
          component={ContactsScreen}
          options={{ tabBarIcon: () => <Text>👥</Text> }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}