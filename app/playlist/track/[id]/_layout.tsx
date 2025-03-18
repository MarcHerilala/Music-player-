import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen 
        name="/[id]/create" 
        options={{ title: "Create" 

        ,
        headerStyle: {
          backgroundColor: '#111827', 
        },
        }} 
      />
      <Stack.Screen 
        name="/[id]/list" 
        options={{ title: "List" ,

          headerStyle: {
          backgroundColor: '#111827', 
        },
        }} 
        
      />
    </Stack>
  );
}
