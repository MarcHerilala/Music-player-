import {create} from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';





interface PlaylistStore {
  playlists: Playlist[];
  setPlaylists: (playlists: Playlist[]) => void;
  loadPlaylists: () => Promise<void>;
  addPlaylist: (newPlaylist: Playlist) => void;
  addTracksToPlaylist: (playlistId: string, track: Track[]) => void;
  removeTrackFromPlaylist: (playlistId: string, trackId: string) => void;
}

export const usePlaylistStore = create<PlaylistStore>((set) => ({
  playlists: [],
  
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
  
  setPlaylists: (playlists: Playlist[]) => {
    AsyncStorage.setItem('playlists', JSON.stringify(playlists));
    set({ playlists });
  },

  addPlaylist: (newPlaylist: Playlist) => {
    set((state) => {
      const updatedPlaylists = [...state.playlists, newPlaylist];
      AsyncStorage.setItem('playlists', JSON.stringify(updatedPlaylists)); // Persister la playlist
      return { playlists: updatedPlaylists };
    });
  },

  addTracksToPlaylist: (playlistId: string, newTracks: Track[]) => {
  set((state) => {
    const updatedPlaylists = state.playlists.map((playlist) =>
      playlist.id === playlistId
        ? { ...playlist, tracks: [...playlist.tracks, ...newTracks] }
        : playlist
    );

    AsyncStorage.setItem("playlists", JSON.stringify(updatedPlaylists));
    return { playlists: updatedPlaylists };
  });
},

  removeTrackFromPlaylist: (playlistId:string, trackId:string) => {
    set((state) => {
      const updatedPlaylists = state.playlists.map((playlist) =>
        playlist.id === playlistId
          ? { ...playlist, tracks: playlist.tracks.filter((t) => t.id !== trackId) }
          : playlist
      );

      AsyncStorage.setItem("playlists", JSON.stringify(updatedPlaylists));
      return { playlists: updatedPlaylists };
    });
  },
}));

export default usePlaylistStore;

