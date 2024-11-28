import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import hospitals from '../data/hospitals.json'; // Importa os hospitais
import { useNavigation } from '@react-navigation/native';

const MapScreen = () => {
  const navigation = useNavigation();

  const handleMarkerPress = (hospital) => {
    navigation.navigate('HospitalDetails', { hospital }); // Passa os dados do hospital
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: -23.55052, // Coordenadas de SP
          longitude: -46.633308,
          latitudeDelta: 0.2,
          longitudeDelta: 0.2,
        }}
      >
        {hospitals.map((hospital) => (
          <Marker
            key={hospital.id}
            coordinate={{
              latitude: hospital.latitude,
              longitude: hospital.longitude,
            }}
            title={hospital.name}
            description={hospital.address}
            onPress={() => handleMarkerPress(hospital)} // Envia dados ao clicar
          />
        ))}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
});

export default MapScreen;
