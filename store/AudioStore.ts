import { create } from 'zustand';
import { Audio } from 'expo-av';

interface AudioState {
  sound: Audio.Sound | null;
  isPlaying: boolean;
  currentUri: string | null;
  currentTitle: string | null;
  loadAudio: (uri: string, title: string) => Promise<void>;
  playAudio: () => Promise<void>;
  pauseAudio: () => Promise<void>;
  stopAudio: () => Promise<void>;
}

const useAudioStore = create<AudioState>((set, get) => ({
  sound: null,
  isPlaying: false,
  currentUri: null,
  currentTitle: null,

  loadAudio: async (uri: string, title: string) => {
    const { sound, currentUri, isPlaying } = get();

    if (sound && uri !== currentUri) {
      await sound.stopAsync();
      await sound.unloadAsync();
    }

    if (uri !== currentUri) {
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri },
        { shouldPlay: false }
      );

      set({ sound: newSound, currentUri: uri,currentTitle: title, isPlaying: false });
    }
  },

  playAudio: async () => {
    const { sound, isPlaying } = get();

    if (sound && !isPlaying) {
      await sound.playAsync();
      set({ isPlaying: true });
    }
  },

  pauseAudio: async () => {
    const { sound, isPlaying } = get();

    if (sound && isPlaying) {
      await sound.pauseAsync();
      set({ isPlaying: false });
    }
  },

  stopAudio: async () => {
    const { sound } = get();
    if (sound) {
      await sound.stopAsync();
      await sound.unloadAsync();
      set({ sound: null, isPlaying: false, currentUri: null, currentTitle: null });
    }
  }
}));

export default useAudioStore;