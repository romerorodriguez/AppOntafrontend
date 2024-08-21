import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './components/Login';
import Registro from './components/Registro';
import Inicio from './components/Inicio';
import RecuperarContrasena from './components/RecuperarContrasena';
import Perfil from './components/Perfil';
import CambiarContrasena from './components/CambiarContrasena';
import CrearCategoria from './components/CrearCategoria';
import CrearArticulo from './components/CrearArticulo';
import ListaCategorias from './components/ListaCategorias';
import CategoriaSeleccionada from './components/CategoriaSeleccionada';
import Buscar from './components/Buscar';
import ArticulosPorFecha from './components/ArticulosPorFecha'

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen
          name="Login"
          component={Login}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Registro"
          component={Registro}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="RecuperarContrasena"
          component={RecuperarContrasena}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Inicio"
          component={Inicio}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Perfil"
          component={Perfil}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="CambiarContrasena"
          component={CambiarContrasena}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="CrearArticulo"
          component={CrearArticulo}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="CrearCategoria"
          component={CrearCategoria}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ListaCategorias"
          component={ListaCategorias}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="CategoriaSeleccionada"
          component={CategoriaSeleccionada}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Buscar"
          component={Buscar}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ArticulosPorFecha"
          component={ArticulosPorFecha}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
