import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import FileManagerScreen from './screens/FileManagerScreen';
import FileViewerScreen from './screens/FileViewerScreen';
import FileEditorScreen from './screens/FileEditorScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerStyle: { backgroundColor: '#007AFF' }, headerTintColor: '#fff' }}>
        <Stack.Screen name="FileManager" component={FileManagerScreen} options={{ title: '📁 Файловий менеджер' }} />
        <Stack.Screen name="FileViewer" component={FileViewerScreen} options={{ title: '👁 Перегляд файлу' }} />
        <Stack.Screen name="FileEditor" component={FileEditorScreen} options={{ title: '✏️ Редагування файлу' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}