import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import useAudioStore from '@/store/AudioStore';

export default function FloatingPlayer() {
  const {
    currentTitle,
    currentUri,
    nextAudio,
    prevAudio,
    pauseAudio,
    playAudio,
    isPlaying,
  } = useAudioStore();

  const navigation = useNavigation();

  if (!currentUri) return null; // pas de musique → pas de player visible
  const togglePlaying = () => {
  if (isPlaying) {
    pauseAudio();
  } else {
    playAudio();
  }
};

  return (
    <TouchableOpacity
     // onPress={() => navigation.navigate('')}
      style={styles.container}
      activeOpacity={0.9}
    >
      <View style={styles.info}>
        <Text numberOfLines={1} style={styles.title}>{currentTitle || 'Lecture en cours'}</Text>
      </View>

      <View style={styles.controls}>
        <TouchableOpacity onPress={prevAudio}>
          <Ionicons name="play-skip-back" size={22} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity onPress={togglePlaying} style={styles.playPause}>
          <Ionicons name={isPlaying ? 'pause' : 'play'} size={24} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity onPress={nextAudio}>
          <Ionicons name="play-skip-forward" size={22} color="#fff" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    right: 10,
    flexDirection: 'row',
    backgroundColor: '#1f1f1f',
    borderRadius: 14,
    padding: 10,
    alignItems: 'center',
    zIndex: 999,
    elevation: 5,
  },
  info: {
    flex: 1,
  },
  title: {
    color: '#fff',
    fontWeight: 'bold',
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  playPause: {
    marginHorizontal: 10,
  },
});
