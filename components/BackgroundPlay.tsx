import React, { useEffect } from "react";
import { Audio } from "expo-av";
import * as TaskManager from "expo-task-manager";
import * as BackgroundFetch from "expo-background-fetch";
import { handleNotificationAction } from "@/services/NotificationService";
import useAudioStore from "@/store/AudioStore";
import { addNotificationResponseReceivedListener, dismissAllNotificationsAsync, dismissNotificationAsync } from "expo-notifications";

const BACKGROUND_AUDIO_TASK = "background-audio-task";

TaskManager.defineTask(BACKGROUND_AUDIO_TASK, async () => {
    console.log("Background audio task turning");
    return BackgroundFetch.BackgroundFetchResult.NewData;
});

const BackgroundAudioPlayer: React.FC = () => {
    const { playAudio, pauseAudio, stopAudio, currentTitle } = useAudioStore();

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
        const subscription = addNotificationResponseReceivedListener((response) => {
            const action = response.actionIdentifier;
            if(currentTitle) {
                handleNotificationAction(action, playAudio, pauseAudio, stopAudio, currentTitle);
            } else {
                console.warn('CurrentTitle is null. Cannot handle notification action.');
                
            }
        });

        return () => {
            subscription.remove();
        };
    }, [playAudio, pauseAudio, stopAudio, currentTitle]);

    return null;
}

export default BackgroundAudioPlayer;