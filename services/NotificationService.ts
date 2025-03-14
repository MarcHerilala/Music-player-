import * as Notifications from "expo-notifications";

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
    }),
});

Notifications.setNotificationCategoryAsync('music-controls', [
    {
        identifier: 'play',
        buttonTitle: 'Play',
        options: {
            opensAppToForeground: false,
        },
    },
    {
        identifier: 'pause',
        buttonTitle: 'Pause',
        options: {
            opensAppToForeground: false,
        },
    },
    {
        identifier: 'stop',
        buttonTitle: 'Stop',
        options: {
            opensAppToForeground: false,
            isDestructive: true,
        }
    }
]);

export const showNotification = async (title: string, isPlaying: boolean) => {
    if (!title) return;
    
    await Notifications.scheduleNotificationAsync({
        content: {
            title: isPlaying ? "playing : " + title: "pause : " + title,
            sound: false,
            priority: Notifications.AndroidNotificationPriority.HIGH, 
            vibrate: [0, 250, 250, 250],
            data: { action: isPlaying ? 'pause' : 'play'},
            categoryIdentifier: 'music-controls',
        },
        trigger: null,
    });
};

export const updateNotification = async (title: string, isPlaying: boolean) => {
    if (!title) return;
   
    await Notifications.dismissAllNotificationsAsync();
    await showNotification(title, isPlaying);
};

export const handleNotificationAction = (action: string, playAudio: () => void, pauseAudio: () => void, stopAudio: () => void) => {
    if (action === 'play') {
        playAudio();
    } else if (action === 'pause') {
        pauseAudio();
    } else if (action === 'stop') {
        stopAudio();
        Notifications.dismissAllNotificationsAsync();
    }
}