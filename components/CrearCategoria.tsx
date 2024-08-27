import React, { useState } from 'react';
import { View, StyleSheet, Text, Alert, TextInput, TouchableOpacity, Modal, FlatList, Pressable } from 'react-native';
import Background2 from './Background2';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from './types';
import BASE_URL from '../config';
import { colorList, iconList, IconName } from './IconsAndColors';
import AsyncStorage from '@react-native-async-storage/async-storage';

type CrearCategoriaScreenNavigationProp = StackNavigationProp<RootStackParamList, 'CrearCategoria'>;

const CrearCategoria = () => {
  const navigation = useNavigation<CrearCategoriaScreenNavigationProp>();
  const [showModal, setShowModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [categoryName, setCategoryName] = useState('');
  const [selectedIcon, setSelectedIcon] = useState<IconName | null>(null);
  const [selectedColor, setSelectedColor] = useState('#FF7306');
  const [showIconPicker, setShowIconPicker] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);

  const handleBack = () => {
    navigation.goBack();
  };

  const handleGuardar = () => {
    if (categoryName && selectedIcon && selectedColor) {
      handleCreateCategory();
    } else {
      setSuccessMessage('Por favor, complete todos los campos');
      setShowModal(true);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSuccessMessage('');

    // Navegar a la pantalla 'Inicio' con el parámetro opcional 'refresh'
    navigation.navigate('Inicio', { refresh: true });
};

  const renderIconItem = ({ item }: { item: IconName }) => (
    <TouchableOpacity onPress={() => {
      setSelectedIcon(item);
      setShowIconPicker(false);
    }}>
      <Ionicons name={item} size={40} color="black" style={styles.iconItem} />
    </TouchableOpacity>
  );

  const renderColorItem = ({ item }: { item: string }) => (
    <TouchableOpacity
      style={[styles.colorItem, { backgroundColor: item }]}
      onPress={() => {
        setSelectedColor(item);
        setShowColorPicker(false);
      }}
    />
  );

  const handleCreateCategory = async () => {
    if (!categoryName || !selectedIcon) {
      Alert.alert('Error', 'Debes completar todos los campos.');
      return;
    }
  
    try {
      // Obtener el ID del usuario desde AsyncStorage
      const userId = await AsyncStorage.getItem('userId');
  
      if (!userId) {
        Alert.alert('Error', 'No se pudo obtener el ID del usuario.');
        return;
      }
  
      const response = await fetch(`${BASE_URL}/categories`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombre: categoryName,
          icono: selectedIcon,
          color: selectedColor,
          id_usuario: userId, // Usar el ID del usuario autenticado
        }),
      });
  
      if (response.ok) {
        const result = await response.json();
        setSuccessMessage('Categoría creada con éxito');
        setShowModal(true);
        // Aquí puedes manejar la redirección o limpieza del formulario si es necesario
      } else {
        // Mostrar el mensaje de error recibido del servidor
        const errorData = await response.json();
        const errorMessage = errorData.error || 'No se pudo crear la categoría.';
        setSuccessMessage(errorMessage);
        setShowModal(true);
      }
    } catch (error) {
      console.error('Error al crear la categoría:', error);
      setSuccessMessage('Hubo un problema al conectar con el servidor.' );
      setShowModal(true);
    }
  };
  
  return (
    <View style={styles.container}>
      <Background2 />
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Ionicons name="arrow-back" size={30} color="white" />
        </TouchableOpacity>
        <Text style={styles.title}>Nueva Categoría</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.subtitle}>Crear una nueva categoría</Text>
        <Text style={styles.instructions}>
          Puede personalizar sus categorías con íconos y colores únicos,
          agregando un toque personal a su organización.
        </Text>
      </View>
      <View style={styles.box}>
        <TextInput
          style={[styles.input, { marginBottom: 20 }]}
          placeholder="Escribe el nombre de la categoría"
          value={categoryName}
          onChangeText={setCategoryName}
        />
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={() => setShowIconPicker(true)}>
            <Ionicons name={selectedIcon || "add-circle-outline"} size={24} color="black" />
            <Text style={{ marginLeft: 10 }}>Icono</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => setShowColorPicker(true)}>
            <View style={[styles.colorPreview, { backgroundColor: selectedColor }]}></View>
            <Text style={{ marginLeft: 10 }}>Color</Text>
          </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity style={styles.saveButton} onPress={handleGuardar}>
        <Text style={styles.saveButtonText}>Guardar</Text>
      </TouchableOpacity>

      {/* Modal de éxito */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={showModal}
        onRequestClose={closeModal}
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

      {/* Modal de selección de icono */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showIconPicker}
        onRequestClose={() => setShowIconPicker(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Selecciona un icono</Text>
            <FlatList
              data={iconList}
              renderItem={renderIconItem}
              keyExtractor={item => item}
              numColumns={4}
            />
            <TouchableOpacity style={styles.closeButton} onPress={() => setShowIconPicker(false)}>
              <Text style={styles.closeButtonText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal de selección de color */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showColorPicker}
        onRequestClose={() => setShowColorPicker(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Selecciona un color</Text>
            <FlatList
              data={colorList}
              renderItem={renderColorItem}
              keyExtractor={(item) => item}
              numColumns={4}
              contentContainerStyle={styles.colorList}
            />
            <TouchableOpacity style={styles.closeButton} onPress={() => setShowColorPicker(false)}>
              <Text style={styles.closeButtonText}>Cerrar</Text>
            </TouchableOpacity>
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
    marginBottom: 20,
  },
  box: {
    backgroundColor: '#66cdaa',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignSelf: 'center',
    marginTop: 20,
  },
  input: {
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    width: '100%',
    backgroundColor: '#ffffff',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#ffffff',
    borderRadius: 15,
  },
  colorPreview: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 5,
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
    width: '80%',
    maxHeight: '80%',
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
  iconItem: {
    margin: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  closeButton: {
    backgroundColor: '#FF7306',
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  colorItem: {
    width: 40,
    height: 40,
    margin: 5,
    borderRadius: 20,
  },
  colorList: {
    justifyContent: 'center',
  },
});

export default CrearCategoria;