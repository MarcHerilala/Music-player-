import React from "react";
import { useLocalSearchParams } from "expo-router";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { MaterialIcons, AntDesign } from '@expo/vector-icons';
import AudioPlayer from "@/components/AudioPlayer";

export default function AudioDetailsScreen() {
  const { slug, details } = useLocalSearchParams();

  const audio = details && typeof details === 'string' ? JSON.parse(details) : null;


  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={{ uri: audio?.uri }} style={styles.albumCover} />
        <Text style={styles.title}>{audio?.filename}</Text>
        <Text style={styles.subTitle}>Album ID: {audio?.albumId}</Text>
        <Text style={styles.duration}>{audio?.duration} seconds</Text>
      </View>

      <View style={styles.controls}>
        <AudioPlayer uri={audio?.uri} />
      </View>

      <View style={styles.details}>
        <Text style={styles.detailsText}>Filename: {audio?.filename}</Text>
        <Text style={styles.detailsText}>Duration: {audio?.duration} seconds</Text>
        <Text style={styles.detailsText}>Album ID: {audio?.albumId}</Text>
        <Text style={styles.detailsText}>URI: {audio?.uri}</Text>
      </View>

    
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  albumCover: {
    width: 150,
    height: 150,
    borderRadius: 10,
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  subTitle: {
    fontSize: 16,
    color: '#777',
    marginBottom: 5,
  },
  duration: {
    fontSize: 16,
    color: '#777',
    marginBottom: 20,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 30,
  },
  controlButton: {
    marginHorizontal: 20,
    backgroundColor: '#6366f1',
    padding: 15,
    borderRadius: 50,
  },
  details: {
    marginBottom: 20,
  },
  detailsText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  iconButton: {
    alignItems: 'center',
  },
  iconText: {
    marginTop: 5,
    color: '#6366f1',
  },
});
