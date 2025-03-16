import React, { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { View, Text, StyleSheet, Image, Dimensions, Platform, TouchableOpacity } from "react-native";
import { BlurView } from 'expo-blur';
import AudioPlayer from "@/components/AudioPlayer";
import { Metadata } from "@/types/metaData";
import MusicInfo from "expo-music-info-2";
import { Ionicons } from '@expo/vector-icons';

const DEFAULT_COVER = "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3";
const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function AudioDetailsScreen() {
  const { slug, details } = useLocalSearchParams();
  const [metadata, setMetadata] = useState<Metadata>();
  const audio = details && typeof details === 'string' ? JSON.parse(details) : null;
  
  useEffect(() => {
    if (!audio?.uri) return;

    (MusicInfo as any).getMusicInfoAsync(audio.uri, {
      title: true,
      artist: true,
      album: true,
      genre: true,
      picture: true
    }).then((info: React.SetStateAction<Metadata | undefined>) => {
      setMetadata(info);
    }).catch((error: any) => {
      console.error("Error fetching metadata:", error);
    });
  }, [audio?.uri]);

  const handlePrevious = () => {
    // Implement previous track functionality
  };

  const handleStop = () => {
    // Implement stop functionality
  };

  const handleNext = () => {
    // Implement next track functionality
  };

  return (
    <View style={styles.container}>
      <View style={styles.backgroundImage}>
        <Image 
          source={{ uri: metadata?.picture?.pictureData || DEFAULT_COVER }}
          style={styles.backgroundCover}
          blurRadius={25}
        />
        <View style={styles.overlay} />
      </View>
      
      <View style={styles.content}>
        <View style={styles.albumContainer}>
          <Image 
            source={{ uri: metadata?.picture?.pictureData || DEFAULT_COVER }} 
            style={styles.albumCover}
          />
          {Platform.OS !== 'web' && (
            <BlurView intensity={100} style={styles.albumShadow} />
          )}
        </View>

        <View style={styles.infoContainer}>
          <View style={styles.textContainer}>
            <Text style={styles.title} numberOfLines={2}>
              {metadata?.title || audio?.filename || 'Unknown Track'}
            </Text>
            <Text style={styles.artist} numberOfLines={1}>
              {metadata?.artist || 'Unknown Artist'}
            </Text>
            <View style={styles.albumInfoContainer}>
              <Text style={styles.album} numberOfLines={2}>
                {metadata?.album || 'Unknown Album'}{metadata?.genre ? ' • ' : ''}{metadata?.genre || ''}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.controlsContainer}>
          <TouchableOpacity onPress={handlePrevious} style={styles.controlButton}>
            <Ionicons name="play-skip-back" size={32} color="#6b46c1" />
          </TouchableOpacity>
          
          <View style={styles.mainControls}>
            <TouchableOpacity onPress={handleStop} style={styles.stopButton}>
              <Ionicons name="stop" size={24} color="#fff" />
            </TouchableOpacity>
            
            <View style={styles.playPauseContainer}>
              <AudioPlayer uri={audio?.uri} currentTitle={audio?.filename} />
            </View>
          </View>

          <TouchableOpacity onPress={handleNext} style={styles.controlButton}>
            <Ionicons name="play-skip-forward" size={32} color="#6b46c1" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  backgroundCover: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.85)',
  },
  content: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  albumContainer: {
    width: SCREEN_WIDTH * 0.8,
    aspectRatio: 1,
    marginVertical: 30,
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 10,
    shadowColor: '#6b46c1',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
  },
  albumCover: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
  },
  albumShadow: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(107,70,193,0.1)',
  },
  infoContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 30,
    padding: 20,
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderRadius: 15,
    shadowColor: '#6b46c1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  textContainer: {
    width: '100%',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 12,
    textAlign: 'center',
    textShadowColor: 'rgba(107,70,193,0.1)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
    paddingHorizontal: 10,
  },
  artist: {
    fontSize: 22,
    color: '#4a5568',
    marginBottom: 8,
    textAlign: 'center',
    paddingHorizontal: 10,
  },
  albumInfoContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  album: {
    fontSize: 16,
    color: '#718096',
    textAlign: 'center',
    flexShrink: 1,
  },
  controlsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 20,
    marginBottom: 40,
  },
  controlButton: {
    padding: 15,
    backgroundColor: 'rgba(107,70,193,0.1)',
    borderRadius: 50,
    shadowColor: '#6b46c1',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  mainControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
  },
  stopButton: {
    backgroundColor: '#dc2626',
    padding: 12,
    borderRadius: 50,
    marginRight: 10,
    shadowColor: '#dc2626',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  playPauseContainer: {
    backgroundColor: 'rgba(107,70,193,0.1)',
    borderRadius: 50,
    padding: 10,
    shadowColor: '#6b46c1',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
});