import React, { useEffect, useState } from 'react';
import { Alert, Modal, StyleSheet, Text, Pressable, View, TextInput } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { loadPlaylists,savePlaylists } from '@/services/PlayListService';
import { Plus } from 'lucide-react-native';
import usePlaylistStore from '@/store/PlayListStore';
export const PlayListCreateModal = () => {
  const [modalVisible, setModalVisible] = useState(false);
  
    
 const [newPlaylistName, setNewPlaylistName] = useState('');
  const { playlists, loadPlaylists, addPlaylist } = usePlaylistStore();

  // Charger les playlists au montage du composant
  useEffect(() => {
    loadPlaylists();
  }, [loadPlaylists]);

  const handleAddPlaylist = () => {
    if (newPlaylistName.trim() === '') return;

    // Crée une nouvelle playlist
    const newPlaylist = {
      id: Date.now().toString(),
      name: newPlaylistName,
      tracks: [],
    };

    // Utilise la méthode addPlaylist du store
    addPlaylist(newPlaylist);
    setNewPlaylistName(''); // Réinitialise le champ
    setModalVisible(false); // Ferme le modal
  };




  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.centeredView}>
        <View>

        
          <Pressable style={styles.addButton} onPress={() => setModalVisible(true)}>
            <Plus size={24} color="#ffffff" />
          </Pressable>
        </View>
        {/* Modal pour la création de la playlist */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            Alert.alert('Le modal a été fermé.');
            setModalVisible(false);
          }}
          
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={null}>Créer une nouvelle playlist</Text>
              {/* Champ de saisie pour le nom de la playlist */}
              <TextInput
                style={styles.input}
                onChangeText={(text) => setNewPlaylistName(text)} // Met à jour le nom de la playlist
                value={newPlaylistName}
                placeholder="Nom de la playlist"
              />
              {/* Bouton pour créer la playlist */}
              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={handleAddPlaylist}
              >
                <Text style={styles.textStyle}>Créer la Playlist</Text>
              </Pressable>
              {/* Bouton pour fermer le modal */}
              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.textStyle}>Fermer le modal</Text>
              </Pressable>
            </View>
          </View>
        </Modal>

        {/* Bouton pour afficher le modal */}
       
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 15,
    width: '100%',
    paddingLeft: 8,
    borderRadius: 4,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButton: {
    backgroundColor: '#6366f1',
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
    
  },
  buttonClose: {
    backgroundColor: '#2196F3',
    marginTop: 10,
    width: '80%', // Ajusté la largeur pour qu'il y ait plus de place pour le texte
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});
