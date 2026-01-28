import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { chatService } from '@/services/chatService';
import { Card, Input, Button, LoadingSpinner } from '@/components';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useChat } from '@/contexts/ChatContext';

export default function ChatScreen() {
  const params = useLocalSearchParams();
  const providerId = params.providerId as string;
  const { messages, addMessage, sendMessage, isLoading } = useChat();
  const [messageText, setMessageText] = useState('');

  const { data: conversation, refetch } = useQuery({
    queryKey: ['conversation', providerId],
    queryFn: () => chatService.getConversation(providerId),
  });

  const handleSendMessage = async () => {
    if (messageText.trim()) {
      await sendMessage(messageText);
      setMessageText('');
      refetch();
    }
  };

  if (isLoading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.messagesContainer}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={refetch} />
        }
      >
        {messages.length === 0 ? (
          <View style={styles.emptyState}>
            <MaterialCommunityIcons
              name="chat-outline"
              size={48}
              color="#d1d5db"
            />
            <Text style={styles.emptyText}>Aucun message</Text>
            <Text style={styles.emptySubtext}>
              Commencez une conversation
            </Text>
          </View>
        ) : (
          messages.map((message) => (
            <View
              key={message.id}
              style={[
                styles.messageRow,
                message.user._id === 'currentUserId'
                  ? styles.sentMessage
                  : styles.receivedMessage,
              ]}
            >
              <Card
                style={[
                  styles.messageBubble,
                  message.user._id === 'currentUserId'
                    ? styles.sentBubble
                    : styles.receivedBubble,
                ]}
              >
                <Text
                  style={[
                    styles.messageText,
                    message.user._id === 'currentUserId'
                      ? styles.sentText
                      : styles.receivedText,
                  ]}
                >
                  {message.text}
                </Text>
              </Card>
            </View>
          ))
        )}
      </ScrollView>

      <View style={styles.inputContainer}>
        <View style={styles.inputRow}>
          <Input
            placeholder="Votre message..."
            value={messageText}
            onChangeText={setMessageText}
            multiline
            numberOfLines={2}
            containerStyle={styles.inputField}
          />
          <TouchableOpacity
            style={styles.sendButton}
            onPress={handleSendMessage}
            disabled={!messageText.trim()}
          >
            <MaterialCommunityIcons
              name="send"
              size={24}
              color={messageText.trim() ? '#6366f1' : '#d1d5db'}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  messagesContainer: {
    flex: 1,
    padding: 16,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6b7280',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#9ca3af',
    marginTop: 8,
  },
  messageRow: {
    marginBottom: 12,
    flexDirection: 'row',
  },
  sentMessage: {
    justifyContent: 'flex-end',
  },
  receivedMessage: {
    justifyContent: 'flex-start',
  },
  messageBubble: {
    maxWidth: '70%',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  sentBubble: {
    backgroundColor: '#6366f1',
  },
  receivedBubble: {
    backgroundColor: '#f3f4f6',
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
  },
  sentText: {
    color: '#ffffff',
  },
  receivedText: {
    color: '#1f2937',
  },
  inputContainer: {
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
    padding: 12,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
  },
  inputField: {
    flex: 1,
    marginBottom: 0,
  },
  sendButton: {
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
