import { useLocalSearchParams, router } from "expo-router";
import { Text, View, FlatList, StyleSheet, Pressable } from "react-native";
import AudioItem from "@/components/AudioItem";
import usePlaylistStore from "@/store/PlayListStore";
import Icon from "react-native-vector-icons/FontAwesome6";
import useAudioStore from "@/store/AudioStore";
import { useEffect } from "react";
import * as MediaLibrary from  "expo-media-library";
export default function PlaylistDetail() {
  const {removeTrackFromPlaylist,playlists}=usePlaylistStore()
  const { id, tracks } = useLocalSearchParams();
  const {customPlaylist,setCustomPlaylist,togglePlaylistMode,loadAudio}=useAudioStore()
  const playList=playlists.find((playlist)=>playlist.id===id)

  const trackList = playList ? playList.tracks : [];
  const playListId=Array.isArray(id)?id[0]:id
  useEffect(() => {
    
    if(customPlaylist.length>0){
      setCustomPlaylist([])
    }
    setCustomPlaylist(trackList as MediaLibrary.Asset[]);
    togglePlaylistMode(true);
  }, [trackList]);
  const handleAddTracks = () => {
    router.push(`/playlist/track/${id}/create`)
  };

  const renderTrackItem = ({ item }: { item: Track }) => (
   <AudioItem index={item.duration} item={item} isItInPlayList={true} onDelete={()=>removeTrackFromPlaylist(playListId,item.id)}/>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.playlistTitle}>Playlist {id}</Text>
      <FlatList
        data={customPlaylist}
        keyExtractor={(item) => item.id}
        renderItem={renderTrackItem}
        contentContainerStyle={styles.trackList}
      />
      <Pressable 
        style={styles.fab}
        onPress={handleAddTracks}
      >
        <Icon name="plus" color="#ffffff" size={24} />
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

