import React from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';

const Background = () => {
  return (
    <View style={styles.container}>
      <View style={styles.blueHalf} />
      <View style={styles.whiteHalf} />
    </View>
  );
};

const windowHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1, // Para asegurar que esté detrás de otros elementos
  },
  blueHalf: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: windowHeight / 2,
    backgroundColor: '#000033', // Azul
  },
  whiteHalf: {
    position: 'absolute',
    top: windowHeight / 2,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#ffffff', // Blanco
  },
});

export default Background;