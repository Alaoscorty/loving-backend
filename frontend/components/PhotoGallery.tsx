import React, { useState } from 'react';
import {
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ViewStyle,
  Dimensions,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface PhotoGalleryProps {
  photos: string[];
  onSelect?: (photoIndex: number) => void;
  editable?: boolean;
  onAddPhoto?: () => void;
  onRemovePhoto?: (index: number) => void;
  style?: ViewStyle;
  columns?: number;
}

const PhotoGallery: React.FC<PhotoGalleryProps> = ({
  photos,
  onSelect,
  editable = false,
  onAddPhoto,
  onRemovePhoto,
  style,
  columns = 3,
}) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [previewIndex, setPreviewIndex] = useState<number | null>(null);

  const screenWidth = Dimensions.get('window').width;
  const photoSize = (screenWidth - 32 - (columns - 1) * 8) / columns;

  const handlePhotoPress = (index: number) => {
    setPreviewIndex(index);
    if (onSelect) {
      onSelect(index);
    }
  };

  return (
    <>
      <View style={[styles.container, style]}>
        <ScrollView
          scrollEnabled={false}
          style={styles.scrollView}
        >
          <View style={[styles.grid, { gap: 8 }]}>
            {editable && onAddPhoto && (
              <TouchableOpacity
                style={[
                  styles.photoContainer,
                  { width: photoSize, height: photoSize },
                  styles.addPhotoButton,
                ]}
                onPress={onAddPhoto}
              >
                <MaterialCommunityIcons
                  name="plus"
                  size={32}
                  color="#6366f1"
                />
              </TouchableOpacity>
            )}

            {photos.map((photo, index) => (
              <View
                key={index}
                style={[
                  styles.photoContainer,
                  { width: photoSize, height: photoSize },
                ]}
              >
                <TouchableOpacity
                  onPress={() => handlePhotoPress(index)}
                  style={styles.photoWrapper}
                >
                  <Image
                    source={{ uri: photo }}
                    style={styles.photo}
                    resizeMode="cover"
                  />
                </TouchableOpacity>

                {editable && onRemovePhoto && (
                  <TouchableOpacity
                    style={styles.removeButton}
                    onPress={() => onRemovePhoto(index)}
                  >
                    <MaterialCommunityIcons
                      name="close"
                      size={20}
                      color="#ffffff"
                    />
                  </TouchableOpacity>
                )}
              </View>
            ))}
          </View>
        </ScrollView>
      </View>

      <Modal
        visible={previewIndex !== null}
        transparent={true}
        onRequestClose={() => setPreviewIndex(null)}
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setPreviewIndex(null)}
          >
            <MaterialCommunityIcons
              name="close"
              size={28}
              color="#ffffff"
            />
          </TouchableOpacity>

          {previewIndex !== null && (
            <Image
              source={{ uri: photos[previewIndex] }}
              style={styles.fullImage}
              resizeMode="contain"
            />
          )}
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
  },
  scrollView: {
    paddingHorizontal: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingVertical: 16,
  },
  photoContainer: {
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#f3f4f6',
  },
  photoWrapper: {
    flex: 1,
  },
  photo: {
    flex: 1,
  },
  removeButton: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 16,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addPhotoButton: {
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e5e7eb',
    borderStyle: 'dashed',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullImage: {
    width: '100%',
    height: '100%',
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 1,
    padding: 8,
  },
});

export default PhotoGallery;
