import { useEffect, useState } from "react";
import { View, Image, StyleSheet, Animated } from "react-native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as SplashScreen from "expo-splash-screen";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [isReady, setIsReady] = useState(false);
  const fadeAnim = new Animated.Value(1); 
  const rotateAnim = new Animated.Value(0);

  useEffect(() => {
    const prepareApp = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (e) {
        console.warn(e);
      } finally {
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 1000, 
            useNativeDriver: true,
          }),
          Animated.timing(rotateAnim, {
            toValue: 1, 
            duration: 1000, 
            useNativeDriver: true,
          }),
        ]).start(() => {
          setIsReady(true);
          SplashScreen.hideAsync();
        });
      }
    };

    prepareApp();
  }, []);

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"], 
  });

  return (
    <>
      {/* Animation du splash screen */}
      {!isReady && (
        <Animated.View style={[styles.splashContainer, { opacity: fadeAnim }]}>
          <Animated.Image
            source={require("../assets/images/music-player-icon.png")}
            style={[styles.logo, { transform: [{ rotate }] }]}
          />
        </Animated.View>
      )}

      {/* L'application normale */}
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
  );
}

const styles = StyleSheet.create({
  splashContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#ffffff",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2,
  },
  logo: {
    width: 150,
    height: 150,
  },
});
