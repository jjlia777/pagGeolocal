import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function HospitalDetails({ route }) {
  const { hospital } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{hospital.name}</Text>
      {/* Adicione mais informações aqui, como endereço, telefone, etc. */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});
