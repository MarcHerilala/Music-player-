import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import useAudioStore from '@/store/AudioStore';
import ProgressBar from './ProgressBar';
import AudioPlayer from './AudioPlayer';

export  function FloatingPlayer() {
  const {isPlaying,currentTitle,nextAudio,prevAudio,currentUri}=useAudioStore();

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.trackInfo}>
          <Text style={styles.artist}>{currentTitle}</Text>
        </View>
        
        <View style={styles.controls}>
        
        <AudioPlayer uri={currentUri || ""} currentTitle={currentTitle || ""} isInDetail={false} />
         
        </View>
      </View>
      
      <ProgressBar  />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: 'black',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  trackInfo: {
    flex: 1,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  artist: {
    color: '#FF6B00',
    fontSize: 14,
    marginTop: 4,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  controlButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
  },
  playButton: {
    backgroundColor: '#FF6B00',
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  controlIcon: {
    color: '#FFFFFF',
    fontSize: 18,
  },
  playIcon: {
    fontSize: 20,
  },
  progressBar: {
    height: 3,
    backgroundColor: '#333333',
  },
  progress: {
    width: '45%',
    height: '100%',
    backgroundColor: '#FF6B00',
  },
});
