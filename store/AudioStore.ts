import { create } from 'zustand';
import { Audio } from 'expo-av';
import * as MediaLibrary from "expo-media-library"
import { router } from 'expo-router';


interface AudioState {
  sound: Audio.Sound | null;
  isPlaying: boolean;
  currentUri: string | null;
  currentTitle: string | null;
  defaultPlaylist: MediaLibrary.Asset[];
  customPlaylist: MediaLibrary.Asset[];
  isCustomMode: boolean;
  currentIndex: number | null;
  nextAudioId: string | null;
  prevAudioId: string | null;
  positionMillis:number;
  durationMillis:number;
  isPlayingInTheDetail:boolean;
  setIsPlayingInTheDetail:(isPlayingInTheDetail:boolean)=>void;
  setDefaultPlaylist: (tracks: MediaLibrary.Asset[]) => void;
  setCustomPlaylist: (tracks: MediaLibrary.Asset[]) => void;
  togglePlaylistMode: (mode:boolean) => void;
  loadAudio: (uri: string, title: string) => Promise<void>;
  playAudio: () => Promise<void>;
  pauseAudio: () => Promise<void>;
  stopAudio: () => Promise<void>;
  nextAudio: () => Promise<string | undefined>;
  prevAudio: () => Promise<string | undefined>;
  seekAudio: (positionMillis:number) => Promise<void>;
}

const useAudioStore = create<AudioState>((set, get) => ({
  sound: null,
  isPlaying: false,
  currentUri: null,
  currentTitle: null,
  defaultPlaylist: [],
  customPlaylist: [],
  isCustomMode: false,
  currentIndex: null,
  nextAudioId:null,
  prevAudioId:null,
  durationMillis:0,
  positionMillis:0,
  isPlayingInTheDetail:true,
  setIsPlayingInTheDetail:(isPlayingInTheDetail:boolean)=>set({isPlayingInTheDetail}),
  
  setDefaultPlaylist: (tracks) => {
    set({ defaultPlaylist: tracks });
    if (!get().isCustomMode) set({ currentIndex: 0 });
  },

  setCustomPlaylist: (tracks) => {
    set({ customPlaylist: tracks });
    if (get().isCustomMode) set({ currentIndex: 0 });
  },

  togglePlaylistMode: (mode) => {
    const { isCustomMode, customPlaylist, defaultPlaylist } = get();
    const newMode = mode !== undefined ? mode : !isCustomMode;
    const newPlaylist = newMode ? customPlaylist : defaultPlaylist;

    set({
      isCustomMode: newMode,
      currentIndex: newPlaylist.length > 0 ? 0 : null,
    });
  },

  loadAudio: async (uri: string, title: string) => {
    const { sound, currentUri } = get();

    if (sound && uri !== currentUri) {
      await sound.stopAsync();
      await sound.unloadAsync();
    }

    if (uri !== currentUri) {
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri },
        { shouldPlay: false }
      );
      newSound.setOnPlaybackStatusUpdate(async (status) => {
        if(status.isLoaded){
            if (status.didJustFinish && !status.isLooping) {
            await get().nextAudio();
            
      }
          set({
            durationMillis:status.durationMillis,
            positionMillis:status.positionMillis
          })
        }
    });
    

      set({ sound: newSound, currentUri: uri, currentTitle: title, isPlaying: false });
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
      set({
        sound: null,
        isPlaying: false,
        currentUri: null,
        currentTitle: null,
        currentIndex: null,
      });
    }
  },

  nextAudio: async () => {
    const { isCustomMode, customPlaylist, defaultPlaylist, currentIndex ,isPlayingInTheDetail} = get();
    const playlist = isCustomMode ? customPlaylist : defaultPlaylist;

    if (playlist.length === 0 || currentIndex === null) return;

    const nextIndex = (currentIndex + 1) % playlist.length;
    const nextTrack = playlist[nextIndex];
   
    
    await get().loadAudio(nextTrack.uri, nextTrack.filename);
     
    set({ currentIndex: nextIndex ,nextAudioId:nextTrack.id});
  
    await get().playAudio();
     if(isPlayingInTheDetail){
      router.replace(`/(details)/${nextTrack.id}`);
    }
    return nextTrack.id;
  },

  prevAudio: async () => {
    const { isCustomMode, customPlaylist, defaultPlaylist, currentIndex,isPlayingInTheDetail } = get();
    const playlist = isCustomMode ? customPlaylist : defaultPlaylist;

    if (playlist.length === 0 || currentIndex === null) return;

    const prevIndex = (currentIndex - 1 + playlist.length) % playlist.length;
    const prevTrack = playlist[prevIndex];

    await get().loadAudio(prevTrack.uri, prevTrack.filename);
    set({ 
      currentIndex: prevIndex ,
      prevAudioId:prevTrack.id

    });
   
    await get().playAudio();
    if(isPlayingInTheDetail){
      router.replace(`/(details)/${prevTrack.id}`);
    }
    return prevTrack.id
  },
  seekAudio: async (positionMillis:number) =>{
    const {sound,durationMillis}=get()
     if (sound && positionMillis >= 0 && positionMillis <= durationMillis) {
      await sound.setPositionAsync(positionMillis);
      set({ positionMillis });
    }
  }
}));

export default useAudioStore;
