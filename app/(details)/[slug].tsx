import React from "react";
import { useLocalSearchParams } from "expo-router";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { MaterialIcons } from '@expo/vector-icons';
import AudioPlayer from "@/components/AudioPlayer";

export default function AudioDetailsScreen() {
  const { slug, details } = useLocalSearchParams();
  const audio = details && typeof details === 'string' ? JSON.parse(details) : null;

  const handleStop = () => {
    console.log("Audio stopped");
  };

  const handlePrev = () => {
    console.log("Previous track");
  };

  const handleNext = () => {
    console.log("Next track");
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={{ uri: audio?.uri }} style={styles.albumCover} />
        <Text style={styles.title}>{audio?.filename}</Text>
        <Text style={styles.subTitle}>Album ID: {audio?.albumId}</Text>
        <Text style={styles.duration}>{audio?.duration} seconds</Text>
      </View>

      <View style={styles.controls}>
        <TouchableOpacity onPress={handlePrev} style={styles.controlButton}>
          <MaterialIcons name="skip-previous" size={35} color="white" />
        </TouchableOpacity>

        <AudioPlayer uri={audio?.uri} currentTitle={audio?.filename} />

        <TouchableOpacity onPress={handleNext} style={styles.controlButton}>
          <MaterialIcons name="skip-next" size={35} color="white" />
        </TouchableOpacity>
      </View>

      <View style={styles.stopButtonContainer}>
        <TouchableOpacity onPress={handleStop} style={styles.stopButton}>
          <MaterialIcons name="stop" size={30} color="white" />
        </TouchableOpacity>
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
    marginBottom: 5,
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
    alignItems: 'center',
    marginBottom: 30,
  },
  controlButton: {
    marginHorizontal: 20,
    backgroundColor: '#6366f1',
    padding: 15,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stopButtonContainer: {
    alignItems: 'center',
    marginVertical: 15,
  },
  stopButton: {
    backgroundColor: '#888', // Neutral grey for the stop button
    padding: 20,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  details: {
    marginBottom: 20,
  },
  detailsText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
  },
});
