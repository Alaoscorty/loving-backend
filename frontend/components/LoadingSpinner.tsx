import React from 'react';
import {
  View,
  ActivityIndicator,
  StyleSheet,
  ViewStyle,
} from 'react-native';

interface LoadingSpinnerProps {
  size?: 'small' | 'large';
  color?: string;
  style?: ViewStyle;
  fullScreen?: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'large',
  color = '#6366f1',
  style,
  fullScreen = false,
}) => {
  const sizeValue = size === 'small' ? 'small' : 'large';

  if (fullScreen) {
    return (
      <View style={[styles.fullScreenContainer, style]}>
        <ActivityIndicator
          size={sizeValue}
          color={color}
        />
      </View>
    );
  }

  return (
    <View style={[styles.container, style]}>
      <ActivityIndicator
        size={sizeValue}
        color={color}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullScreenContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
});

export default LoadingSpinner;
