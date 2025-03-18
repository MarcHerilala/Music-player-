import React, { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { View, Text, StyleSheet, Image, Dimensions, Platform, TouchableOpacity, StatusBar } from "react-native";
import { BlurView } from 'expo-blur';
import AudioPlayer from "@/components/AudioPlayer";
import { Metadata } from "@/types/metaData";
import MusicInfo from "expo-music-info-2";
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { getAudioById } from "@/helpers/fetch";
import { useRouter } from "expo-router";
import useAudioStore from "@/store/AudioStore";
import * as MediaLibrary from "expo-media-library";
import ProgressBar from "@/components/ProgressBar";

const DEFAULT_COVER = "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3";
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const IS_SMALL_DEVICE = SCREEN_HEIGHT < 700;

export default function AudioDetailsScreen() {
  const { slug } = useLocalSearchParams();
  const { stopAudio, nextAudio, prevAudio } = useAudioStore();
  const [metadata, setMetadata] = useState<Metadata>();
  const [audio, setAudio] = useState<MediaLibrary.Asset | null>(null);
  const [isNavigating, setIsNavigating] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const loadAudio = async () => {
      try {
        const audioData = await getAudioById(slug as string);
        setAudio(audioData);

        if (audioData?.uri) {
          const info = await (MusicInfo as any).getMusicInfoAsync(audioData.uri, {
            title: true,
            artist: true,
            album: true,
            genre: true,
            picture: true
          });
          setMetadata(info);
        }
      } catch (error) {
        console.error("Error loading audio:", error);
      }
    };

    loadAudio();
  }, [slug]);

  const handlePrevious = () => {
    prevAudio().then(id => {
      if (id) {
        console.log(id);
      }
    });
  };

  const handleStop = () => {
  
    stopAudio();
  };

  const handleNext = () => {
    nextAudio().then(id => {
      if (id) {
        console.log(id);
      }
    });
  };

  if (!audio) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <View style={styles.loadingContent}>
          <MaterialIcons name="music-note" size={48} color="#6b46c1" />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      <View style={styles.backgroundImage}>
        <Image 
          source={{ uri: metadata?.picture?.pictureData || DEFAULT_COVER }}
          style={styles.backgroundCover}
          blurRadius={25}
        />
        <View style={styles.overlay} />
      </View>
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-down" size={28} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuButton}>
          <Ionicons name="ellipsis-horizontal" size={24} color="#fff" />
        </TouchableOpacity>
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
              <FontAwesome5 name="compact-disc" size={14} color="#718096" style={styles.albumIcon} />
              <Text style={styles.album} numberOfLines={2}>
                {metadata?.album || 'Unknown Album'}{metadata?.genre ? ' • ' : ''}{metadata?.genre || ''}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.progressContainer}>
          <ProgressBar />
        </View>

        <View style={styles.controlsContainer}>
          <TouchableOpacity 
            onPress={handlePrevious} 
            style={[styles.controlButton, isNavigating && styles.disabledButton]}
            disabled={isNavigating}
          >
            <Ionicons name="play-skip-back-sharp" size={24} color={isNavigating ? "#9ca3af" : "#fff"} />
          </TouchableOpacity>
          
          <View style={styles.mainControls}>
            <TouchableOpacity onPress={handleStop} style={styles.stopButton}>
              <Ionicons name="stop" size={22} color="#fff" />
            </TouchableOpacity>
            
            <View style={styles.playPauseContainer}>
              <AudioPlayer uri={audio.uri} currentTitle={audio.filename} />
            </View>
          </View>

          <TouchableOpacity 
            onPress={handleNext} 
            style={[styles.controlButton, isNavigating && styles.disabledButton]}
            disabled={isNavigating}
          >
            <Ionicons name="play-skip-forward-sharp" size={24} color={isNavigating ? "#9ca3af" : "#fff"} />
          </TouchableOpacity>
        </View>

        <View style={styles.extraControls}>
          <TouchableOpacity style={styles.extraButton}>
            <Ionicons name="heart-outline" size={22} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.extraButton}>
            <Ionicons name="shuffle" size={22} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.extraButton}>
            <Ionicons name="repeat" size={22} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContent: {
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6b46c1',
    fontWeight: '600',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
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
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'space-around',
    paddingTop: IS_SMALL_DEVICE ? 60 : 80,
  },
  albumContainer: {
    width: IS_SMALL_DEVICE ? SCREEN_WIDTH * 0.7 : SCREEN_WIDTH * 0.8,
    aspectRatio: 1,
    alignSelf: 'center',
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
    marginVertical: IS_SMALL_DEVICE ? 10 : 20,
  },
  textContainer: {
    width: '100%',
    alignItems: 'center',
  },
  title: {
    fontSize: IS_SMALL_DEVICE ? 24 : 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
    textAlign: 'center',
    textShadowColor: 'rgba(107,70,193,0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
    paddingHorizontal: 10,
  },
  artist: {
    fontSize: IS_SMALL_DEVICE ? 18 : 22,
    color: '#cbd5e0',
    marginBottom: 8,
    textAlign: 'center',
    paddingHorizontal: 10,
  },
  albumInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  albumIcon: {
    marginRight: 8,
  },
  album: {
    fontSize: IS_SMALL_DEVICE ? 14 : 16,
    color: '#718096',
    textAlign: 'center',
    flexShrink: 1,
  },
  progressContainer: {
    width: '100%',
    paddingHorizontal: IS_SMALL_DEVICE ? 10 : 20,
  },
  controlsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: IS_SMALL_DEVICE ? 20 : 30,
    marginVertical: IS_SMALL_DEVICE ? 10 : 20,
  },
  controlButton: {
    padding: 15,
    backgroundColor: 'rgba(107,70,193,0.3)',
    borderRadius: 50,
    shadowColor: '#6b46c1',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  disabledButton: {
    backgroundColor: 'rgba(156,163,175,0.1)',
    shadowOpacity: 0,
  },
  mainControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: IS_SMALL_DEVICE ? 15 : 20,
  },
  stopButton: {
    backgroundColor: '#dc2626',
    padding: IS_SMALL_DEVICE ? 10 : 12,
    borderRadius: 50,
    shadowColor: '#dc2626',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  playPauseContainer: {
    backgroundColor: 'rgba(107,70,193,0.3)',
    borderRadius: 50,
    padding: IS_SMALL_DEVICE ? 8 : 10,
    shadowColor: '#6b46c1',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  extraControls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 30,
    marginTop: IS_SMALL_DEVICE ? 10 : 20,
    marginBottom: Platform.OS === 'ios' ? 40 : 20,
  },
  extraButton: {
    padding: 10,
    backgroundColor: 'rgba(107,70,193,0.2)',
    borderRadius: 25,
  },
});