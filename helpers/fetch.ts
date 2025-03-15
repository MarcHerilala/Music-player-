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
      first: 10,
      sortBy: MediaLibrary.SortBy.default,
      album:album
    });
    const med=await MediaLibrary.getAlbumsAsync()

    return media.assets
  }

