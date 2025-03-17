import { fetchAudioFiles } from "@/helpers/fetch";
import { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, Pressable } from "react-native";
import * as MediaLibrary from "expo-media-library";
import { router, useLocalSearchParams } from "expo-router";
import usePlaylistStore from "@/store/PlayListStore";
import Icon from "react-native-vector-icons/FontAwesome6";


export default function MusicList() {
  const [audioFiles, setAudioFiles] = useState<MediaLibrary.Asset[]>([]);
  const [selectedTracks, setSelectedTracks] = useState<Set<string>>(new Set());
  const {id}=useLocalSearchParams()
  const {addTracksToPlaylist,playlists}=usePlaylistStore()
  const playlistId = Array.isArray(id) ? id[0] : id;
  useEffect(() => {
    fetchAudioFiles().then(setAudioFiles);
  }, []);
  const playList=playlists.find((playlist)=>playlist.id===id)

    const availableTracks = audioFiles.filter(file => {
    return !playList?.tracks.some(playListTrack => playListTrack.uri === file.uri);
  });

  const toggleTrackSelection = (uri: string) => {
    setSelectedTracks(prev => {
      const newSelection = new Set(prev);
      if (newSelection.has(uri)) {
        newSelection.delete(uri);
      } else {
        newSelection.add(uri);
      }
      return newSelection;
    });
  };

  const addToPlaylist = () => {
    const selectedAudioFiles = audioFiles.filter(file => 
      selectedTracks.has(file.uri)
    );
    
    const tracks: Track[] = selectedAudioFiles.map(file => ({
      id:file.id,
      filename: file.filename,
      uri: file.uri,
      duration:file.duration
    }));
    addTracksToPlaylist(playlistId,tracks)

    router.replace(`/playlist/track/${playlistId}/list`);
    router.back();
   
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Your Music</Text>
        {selectedTracks.size > 0 && (
          <Pressable style={styles.addButton} onPress={addToPlaylist}>
            <Icon name="plus" color="#fff" size={24} />
            <Text style={styles.addButtonText}>
              Add to Playlist ({selectedTracks.size})
            </Text>
          </Pressable>
        )}
      </View>

      <ScrollView style={styles.list}>
        {availableTracks.map((file) => (
          <Pressable
            key={file.uri}
            style={styles.trackItem}
            onPress={() => toggleTrackSelection(file.uri)}
          >
            <View style={styles.trackInfo}>
              <View style={styles.iconContainer}>
                <Icon name="music" size={24} color="#6366f1" />
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.trackName} numberOfLines={1}>
                  {file.filename}
                </Text>
                <Text style={styles.duration}>
                  {Math.round(file.duration)} seconds
                </Text>
              </View>
            </View>
            <View style={[
              styles.checkbox,
              selectedTracks.has(file.uri) && styles.checkboxSelected
            ]}>
              {selectedTracks.has(file.uri) && (
                <Icon name="checkcircle" size={24} color="#6366f1" />
              )}
            </View>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1e293b",
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#6366f1",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 8,
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
  list: {
    flex: 1,
  },
  trackItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  trackInfo: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    backgroundColor: "#f1f5f9",
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  textContainer: {
    flex: 1,
  },
  trackName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1e293b",
  },
  duration: {
    fontSize: 14,
    color: "#64748b",
    marginTop: 4,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#cbd5e1",
    marginLeft: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxSelected: {
    borderColor: "#6366f1",
  },
});