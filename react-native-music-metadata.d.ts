declare module 'react-native-music-metadata' {
    const getMetadata: (uri: string) => Promise<{
        title?: string;
        artist?: string;
        album?: string;
        cover?: string; // Pochette en base64
    }>;

    export default { getMetadata };
}
