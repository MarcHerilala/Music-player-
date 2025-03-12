import * as MediaLibrary from 'expo-media-library';
export const FetchAudioFiles= async ()=>{
    const media = await MediaLibrary.getAssetsAsync({
        mediaType: MediaLibrary.MediaType.audio,
        first: 9999,
    });
    return media.assets;
}


