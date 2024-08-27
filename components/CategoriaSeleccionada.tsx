import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Modal, Dimensions } from 'react-native';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from './types';
import { Ionicons } from '@expo/vector-icons';
import Background2 from './Background2';
import { StackNavigationProp } from '@react-navigation/stack';
import { TextInput } from 'react-native-paper';
import BASE_URL from '../config';

const { width } = Dimensions.get('window');

type CategoriaSeleccionadaRouteProp = RouteProp<RootStackParamList, 'CategoriaSeleccionada'>;
type CategoriaSeleccionadaNavigationProp = StackNavigationProp<RootStackParamList, 'CategoriaSeleccionada'>;

const CategoriaSeleccionada: React.FC = () => {
  const navigation = useNavigation<CategoriaSeleccionadaNavigationProp>();
  const route = useRoute<CategoriaSeleccionadaRouteProp>();
  const { categoryId, categoryTitle, categoryColor } = route.params;
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<string | null>(null);
  const [starredArticles, setStarredArticles] = useState<string[]>([]);
  const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingArticle, setEditingArticle] = useState({ id: '', title: '' });
  const [selectedArticleTitle, setSelectedArticleTitle] = useState<string | null>(null);
  const [articles, setArticles] = useState<{ id: string; title: string }[]>([]);
  const [loading, setLoading] = useState(true);

  const handleBack = () => {
    navigation.goBack();
  };
  const fetchArticles = async () => {
    try {
      const response = await fetch(`${BASE_URL}/articles/category/${categoryId}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      const mappedData = data.map((article: { id: any; titulo: any; }) => ({
        id: article.id,
        title: article.titulo,
      }));
      setArticles(mappedData);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchArticles();
  }, [categoryId]);
  
  const toggleStarred = (id: string) => {
    setStarredArticles((prevStarred) =>
      prevStarred.includes(id) ? prevStarred.filter(item => item !== id) : [...prevStarred, id]
    );
  };

  const handleEllipsisPress = (id: string, y: number, x: number, title: string) => {
    setSelectedArticle(id);
    setSelectedArticleTitle(title);

    const { height, width } = Dimensions.get('window');
    const adjustedX = Math.max(10, Math.min(x - 60, width - 170));
    const adjustedY = Math.max(10, y - 50);

    setModalPosition({ top: adjustedY, left: adjustedX });
    setModalVisible(true);
  };

  const handleEdit = () => {
    if (selectedArticle && selectedArticleTitle) {
      setEditingArticle({ id: selectedArticle, title: selectedArticleTitle });
      setEditModalVisible(true);
    }
    setModalVisible(false);
  };

  const handleDelete = () => {
    setModalVisible(false);
    setConfirmModalVisible(true);
  };

  const handleSaveEdit = async () => {
    try {
      // Aquí deberías actualizar el artículo en tu base de datos
      // Ejemplo de actualización:
      await fetch(`${BASE_URL}/articles/${editingArticle.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title: editingArticle.title }),
      });
      // Actualiza el artículo en la lista local
      setArticles(prevArticles =>
        prevArticles.map(article =>
          article.id === editingArticle.id ? { ...article, title: editingArticle.title } : article
        )
      );
    } catch (error) {
      console.error('Error updating article:', error);
    } finally {
      setEditModalVisible(false);
    }
  };

  const confirmDeleteArticle = async () => {
    setConfirmModalVisible(false);
    if (selectedArticle) {
      try {
        // Aquí deberías eliminar el artículo de tu base de datos
        await fetch(`${BASE_URL}/articles/${selectedArticle}`, {
          method: 'DELETE',
        });
        // Elimina el artículo de la lista local
        setArticles(prevArticles =>
          prevArticles.filter(article => article.id !== selectedArticle)
        );
      } catch (error) {
        console.error('Error deleting article:', error);
      }
    }
  };

  const cancelDeleteArticle = () => {
    setConfirmModalVisible(false);
  };

  const getSortedArticles = () => {
    return articles.sort((a, b) => {
      const aStarred = starredArticles.includes(a.id);
      const bStarred = starredArticles.includes(b.id);
      if (aStarred && !bStarred) return -1;
      if (!aStarred && bStarred) return 1;
      return 0;
    });
  };

  const handleCreateArticle = () => {
    navigation.navigate('CrearArticulo');
  };

  const renderArticleItem = ({ item }: { item: { id: string; title: string } }) => (
    <View style={styles.articleItem}>
      <Text style={styles.articleTitle}>{item.title}</Text>
      <View style={styles.articleActions}>
        <TouchableOpacity onPress={() => toggleStarred(item.id)}>
          <Ionicons
            name={starredArticles.includes(item.id) ? 'star' : 'star-outline'}
            size={24}
            color="#FE9526"
            style={styles.starIcon}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={(e) => handleEllipsisPress(item.id, e.nativeEvent.pageY, e.nativeEvent.pageX, item.title)}>
          <Ionicons name="ellipsis-vertical" size={24} color="#000033" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Background2 />
      <View style={styles.content}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Ionicons name="arrow-back" size={30} color="white" />
        </TouchableOpacity>
        <View style={[styles.categoryTitleContainer, { backgroundColor: categoryColor }]}>
          <Text style={styles.categoryTitle}>{categoryTitle}</Text>
        </View>
        <Text style={styles.instructions}>
          Obtén organización dentro de todas tus categorías.
        </Text>

        {/* List of articles */}
        {loading ? (
          <Text style={styles.loadingText}>Cargando artículos...</Text>
        ) : (
          <FlatList
            data={getSortedArticles()}
            renderItem={renderArticleItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ marginTop: 40 }}
          />
        )}

      </View>

      {/* Modal for edit/delete */}
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

      {/* Add button */}
      <TouchableOpacity style={styles.addButton} onPress={handleCreateArticle}>
        <Ionicons name="add-circle" size={70} color="#FE9526" />
      </TouchableOpacity>

      {/* Modal de confirmación para eliminar */}
      <Modal
        transparent={true}
        animationType="fade"
        visible={confirmModalVisible}
        onRequestClose={() => setConfirmModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalBackground}
          activeOpacity={1}
          onPressOut={() => setConfirmModalVisible(false)}
        >
          <View style={styles.confirmModal}>
            <Text style={styles.confirmText}>¿Estás seguro de que quieres eliminar este artículo?</Text>
            <View style={styles.confirmButtons}>
              <TouchableOpacity style={styles.confirmButton} onPress={confirmDeleteArticle}>
                <Text style={styles.confirmButtonText}>Sí</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cancelButton} onPress={cancelDeleteArticle}>
                <Text style={styles.confirmButtonText}>No</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Modal para editar artículo */}
      <Modal
        transparent={true}
        animationType="fade"
        visible={editModalVisible}
        onRequestClose={() => setEditModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalBackground}
          activeOpacity={1}
          onPressOut={() => setEditModalVisible(false)}
        >
          <View style={styles.editModal}>
            <TextInput
              label="Título del artículo"
              value={editingArticle.title}
              onChangeText={(text) => setEditingArticle(prev => ({ ...prev, title: text }))}
              style={styles.textInput}
            />
            <View style={styles.editModalButtoms}>
            <TouchableOpacity style={styles.saveButton} onPress={handleSaveEdit}>
              <Text style={styles.saveButtonText}>Guardar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={() => setEditModalVisible(false)}>
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
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
    backgroundColor: '#f0f0f0',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  backButton: {
    marginBottom: 10,
  },
  categoryTitleContainer: {
    padding: 10,
    borderRadius: 5,
  },
  categoryTitle: {
    fontSize: 20,
    color: 'white',
    fontWeight: 'bold',
  },
  instructions: {
    fontSize: 16,
    color: 'white',
    marginBottom: 20,
    marginTop: 20
  },
  articleItem: {
    backgroundColor: '#ffffff',
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
    elevation: 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 3, 
    borderColor: '#000033'
  },
  articleTitle: {
    fontSize: 16,
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
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    position: 'absolute',
    backgroundColor: '#37394A',
    borderRadius: 10,
    padding: 15,
    width: 150,
  },
  modalContent: {
    alignItems: 'center',
  },
  modalButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 5,
    marginBottom: 5,
    width: '100%',
  },
  modalIcon: {
    marginRight: 10,
  },
  modalButtonText: {
    color: 'white'
  },
  separator: {
    height: 1,
    backgroundColor: '#ddd',
    width: '100%',
    marginVertical: 5,
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
  },
  loadingText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 18,
  },
  editModal: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3, 
    borderColor: '#000033',
  },
  textInput: {
    width: '100%',
    marginBottom: 10,
  },
  editModalButtoms: {
    flexDirection: 'row',
    justifyContent:'space-between',
  },
  saveButton: {
    backgroundColor: '#FE3777',
    padding: 10,
    borderRadius: 5,
    width: '45%',
    alignItems: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: '#0270D0',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    width: '45%',
    alignItems: 'center',
  }, 
  cancelButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  confirmModal: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3, 
    borderColor: '#000033',
    fontWeight: 'bold'
  },
  confirmText: {
    fontSize: 16,
    marginBottom: 20,
    fontWeight: 'bold',
  },
  confirmButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  confirmButton: {
    padding: 10,
    borderRadius: 5,
    width: '45%',
    alignItems: 'center',
    backgroundColor: '#FE3777',
  },
  confirmButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CategoriaSeleccionada;
