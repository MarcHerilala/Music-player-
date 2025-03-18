import { useEffect, useState } from "react";
import { View, Image, Animated } from "react-native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useFonts } from 'expo-font';

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  const [rotate] = useState(new Animated.Value(0));
  const [isSplashVisible, setIsSplashVisible] = useState(true);

  useEffect(() => {
    if (loaded) {
      
      Animated.loop(
        Animated.timing(rotate, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        })
      ).start();

      
      setTimeout(() => {
        setIsSplashVisible(false);
      }, 2500);
    }
  }, [loaded]);

  if (!loaded) return null;

  const rotateInterpolated = rotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <>
      {isSplashVisible ? (
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "#ffffff",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Animated.Image 
            source={require("../assets/images/music-player-icon.png")}
            style={{
              width: 200,
              height: 200,
              transform: [{ rotate: rotateInterpolated }],
            }} 
          />
        </View>
      ) : (
        <>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(drawer)" options={{ headerShown: false }} />
            <Stack.Screen 
              name="(details)" 
              options={{
                headerShown: true,
                headerTitle: "Details",
                presentation: "card",
              }} 
            />
            <Stack.Screen name="+not-found" />
          </Stack>
          <StatusBar style="auto" />
        </>
      )}
    </>
  );
}