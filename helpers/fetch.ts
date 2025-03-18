import * as MediaLibrary from 'expo-media-library';
import MusicInfo from 'expo-music-info-2';


  export const fetchAudioFiles = async (limit = 20, offset = 0) => {
  const media = await MediaLibrary.getAssetsAsync({
    mediaType: MediaLibrary.MediaType.audio,
    first: limit,
  });
  return media.assets;
};


export const getAudioById = async (id: string) => {
  const audioFiles = await fetchAudioFiles();
  const audio = audioFiles.find((file) => file.id === id);

  if (!audio) {
    throw new Error(`Audio with ID ${id} not found`);
  }

  return audio;
};

export const fetchAudioByAlbum = async (album: string) => {
    const media = await MediaLibrary.getAssetsAsync({
      mediaType: MediaLibrary.MediaType.audio,
      first: 10,
      sortBy: MediaLibrary.SortBy.default,
      album:album
    });
    const med=await MediaLibrary.getAlbumsAsync()

    return media.assets
  }






export const fetchMetadata = async (uri: string) => {
const metadata = await (MusicInfo as any).getMusicInfoAsync(uri, {
      title: true,
      artist: true,
      album: true,
      genre: true,
      picture: true
    });

    return metadata
    
};

