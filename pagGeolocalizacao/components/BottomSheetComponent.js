import React, { useCallback, useMemo, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import BottomSheet from '@gorhom/bottom-sheet';

const BottomSheetComponent = ({ hospital, onClose }) => {
  const bottomSheetRef = useRef(null);

  // Define os pontos de ancoragem (snap points)
  const snapPoints = useMemo(() => ['10%', '80%'], []);

  // Função chamada quando o BottomSheet é fechado
  const handleSheetChanges = useCallback((index) => {
    if (index === -1) {
      onClose();
    }
  }, [onClose]);

  return (
    <BottomSheet
      ref={bottomSheetRef}
      snapPoints={snapPoints}
      index={-1} // Começa fechado
      onChange={handleSheetChanges}
      enablePanDownToClose={true} // Permite fechar arrastando para baixo
      animateOnMount={true} // Animação suave ao abrir
    >
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>{hospital?.name || 'Detalhes do Hospital'}</Text>
        </View>
        <View style={styles.body}>
          <Text>{hospital?.description || 'Informações sobre o hospital serão exibidas aqui.'}</Text>
        </View>
      </ScrollView>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  header: {
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  body: {
    marginTop: 10,
  },
});

export default BottomSheetComponent;
