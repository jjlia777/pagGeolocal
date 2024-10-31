import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, TextInput, Text, TouchableOpacity, ScrollView, ActivityIndicator, Image } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import HospitalDetails from './pages/HospitalDetails';

const Stack = createStackNavigator();

// Dados dos hospitais
const hospitals = [
  {
    id: 1,
    name: 'Hospital Regional de Ferraz',
    latitude: -23.537771,
    longitude: -46.358699,
    image: require('./assets/hospital1.png'), // Substitua pela imagem real do hospital
  },
  {
    id: 2,
    name: 'UBS Centro',
    latitude: -23.532345,
    longitude: -46.355123,
    image: require('./assets/ubs.png'), // Substitua pela imagem real da UBS
  },
  // Adicione outros hospitais e UBS aqui
];

function MapScreen({ navigation }) {
  const [location, setLocation] = useState(null);
  const [search, setSearch] = useState('');
  const [route, setRoute] = useState([]);
  const mapRef = useRef(null);

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
      if (status !== 'granted') return;

      let location = await Location.getCurrentPositionAsync({});
      setLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });

      calculateRoute(location.coords, hospitals[0]); // Exemplo de rota para o primeiro hospital
    })();
  }, []);

  const handleHospitalSelect = (hospital) => {
    setSearch(hospital.name);
    mapRef.current.animateToRegion({
      latitude: hospital.latitude,
      longitude: hospital.longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    }, 1000);
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
        {/* Marcadores dos hospitais */}
        {hospitals.map(hospital => (
          <Marker
            key={hospital.id}
            coordinate={{ latitude: hospital.latitude, longitude: hospital.longitude }}
            onPress={() => navigation.navigate('HospitalDetails', { hospital })}
          >
            <View style={styles.customMarker}>
              <Image source={hospital.image} style={styles.markerImage} />
            </View>
          </Marker>
        ))}

        {route.length > 0 && (
          <Polyline coordinates={route} strokeWidth={4} strokeColor="blue" />
        )}
      </MapView>

      {/* Barra de pesquisa */}
      <View style={styles.overlay}>
        <View style={styles.search}>
          <View style={styles.searchContainer}>
            <Ionicons name="search" size={24} color="gray" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Encontre um hospital..."
              value={search}
              onChangeText={setSearch}
            />
          </View>
          <TouchableOpacity onPress={() => {
            const hospital = hospitals.find(h => h.name.toLowerCase().includes(search.toLowerCase()));
            if (hospital) handleHospitalSelect(hospital);
          }}>
            <Ionicons name="search" size={24} color="blue" />
          </TouchableOpacity>
        </View>

        {/* Botões roxos com Scroll Horizontal (mantendo o estilo original) */}
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

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="MapScreen" component={MapScreen} options={{ headerShown: false }} />
        <Stack.Screen name="HospitalDetails" component={HospitalDetails} options={{ title: 'Detalhes do Hospital' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
