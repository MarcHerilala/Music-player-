import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import useAudioStore from '@/store/AudioStore';

const PrevButton = () => {
  const prevAudio = useAudioStore((state) => state.prevAudio);

  return (
    <TouchableOpacity style={styles.button} onPress={prevAudio}>
      <Text style={styles.text}>Prev</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#ff4757',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 10,
  },
  text: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default PrevButton;
