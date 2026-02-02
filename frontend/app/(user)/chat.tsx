import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  FlatList,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Card, Input, LoadingSpinner } from '@/components';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useChat } from '@/contexts/ChatContext';
import { useAuth } from '@/contexts/AuthContext';
import { chatService } from '@/services/chatService';
import { useRouter } from 'expo-router';


const CHAT_CACHE_KEY = 'chat_messages_cache';
const router = useRouter();

export default function ChatScreen() {
  const params = useLocalSearchParams();
  const conversationId = (params.conversationId as string) || undefined;
  const providerId = (params.providerId as string) || undefined;
  const { user } = useAuth();
  const currentUserId = user?._id || '';
  const chat = useChat();
  const {
    messages = [],
    sendMessage,
    isLoading,
    setCurrentConversation,
    currentConversationId,
  } = (chat || {}) as any;
  const [messageText, setMessageText] = useState('');
  const [initLoading, setInitLoading] = useState(true);
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (cancelled) return;
      setInitLoading(true);
      try {
        if (conversationId) {
          await setCurrentConversation?.(conversationId);
        } else if (providerId) {
          const conv = await chatService.createOrGetConversation(providerId);
          if (conv?.id && setCurrentConversation) {
            await setCurrentConversation(conv.id);
          }
        }
      } catch (e) {
        console.error('Chat init error:', e);
      } finally {
        if (!cancelled) setInitLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [conversationId, providerId]);

  useEffect(() => {
    if (!currentConversationId || messages.length === 0) return;
    const saveCache = async () => {
      try {
        await AsyncStorage.setItem(
          `${CHAT_CACHE_KEY}_${currentConversationId}`,
          JSON.stringify(
            messages.map((m: any) => ({
              ...m,
              createdAt: m.createdAt instanceof Date ? m.createdAt.toISOString() : m.createdAt,
            }))
          )
        );
      } catch {
        // ignore local cache errors
      }
    };
    void saveCache();
  }, [currentConversationId, messages]);

  const handleSendMessage = async () => {
    const text = messageText.trim();
    if (!text || !sendMessage) return;
    setMessageText('');
    await sendMessage(text);
  };

  const isSent = (msg: any) => {
    const senderId = msg.user?._id?.toString?.() || msg.user?._id;
    return senderId === currentUserId;
  };

  if (initLoading || (isLoading && messages.length === 0)) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id || String(Math.random())}
        contentContainerStyle={styles.messagesList}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <MaterialCommunityIcons name="chat-outline" size={48} color="#d1d5db" />
            <Text style={styles.emptyText}>Aucun message</Text>
            <Text style={styles.emptySubtext}>Envoyez un message pour commencer</Text>
          </View>
        }
        renderItem={({ item }) => (
          <View
            style={[
              styles.messageRow,
              isSent(item) ? styles.sentMessage : styles.receivedMessage,
            ]}
          >
            <Card
              style={[
                styles.messageBubble,
                isSent(item) ? styles.sentBubble : styles.receivedBubble,
              ] as any}
            >
              <Text
                style={[
                  styles.messageTextStyle,
                  isSent(item) ? styles.sentText : styles.receivedText,
                ]}
              >
                {item.text}
              </Text>
            </Card>
          </View>
        )}
        refreshControl={
          <RefreshControl
            refreshing={!!isLoading}
            onRefresh={() => currentConversationId && setCurrentConversation?.(currentConversationId)}
          />
        }
      />

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

      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.push('/(user)/conversation-list')}
      >
        <MaterialCommunityIcons name="arrow-left" size={20} color="#6366f1" />
        <Text style={styles.backButtonText}>Retour aux conversations</Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb', paddingTop: 20, },
  messagesList: { padding: 16, flexGrow: 1 },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: { fontSize: 18, fontWeight: '600', color: '#6b7280', marginTop: 16 },
  emptySubtext: { fontSize: 14, color: '#9ca3af', marginTop: 8 },
  messageRow: { marginBottom: 12, flexDirection: 'row' },
  sentMessage: { justifyContent: 'flex-end' },
  receivedMessage: { justifyContent: 'flex-start' },
  messageBubble: { maxWidth: '70%', paddingHorizontal: 12, paddingVertical: 8 },
  sentBubble: { backgroundColor: '#6366f1' },
  receivedBubble: { backgroundColor: '#f3f4f6' },
  messageTextStyle: { fontSize: 14, lineHeight: 20 },
  sentText: { color: '#ffffff' },
  receivedText: { color: '#1f2937' },
  inputContainer: {
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
    padding: 12,
  },
  inputRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 8 },
  inputField: { flex: 1, marginBottom: 0 },
  sendButton: { padding: 8, justifyContent: 'center', alignItems: 'center' },
  backButton: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  paddingVertical: 14,
  borderTopWidth: 1,
  borderTopColor: '#e5e7eb',
  backgroundColor: '#fff',
},
backButtonText: {
  marginLeft: 8,
  fontSize: 14,
  fontWeight: '600',
  color: '#6366f1',
},

});
