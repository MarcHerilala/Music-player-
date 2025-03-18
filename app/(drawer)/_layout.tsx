import { Drawer } from "expo-router/drawer";
import Icon from 'react-native-vector-icons/FontAwesome5';

export default function Layout() {
  return (
    <Drawer screenOptions={{
       drawerStyle: {
      backgroundColor: '#111827', 
    },
    drawerActiveTintColor: '#8B5CF6', 
    drawerInactiveTintColor: '#D1D5DB', 
    drawerLabelStyle: {
      fontWeight: 'bold', 
    },
      headerStyle: {
          backgroundColor: '#111827', 
        },
        headerTintColor: '#ffffff', 
      
    }
    }>
      <Drawer.Screen name="index" 
        options={{
          title: "Songs", 
          drawerIcon: ({ color }) => <Icon name="music" size={20} color={color} />, 
        }}
      />
      <Drawer.Screen name="playlist" 
       options={{
          title: "Playlist",
          drawerIcon: ({ color }) => <Icon name="list" size={20} color={color} />, 
        }}
      />
      
    </Drawer>
  );
}
