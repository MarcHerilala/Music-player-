import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import Slider from '@react-native-community/slider';
import useAudioStore from '@/store/AudioStore';

const ProgressBar = () => {
  const { positionMillis, durationMillis, seekAudio, isPlaying, isLoading } = useAudioStore();
  const [isSeeking, setIsSeeking] = useState(false);
  const [seekValue, setSeekValue] = useState(0);

  useEffect(() => {
    if (!isSeeking) {
      setSeekValue(positionMillis);
    }
  }, [positionMillis, isSeeking]);

  const handleSlidingStart = () => {
    setIsSeeking(true);
  };

  const handleSlidingComplete = async (value: number) => {
    setIsSeeking(false);
    await seekAudio(value);
  };

  const handleValueChange = (value: number) => {
    setSeekValue(value);
  };

  const formatTime = (milliseconds: number) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="small" color="#1EB1FC" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.timeText}>{formatTime(seekValue)}</Text>
      <Slider
        style={styles.slider}
        minimumValue={0}
        maximumValue={durationMillis || 1}
        value={seekValue}
        onSlidingStart={handleSlidingStart}
        onSlidingComplete={handleSlidingComplete}
        onValueChange={handleValueChange}
        minimumTrackTintColor="#1EB1FC"
        maximumTrackTintColor="#8E8E93"
        thumbTintColor="#1EB1FC"
        disabled={!isPlaying && positionMillis === 0}
      />
      <Text style={styles.timeText}>{formatTime(durationMillis)}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  loadingContainer: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  slider: {
    flex: 1,
    marginHorizontal: 10,
  },
  timeText: {
    fontSize: 12,
    color: '#666',
    minWidth: 35,
  },
});

export default ProgressBar;