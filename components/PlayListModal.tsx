import React, { useEffect, useState } from 'react';
import { Modal, StyleSheet, Text, Pressable, View, TextInput } from 'react-native';
import { Plus, X } from 'lucide-react-native';
import usePlaylistStore from '@/store/PlayListStore';

export const PlayListCreateModal = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const { loadPlaylists, addPlaylist } = usePlaylistStore();

  useEffect(() => {
    loadPlaylists();
  }, [loadPlaylists]);

  const handleAddPlaylist = () => {
    if (newPlaylistName.trim() === '') return;

    const newPlaylist = {
      id: Date.now().toString(),
      name: newPlaylistName,
      tracks: [],
    };

    addPlaylist(newPlaylist);
    setNewPlaylistName('');
    setModalVisible(false);
  };

  return (
    <>
      <Pressable style={styles.addButton} onPress={() => setModalVisible(true)}>
        <Plus size={24} color="#ffffff" />
      </Pressable>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalView}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Create New Playlist</Text>
              <Pressable
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}
              >
                <X size={24} color="#64748b" />
              </Pressable>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Playlist Name</Text>
              <TextInput
                style={styles.input}
                onChangeText={setNewPlaylistName}
                value={newPlaylistName}
                placeholder="Enter playlist name"
                placeholderTextColor="#94a3b8"
                autoFocus
              />
            </View>

            <Pressable
              style={[
                styles.createButton,
                !newPlaylistName.trim() && styles.createButtonDisabled
              ]}
              onPress={handleAddPlaylist}
              disabled={!newPlaylistName.trim()}
            >
              <Text style={styles.createButtonText}>Create Playlist</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  addButton: {
    backgroundColor: '#6366f1',
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    backgroundColor: 'white',
    borderRadius: 24,
    width: '90%',
    maxWidth: 400,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1e293b',
  },
  closeButton: {
    padding: 4,
  },
  inputContainer: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748b',
    marginBottom: 8,
  },
  input: {
    height: 48,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#1e293b',
  },
  createButton: {
    backgroundColor: '#6366f1',
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  createButtonDisabled: {
    backgroundColor: '#cbd5e1',
    shadowColor: 'transparent',
  },
  createButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
