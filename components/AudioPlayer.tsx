import React, { useEffect } from "react";
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import useAudioStore from '@/store/AudioStore';
import { updateNotification } from "@/services/NotificationService";
import Icon from 'react-native-vector-icons/FontAwesome';
import { THEME_COLOR_LIGHT } from '@/helpers/BaseColor';

interface AudioPlayerProps {
    uri: string;
    currentTitle: string;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ uri, currentTitle }) => {
    const { currentUri, sound, isPlaying, loadAudio, playAudio, pauseAudio } = useAudioStore();

    useEffect(() => {
        const autoPlay = async () => {
            await loadAudio(uri, currentTitle);
            await playAudio(); // 🔥 Auto-play après chargement
            updateNotification(currentTitle, true);
        };
        autoPlay();
    }, [uri, currentTitle]);

    const handlePlayPause = async () => {
        if (currentUri !== uri) {
            if (isPlaying) {
                await pauseAudio();
            }
            await loadAudio(uri, currentTitle);
            await playAudio();
            updateNotification(currentTitle, true);
        } else {
            if (isPlaying) {
                await pauseAudio();
                updateNotification(currentTitle, false);
            } else {
                await playAudio();
                updateNotification(currentTitle, true);
            }
        }
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={handlePlayPause} style={styles.button} disabled={!sound}>
                {isPlaying && currentUri === uri ? (
                    <Icon name="pause" size={32} color={THEME_COLOR_LIGHT} />
                ) : (
                    <Icon name="play" size={32} color={THEME_COLOR_LIGHT} />
                )}
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
