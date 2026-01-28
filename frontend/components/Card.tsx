import React from 'react';
import {
  View,
  StyleSheet,
  ViewStyle,
  TouchableOpacity,
  GestureResponderEvent,
} from 'react-native';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  onPress?: (event: GestureResponderEvent) => void;
  shadow?: boolean;
  padding?: 'small' | 'medium' | 'large';
  borderRadius?: number;
}

const Card: React.FC<CardProps> = ({
  children,
  style,
  onPress,
  shadow = true,
  padding = 'medium',
  borderRadius = 12,
}) => {
  const getPaddingValue = () => {
    switch (padding) {
      case 'small':
        return 8;
      case 'large':
        return 20;
      default:
        return 12;
    }
  };

  const shadowStyle = shadow
    ? {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
      }
    : {};

  const cardStyle = [
    styles.card,
    {
      padding: getPaddingValue(),
      borderRadius,
    },
    shadowStyle,
    style,
  ];

  if (onPress) {
    return (
      <TouchableOpacity
        style={cardStyle}
        onPress={onPress}
        activeOpacity={0.7}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return <View style={cardStyle}>{children}</View>;
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    marginVertical: 8,
    marginHorizontal: 0,
  },
});

export default Card;
