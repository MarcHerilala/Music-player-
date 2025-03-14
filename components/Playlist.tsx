import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList } from 'react-native';
import { loadPlaylists,savePlaylists } from '@/services/PlayListService';

const PlaylistScreen = () => {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [newPlaylistName, setNewPlaylistName] = useState('');

  useEffect(() => {
    loadPlaylists().then(setPlaylists);
  }, []);

  const addPlaylist = () => {
    if (newPlaylistName.trim() === '') return;

    const newPlaylist: Playlist = {
      id: Date.now().toString(),
      name: newPlaylistName,
      tracks: [],
    };

    const updatedPlaylists = [...playlists, newPlaylist];
    setPlaylists(updatedPlaylists);
    savePlaylists(updatedPlaylists);
    setNewPlaylistName('');
  };

  return (
    <View>
      <Text>Playlists</Text>
      <TextInput
        placeholder="Nom de la playlist"
        value={newPlaylistName}
        onChangeText={setNewPlaylistName}
      />
      <Button title="Créer Playlist" onPress={addPlaylist} />
      
      <FlatList
        data={playlists}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <Text>{item.name}</Text>}
      />
    </View>
  );
};

export default PlaylistScreen;
