import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TextInput, Button, Text } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';

export default function App() {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [distance, setDistance] = useState('5 km');
  const [search, setSearch] = useState('');

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    })();
  }, []);

  if (location === null) {
    return <Text>Carregando mapa...</Text>;
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Encontre um hospital..."
        value={search}
        onChangeText={setSearch}
      />
      <View style={styles.buttonContainer}>
        <Button title={`Até ${distance}`} onPress={() => setDistance('10 km')} />
        <Button title="Filtrar" onPress={() => alert('Filtro aplicado')} />
      </View>
      <MapView style={styles.map} initialRegion={location}>
        <Marker coordinate={location} title="Você está aqui" />
        {/* Adicione mais marcadores abaixo, como no exemplo */}
        <Marker coordinate={{ latitude: -23.5442, longitude: -46.3729 }} title="Hospital A" />
        <Marker coordinate={{ latitude: -23.5505, longitude: -46.6333 }} title="Hospital B" />
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  map: {
    width: '100%',
    height: '70%',
  },
  searchInput: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    margin: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
  },
});
