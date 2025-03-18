import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Platform,
  ImageBackground,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as MediaLibrary from 'expo-media-library';
import { useRouter } from 'expo-router';
import { fetchAudioFiles } from '@/helpers/fetch';
import BackgroundAudioPlayer from './BackgroundPlay';
import Icon from 'react-native-vector-icons/FontAwesome6';
const { width } = Dimensions.get('window');
import AudioItem from './AudioItem';
import useAudioStore from '@/store/AudioStore';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';

export const AudioListScreen = () => {
  const [permissionStatus, setPermissionStatus] = useState<MediaLibrary.PermissionStatus | 'web' | null>(null);
  const { setDefaultPlaylist, defaultPlaylist, togglePlaylistMode } = useAudioStore();
  const router = useRouter();

  useEffect(() => {
    requestPermission();
    fetchAudioFiles().then(setDefaultPlaylist);
  }, []);

  const requestPermission = async () => {
    if (Platform.OS === 'web') {
      setPermissionStatus('web');
      return;
    }

    const { status } = await MediaLibrary.requestPermissionsAsync();
    setPermissionStatus(status);
  
    setTimeout(() => {
      togglePlaylistMode(false);
    }, 100);
  };

  const renderAudioItem = ({ item, index }: { item: MediaLibrary.Asset; index: number }) => (
    <AudioItem index={index} item={item} uri={item.uri} currentTitle={item.filename} />
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <LinearGradient
        colors={['rgba(255, 102, 0, 0.1)', 'rgba(255, 102, 0, 0.05)']}
        style={styles.emptyStateGradient}
      >
        <Icon name="music" size={64} color="#FF6600" style={styles.emptyIcon} />
        <Text style={styles.emptyText}>Your Library Awaits</Text>
        <Text style={styles.emptySubtext}>
          Add your favorite tracks and let the music flow
        </Text>
      </LinearGradient>
    </View>
  );

  const renderPermissionDenied = () => (
    <View style={styles.emptyState}>
      <LinearGradient
        colors={['rgba(239, 68, 68, 0.1)', 'rgba(239, 68, 68, 0.05)']}
        style={styles.emptyStateGradient}
      >
        <Icon name="triangle-exclamation" size={64} color="#EF4444" style={styles.emptyIcon} />
        <Text style={styles.emptyText}>Permission Needed</Text>
        <Text style={styles.emptySubtext}>
          Let's unlock your music collection together
        </Text>
        <TouchableOpacity
          style={styles.permissionButton}
          onPress={requestPermission}
        >
          <LinearGradient
            colors={['#FF6600', '#FF4500']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.permissionButtonGradient}
          >
            <Text style={styles.permissionButtonText}>Grant Access</Text>
          </LinearGradient>
        </TouchableOpacity>
      </LinearGradient>
    </View>
  );

  const renderWebPlatformMessage = () => (
    <View style={styles.emptyState}>
      <LinearGradient
        colors={['rgba(239, 68, 68, 0.1)', 'rgba(239, 68, 68, 0.05)']}
        style={styles.emptyStateGradient}
      >
        <Icon name="globe" size={64} color="#EF4444" style={styles.emptyIcon} />
        <Text style={styles.emptyText}>Web Playback</Text>
        <Text style={styles.emptySubtext}>
          Experience the full features on our mobile app
        </Text>
      </LinearGradient>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={{ uri: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=2070&auto=format&fit=crop' }}
        style={styles.backgroundImage}
      >
        <LinearGradient
          colors={['rgba(17, 24, 39, 0.95)', 'rgba(17, 24, 39, 0.85)']}
          style={styles.gradient}
        >
          <BlurView intensity={80} tint="dark" style={styles.header}>
            <Text style={styles.title}>Your Musics</Text>
          </BlurView>

          {permissionStatus === 'denied' && renderPermissionDenied()}
          {permissionStatus === 'web' && renderWebPlatformMessage()}
          
          <FlatList
            data={defaultPlaylist}
            keyExtractor={(item) => item.id}
            renderItem={renderAudioItem}
            ListEmptyComponent={renderEmptyState}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />

          <BackgroundAudioPlayer />
        </LinearGradient>
      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111827',
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
  },
  gradient: {
    flex: 1,
  },
  header: {
    padding: 20,
    backgroundColor: 'rgba(17, 24, 39, 0.7)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(75, 85, 99, 0.3)',
    overflow: 'hidden',
  },
  title: {
    fontSize: 34,
    fontWeight: 'bold',
    color: '#F9FAFB',
    letterSpacing: 0.5,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    backgroundColor: 'rgba(17, 24, 39, 0.6)',
    padding: 10,
    paddingHorizontal: 16,
    borderRadius: 24,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: 'rgba(255, 102, 0, 0.3)',
  },
  subtitle: {
    fontSize: 14,
    color: '#D1D5DB',
    marginLeft: 10,
    letterSpacing: 0.3,
  },
  listContent: {
    padding: 16,
    paddingBottom: 100,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyStateGradient: {
    padding: 32,
    borderRadius: 24,
    alignItems: 'center',
    width: '100%',
    maxWidth: 400,
    borderWidth: 1,
    borderColor: 'rgba(255, 102, 0, 0.2)',
  },
  emptyIcon: {
    marginBottom: 20,
    opacity: 0.9,
  },
  emptyText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#F9FAFB',
    textAlign: 'center',
    letterSpacing: 0.5,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  emptySubtext: {
    fontSize: 16,
    color: '#D1D5DB',
    textAlign: 'center',
    marginTop: 12,
    maxWidth: width * 0.8,
    lineHeight: 24,
    letterSpacing: 0.3,
  },
  permissionButton: {
    marginTop: 32,
    overflow: 'hidden',
    borderRadius: 16,
    elevation: 8,
    shadowColor: '#FF6600',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
  },
  permissionButtonGradient: {
    paddingHorizontal: 32,
    paddingVertical: 16,
  },
  permissionButtonText: {
    color: '#F9FAFB',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 1,
    textAlign: 'center',
  },
});
