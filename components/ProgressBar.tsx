import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { GestureDetector, Gesture, GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  runOnJS,
  useDerivedValue
} from 'react-native-reanimated';
import useAudioStore from '@/store/AudioStore';

const ProgressBar = () => {
  const { positionMillis, durationMillis, seekAudio } = useAudioStore();
  
  const progress = useSharedValue(0);
  const isSeeking = useSharedValue(false);
  const barWidth = useSharedValue(0);

  useDerivedValue(() => {
    if (!isSeeking.value) {
      progress.value = durationMillis > 0 ? positionMillis / durationMillis : 0;
    }
  });

  const panGesture = Gesture.Pan()
    .onStart(() => {
      isSeeking.value = true;
    })
    .onUpdate((event) => {
      const newProgress = Math.max(0, Math.min(1, event.x / barWidth.value));
      progress.value = newProgress;
    })
    .onEnd(() => {
      const seekPosition = progress.value * durationMillis;
      runOnJS(seekAudio)(seekPosition); 
      isSeeking.value = false;
    });

  const progressStyle = useAnimatedStyle(() => ({
    width: `${progress.value * 100}%`,
  }));

  const thumbStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: withSpring(progress.value * (barWidth.value - 16)) },
    ],
  }));

  const formatTime = (milliseconds: number) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <Text style={styles.timeText}>{formatTime(positionMillis)}</Text>
      
      <GestureDetector gesture={panGesture}>
        <View 
          style={styles.progressContainer}
          onLayout={({ nativeEvent }) => {
            barWidth.value = nativeEvent.layout.width;
          }}
        >
          <View style={styles.progressBackground} />
          <Animated.View style={[styles.progressFill, progressStyle]} />
          <Animated.View style={[styles.thumb, thumbStyle]} />
        </View>
      </GestureDetector>

      <Text style={styles.timeText}>{formatTime(durationMillis)}</Text>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    height: 60,
  },
  loadingContainer: {
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressContainer: {
    flex: 1,
    height: 8,
    marginHorizontal: 10,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBackground: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: '100%',
    backgroundColor: '#8E8E93',
  },
  progressFill: {
    position: 'absolute',
    left: 0,
    height: '100%',
    backgroundColor: '#1EB1FC',
  },
  thumb: {
    position: 'absolute',
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#1EB1FC',
    transform: [{ translateX: -8 }, { translateY: -4 }],
  },
  timeText: {
    fontSize: 14,
    color: '#666',
    minWidth: 40,
  },
});

export default ProgressBar;
