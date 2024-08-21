import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, TextInput, TouchableOpacity, Modal, Pressable, Alert } from 'react-native';
import Background2 from './Background2';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from './types';
import { Picker } from '@react-native-picker/picker';
import BASE_URL from '../config';
import AsyncStorage from '@react-native-async-storage/async-storage';

type CrearArticuloScreenNavigationProp = StackNavigationProp<RootStackParamList, 'CrearArticulo'>;

const CrearArticulo = () => {
  const navigation = useNavigation<CrearArticuloScreenNavigationProp>();
  const [showModal, setShowModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('');
  const [titulo, setTitulo] = useState('');
  const [texto, setTexto] = useState('');
  const [categorias, setCategorias] = useState<{ label: string; value: string }[]>([]);

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem('userId');
        if (!storedUserId) {
          console.error('User ID not found');
          return;
        }
        const id_usuario = parseInt(storedUserId, 10);

        const response = await fetch(`${BASE_URL}/categories/${id_usuario}`);
        const data = await response.json();
        if (Array.isArray(data) && data.length > 0) {
          const formattedData = data.map(item => ({
            label: item.nombre || item.label,
            value: item.id || item.value
          }));
          setCategorias(formattedData);
        } else {
          setCategorias([]);
        }
      } catch (error) {
        console.error('Error al obtener categorías:', error);
        setCategorias([]);
      }
    };

    fetchCategorias();
  }, []);

  const handleBack = () => {
    navigation.goBack();
  };

  const handleGuardar = async () => {
    if (!titulo || !texto || !categoriaSeleccionada) {
      Alert.alert('Error', 'Rellena todos los campos');
      return;
    }
  
    try {
      const storedUserId = await AsyncStorage.getItem('userId');
      const id_usuario = storedUserId ? parseInt(storedUserId, 10) : null;
  
      if (!id_usuario) {
        Alert.alert('Error', 'No se pudo obtener el ID del usuario');
        return;
      }
  
      const response = await fetch(`${BASE_URL}/articles`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          titulo,
          texto,
          prioridad: 1, // Puedes ajustar esto si quieres que sea configurable
          id_categoria: parseInt(categoriaSeleccionada, 10),
          id_usuario
        }),
      });
  
      if (response.ok) {
        const result = await response.json();
        setSuccessMessage(result.message);
        setShowModal(true);
        setTitulo('');
        setTexto('');
        setCategoriaSeleccionada('');
      } else {
        const errorResponse = await response.json();
        Alert.alert('Error', errorResponse.error || 'Error al guardar el artículo');
      }
    } catch (error) {
      console.error('Error al guardar el artículo:', error);
      Alert.alert('Error', 'Error al guardar el artículo');
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSuccessMessage('');
    navigation.navigate('ListaCategorias', { 
      categoryId: 'defaultId', 
      categoryTitle: 'defaultTitle' 
    });
  };

  return (
    <View style={styles.container}>
      <Background2 />
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Ionicons name="arrow-back" size={30} color="white" />
        </TouchableOpacity>
        <Text style={styles.title}>Nuevo Artículo</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.subtitle}>Crear un nuevo artículo</Text>
        <Text style={styles.instructions}>
          Elija una categoría, agregando un toque de personalización a su artículo.
        </Text>
      </View>
      <View style={styles.box}>
        <View style={styles.inputContainer}>
          <Picker
            selectedValue={categoriaSeleccionada}
            style={styles.pickerInput}
            onValueChange={(itemValue) => setCategoriaSeleccionada(itemValue)}
          >
            <Picker.Item label="Seleccione una categoría" value="" />
            {categorias.length > 0 ? (
              categorias.map((categoria) => (
                <Picker.Item
                  key={categoria.value}
                  label={categoria.label}
                  value={categoria.value}
                />
              ))
            ) : (
              <Picker.Item label="No hay categorías disponibles" value="" />
            )}
          </Picker>
        </View>
        <TextInput
          style={[styles.input, styles.inputTitle]}
          placeholder="Ingresa el título de tu artículo"
          value={titulo}
          onChangeText={setTitulo}
        />
        <TextInput
          style={[styles.input, styles.largeInput]}
          placeholder="Texto"
          multiline={true}
          numberOfLines={6}
          value={texto}
          onChangeText={setTexto}
        />
      </View>
      <TouchableOpacity style={styles.saveButton} onPress={handleGuardar}>
        <Text style={styles.saveButtonText}>Guardar</Text>
      </TouchableOpacity>

      <Modal
        animationType="fade"
        transparent={true}
        visible={showModal}
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContent}>
            <View style={styles.successCircle}>
              <Ionicons name="checkmark" size={60} color="white" />
            </View>
            <Text style={styles.modalText}>{successMessage}</Text>
            <Pressable style={styles.modalCloseButton} onPress={closeModal}>
              <Ionicons name="close" size={24} color="#000033" />
            </Pressable>
          </View>
        </View>
      </Modal>
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
    padding: 10,
  },
  backButton: {
    marginRight: 10,
    marginTop: 50,
  },
  title: {
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 50,
  },
  content: {
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 10,
  },
  instructions: {
    textAlign: 'left',
    color: 'white',
    fontSize: 16,
    marginBottom: 10,
  },
  box: {
    backgroundColor: '#00C29D',
    padding: 30,
    borderRadius: 10,
    width: '80%',
    alignSelf: 'center',
    marginTop: 10,
  },
  inputContainer: {
    borderWidth: 2,
    borderRadius: 5,
    borderColor: '#000033',
    marginBottom: 10,
    backgroundColor: '#ffffff',
  },
  input: {
    borderWidth: 2,
    borderRadius: 5,
    padding: 10,
    width: '100%',
    marginBottom: 10,
    backgroundColor: '#ffffff',
    color: '#000033', // Color del texto
  },
  pickerInput: {
    width: '100%',
    color: '#000033', // Color del texto
  },
  inputTitle: {
    marginTop: 10,
    color: '#000033', // Color del texto
  },
  largeInput: {
    height: 150,
    textAlignVertical: 'top',
    color: '#000033', // Color del texto
  },
  saveButton: {
    backgroundColor: '#FF7306',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 50,
    marginTop: 20,
    alignSelf: 'center',
  },
  saveButtonText: {
    color: '#000000',
    fontSize: 18,
    fontWeight: 'bold',
  },
  // Estilos para el modal
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%', // Ajusta el ancho según necesites
    maxHeight: '80%', // Ajusta la altura máxima según necesites
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#000033',
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
    color: 'black',
    textAlign: 'center',
  },
  successCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#00C29D',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalCloseButton: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
});

export default CrearArticulo;
