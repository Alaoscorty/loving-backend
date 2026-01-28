import React from 'react';
import {
  Modal as RNModal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface ModalProps {
  visible: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  closeButton?: boolean;
  style?: ViewStyle;
  contentStyle?: ViewStyle;
}

const Modal: React.FC<ModalProps> = ({
  visible,
  title,
  onClose,
  children,
  closeButton = true,
  style,
  contentStyle,
}) => {
  return (
    <RNModal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={[styles.container, style]}>
          <View style={styles.header}>
            <Text style={styles.title}>{title}</Text>
            {closeButton && (
              <TouchableOpacity
                onPress={onClose}
                activeOpacity={0.7}
              >
                <MaterialCommunityIcons
                  name="close"
                  size={24}
                  color="#6b7280"
                />
              </TouchableOpacity>
            )}
          </View>

          <View style={[styles.content, contentStyle]}>
            {children}
          </View>
        </View>
      </View>
    </RNModal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1f2937',
  },
  content: {
    padding: 16,
  },
});

export default Modal;
