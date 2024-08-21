import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Background2 from './Background2';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from './types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BASE_URL from '../config';

type PerfilScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Perfil'>;
type PerfilScreenRouteProp = RouteProp<RootStackParamList, 'Perfil'>;

type Props = {
  navigation: PerfilScreenNavigationProp;
  route: PerfilScreenRouteProp;
};

const Perfil: React.FC<Props> = ({ navigation }) => {
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const userId = await AsyncStorage.getItem('userId');
        if (userId) {
          const response = await fetch(`${BASE_URL}/user/${userId}`);
          const data = await response.json();
          setUsername(data.user.nombre);
          setEmail(data.user.correo_electronico);
          setPassword(data.user.contrasena);
        }
      } catch (error) {
        console.error('Error al cargar datos del usuario:', error);
      }
    };
    loadUserData();
  }, []);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const updateUserName = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      if (userId) {
        const response = await fetch(`${BASE_URL}/user/${userId}/name`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            nuevoNombre: username,
          }),
        });

        const data = await response.json();

        if (response.ok) {
          Alert.alert('Éxito', 'Nombre actualizado con éxito');
          setIsEditingName(false);
        } else {
          Alert.alert('Error', data.error || 'No se pudo actualizar el nombre');
        }
      }
    } catch (error) {
      console.error('Error al actualizar el nombre del usuario:', error);
      Alert.alert('Error', 'Hubo un problema al actualizar el nombre');
    }
  };

  const updateUserEmail = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      if (userId) {
        const response = await fetch(`${BASE_URL}/user/${userId}/email`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            nuevoCorreo: email,
          }),
        });

        const data = await response.json();

        if (response.ok) {
          Alert.alert('Éxito', 'Correo electrónico actualizado con éxito');
          setIsEditingEmail(false);
        } else {
          Alert.alert('Error', data.error || 'No se pudo actualizar el correo electrónico');
        }
      }
    } catch (error) {
      console.error('Error al actualizar el correo electrónico del usuario:', error);
      Alert.alert('Error', 'Hubo un problema al actualizar el correo electrónico');
    }
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const CambiarContrasena = () => {
    navigation.navigate('CambiarContrasena');
  };

  const Salir = async () => {
    try {
      await AsyncStorage.removeItem('userId');
      navigation.navigate('Login');
    } catch (error) {
      console.error('Error al cerrar sesión: ', error);
    }
  };

  return (
    <View style={styles.container}>
      <Background2 />
      <View style={styles.headerContainer}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Ionicons name="arrow-back" size={30} color="white" />
        </TouchableOpacity>
        <Text style={styles.text1}>Perfil</Text>
      </View>
      <View style={styles.titleContainer}>
        <Text style={styles.subTitle}>Configura tu cuenta OnTa</Text>
        <Text style={styles.instructions}>Administra tu información y contraseña</Text>
      </View>
      <View style={styles.sectionContainer}>
        <View style={styles.sectionRow}>
          <Text style={styles.sectionTitle}>Nombre: </Text>
          {isEditingName ? (
            <TextInput
              value={username}
              onChangeText={setUsername}
              style={styles.input}
            />
          ) : (
            <Text style={styles.sectionContent}>{username}</Text>
          )}
          <TouchableOpacity onPress={() => {
            if (isEditingName) {
              updateUserName();
            } else {
              setIsEditingName(true);
            }
          }}>
            <Ionicons name={isEditingName ? "checkmark" : "create"} size={24} color="#000033" />
          </TouchableOpacity>
        </View>
        <View style={styles.separator} />
        <View style={styles.sectionRow}>
          <Text style={styles.sectionTitle}>Correo: </Text>
          {isEditingEmail ? (
            <TextInput
              value={email}
              onChangeText={setEmail}
              style={styles.input}
            />
          ) : (
            <Text style={styles.sectionContent}>{email}</Text>
          )}
          <TouchableOpacity onPress={() => {
            if (isEditingEmail) {
              updateUserEmail();
            } else {
              setIsEditingEmail(true);
            }
          }}>
            <Ionicons name={isEditingEmail ? "checkmark" : "create"} size={24} color="#000033" />
          </TouchableOpacity>
        </View>

        <View style={styles.separator} />
        <View style={styles.sectionRow}>
          <Text style={styles.sectionTitle}>Contraseña: </Text>
          <Text style={styles.sectionContent}>{showPassword ? password : '********'.slice(0, 9)}</Text>
          <TouchableOpacity onPress={togglePasswordVisibility}>
            <Ionicons name={showPassword ? 'eye' : 'eye-off'} size={24} color="#000033" />
          </TouchableOpacity>
        </View>
        <View style={styles.separator} />
        <View style={styles.sectionRow}>
          <Text style={styles.sectionTitle}>Cambiar Contraseña </Text>
          <TouchableOpacity onPress={CambiarContrasena}>
            <Ionicons name="create" size={24} color="#000033" />
          </TouchableOpacity>
        </View>
        <View style={styles.logoutButtonContainer}>
          <TouchableOpacity style={styles.logoutButton} onPress={Salir}>
            <Text style={styles.logoutButtonText}>Salir</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  text1: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  headerContainer: {
    position: 'absolute',
    top: 50,
    left: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 10,
  },
  titleContainer: {
    alignItems: 'flex-start',
    marginTop: 140,
    marginLeft: 20,
    marginRight: 20,
  },
  subTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 40,
  },
  instructions: {
    color: '#FFFFFF',
    fontSize: 14,
    marginBottom: 30,
  },
  sectionContainer: {
    marginTop: 50,
    marginLeft: 20,
    marginRight: 20,
  },
  sectionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#000033',
  },
  separator: {
    height: 1,
    backgroundColor: '#000033',
    marginBottom: 30,
  },
  input: {
    flex: 1,
    borderWidth: 0,
    padding: 8,
    marginRight: 8,
  },
  logoutButtonContainer: {
    alignItems: 'flex-end',
    marginTop: 10,
    marginRight: 0,
  },
  logoutButton: {
    backgroundColor: '#00C29D',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  logoutButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  sectionContent: {
    fontSize: 16,
    color: '#000033',
    flex: 1,
  },
});

export default Perfil;
