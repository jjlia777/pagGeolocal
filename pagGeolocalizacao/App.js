import 'react-native-gesture-handler'; // Import no topo
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import MapScreen from './pages/MapScreen'; // Importando corretamente o MapScreen

const Stack = createStackNavigator();

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
    <NavigationContainer>
      <Stack.Navigator>
        {/* Tela principal de mapa */}
        <Stack.Screen 
          name="MapScreen" 
          component={MapScreen} 
          options={{ headerShown: false }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
    </GestureHandlerRootView>
  );
}
