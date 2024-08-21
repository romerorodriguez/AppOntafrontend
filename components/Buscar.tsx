import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, TextInput, FlatList, ActivityIndicator, Dimensions, Modal, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import Background1 from './Background1';
import BASE_URL from '../config';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

const Buscar = () => {
  const navigation = useNavigation();
  const [searchValue, setSearchValue] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [starredItems, setStarredItems] = useState<number[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<number | null>(null);
  const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem('userId');
        if (storedUserId) {
          setUserId(storedUserId);
        } else {
          Alert.alert('Error', 'No se pudo obtener el ID del usuario. Por favor, inicie sesión nuevamente.');
          navigation.navigate('Login' as never);
        }
      } catch (error) {
        console.error('Error al obtener el ID del usuario:', error);
        Alert.alert('Error', 'Hubo un problema al obtener la información del usuario.');
      }
    };

    fetchUserId();
  }, [navigation]);

  const handleBack = () => {
    navigation.goBack();
  };

  const handleSearch = async () => {
    if (!userId) {
      Alert.alert('Error', 'No se pudo obtener el ID del usuario. Por favor, inicie sesión nuevamente.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/Buscar/${userId}?query=${searchValue}`);
      if (!response.ok) {
        throw new Error('Error en la respuesta del servidor');
      }
      const data = await response.json();
      setResults(data);
      setShowResults(true);
    } catch (error) {
      console.error('Error al realizar la búsqueda:', error);
      Alert.alert('Error', 'Hubo un problema al realizar la búsqueda. Por favor, intente nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const toggleStarred = (id: number) => {
    setStarredItems(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleEllipsisPress = (id: number, pageY: number, pageX: number) => {
    setSelectedArticle(id);

    const { height, width } = Dimensions.get('window');
    const adjustedX = Math.max(10, Math.min(pageX - 60, width - 170));
    const adjustedY = Math.max(10, pageY - 50);

    setModalPosition({ top: adjustedY, left: adjustedX });
    setModalVisible(true);
  };

  const handleEdit = () => {
    console.log('Editar', selectedArticle);
    setModalVisible(false);
  };

  const handleDelete = () => {
    console.log('Eliminar', selectedArticle);
    setModalVisible(false);
  };

  const renderArticleItem = ({ item }) => (
    <View style={styles.articleItem}>
      <Text style={styles.articleTitle}>{item.titulo}</Text>
      <View style={styles.articleActions}>
        <TouchableOpacity onPress={() => toggleStarred(item.id)}>
          <Ionicons
            name={starredItems.includes(item.id) ? "star" : "star-outline"}
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

  return (
    <View style={styles.container}>
      <Background1 />

      <View style={styles.headerContainer}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Ionicons name="arrow-back" size={30} color="white" />
        </TouchableOpacity>
        <Text style={styles.title}>Buscar</Text>
      </View>

      <View style={styles.searchBarContainer}>
        <Ionicons name="search" size={20} color="#000033" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar..."
          placeholderTextColor="#000033"
          selectionColor="#000033"
          value={searchValue}
          onChangeText={text => setSearchValue(text)}
          onSubmitEditing={handleSearch}
        />
      </View>
      <View style={styles.instructionsContainer}>
        <Text style={styles.instructionsText}>
          Escribe una palabra clave y deja que nuestra herramienta haga el resto.
        </Text>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />
      ) : showResults ? (
        results.length > 0 ? (
          <FlatList
            data={results}
            renderItem={renderArticleItem}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.articleList}
          />
        ) : (
          <Text style={styles.noResults}>No se encontraron resultados.</Text>
        )
      ) : null}


      {modalVisible && (
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
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000033',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    marginBottom: 20,
  },
  backButton: {
    marginRight: 10,
    marginTop: 70,
  },
  title: {
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 70,
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginLeft: 10,
    marginRight: 10,
    width: '90%',
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
  instructionsContainer: {
    marginTop: 20,
    paddingHorizontal: 16,
  },
  instructionsText: {
    color: 'white',
    fontSize: 16,
    marginTop: 10,
  },
  loader: {
    marginTop: 20,
  },
  noResults: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
  articleList: {
    paddingHorizontal: 16,
    marginTop: 20,
  },
  articleItem: {
    width: width - 32,
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
  separator: {
    height: 1,
    backgroundColor: 'white',
    alignSelf: 'stretch',
    marginVertical: 5,
  },
});

export default Buscar;
