import {create} from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';





interface PlaylistStore {
  playlists: Playlist[];
  setPlaylists: (playlists: Playlist[]) => void;
  loadPlaylists: () => Promise<void>;
  addPlaylist: (newPlaylist: Playlist) => void;
}

export const usePlaylistStore = create<PlaylistStore>((set) => ({
  playlists: [],
  
  // Charger les playlists depuis AsyncStorage
  loadPlaylists: async () => {
    try {
      const playlists = await AsyncStorage.getItem('playlists');
      if (playlists) {
        set({ playlists: JSON.parse(playlists) });
      }
    } catch (error) {
      console.error('Failed to load playlists from AsyncStorage', error);
    }
  },
  
  // Mettre à jour les playlists dans AsyncStorage
  setPlaylists: (playlists: Playlist[]) => {
    AsyncStorage.setItem('playlists', JSON.stringify(playlists));
    set({ playlists });
  },

  // Ajouter une nouvelle playlist
  addPlaylist: (newPlaylist: Playlist) => {
    set((state) => {
      const updatedPlaylists = [...state.playlists, newPlaylist];
      AsyncStorage.setItem('playlists', JSON.stringify(updatedPlaylists)); // Persister la playlist
      return { playlists: updatedPlaylists };
    });
  },
}));

export default usePlaylistStore;

