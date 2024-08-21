import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, FlatList, Dimensions, Modal, TouchableWithoutFeedback } from 'react-native';
import Background from './Background';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, NavigationProp, useFocusEffect } from '@react-navigation/native';
import { RootStackParamList } from './types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BASE_URL from '../config';

const { width } = Dimensions.get('window');

interface Category {
  id: number;
  nombre: string;
  icono: string;
  color: string;
  numero_articulos: number;
}

const Inicio = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [username, setUsername] = useState('');

  const loadUserData = useCallback(async () => {
    try {
      const storedUsername = await AsyncStorage.getItem('username');
      const userId = await AsyncStorage.getItem('userId');

      if (storedUsername) {
        setUsername(storedUsername);
      }

      if (userId) {
        // Obtener categorías del usuario
        const categoriesResponse = await fetch(`${BASE_URL}/user/${userId}`);
        if (categoriesResponse.ok) {
          const categoriesData = await categoriesResponse.json();
          
          // Obtener conteo de artículos por categoría
          const articleCountResponse = await fetch(`${BASE_URL}/categories/article-count/${userId}`);
          if (articleCountResponse.ok) {
            const articleCountData = await articleCountResponse.json();
            
            // Combinar datos de categorías con el conteo de artículos
            const updatedCategories = categoriesData.categories.map((category: { nombre: any; }) => {
              const articleCount = articleCountData.find((item: { Categoria: any; }) => item.Categoria === category.nombre);
              return {
                ...category,
                numero_articulos: articleCount ? articleCount.NumeroDeArticulos : 0
              };
            });
            
            setCategories(updatedCategories);
          } else {
            console.error('Error al obtener el conteo de artículos');
          }
        } else {
          console.error('Error al obtener las categorías del servidor');
        }
      }
    } catch (error) {
      console.error('Error al cargar datos del usuario:', error);
    }
  }, []);

  useEffect(() => {
    loadUserData();
  }, [loadUserData]);

  useFocusEffect(
    useCallback(() => {
      loadUserData();
    }, [loadUserData])
  );

  const handleMenuPress = () => {
    navigation.navigate('Perfil');
  };

  const handleMoreOptionsPress = () => {
    navigation.navigate('ListaCategorias');
  };

 const handleCategoryPress = (categoryId: number, categoryTitle: string, categoryColor: string) => {
  navigation.navigate('CategoriaSeleccionada', {
    categoryId: categoryId.toString(),
    categoryTitle,
    categoryColor
  });
};
  

  const handleDeleteCategory = (categoryId: number) => {
    setSelectedCategoryId(categoryId);
    setConfirmModalVisible(true);
  };

  const cancelDeleteCategory = () => {
    setSelectedCategoryId(null);
    setConfirmModalVisible(false);
  };

  const deleteCategory = async (categoryId: number) => {
    try {
      const response = await fetch(`${BASE_URL}/categories/${categoryId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Error al eliminar la categoría');
      }
    } catch (error) {
      console.error('Error al eliminar la categoría:', error);
      throw error;
    }
  };

  const confirmDeleteCategory = async () => {
    if (selectedCategoryId !== null) {
      try {
        await deleteCategory(selectedCategoryId);
        setCategories(prevCategories =>
          prevCategories.filter(category => category.id !== selectedCategoryId)
        );
      } catch (error) {
        console.error('Error al eliminar la categoría:', error);
      } finally {
        setConfirmModalVisible(false);
        setSelectedCategoryId(null);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Background />
      <View style={styles.headerContainer}>
        <View style={styles.textWithIconContainer}>
          <Text style={styles.text1}>Hola,</Text>
          <TouchableOpacity onPress={handleMenuPress}>
            <Ionicons name="menu" size={32} color="#ffffff" style={styles.icon} />
          </TouchableOpacity>
        </View>
        <Text style={styles.text}>{username}</Text>
        <View style={styles.searchBarContainer}>
          <Ionicons name="search" size={24} color="#000033" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar..."
            placeholderTextColor="#000033"
            selectionColor="#000033"
            onFocus={() => navigation.navigate('Buscar')}
          />
        </View>
        <View style={styles.categoriesHeaderContainer}>
          <Text style={styles.text3}>Categorías</Text>
          <TouchableOpacity onPress={handleMoreOptionsPress}>
            <Ionicons name="ellipsis-horizontal" size={24} color="#ffffff" style={styles.moreOptionsIcon} />
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={categories}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.categoryItem, { backgroundColor: item.color }]}
            onPress={() => handleCategoryPress(item.id, item.nombre, item.color)}
          >
            <View style={styles.categoryContent}>
              <Ionicons name={item.icono} size={32} color="#ffffff" style={styles.categoryIcon} />
              <View style={styles.categoryTextContainer}>
                <Text style={styles.categoryTitle}>{item.nombre}</Text>
                <Text style={styles.categoryArticlesCount}>{item.numero_articulos} artículos</Text>
              </View>
            </View>
            <View style={styles.categoryIcons}>
              <TouchableOpacity onPress={() => navigation.navigate('CrearArticulo')}>
                <Ionicons name="add" size={24} color="#ffffff" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDeleteCategory(item.id)}>
                <Ionicons name="trash" size={24} color="#ffffff" />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        contentContainerStyle={styles.categoriesList}
        extraData={categories}
      />

      {/* Modal de Confirmación para Eliminar Categoría */}
      <Modal
        transparent={true}
        visible={confirmModalVisible}
        animationType="fade"
        onRequestClose={() => setConfirmModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalBackground}
          activeOpacity={1}
          onPressOut={() => setConfirmModalVisible(false)}
        >
        <View style={styles.confirmModalContainer}>
          <View style={styles.confirmModalContent}>
            <Text style={styles.confirmModalText}>¿Seguro que quieres eliminar esta categoría?</Text>
            <View style={styles.confirmModalButtons}>
              <TouchableOpacity style={styles.confirmButton} onPress={confirmDeleteCategory}>
                <Text style={styles.confirmButtonText}>Confirmar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cancelButton} onPress={cancelDeleteCategory}>
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  textWithIconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  text: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  text1: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  icon: {
    marginLeft: 10,
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginTop: 20,
  },
  searchInput: {
    flex: 1,
    height: 40,
    color: '#000033',
    paddingHorizontal: 10,
  },
  searchIcon: {
    marginRight: 10,
  },
  categoriesHeaderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  text3: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  moreOptionsIcon: {
    marginLeft: 10,
  },
  categoriesList: {
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  categoryItem: {
    width: (width - 60) / 2,
    height: (width - 60) / 2,
    margin: 10,
    padding: 10,
    borderRadius: 10,
    justifyContent: 'center',
  },
  categoryContent: {
    flexDirection: 'column',
    alignItems: 'flex-start',  
  },
  categoryIcon: {
    marginBottom: 10,
  },
  categoryTextContainer: {
    alignItems: 'center',
 
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
  },
  categoryArticlesCount: {
    fontSize: 14,
    color: '#ffffff',
    textAlign: 'center',
  },
  categoryIcons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  confirmModalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  confirmModalContent: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 10,
    width: 300,
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#000033',
  },
  confirmModalText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  confirmModalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  confirmButton: {
    backgroundColor: '#FE3777',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginRight: 10,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: '#0270D0',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
});

export default Inicio;
