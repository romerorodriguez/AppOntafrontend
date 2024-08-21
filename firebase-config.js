import { initializeApp } from 'firebase/app';
import { getAuth, initializeAuth, browserLocalPersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Asegúrate de usar AsyncStorage aquí

export const firebaseConfig = {
  apiKey: "AIzaSyAl2QMe1sfoI1EYvxg6auEDhLWWrqCINQ4",
  authDomain: "apponta-cfc06.firebaseapp.com",
  projectId: "apponta-cfc06",
  storageBucket: "apponta-cfc06.appspot.com",
  messagingSenderId: "574184938673",
  appId: "1:574184938673:web:03e604b8479ca888a01690"
};

const app = initializeApp(firebaseConfig);

// Inicializa la autenticación con persistencia en AsyncStorage
export const auth = initializeAuth(app, {
  persistence: browserLocalPersistence
});