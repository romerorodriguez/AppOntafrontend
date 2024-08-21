import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, Image, StyleSheet } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import Background from './Background';
import { Feather } from '@expo/vector-icons';
import BASE_URL from '../config';
import AsyncStorage from '@react-native-async-storage/async-storage';


type RootStackParamList = {
  Login: undefined;
  Registro: undefined;
  Inicio: undefined;
  RecuperarContrasena: undefined;
};

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;
type LoginScreenRouteProp = RouteProp<RootStackParamList, 'Login'>;

type LoginProps = {
  navigation: LoginScreenNavigationProp;
  route: LoginScreenRouteProp;
};

const Login: React.FC<LoginProps> = ({ navigation }) => {
  const [correo, setCorreo] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    console.log('Correo:', correo);
    console.log('Contraseña:', contraseña);
  
    if (!correo || !contraseña) {
      setError('Por favor, completa todos los campos');
      return;
    }
  
    try {
      const response = await fetch(`${BASE_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', 
        },
        body: JSON.stringify({
          correo_electronico: correo,
          contrasena: contraseña,
        }),
      });
  
      const data = await response.json();
      console.log('Respuesta del servidor:', data);
  
      if (response.ok) {
        const { user, categories } = data;
  
        if (user) {
          await AsyncStorage.setItem('userEmail', user.correo_electronico || '');
          await AsyncStorage.setItem('username', user.nombre || '');
          await AsyncStorage.setItem('userId', user.id ? user.id.toString() : '');
  
          // Agregar console.log para verificar el ID guardado
          const savedUserId = await AsyncStorage.getItem('userId');
          console.log('ID del usuario guardado:', savedUserId);
        }
  
        if (categories && Array.isArray(categories) && categories.length > 0) {
          await AsyncStorage.setItem('userCategories', JSON.stringify(categories));
        } else {
          await AsyncStorage.setItem('userCategories', JSON.stringify([]));
        }
  
        console.log('Nombre de usuario guardado:', user?.nombre || 'Usuario');
        navigation.navigate('Inicio');
      } else {
        setError(data.error || 'Error al iniciar sesión');
      }
    } catch (error) {
      console.error('Error detallado:', error);
      setError('Error de conexión. Por favor, intenta más tarde.');
    }
  };
  
  
  return (
    <View style={styles.container}>
      <Background />
      <View style={styles.logoContainer}>
        <Image source={require('../assets/logo.png')} style={styles.logo} />
      </View>
      <Text style={[styles.texto]}>Inicia Sesión</Text>
      {error && <Text style={styles.errorText}>{error}</Text>}
      <View style={styles.formContainer}>
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Correo electrónico</Text>
          <TextInput
            style={styles.input}
            placeholder="Introduce tu Correo Electrónico"
            placeholderTextColor="#ffffff"
            onChangeText={setCorreo}
            value={correo}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Contraseña</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="********* "
              placeholderTextColor="#ffffff"
              secureTextEntry={!showPassword}
              onChangeText={setContraseña}
              value={contraseña}
            />
            <TouchableOpacity style={styles.eyeIcon} onPress={() => setShowPassword(!showPassword)}>
              <Feather name={showPassword ? 'eye' : 'eye-off'} size={24} color="#ffffff" />
            </TouchableOpacity>
          </View>
          </View>

        <Text style={styles.olvidasteContraseñaText} onPress={() => navigation.navigate('RecuperarContrasena')}>
          ¿Olvidaste tu contraseña?
        </Text>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Inicia Sesión</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.registrarText}>
        ¿No tienes una cuenta?
        <Text style={styles.boldText} onPress={() => navigation.navigate('Registro')}>
          {' '} Regístrate
        </Text>
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  logoContainer: { alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  boldText: { fontWeight: 'bold' },
  logo: { width: 150, height: 150, borderRadius: 80 },
  formContainer: { width: 300, backgroundColor: '#0094F1', padding: 20, borderRadius: 10 },
  texto: { fontSize: 30, fontWeight: 'bold', color: '#ffffff', marginBottom: 16, textAlign: 'center' },
  inputContainer: { marginBottom: 20 },
  input: { height: 40, backgroundColor: '#0094F1', color: '#ffffff', borderBottomWidth: 1, borderBottomColor: '#ffffff', padding: 0, fontSize: 15 },
  inputLabel: { color: '#ffffff', fontSize: 16, fontWeight: 'bold', marginBottom: 4 },
  buttonContainer: { alignItems: 'center', marginTop: 20 },
  button: { backgroundColor: '#00C29D', paddingVertical: 15, borderRadius: 30, width: 180 },
  buttonText: { color: '#ffffff', fontWeight: 'bold', fontSize: 20, textAlign: 'center' },
  registrarText: { color: '#01063E', fontSize: 14, marginTop: 20, textAlign: 'center', fontWeight: 'regular' },
  olvidasteContraseñaText: { color: '#01063E', fontSize: 14, fontWeight: 'bold', marginTop: 4, textAlign: 'right' },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ffffff',
  },
  passwordInput: {
    flex: 1,
    height: 40,
    color: '#ffffff',
    padding: 0,
    fontSize: 15,
  },
  eyeIcon: {
    padding: 10,
  },
  errorText: { color: 'red', textAlign: 'center', marginTop: 10 },
});

export default Login;
