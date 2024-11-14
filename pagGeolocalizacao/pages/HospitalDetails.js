import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function HospitalDetails({ route }) {
  const { hospital } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{hospital.name}</Text>
      {/* Adicione outros detalhes do hospital aqui */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
   
  }
})