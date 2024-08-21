import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, FlatList, Dimensions, Modal, ActivityIndicator, TextInput, TouchableWithoutFeedback } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Background2 from './Background2';
import BASE_URL from '../config';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

import { RootStackParamList } from './types';

type ProfileScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Perfil'>;

const ListaCategorias = () => {
  const navigation = useNavigation<ProfileScreenNavigationProp>();

  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [starredArticles, setStarredArticles] = useState<string[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisible2, setModalVisible2] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<string | null>(null);
  const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingArticle, setEditingArticle] = useState({ id: '', title: '' });
  const [categories, setCategories] = useState<{ id: string; nombre: string; color: string }[]>([]);
  const [articles, setArticles] = useState<{ id: string; titulo: string; id_categoria: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true); // Agrega esto para mostrar un indicador de carga
        const userId = await AsyncStorage.getItem('userId');
        
        if (!userId) {
          throw new Error('No se encontró el ID del usuario');
        }
  
        const response = await fetch(`${BASE_URL}/user/${userId}`);
        
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        
        const data = await response.json();
        setCategories(data.categories || []);
        setArticles(data.articles || []);
      } catch (error) {
        console.error('Error al obtener datos del usuario:', error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchUserData();
  }, []);
  

  const handleMenuPress = () => {
    navigation.navigate('Perfil');
  };

  const handleBack = () => {
    navigation.navigate('Inicio');
  };
  

  const handleDateChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(false);
    setDate(currentDate);
  };

  const showDatePickerModal = () => {
    setShowDatePicker(true);
  };

  const formatDate = (date: Date): string => {
    const options: Intl.DateTimeFormatOptions = {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    };
    return date.toLocaleDateString('es-ES', options);
  };

  const renderCategoryItem = ({ item }: { item: { id: string; nombre: string; color: string } }) => (
    <TouchableOpacity 
      style={[styles.categoryItem, { backgroundColor: item.color }]} 
      onPress={() => navigation.navigate('CategoriaSeleccionada', { 
        categoryId: item.id,
        categoryTitle: item.nombre,
        categoryColor: item.color 
      })}
    >
      <Text style={styles.categoryTitle}>{item.nombre}</Text>
    </TouchableOpacity>
  );

  const toggleStarred = (id: string) => {
    setStarredArticles((prevStarred) => 
      prevStarred.includes(id) ? prevStarred.filter(item => item !== id) : [...prevStarred, id]
    );
  };

  const handleMoreOptionsPress = () => {
    setModalVisible2(true);
  };

  const handleCreateCategory = () => {
    setModalVisible2(false);
    navigation.navigate('CrearCategoria');
  };

  const handleCreateArticle = () => {
    navigation.navigate('CrearArticulo');
  };

  const handleEllipsisPress = (id: string, y: number, x: number) => {
    setSelectedArticle(id);
  
    const { height, width } = Dimensions.get('window');
    const adjustedX = Math.max(10, Math.min(x - 60, width - 170));
    const adjustedY = Math.max(10, y - 50);
  
    setModalPosition({ top: adjustedY, left: adjustedX });
    setModalVisible(true);
  };

  const handleEdit = async () => {
    if (selectedArticle && selectedArticle) {
      setEditingArticle({ id: selectedArticle, title: '' });
      setEditModalVisible(true);
    }
    setModalVisible(true);
  };

  const handleSaveEdit = async () => {
    try {
      const response = await fetch(`${BASE_URL}/articles/${editingArticle.id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify({ 
          titulo: editingArticle.title 
        }),
      });  
      const result = await response.json();
      if (response.ok){
        setArticles((prevArticles) =>
          prevArticles.map((article) =>
              article.id === editingArticle.id
                  ? { ...article, titulo: editingArticle.title }
                  : article
          )
      );
      console.log('Edit', selectedArticle);
      setEditModalVisible(false);
      } else {
        console.error('Error al editar el artículo');
      }
    } catch {
      console.error('Error al editar el artículo');
    }
  };

  const handleDelete = async () => {
    setModalVisible(false);
    setConfirmModalVisible(true);
  };

  const confirmDeleteArticle = async () => {
    if(!selectedArticle) return;
    try {
      const response = await fetch(`${BASE_URL}/articles/${selectedArticle}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if(response.status === 204)  {
        setArticles(articles.filter(article => article.id!== selectedArticle));
        setSelectedArticle(null);
        console.log('Deleted', selectedArticle);
        setConfirmModalVisible(false);
      } else {
        console.error('Error al eliminar el artículo');
      }
    } catch {
      console.error('Error al eliminar el artículo');
    }
  };

  const cancelDeleteArticle = () => {
    setConfirmModalVisible(false);
  };

  const renderArticleItem = ({ item }) => (
    <View style={styles.articleItem}>
      <Text style={styles.articleTitle}>{item.titulo}</Text>
      <View style={styles.articleActions}>
        <TouchableOpacity onPress={() => toggleStarred(item.id)}>
          <Ionicons 
            name={starredArticles.includes(item.id) ? "star" : "star-outline"} 
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
      const aStarred = starredArticles.includes(a.id);
      const bStarred = starredArticles.includes(b.id);
      if (aStarred && !bStarred) return -1;
      if (!aStarred && bStarred) return 1;
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
        <TouchableOpacity style={styles.menuButton} onPress={handleMenuPress}>
          <Ionicons name="menu" size={32} color="white" />
        </TouchableOpacity>
      </View>
      <View style={styles.titleContainer}>
        <Text style={styles.appTitle}>
          SEAMOS{'\n'}
          PRODUCTIVOS{'\n'}
          HOY
        </Text>
      </View>
      <View style={styles.dateContainer}>
        <View style={styles.dateInfoContainer}>
          <TouchableOpacity onPress={showDatePickerModal}>
            <Ionicons name="calendar-outline" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.labelText}>Fecha:</Text>
          <Text style={styles.selectedDateText}>{formatDate(date)}</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.addButton} onPress={handleMoreOptionsPress}>
        <Ionicons name="add" size={24} color="#000033" />
      </TouchableOpacity>

      {/* Modal de Opciones */}
      <Modal
        transparent={true}
        visible={modalVisible2}
        animationType="slide"
        onRequestClose={() => setModalVisible2(false)}
      >
        <TouchableWithoutFeedback onPress={() => setModalVisible2(false)}>
          <View style={styles.modalOverlay} />
        </TouchableWithoutFeedback>
        <View style={styles.modalContainer2}>
          <TouchableOpacity style={styles.modalOption} onPress={handleCreateCategory}>
            <Text style={styles.modalOptionText}>Crear Categoría</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.modalOption} onPress={handleCreateArticle}>
            <Text style={styles.modalOptionText}>Crear Artículo</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      <View style={{ marginTop: 20, paddingHorizontal: 10 }}>
        <FlatList
          data={categories}
          renderItem={renderCategoryItem}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 10 }}
        />
      </View>

      <FlatList
        data={getSortedArticles()}
        renderItem={renderArticleItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.articleList}
      />

      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={handleDateChange}
        />
      )}

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
  },
  headerContainer: {
    position: 'absolute',
    top: 50,
    left: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    marginRight: 10,
  },
  menuButton: {
    marginLeft: 'auto',
  },
  titleContainer: {
    alignItems: 'flex-start',
    marginTop: 100,
    marginLeft: 20,
  },
  appTitle: {
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'left',
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
  cancelButton: {
    backgroundColor: '#cccccc',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  cancelButtonText: {
    color: '#000000',
    fontWeight: 'bold',
    fontSize: 16,
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
});

export default ListaCategorias;