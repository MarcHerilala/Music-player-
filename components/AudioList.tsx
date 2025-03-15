import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as MediaLibrary from 'expo-media-library';
import { useRouter } from 'expo-router';
import { fetchAudioFiles } from '@/helpers/fetch';
import BackgroundAudioPlayer from './BackgroundPlay';
import Icon from 'react-native-vector-icons/FontAwesome6';
const { width } = Dimensions.get('window');
import AudioItem from './AudioItem';

export const AudioListScreen = () => {
  const [audioFiles, setAudioFiles] = useState<MediaLibrary.Asset[]>([]);
  const [permissionStatus, setPermissionStatus] = useState<MediaLibrary.PermissionStatus | 'web' | null>(null);

;  const router=useRouter();
  useEffect(() => {
    requestPermission();
  }, []);

  const requestPermission = async () => {
    if (Platform.OS === 'web') {
      setPermissionStatus('web');
      return;
    }

    const { status } = await MediaLibrary.requestPermissionsAsync();
    setPermissionStatus(status);
    
      fetchAudioFiles().then(setAudioFiles);
      
    
  };

  const renderAudioItem = ({ item, index }: { item: MediaLibrary.Asset; index: number }) => (
   <AudioItem index={index} item={item}/>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      { <Icon name='music' size={64} color="#6366f1" style={styles.emptyIcon} />}
      <Text style={styles.emptyText}>No audio files found</Text>
      <Text style={styles.emptySubtext}>
        Add some audio files to your device to see them here
      </Text>
    </View>
  );

  const renderPermissionDenied = () => (
    <View style={styles.emptyState}>
      <Icon name="alert-circle" size={64} color="#ef4444" style={styles.emptyIcon} />
      <Text style={styles.emptyText}>Permission Required</Text>
      <Text style={styles.emptySubtext}>
        We need access to your audio files to display them here
      </Text>
      <TouchableOpacity
        style={styles.permissionButton}
        onPress={requestPermission}
      >
        <Text style={styles.permissionButtonText}>Grant Permission</Text>
      </TouchableOpacity>
    </View>
  );

  const renderWebPlatformMessage = () => (
    <View style={styles.emptyState}>
      <Icon name="alert-circle" size={64} color="#ef4444" style={styles.emptyIcon} />
      <Text style={styles.emptyText}>Web Platform</Text>
      <Text style={styles.emptySubtext}>
        Audio file listing is not supported in web browsers
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Audio Library</Text>
        {permissionStatus === 'granted' && (
          <Text style={styles.subtitle}>
            {audioFiles.length} audio files found
          </Text>
        )}
      </View>

      {permissionStatus === 'denied' && renderPermissionDenied()}
      {permissionStatus === 'web' && renderWebPlatformMessage()}
      
        <FlatList
          data={audioFiles}
          keyExtractor={(item) => item.id}
          renderItem={renderAudioItem}
          ListEmptyComponent={renderEmptyState}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
    

      <BackgroundAudioPlayer />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  subtitle: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 4,
  },
  listContent: {
    padding: 16,
    paddingBottom: 100,
  },
  audioItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3.84,
    elevation: 2,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#eef2ff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  audioInfo: {
    flex: 1,
    marginLeft: 12,
  },
  fileName: {
    fontSize: 16,
    color: '#1e293b',
    fontWeight: '500',
  },
  duration: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 2,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyIcon: {
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
    marginTop: 8,
    maxWidth: width * 0.8,
  },
  permissionButton: {
    marginTop: 24,
    backgroundColor: '#6366f1',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  permissionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
});

