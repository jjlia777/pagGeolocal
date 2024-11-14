import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, TextInput, Text, TouchableOpacity, ScrollView, ActivityIndicator, Image } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import BottomSheetComponent from '../components/BottomSheetComponent'; // Ajustado para o caminho correto

// Lista de hospitais locais
const hospitals = [
  {
    id: 1,
    name: 'Hospital Regional de Ferraz',
    latitude: -23.537771,
    longitude: -46.358699,
    // image: require('../../assets/hospital1.png'), // Caminho ajustado
  },
  {
    id: 2,
    name: 'UBS Centro',
    latitude: -23.532345,
    longitude: -46.355123,
    // image: require('../../assets/ubs.png'), // Certifique-se que o caminho está correto
  },
];

  // Adicione outros hospitais aqui


export default function MapScreen() {
  const [location, setLocation] = useState(null);
  const [search, setSearch] = useState('');
  const [filteredHospitals, setFilteredHospitals] = useState(hospitals);
  const [selectedHospital, setSelectedHospital] = useState(null);
  const mapRef = useRef(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return;

      let location = await Location.getCurrentPositionAsync({});
      setLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    })();
  }, []);

  const handleSearch = (text) => {
    setSearch(text);
    if (text) {
      const results = hospitals.filter(hospital =>
        hospital.name.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredHospitals(results);
    } else {
      setFilteredHospitals(hospitals);
    }
  };

  const handleMarkerPress = (hospital) => {
    setSelectedHospital(hospital);
  };

  if (!location) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={{
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        showsUserLocation={true}
        showsMyLocationButton={true}
      >
        {filteredHospitals.map(hospital => (
          <Marker
            key={hospital.id}
            coordinate={{ latitude: hospital.latitude, longitude: hospital.longitude }}
            onPress={() => handleMarkerPress(hospital)}
          >
            <View style={styles.customMarker}>
              <Image source={hospital.image} style={styles.markerImage} />
            </View>
          </Marker>
        ))}
      </MapView>

      <View style={styles.overlay}>
        <View style={styles.search}>
          <Ionicons name="search" size={24} color="gray" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Encontre um hospital..."
            value={search}
            onChangeText={handleSearch}
          />
        </View>
      </View>

      {selectedHospital && (
        <BottomSheetComponent hospital={selectedHospital} onClose={() => setSelectedHospital(null)} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  overlay: {
    position: 'absolute',
    top: 50,
    width: '100%',
    paddingHorizontal: 20,
  },
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 30,
    borderWidth: 1,
    borderColor: '#007AFF',
    paddingHorizontal: 10,
    height: 50,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 5,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  customMarker: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    padding: 5,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 5,
  },
  markerImage: {
    width: 40,
    height: 40,
    borderRadius: 5,
  },
});
