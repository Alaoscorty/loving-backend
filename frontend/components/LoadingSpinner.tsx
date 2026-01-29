import React, { useEffect, useRef } from 'react';
import {
  View,
  ActivityIndicator,
  StyleSheet,
  ViewStyle,
  Text,
  Image,
  Animated,
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
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Animation de clignotement infini
    Animated.loop(
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [fadeAnim]);

  const sizeValue = size === 'small' ? 'small' : 'large';

  const Container = fullScreen ? styles.fullScreenContainer : styles.container;

  return (
    <View style={[Container, style]}>
      {/* Texte animé Loving */}
      <Animated.Text style={[styles.lovingText, { opacity: fadeAnim }]}>
        Loving
      </Animated.Text>

      <Image
      source={require("@/assets/fond-loading.png")}
      style={styles.image}
      resizeMode="contain"
      />

      {/* Spinner */}
      <ActivityIndicator size={sizeValue} color={color} />
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
  lovingText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#00f0ff', // bleu néon
    marginBottom: 20,
    textShadowColor: '#00f0ff',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  image:{
    width: 120,
    height:120,
    marginBottom:20
  },
});

export default LoadingSpinner;
