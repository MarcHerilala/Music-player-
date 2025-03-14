import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';


export default function RootLayout() {


  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(drawer)" options={{ headerShown: false }} />
        <Stack.Screen 
          name="details" 
          options={{
            headerShown: true,
            headerTitle: "Details",
            presentation: 'card',
          }} 
        />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </>
  );
}