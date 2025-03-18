import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Image, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import AudioPlayer from './AudioPlayer';
import { formatDuration } from '@/helpers/utils';
import { FontAwesome6 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInRight } from 'react-native-reanimated';
import { THEME_COLOR,THEME_COLOR_LIGHT } from '@/helpers/BaseColor';
import useAudioStore from '@/store/AudioStore';
import { updateNotification } from '@/services/NotificationService';

const { width } = Dimensions.get('window');

// Orange/red theme color


type AudioItemProps = {
  item: Track;
  index: number;
  isItInPlayList?: boolean;
  onDelete?: (id: string) => void;
  uri: string;
  currentTitle: string;
};

const AudioItem = ({ item, index, isItInPlayList, onDelete, uri, currentTitle }: AudioItemProps) => {
  const router = useRouter();
  const {currentUri, sound, isPlaying, loadAudio, playAudio, pauseAudio } = useAudioStore();

   /*useEffect(() => {
          loadAudio(uri, currentTitle);
      }, [uri, currentTitle]);*/

  const handlePress = async () => {
   /* router.push({
      pathname: "/(details)/[slug]",
      params: {
        slug: item.id,
        details: JSON.stringify({
          filename: item.filename,
          duration: item.duration,
          uri: item.uri,
        }),
      },
    });*/
    router.push(`/(details)/${item.id}`);

   /* if (currentUri !== uri) {
            if (isPlaying) {
                
            }
            await loadAudio(uri, currentTitle);
            await playAudio(); 
            updateNotification(currentTitle, true)
        } else {
            if (isPlaying){
                await pauseAudio();
                updateNotification(currentTitle, false);
            } else {
                await playAudio();
                updateNotification(currentTitle, true);
            }
        }*/
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

  const ContentWrapper = isItInPlayList ? View : Animated.View;
  const animationProps = isItInPlayList ? {} : {
    entering: FadeInRight.delay(index * 100).springify()
  };

  return (
    <View
      
    >
      <TouchableOpacity onPress={handlePress} style={[styles.touchable,styles.audioItem ]}>
        <LinearGradient
          colors={['rgba(17, 24, 39, 0.95)', 'rgba(17, 24, 39, 0.85)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.container}
        >
          <View style={styles.mainContent}>
            <View style={styles.iconContainer}>
              <Image
                source={{ uri: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=300&auto=format&fit=crop' }}
                style={styles.albumArt}
              />
              <LinearGradient
                colors={[`${THEME_COLOR}CC`, `${THEME_COLOR}B3`]}
                style={styles.playIconOverlay}
              >
                <FontAwesome6 name="compact-disc" size={24} color="#FFFFFF" style={styles.spinningIcon} />
              </LinearGradient>
            </View>
            
            <View style={styles.audioInfo}>
              <Text style={styles.fileName} numberOfLines={1}>
                {item.filename}
              </Text>
            </View>
            
            <View style={styles.controlsContainer}>
              
              {isItInPlayList && (
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={handleDelete}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <LinearGradient
                    colors={['rgba(239, 68, 68, 0.2)', 'rgba(239, 68, 68, 0.1)']}
                    style={styles.deleteButtonGradient}
                  >
                    <FontAwesome6 name="trash-can" size={16} color="#EF4444" />
                  </LinearGradient>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  audioItem: {
    marginBottom: 16,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: THEME_COLOR,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
    width: width - 32,
    alignSelf: 'center',
  },
  touchable: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  container: {
    padding: 16,
    borderWidth: 1,
    borderColor: THEME_COLOR_LIGHT,
    backgroundColor: 'rgba(17, 24, 39, 0.95)',
  },
  mainContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  albumArt: {
    width: '100%',
    height: '100%',
    borderRadius: 16,
  },
  playIconOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
  },
  spinningIcon: {
    transform: [{ rotate: '-30deg' }],
  },
  audioInfo: {
    flex: 1,
    gap: 8,
  },
  fileName: {
    fontSize: 16,
    color: '#F3F4F6',
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  metaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  durationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME_COLOR_LIGHT,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  duration: {
    fontSize: 12,
    color: '#D1D5DB',
    marginLeft: 6,
    letterSpacing: 0.2,
  },
  divider: {
    width: 1,
    height: 12,
    backgroundColor: THEME_COLOR_LIGHT,
  },
  formatContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME_COLOR_LIGHT,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  format: {
    fontSize: 12,
    color: '#D1D5DB',
    marginLeft: 6,
    letterSpacing: 0.2,
  },
  controlsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  deleteButton: {
    overflow: 'hidden',
    borderRadius: 12,
  },
  deleteButtonGradient: {
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.4)',
  },
});

export default AudioItem;