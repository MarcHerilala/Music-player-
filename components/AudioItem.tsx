import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import AudioPlayer from './AudioPlayer';
import { formatDuration } from '@/helpers/utils';
import Icon from 'react-native-vector-icons/FontAwesome6';
type AudioItemProps = {
  item: Track;
  index: number;
  isItInPlayList?: boolean;
  onDelete?: (id: string) => void;
};

const AudioItem = ({ item, index, isItInPlayList, onDelete }: AudioItemProps) => {
  const router = useRouter();

  const handlePress = () => {
    router.push({
      pathname: "/(details)/[slug]",
      params: {
        slug: item.id,
        details: JSON.stringify({
          filename: item.filename,
          duration: item.duration,
          uri: item.uri,
        }),
      },
    });
  };

  const handleDelete = () => {
    Alert.alert(
      "Remove from Playlist",
      `Are you sure you want to remove "${item.filename}" from this playlist?`,
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Remove",
          style: "destructive",
          onPress: () => onDelete?.(item.id)
        }
      ]
    );
  };

  return (
    <TouchableOpacity style={styles.audioItem} onPress={handlePress}>
      <View style={styles.iconContainer}>
        <Icon name='music' size={24} color="#6366f1" />
      </View>
      <View style={styles.audioInfo}>
        <Text style={styles.fileName} numberOfLines={1}>
          {item.filename}
        </Text>
        <Text style={styles.duration}>{formatDuration(item.duration)}</Text>
      </View>
      <AudioPlayer uri={item.uri} currentTitle={item.filename} />
      {isItInPlayList && (
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={handleDelete}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Icon name='trash-can' size={20} color="#ef4444" />
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  audioItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3.84,
    elevation: 2,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#eef2ff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  audioInfo: {
    flex: 1,
    marginLeft: 12,
  },
  fileName: {
    fontSize: 16,
    color: '#1e293b',
    fontWeight: '500',
  },
  duration: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 2,
  },
  deleteButton: {
    marginLeft: 12,
    padding: 8,
  },
});

export default AudioItem;