import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import useAudioStore from '@/store/AudioStore';

const NextButton = () => {
  const nextAudio = useAudioStore((state) => state.nextAudio);

  return (
    <TouchableOpacity style={styles.button} onPress={nextAudio}>
      <Text style={styles.text}>Next</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#007bff',
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

export default NextButton;
