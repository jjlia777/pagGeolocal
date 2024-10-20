
import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TextInput, Text, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { Ionicons, FontAwesome } from '@expo/vector-icons'; // Ícones
import * as Location from 'expo-location';

export default function App() {
  const [location, setLocation] = useState(null);
  const [search, setSearch] = useState('');
  const [route, setRoute] = useState([]);
  const destination = {
    latitude: -23.537771481736545,  // Latitude de exemplo
    longitude: -46.358699761376954, // Longitude de exemplo
  };

  const calculateRoute = async (origin, destination) => {
    try {
      const originCoords = `${origin.longitude},${origin.latitude}`;
      const destinationCoords = `${destination.longitude},${destination.latitude}`;
      const osrmUrl = `https://router.project-osrm.org/route/v1/driving/${originCoords};${destinationCoords}?overview=full&geometries=geojson`;

      const response = await fetch(osrmUrl);
      const data = await response.json();

      if (data.routes && data.routes.length > 0) {
        const routeData = data.routes[0].geometry.coordinates;
        const routeCoordinates = routeData.map((coord) => ({
          latitude: coord[1],
          longitude: coord[0],
        }));
        setRoute(routeCoordinates);
      }
    } catch (error) {
      console.error('Erro ao calcular a rota:', error);
    }
  };

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });

      calculateRoute(location.coords, destination);
    })();
  }, []);

  if (!location) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Map View com funcionalidade de rota e localização */}
      <MapView
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
        <Marker
          coordinate={destination}
          title="Destino"
          description="Ponto de chegada"
        >
          <FontAwesome name="flag" size={40} color="green" />
        </Marker>
        <Marker
          coordinate={location}
          title="Você está aqui"
          description="Localização atual"
        >
          <FontAwesome name="map-marker" size={40} color="red" />
        </Marker>

        {route.length > 0 && (
          <Polyline coordinates={route} strokeWidth={4} strokeColor="blue" />
        )}
      </MapView>

      {/* Overlay que contém a barra de busca e os botões */}
      <View style={styles.overlay}>
        <View style={styles.search}>
          {/* Search Container */}
          <View style={styles.searchContainer}>
            <Ionicons name="search" size={24} color="gray" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Encontre um hospital..."
              value={search}
              onChangeText={setSearch}
            />
          </View>
          <TouchableOpacity style={styles.filterButton}>
            <Ionicons name="options-outline" size={24} color="gray" />
          </TouchableOpacity>
        </View>

        {/* Botões roxos com Scroll Horizontal */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scrollContainer}>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.buttonText}>Até 5 km</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.buttonText}>svbkjf</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.buttonText}>dkvhbdf</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.buttonText}>Outro Botão</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  map: {
    ...StyleSheet.absoluteFillObject, // Faz o mapa ocupar a tela inteira
  },
  overlay: {
    position: 'absolute',
    top: 50,
    width: '100%',
    paddingHorizontal: 20,
  },
  search: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 30,
    borderWidth: 1,
    borderColor: '#007AFF',
    paddingHorizontal: 10,
    height: 50,
    flex: 1,
    marginRight: 10,
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
    height: '100%',
    fontSize: 16,
  },
  filterButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#007AFF',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 5,
  },
  scrollContainer: {
    flexDirection: 'row',
  },
  actionButton: {
    backgroundColor: '#5D5FEF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 30,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});
