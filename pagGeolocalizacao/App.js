import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import MapScreen from './pages/MapScreen';
import HospitalDetails from './pages/HospitalDetails';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="MapScreen"
          component={MapScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="HospitalDetails"
          component={HospitalDetails}
          options={{ title: 'Detalhes do Hospital' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
