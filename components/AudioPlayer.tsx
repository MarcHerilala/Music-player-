import React, { useEffect, useState} from "react";
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { PlayIcon, PauseIcon } from 'lucide-react-native';
import useAudioStore from '@/store/AudioStore';

interface AudioPlayerProps {
    uri: string;
    currentTitle: string;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ uri, currentTitle }) => {
    const {currentUri, sound, isPlaying, loadAudio, playAudio, pauseAudio } = useAudioStore();

    useEffect(() => {
        loadAudio(uri, currentTitle);
    }, [uri]);

   const handlePlayPause = async () => {
    if (currentUri !== uri) {
        if (isPlaying) {
            await pauseAudio();
        }
        await loadAudio(uri, currentTitle);
        await playAudio(); 
    } else {
        
        isPlaying ? await pauseAudio() : await playAudio();
    }
};


    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={handlePlayPause} style={styles.button} disabled={!sound}>
                {isPlaying &&currentUri==uri? <PauseIcon size={32} color="#6366f1" /> : <PlayIcon size={32} color="#6366f1" />}
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
    },
});

export default AudioPlayer;
