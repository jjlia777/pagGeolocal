import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { setString as copyToClipboard } from '@react-native-clipboard/clipboard'; // Importa o módulo atualizado do Clipboard
import { Ionicons, MaterialIcons, FontAwesome } from '@expo/vector-icons';

export default function HospitalDetails({ route }) {
  const { hospital } = route.params || {}; // Garante que route.params não seja undefined
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const checkOpenStatus = () => {
      if (hospital?.operation) {
        const now = new Date();
        const currentDay = now.getDay(); // 0 = Domingo, 1 = Segunda, ..., 6 = Sábado
        const currentTimeInMinutes = now.getHours() * 60 + now.getMinutes();

        const isTimeInRange = (start, end) => {
          if (!start || !end) return false; // Garante que os valores existem
          const [startHour, startMinute] = start.split(':').map(Number);
          const [endHour, endMinute] = end.split(':').map(Number);
          const startTimeInMinutes = startHour * 60 + startMinute;
          const endTimeInMinutes = endHour * 60 + endMinute;

          return currentTimeInMinutes >= startTimeInMinutes && currentTimeInMinutes <= endTimeInMinutes;
        };

        const operationSchedule = hospital.operation;
        let open = false;

        const schedules = operationSchedule.split(', ');
        schedules.forEach(schedule => {
          const [days, time] = schedule.split(': ') || [];
          const [start, end] = time ? time.split(' às ') : [];

          const daysMap = {
            Domingo: 0,
            Segunda: 1,
            Terça: 2,
            Quarta: 3,
            Quinta: 4,
            Sexta: 5,
            Sábado: 6,
          };

          if (days?.includes('-')) {
            const [startDay, endDay] = days.split('-').map(d => daysMap[d]);
            if (currentDay >= startDay && currentDay <= endDay) {
              open = open || isTimeInRange(start, end);
            }
          } else {
            if (daysMap[days] === currentDay) {
              open = open || isTimeInRange(start, end);
            }
          }
        });

        setIsOpen(open);
      }
    };

    checkOpenStatus();
    const interval = setInterval(checkOpenStatus, 60000);
    return () => clearInterval(interval);
  }, [hospital]);

  const copyAddress = () => {
    copyToClipboard(hospital?.address || "Endereço indisponível"); // Copia o endereço
    Alert.alert("Endereço copiado!", hospital?.address || "Endereço indisponível");
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>{hospital?.name || "Nome indisponível"}</Text>
        <View style={styles.headerIcons}>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="share-social-outline" size={24} color="#666" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="close-outline" size={24} color="#666" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Imagens do hospital */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imageScroll}>
        {hospital?.images?.length > 0 ? (
          hospital.images.map((image, index) => (
            <Image key={index} source={{ uri: image }} style={styles.image} resizeMode="cover" />
          ))
        ) : (
          <Text style={styles.noImageText}>Nenhuma imagem disponível.</Text>
        )}
      </ScrollView>

      {/* Status */}
      <View style={styles.statusContainer}>
        <Text style={styles.statusText}>{hospital?.services || "0"} serviços</Text>
        <View style={styles.rating}>
          <MaterialIcons name="star" size={24} color="#f4c430" />
          <Text style={styles.ratingText}>{hospital?.rating || "N/A"}</Text>
        </View>
        <FontAwesome name="wheelchair" size={24} color="#000" />
        <Text style={styles.openStatus}>{isOpen ? "ABERTO" : "FECHADO"}</Text>
      </View>

      {/* Botão de rota */}
      <TouchableOpacity style={styles.routeButton}>
        <Text style={styles.routeButtonText}>Ver Rotas</Text>
      </TouchableOpacity>

      {/* Endereço */}
      <View style={styles.infoContainer}>
        <MaterialIcons name="location-on" size={30} color="#6c63ff" />
        <TouchableOpacity onPress={copyAddress}>
          <Text style={styles.infoText}>{hospital?.address || "Endereço indisponível"}</Text>
        </TouchableOpacity>
      </View>

      {/* Horários de funcionamento */}
      <View style={styles.operationContainer}>
        <Text style={styles.operationTitle}>FUNCIONAMENTO</Text>
        <Text style={styles.operationText}>
          {hospital?.operation || "TODOS OS DIAS, 24 HORAS"}
        </Text>
      </View>

      {/* Serviços médicos */}
      <View style={styles.carouselContainer}>
        <Text style={styles.operationTitle}>SERVIÇOS MÉDICOS</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {hospital?.medicalServices?.map((service, index) => (
            <View key={index} style={styles.card}>
              <Image source={{ uri: service.image }} style={styles.cardImage} />
              <Text style={styles.cardText}>{service.name}</Text>
            </View>
          ))}
        </ScrollView>
      </View>

      {/* Convênios */}
      <View style={styles.carouselContainer}>
        <Text style={styles.operationTitle}>CONVÊNIOS</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {hospital?.insurance?.map((plan, index) => (
            <View key={index} style={styles.card}>
              <Image source={{ uri: plan.image }} style={styles.cardImage} />
              <Text style={styles.cardText}>{plan.name}</Text>
            </View>
          ))}
        </ScrollView>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#f7f7f7',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    marginRight: 10,
  },
  headerIcons: {
    flexDirection: 'row',
  },
  iconButton: {
    marginLeft: 10,
  },
  imageScroll: {
    marginVertical: 15,
  },
  image: {
    width: 250,
    height: 150,
    borderRadius: 10,
    marginRight: 10,
  },
  noImageText: {
    fontSize: 16,
    fontStyle: 'italic',
    textAlign: 'center',
    color: '#888',
    marginBottom: 20,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 10,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 10,
    elevation: 3,
  },
  statusText: {
    fontSize: 16,
    color: '#333',
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 16,
    color: '#444',
    marginLeft: 5,
  },
  openStatus: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#28a745'
  },
  routeButton: {
    backgroundColor: '#6c63ff',
    paddingVertical: 15,
    borderRadius: 10,
    marginVertical: 20,
    alignItems: 'center',
  },
  routeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
  },
  infoText: {
    fontSize: 16,
    marginLeft: 10,
    color: '#666',
  },
  operationContainer: {
    marginBottom: 15,
  },
  operationTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  operationText: {
    fontSize: 16,
    color: '#555',
  },
  carouselContainer: {
    marginBottom: 15,
  },
  card: {
    width: 100,
    marginRight: 10,
    alignItems: 'center',
  },
  cardImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 5,
  },
  cardText: {
    fontSize: 14,
    textAlign: 'center',
    color: '#444',
  },
});
