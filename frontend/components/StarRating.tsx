import React from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  Text,
} from 'react-native';

interface StarRatingProps {
  rating: number;
  onRatingChange?: (rating: number) => void;
  readOnly?: boolean;
  size?: number;
  color?: string;
  emptyColor?: string;
  style?: ViewStyle;
  showNumber?: boolean;
}

const StarRating: React.FC<StarRatingProps> = ({
  rating,
  onRatingChange,
  readOnly = false,
  size = 24,
  color = '#fbbf24',
  emptyColor = '#d1d5db',
  style,
  showNumber = true,
}) => {
  const handleStarPress = (index: number) => {
    if (!readOnly && onRatingChange) {
      onRatingChange(index + 1);
    }
  };

  const renderStar = (index: number) => {
    const isFilled = index < Math.floor(rating);
    const isHalf = index === Math.floor(rating) && rating % 1 !== 0;

    return (
      <TouchableOpacity
        key={index}
        onPress={() => handleStarPress(index)}
        disabled={readOnly}
        activeOpacity={0.7}
      >
        <Text
          style={{
            fontSize: size,
            color: isFilled || isHalf ? color : emptyColor,
            marginHorizontal: 4,
          }}
        >
          {isFilled || isHalf ? '★' : '☆'}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, style]}>
      <View style={styles.starsContainer}>
        {[0, 1, 2, 3, 4].map((index) => renderStar(index))}
      </View>
      {showNumber && (
        <Text style={styles.ratingText}>{rating.toFixed(1)}/5</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  starsContainer: {
    flexDirection: 'row',
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
  },
});

export default StarRating;
