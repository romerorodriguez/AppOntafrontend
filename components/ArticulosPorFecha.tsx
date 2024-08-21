import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, FlatList, Dimensions, Modal, ActivityIndicator, TouchableWithoutFeedback, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation, useRoute } from '@react-navigation/native'; // Importa useRoute aquí
import { StackNavigationProp } from '@react-navigation/stack';
import Background2 from './Background2';
import BASE_URL from '../config';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

import { RootStackParamList } from './types';

type ProfileScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Perfil'>;

const ArticulosPorFecha = () => {
  const navigation = useNavigation<ProfileScreenNavigationProp>();
  const route = useRoute(); // Añade esta línea para obtener los parámetros de la ruta
  const { selectedDate } = route.params as { selectedDate: string };
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<string | null>(null);
  const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });
  const [articles, setArticles] = useState<{ id: string; titulo: string; prioridad: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingArticle, setEditingArticle] = useState({ id: '', title: '' });
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    console.log(articles); // Revisa si todos los artículos tienen un id definido

    const fetchArticlesByDate = async () => {
      try {
        setLoading(true);
        const storedUserId = await AsyncStorage.getItem('userId');
        setUserId(storedUserId);
    
        if (!storedUserId) {
          throw new Error('No se encontró el ID del usuario');
        }
    
        const response = await fetch(`${BASE_URL}/search_articles_by_date/${storedUserId}?fecha=${selectedDate}`);
        if (!response.ok) {
          throw new Error('Network response was not ok for articles');
        }
        const articlesData = await response.json();
        
        // Mapear los datos recibidos al formato esperado por el componente
        const mappedArticles = articlesData.map((article: { articulo: any; prioridad: any; }, index: { toString: () => any; }) => ({
          id: index.toString(), // Usar el índice como ID temporal
          titulo: article.articulo,
          prioridad: article.prioridad
        }));
        
        setArticles(mappedArticles || []);
      } catch (error) {
        console.error('Error al obtener artículos por fecha:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchArticlesByDate();
  }, [selectedDate]);

  const handleBack = () => {
    navigation.navigate('ListaCategorias');
  };

  const handleEdit = () => {
    if (selectedArticle) {
      const article = articles.find(a => a.id === selectedArticle);
      if (article) {
        setEditingArticle({ id: selectedArticle, title: article.titulo });
        setEditModalVisible(true);
      }
    }
    setModalVisible(false);
  };

  const handleEllipsisPress = (id: string, y: number, x: number) => {
    setSelectedArticle(id);

    const { height, width } = Dimensions.get('window');
    const adjustedX = Math.max(10, Math.min(x - 60, width - 170));
    const adjustedY = Math.max(10, y - 50);

    setModalPosition({ top: adjustedY, left: adjustedX });
    setModalVisible(true);
  };

  const handleSaveEdit = async () => {
    if (!userId || !editingArticle.id) return;
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await fetch(`${BASE_URL}/articles/${editingArticle.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // Asegúrate de incluir el token si es necesario
        },
        body: JSON.stringify({
          titulo: editingArticle.title
        }),
      });

      if (response.ok) {
        const result = await response.json();
        setArticles((prevArticles) =>
          prevArticles.map((article) =>
            article.id === editingArticle.id
              ? { ...article, titulo: editingArticle.title }
              : article
          )
        );
        setEditModalVisible(false);
      } else {
        const errorData = await response.json();
        console.error('Error al editar el artículo:', errorData);
        // Aquí puedes mostrar un mensaje de error al usuario
      }
    } catch (error) {
      console.error('Error al editar el artículo:', error);
      // Aquí puedes mostrar un mensaje de error al usuario
    }
  };

  const handleDelete = () => {
    setModalVisible(false);
    setConfirmModalVisible(true);
  };

  const confirmDeleteArticle = async () => {
    if (!selectedArticle || !userId) return;
    try {
      const response = await fetch(`${BASE_URL}/articles/${selectedArticle}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        setArticles(articles.filter(article => article.id !== selectedArticle));
        setSelectedArticle(null);
        setConfirmModalVisible(false);
      } else {
        console.error('Error al eliminar el artículo');
      }
    } catch (error) {
      console.error('Error al eliminar el artículo:', error);
    }
  };

  const cancelDeleteArticle = () => {
    setConfirmModalVisible(false);
  };

  const handleStarPress = async (articleId: string, currentPriority: string) => {
    const newPriority = currentPriority === "Sí" ? false : true;
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await fetch(`${BASE_URL}/articles/${articleId}/priority`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          prioridad: newPriority,
        }),
      });
  
      if (response.ok) {
        const result = await response.json();
        setArticles((prevArticles) =>
          prevArticles.map((article) =>
            article.id === articleId
              ? { ...article, prioridad: newPriority ? "Sí" : "No" }
              : article
          )
        );
      } else {
        const errorData = await response.json();
        console.error('Error al actualizar la prioridad del artículo:', errorData);
      }
    } catch (error) {
      console.error('Error al actualizar la prioridad del artículo:', error);
    }
  };
  
  const renderArticleItem = ({ item }: { item: { id: string; titulo: string; prioridad: string } }) => (
    <View style={styles.articleItem}>
      <Text style={styles.articleTitle}>{item.titulo}</Text>
      <View style={styles.articleActions}>
        <TouchableOpacity onPress={() => handleStarPress(item.id, item.prioridad)}>
          <Ionicons
            name={item.prioridad === "Sí" ? "star" : "star-outline"}
            size={24}
            color="#FE9526"
            style={styles.starIcon}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={(e) => handleEllipsisPress(item.id, e.nativeEvent.pageY, e.nativeEvent.pageX)}>
          <Ionicons name="ellipsis-vertical" size={24} color="#000033" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const getSortedArticles = () => {
    return articles.sort((a, b) => {
      if (a.prioridad === "Sí" && b.prioridad !== "Sí") return -1;
      if (a.prioridad !== "Sí" && b.prioridad === "Sí") return 1;
      return 0;
    });
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }


  return (
    <View style={styles.container}>
      <Background2 />
      <View style={styles.headerContainer}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Ionicons name="arrow-back" size={30} color="white" />
        </TouchableOpacity>
      </View>
      <View style={styles.contentContainer}>
        <Text style={styles.dateText}>Artículos para: {selectedDate}</Text>
        <FlatList
          data={getSortedArticles()}
          renderItem={renderArticleItem}
          keyExtractor={(item) => item.id.toString()} // Verifica que item.id no sea undefined
          contentContainerStyle={styles.articleList}
        />

      </View>
      <Modal
        transparent={true}
        animationType="fade"
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalBackground}
          activeOpacity={1}
          onPressOut={() => setModalVisible(false)}
        >
          <View style={[styles.modalContainer, { top: modalPosition.top, left: modalPosition.left }]}>
            <View style={styles.modalContent}>
              <TouchableOpacity style={styles.modalButton} onPress={handleEdit}>
                <Ionicons name="create-outline" size={24} color="white" style={styles.modalIcon} />
                <Text style={styles.modalButtonText}>Editar</Text>
              </TouchableOpacity>
              <View style={styles.separator} />
              <TouchableOpacity style={styles.modalButton} onPress={handleDelete}>
                <Ionicons name="trash-outline" size={24} color="white" style={styles.modalIcon} />
                <Text style={styles.modalButtonText}>Eliminar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
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
              <Text style={styles.confirmModalText}>{`¿Seguro que quieres eliminar este artículo?\n"${selectedArticle}"?`}</Text>
              <View style={styles.confirmModalButtons}>
                <TouchableOpacity style={styles.confirmButton} onPress={confirmDeleteArticle}>
                  <Text style={styles.confirmButtonText}>Confirmar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.cancelButton} onPress={cancelDeleteArticle}>
                  <Text style={styles.cancelButtonText}>Cancelar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>

      <Modal
        transparent={true}
        visible={editModalVisible}
        animationType="fade"
        onRequestClose={() => setEditModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalBackground}
          activeOpacity={1}
          onPressOut={() => setEditModalVisible(false)}
        >
          <View style={styles.editModalContainer}>
            <View style={styles.editModalContent}>
              <Text style={styles.editModalTitle}>Editar Artículo</Text>
              <TextInput
                style={styles.editInput}
                value={editingArticle.title}
                onChangeText={(text) => setEditingArticle(prev => ({ ...prev, title: text }))}
                placeholder="Título del artículo"
              />
              <View style={styles.editModalButtons}>
                <TouchableOpacity style={styles.saveButton} onPress={handleSaveEdit}>
                  <Text style={styles.buttonText}>Guardar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.cancelButton} onPress={() => setEditModalVisible(false)}>
                  <Text style={styles.buttonText}>Cancelar</Text>
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
    paddingTop: 100,
  },
  headerContainer: {
    position: 'absolute',
    top: 50, // Ajusta este valor según sea necesario
    left: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 1, // Asegura que el header esté por encima de otros elementos
  },
  contentContainer: {
    flex: 1,
    marginTop: 10, // Añade un margen superior para separar del header
  },
  backButton: {
    marginRight: 10,
  },
  menuButton: {
    marginLeft: 'auto',
  },
  titleContainer: {
    alignItems: 'flex-start',
    marginTop: 130, // Ajusta este valor para alinear el título con la flecha
    marginLeft: 20,
  },
  appTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'left',
    lineHeight: 32,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 20,
    marginHorizontal: 20,
  },
  dateInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  labelText: {
    color: 'white',
    fontSize: 18,
    marginLeft: 10,
  },
  selectedDateText: {
    color: 'white',
    fontSize: 18,
    marginLeft: 10,
  },
  addButton: {
    marginTop: 50,
    alignSelf: 'flex-end',
    marginRight: 20,
  },
  categoryItem: {
    width: 100,
    height: 35,
    marginHorizontal: 10,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  articleList: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  articleItem: {
    width: width - 40,
    height: 70,
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: '#000033',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  articleTitle: {
    color: '#000033',
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
    marginRight: 10,
  },
  articleActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  starIcon: {
    marginRight: 10,
  },
  cancelButtonText: {
    color: '#000000',
    fontWeight: 'bold',
    fontSize: 16,
  },
  confirmModalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  confirmModalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  confirmModalText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  confirmModalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '90%',
    borderRadius: 10,
  },
  confirmButton: {
    backgroundColor: '#ff4d4d',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  confirmButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    position: 'absolute',
    backgroundColor: '#37394A',
    borderRadius: 10,
    padding: 10,
    minWidth: 140,
  },
  modalContent: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  modalButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  modalIcon: {
    marginRight: 10,
  },
  modalButtonText: {
    fontSize: 16,
    color: 'white',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer2: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    padding: 20,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  cancelButton: {
    backgroundColor: '#cccccc',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  modalOption: {
    paddingVertical: 15,
  },
  modalOptionText: {
    fontSize: 18,
    color: '#000033',
  },
  separator: {
    height: 1,
    backgroundColor: 'white',
    alignSelf: 'stretch',
    marginVertical: 5,
  },
  editModalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '90%',
  },
  editModalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  editModalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#000033',
  },
  editInput: {
    height: 40,
    borderColor: '#000033',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    borderRadius: 10,
    color: '#000033',
  },
  editModalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  saveButton: {
    backgroundColor: '#FE3777',
    padding: 10,
    borderRadius: 5,
    width: '45%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  dateText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
});

export default ArticulosPorFecha;