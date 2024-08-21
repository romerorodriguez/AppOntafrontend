import React, { useRef, useEffect } from 'react';
import { Animated, StyleSheet, View, Dimensions } from 'react-native';

const Background1 = () => {
  const translateY = useRef(new Animated.Value(Dimensions.get('window').height)).current;

  useEffect(() => {
    Animated.timing(
      translateY,
      {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }
    ).start();
  }, []);

  return (
    <Animated.View style={[styles.container, { transform: [{ translateY }] }]}>
      <View style={styles.blueHalf} />
      <View style={styles.whiteHalf} />
    </Animated.View>
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
  blueHalf: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: windowHeight / 2,
    backgroundColor: '#000033',
  },
  whiteHalf: {
    position: 'absolute',
    top: windowHeight / 2,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#ffffff',
    
  },
});

export default Background1;