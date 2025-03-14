import { useLocalSearchParams, router } from "expo-router";
import { Text, View, FlatList, StyleSheet, Pressable } from "react-native";
import { Plus, Music2 } from "lucide-react-native";

interface Track {
  id: string;
  name: string;
}

const mockTracks: Track[] = [
  { id: "1", name: "Track 1" },
  { id: "2", name: "Track 2" },
  { id: "3", name: "Track 3" },
  { id: "4", name: "Track 4" },
  { id: "5", name: "Track 5" },
];

export default function PlaylistDetail() {
  const { id } = useLocalSearchParams();

  // Ici, tu récupères les tracks de la playlist en utilisant l'ID, pour l'instant on simule
  const tracks = mockTracks;

  const handleAddTracks = () => {
    router.push("/playlist/track/music")
  };

  const renderTrackItem = ({ item }: { item: Track }) => (
    <Pressable style={styles.trackItem}>
      <View style={styles.trackIconContainer}>
        <Music2 size={24} color="#6366f1" />
      </View>
      <Text style={styles.trackName}>{item.name}</Text>
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.playlistTitle}>Playlist {id}</Text>
      <FlatList
        data={tracks}
        keyExtractor={(item) => item.id}
        renderItem={renderTrackItem}
        contentContainerStyle={styles.trackList}
      />
      <Pressable 
        style={styles.fab}
        onPress={handleAddTracks}
      >
        <Plus color="#ffffff" size={24} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f8fafc",
  },
  playlistTitle: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 24,
    color: "#1e293b",
  },
  trackList: {
    paddingBottom: 80, // Extra padding for FAB
  },
  trackItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#ffffff",
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  trackIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f1f5f9",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  trackName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1e293b",
  },
  fab: {
    position: "absolute",
    right: 24,
    bottom: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#6366f1",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
});


