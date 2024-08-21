// Importa las librerías necesarias
import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, Image, StyleSheet, Dimensions } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { KeyboardAwareScrollView } from '@codler/react-native-keyboard-aware-scroll-view';
import Background from './Background';
import { Checkbox } from 'react-native-paper';
import { Feather } from '@expo/vector-icons';
import BASE_URL from '../config';

type RootStackParamList = {
  Login: undefined;
  Registro: undefined;
};

type RegistroScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Registro'>;
type RegistroScreenRouteProp = RouteProp<RootStackParamList, 'Registro'>;

type RegistroProps = {
  navigation: RegistroScreenNavigationProp;
  route: RegistroScreenRouteProp;
};

const Registro: React.FC<RegistroProps> = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [aceptaTerminos, setAceptaTerminos] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleRegister = async () => {
    if (!username || !email || !contraseña) {
        setError('Por favor, completa todos los campos');
        return;
    }

    if (!aceptaTerminos) {
        setError('Debes aceptar los términos y condiciones');
        return;
    }

    try {
        const response = await fetch(`${BASE_URL}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                nombre: username,
                correo_electronico: email,
                contrasena: contraseña,
                acepta_terminos: aceptaTerminos,
            }),
        });

        const data = await response.json();

        if (response.ok) {
            setSuccess('Usuario registrado exitosamente');
            
            // Redirige al usuario a la página de inicio de sesión
            navigation.navigate('Login'); // Reemplaza 'Login' con el nombre de tu ruta de inicio de sesión
            
        } else {
            setError(data.error || 'Error al registrar el usuario');
        }
    } catch (error) {
        console.error('Error detallado:', error);
        setError('Error de conexión. Por favor, intenta más tarde.');
    }
};


  return (
    <View style={styles.container}>
      <Background />
      <KeyboardAwareScrollView
        contentContainerStyle={styles.scrollViewContent}
        enableOnAndroid={true}
        extraScrollHeight={20}
      >
        <View style={styles.logoContainer}>
          <Image source={require('../assets/logo.png')} style={styles.logo} />
        </View>
        <Text style={styles.texto}>Registro</Text>
        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}
        {success && (
          <View style={styles.successContainer}>
            <Text style={styles.successText}>{success}</Text>
          </View>
        )}
        <View style={styles.formContainer}>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Nombre</Text>
            <TextInput
              style={styles.input}
              placeholder="Introduce tu nombre"
              placeholderTextColor="#ffffff"
              onChangeText={setUsername}
              value={username}
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
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Correo electrónico</Text>
            <TextInput
              style={styles.input}
              placeholder="Introduce tu Correo Electrónico"
              placeholderTextColor="#ffffff"
              onChangeText={setEmail}
              value={email}
            />
          </View>
          <View style={styles.checkboxContainer}>
            <Checkbox.Android
              status={aceptaTerminos ? 'checked' : 'unchecked'}
              onPress={() => setAceptaTerminos(!aceptaTerminos)}
              color="#000033"
              uncheckedColor="#000033"
            />
            <Text style={styles.checkboxLabel}>Acepto Términos y Condiciones</Text>
          </View>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={handleRegister}>
            <Text style={styles.buttonText}>Registrar</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.registrarText}>
          ¿Ya tienes una cuenta?
          <Text style={styles.boldText} onPress={() => navigation.navigate('Login')}>
            {' '} Inicia Sesión
          </Text>
        </Text>
      </KeyboardAwareScrollView>
    </View>
  );
};

const windowHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollViewContent: { flexGrow: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 20 },
  logoContainer: { alignItems: 'center', marginBottom: 10 },
  boldText: { fontWeight: 'bold' },
  logo: { width: 150, height: 150, borderRadius: 80 },
  formContainer: { width: 300, backgroundColor: '#0094F1', padding: 20, borderRadius: 10 },
  texto: { fontSize: 30, fontWeight: 'bold', color: '#ffffff', marginBottom: 14, textAlign: 'center' },
  inputContainer: { marginBottom: 20 },
  input: { height: 40, backgroundColor: '#0094F1', color: '#ffffff', borderBottomWidth: 1, borderBottomColor: '#ffffff', padding: 0, fontSize: 15 },
  inputLabel: { color: '#ffffff', fontSize: 16, fontWeight: 'bold', marginBottom: 5 },
  checkboxContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  checkboxLabel: { color: '#000033', fontWeight: 'bold', fontSize: 14, marginLeft: 8 },
  buttonContainer: { alignItems: 'center', marginTop: 20 },
  button: { backgroundColor: '#FF7306', paddingVertical: 15, borderRadius: 30, width: 180 },
  buttonText: { color: '#ffffff', fontWeight: 'bold', fontSize: 20, textAlign: 'center' },
  registrarText: { color: '#000033', fontSize: 14, marginTop: 20, textAlign: 'center', fontWeight: 'normal' },
  errorContainer: { backgroundColor: '#ffffff', borderColor: '#000033', borderWidth: 2, borderRadius: 5, padding: 10, marginBottom: 20 },
  errorText: { color: '#FF7306', textAlign: 'center' },
  successContainer: { backgroundColor: '#ffffff', borderColor: '#00C29D', borderWidth: 2, borderRadius: 5, padding: 10, marginBottom: 20 },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0094F1',
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
  successText: { color: '#00C29D', textAlign: 'center' },
});

export default Registro;
