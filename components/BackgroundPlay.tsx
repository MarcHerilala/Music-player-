import React, { useEffect } from "react";
import { Audio } from "expo-av";
import * as TaskManager from "expo-task-manager";
import * as BackgroundFetch from "expo-background-fetch";
import { showNotification, updateNotification, handleNotificationAction } from "@/services/NotificationService";
import useAudioStore from "@/store/AudioStore";
import { addNotificationResponseReceivedListener, dismissAllNotificationsAsync, dismissNotificationAsync } from "expo-notifications";

const BACKGROUND_AUDIO_TASK = "background-audio-task";

TaskManager.defineTask(BACKGROUND_AUDIO_TASK, async () => {
    console.log("Background audio task turning");
    return BackgroundFetch.BackgroundFetchResult.NewData;
});

const BackgroundAudioPlayer: React.FC = () => {
    const { sound, isPlaying, currentTitle, playAudio, pauseAudio, stopAudio } = useAudioStore();

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

    useEffect(() => {
        if (currentTitle) {
            updateNotification(currentTitle, isPlaying);
        }
    }, [isPlaying, currentTitle]);

    useEffect(() => {
        const subscription = addNotificationResponseReceivedListener((response: { actionIdentifier: any; }) => {
            const action = response.actionIdentifier;
            handleNotificationAction(action, playAudio, pauseAudio, stopAudio);
        });

        return () => {
            subscription.remove();
        };
    }, [playAudio, pauseAudio]);

    return null;
}

export default BackgroundAudioPlayer;