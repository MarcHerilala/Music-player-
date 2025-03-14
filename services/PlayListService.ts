import AsyncStorage from '@react-native-async-storage/async-storage';

export const savePlaylists = async (playlists: Playlist[]) => {
  try {
    await AsyncStorage.setItem('playlists', JSON.stringify(playlists));
  } catch (error) {
    console.error("Erreur lors de l'enregistrement :", error);
  }
};

export const loadPlaylists = async () => {
  try {
    const data = await AsyncStorage.getItem('playlists');
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Erreur lors du chargement :", error);
    return [];
  }
};
