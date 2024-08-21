import React from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';

const Background2 = () => {
  return (
    <View style={styles.container}>
      <View style={styles.blueThird} />
      <View style={styles.whiteTwoThirds} />
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
    zIndex: -1,
  },
  blueThird: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: windowHeight / 3,
    backgroundColor: '#000033',
  },
  whiteTwoThirds: {
    position: 'absolute',
    top: windowHeight / 3,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#ffffff',
  },
});

export default Background2;