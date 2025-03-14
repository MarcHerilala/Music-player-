import React, { useEffect } from "react";
import { Audio } from "expo-av";
import * as TaskManager from "expo-task-manager";
import * as BackgroundFetch from "expo-background-fetch";

const BACKGROUND_AUDIO_TASK = "background-audio-task";

TaskManager.defineTask(BACKGROUND_AUDIO_TASK, async () => {
    console.log("Background audio task turning");
    return BackgroundFetch.BackgroundFetchResult.NewData;
});

interface BackgroundAudioPlayerProps {
    uri: string;
}

const BackgroundAudioPlayer: React.FC<BackgroundAudioPlayerProps> = ({ uri }) => {
    useEffect(() => {
        const configureAudio = async() => {
            await Audio.setAudioModeAsync({
                allowsRecordingIOS: false,
                staysActiveInBackground: true,
                playsInSilentModeIOS: true,
                shouldDuckAndroid: true,
                playThroughEarpieceAndroid: false,
            });

            await BackgroundFetch.registerTaskAsync(BACKGROUND_AUDIO_TASK, {
                minimumInterval: 60,
                stopOnTerminate: false,

                startOnBoot: true,
            });
        };

        configureAudio();
        return () => {
            BackgroundFetch.unregisterTaskAsync(BACKGROUND_AUDIO_TASK);
        };
    }, []);

    return null;
}

export default BackgroundAudioPlayer;