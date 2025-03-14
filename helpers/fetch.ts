import * as MediaLibrary from 'expo-media-library';
export const fetchAudioFiles = async () => {
    const media = await MediaLibrary.getAssetsAsync({
      mediaType: MediaLibrary.MediaType.audio,
      first: 10,

      
    });

    return media.assets
  };


export const fetchAudioByAlbum = async (album: string) => {
    const media = await MediaLibrary.getAssetsAsync({
      mediaType: MediaLibrary.MediaType.audio,
      first: 1000,
      sortBy: MediaLibrary.SortBy.default,
      album:album
    });

    return media.assets
  }

