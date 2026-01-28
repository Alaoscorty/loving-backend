import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  ViewStyle,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastProps {
  visible: boolean;
  message: string;
  type?: ToastType;
  duration?: number;
  onHide?: () => void;
  style?: ViewStyle;
}

const Toast: React.FC<ToastProps> = ({
  visible,
  message,
  type = 'info',
  duration = 3000,
  onHide,
  style,
}) => {
  const opacityAnim = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();

      const timer = setTimeout(() => {
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start(() => onHide?.());
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [visible]);

  if (!visible) return null;

  const getBackgroundColor = () => {
    switch (type) {
      case 'success':
        return '#d1fae5';
      case 'error':
        return '#fee2e2';
      case 'warning':
        return '#fef3c7';
      case 'info':
      default:
        return '#dbeafe';
    }
  };

  const getTextColor = () => {
    switch (type) {
      case 'success':
        return '#065f46';
      case 'error':
        return '#7f1d1d';
      case 'warning':
        return '#78350f';
      case 'info':
      default:
        return '#0c2340';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return 'check-circle';
      case 'error':
        return 'alert-circle';
      case 'warning':
        return 'alert';
      case 'info':
      default:
        return 'information';
    }
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor: getBackgroundColor(),
          opacity: opacityAnim,
        },
        style,
      ]}
    >
      <MaterialCommunityIcons
        name={getIcon()}
        size={20}
        color={getTextColor()}
        style={styles.icon}
      />
      <Text style={[styles.message, { color: getTextColor() }]}>
        {message}
      </Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginHorizontal: 16,
    marginVertical: 12,
    borderRadius: 8,
  },
  icon: {
    marginRight: 12,
  },
  message: {
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
  },
});

export default Toast;
