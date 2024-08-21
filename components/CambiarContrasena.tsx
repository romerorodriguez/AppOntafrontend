import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, TextInput, Alert } from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import Background from './Background';  
import BASE_URL from '../config';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CambiarContrasena = () => {
  const navigation = useNavigation();
  const [contrasenaActual, setContrasenaActual] = useState('');
  const [nuevaContrasena, setNuevaContrasena] = useState('');
  const [userId, setUserId] = useState<string | null>(null);
  const [username, setUsername] = useState('');
  const [showPasswordActual, setShowPasswordActual] = useState(false);
  const [showPasswordNueva, setShowPasswordNueva] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem('userId');
        const storedUsername = await AsyncStorage.getItem('username');
        
        if (storedUserId) {
          setUserId(storedUserId);
        } else {
          console.error('No se encontró el ID del usuario en AsyncStorage');
          Alert.alert('Error', 'No se pudo obtener el ID del usuario. Por favor, inicie sesión nuevamente.');
          navigation.navigate('Login' as never);
        }

        if (storedUsername) {
          setUsername(storedUsername);
        }
      } catch (error) {
        console.error('Error al obtener los datos del usuario:', error);
        Alert.alert('Error', 'Hubo un problema al obtener la información del usuario.');
      }
    };
    
    fetchUserData();
  }, [navigation]);

  const handleBack = () => {
    navigation.goBack();
  };

  const cambiarContrasena = async () => {
    if (!contrasenaActual || !nuevaContrasena) {
      Alert.alert('Error', 'Todos los campos son requeridos.');
      return;
    }

    if (!userId) {
      Alert.alert('Error', 'No se pudo obtener el ID del usuario. Por favor, inicie sesión nuevamente.');
      navigation.navigate('Login' as never);
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/user/${userId}/password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contrasenaActual,
          nuevaContrasena,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        Alert.alert('Éxito', 'Contraseña actualizada exitosamente');
        navigation.goBack();
      } else {
        Alert.alert('Error', result.error || 'No se pudo actualizar la contraseña.');
      }
    } catch (error) {
      console.error('Error al conectar con el servidor:', error);
      Alert.alert('Error', 'Error al conectar con el servidor.');
    }
  };

  return (
    <View style={styles.container}>
      <Background />
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Ionicons name="arrow-back" size={30} color="white" />
        </TouchableOpacity>
        <Text style={styles.appTitle}>{username}</Text>
      </View>
      <View style={styles.titleContainer}>
        <Text style={styles.subTitle}>Cambiar Contraseña</Text>
        <Text style={styles.instructions}>
          Su contraseña debe tener al menos 6 caracteres y debe incluir una combinación de números, letras y caracteres especiales (!$@%)
        </Text>
      </View>
      <View style={styles.formContainer}>
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Contraseña Actual</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Ingrese su contraseña actual"
              placeholderTextColor="#ffffff"
              secureTextEntry={!showPasswordActual}
              onChangeText={setContrasenaActual}
              value={contrasenaActual}
            />
            <TouchableOpacity style={styles.eyeIcon} onPress={() => setShowPasswordActual(!showPasswordActual)}>
              <Feather name={showPasswordActual ? 'eye' : 'eye-off'} size={24} color="#ffffff" />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Nueva Contraseña</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Ingrese su nueva contraseña"
              placeholderTextColor="#ffffff"
              secureTextEntry={!showPasswordNueva}
              onChangeText={setNuevaContrasena}
              value={nuevaContrasena}
            />
            <TouchableOpacity style={styles.eyeIcon} onPress={() => setShowPasswordNueva(!showPasswordNueva)}>
              <Feather name={showPasswordNueva ? 'eye' : 'eye-off'} size={24} color="#ffffff" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.buttonLong} onPress={cambiarContrasena}>
          <Text style={styles.buttonText}>Cambiar Contraseña</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 40,
    marginLeft: 20,
  },
  backButton: {
    marginRight: 10,
    marginTop: 30,
  },
  appTitle: {
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 30,
  },
  titleContainer: {
    alignItems: 'flex-start',
    marginTop: 40,
    marginLeft: 30,
    marginRight: 30,
  },
  subTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 30,
  },
  instructions: {
    color: '#FFFFFF',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 70,
  },
  formContainer: {
    marginLeft: 30,
    marginRight: 30,
    backgroundColor: '#0094F1',
    padding: 30, // Aumentado el padding para hacerlo más largo
    borderRadius: 10,
    marginBottom: 30, // Ajustado el margen inferior
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ffffff',
  },
  input: {
    flex: 1,
    color: '#ffffff',
    paddingVertical: 5,
  },
  buttonContainer: {
    alignItems: 'center', 
    marginTop: 10, 
  },
  buttonLong: {
    backgroundColor: '#00C29D',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30,
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  eyeIcon: {
    padding: 5,
  },
});

export default CambiarContrasena;
