// PhotoDisplay Component
// Displays exam photos for Part 2 (Long Turn)

import React from 'react';
import { View, Image, StyleSheet, Dimensions, Text } from 'react-native';
import { colors } from '@/constants/Colors';

interface PhotoDisplayProps {
  images: string[];
  prompt?: string;
  layout?: 'horizontal' | 'vertical' | 'grid';
}

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export function PhotoDisplay({
  images,
  prompt,
  layout = 'horizontal',
}: PhotoDisplayProps) {
  const imageCount = images.length;

  const getImageStyle = () => {
    if (layout === 'horizontal') {
      const imageWidth = (SCREEN_WIDTH - 48) / Math.min(imageCount, 2);
      return {
        width: imageWidth,
        height: imageWidth * 0.75,
      };
    }
    if (layout === 'vertical') {
      return {
        width: SCREEN_WIDTH - 32,
        height: (SCREEN_HEIGHT - 300) / Math.min(imageCount, 2),
      };
    }
    // Grid layout
    const imageWidth = (SCREEN_WIDTH - 48) / 2;
    return {
      width: imageWidth,
      height: imageWidth * 0.75,
    };
  };

  const imageStyle = getImageStyle();

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.imageContainer,
          layout === 'horizontal' && styles.horizontalLayout,
          layout === 'vertical' && styles.verticalLayout,
          layout === 'grid' && styles.gridLayout,
        ]}
      >
        {images.map((imageUri, index) => (
          <View key={index} style={styles.imageWrapper}>
            <Image
              source={{ uri: imageUri }}
              style={[styles.image, imageStyle]}
              resizeMode="cover"
            />
            {imageCount > 1 && (
              <View style={styles.imageLabel}>
                <Text style={styles.imageLabelText}>
                  {String.fromCharCode(65 + index)}
                </Text>
              </View>
            )}
          </View>
        ))}
      </View>

      {prompt && (
        <View style={styles.promptContainer}>
          <Text style={styles.promptText}>{prompt}</Text>
        </View>
      )}
    </View>
  );
}

// Placeholder images for development
export const PLACEHOLDER_IMAGES = [
  'https://picsum.photos/400/300?random=1',
  'https://picsum.photos/400/300?random=2',
  'https://picsum.photos/400/300?random=3',
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  horizontalLayout: {
    flexDirection: 'row',
    gap: 16,
  },
  verticalLayout: {
    flexDirection: 'column',
    gap: 16,
  },
  gridLayout: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    justifyContent: 'center',
  },
  imageWrapper: {
    position: 'relative',
  },
  image: {
    borderRadius: 12,
    backgroundColor: colors.surface.DEFAULT,
  },
  imageLabel: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: colors.background.DEFAULT,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  imageLabelText: {
    color: colors.text.primary,
    fontWeight: 'bold',
    fontSize: 14,
  },
  promptContainer: {
    marginTop: 24,
    paddingHorizontal: 16,
    maxWidth: SCREEN_WIDTH - 32,
  },
  promptText: {
    color: colors.text.secondary,
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
});
