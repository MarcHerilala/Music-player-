import React, { useEffect, useState} from "react";
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { PlayIcon, PauseIcon} from 'lucide-react-native';
import { Audio } from "expo-av";

interface AudioPlayerProps{
    uri: string;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ( { uri }) => {
    const [sound, setSound] = useState<Audio.Sound | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);

    useEffect(() => {
        const loadAudio = async () => {
            const { sound: newSound } = await Audio.Sound.createAsync(
                { uri },
                { shouldPlay: false}
            );
            setSound(newSound);
        };

        loadAudio();

        return () => {
            if (sound) {
                sound.unloadAsync();
            }
        };
    }, [uri]);

    const handlePlayPause = async () => {
        if (sound) {
            if (isPlaying) {
                await sound.pauseAsync();
            } else {
                await sound.playAsync();
            }
            setIsPlaying(!isPlaying);
        }
    };

    return (
        <View style={styles.container}>
          <TouchableOpacity onPress={handlePlayPause} style={styles.button}>
            {isPlaying ? <PauseIcon size={32} color="#6366f1" /> : <PlayIcon size={32} color="#6366f1" />}
          </TouchableOpacity>
        </View>
      );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    button: {
        marginHorizontal: 10,
    }
});

export default AudioPlayer;