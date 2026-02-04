import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
  FlatList,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Card, Input, LoadingSpinner } from '@/components';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useChat } from '@/contexts/ChatContext';
import { useAuth } from '@/contexts/AuthContext';
import { chatService } from '@/services/chatService';
import BottomSheet from '@gorhom/bottom-sheet';

const CHAT_CACHE_KEY = 'chat_messages_cache';

export default function ChatScreen() {
  const router = useRouter();
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

  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['45%'], []);

  /* ---------------- INIT CONVERSATION ---------------- */
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
          if (conv?.id) {
            await setCurrentConversation?.(conv.id);
          }
        }
      } catch (e) {
        console.error('Chat init error:', e);
      } finally {
        if (!cancelled) setInitLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [conversationId, providerId]);

  /* ---------------- CACHE MESSAGES ---------------- */
  useEffect(() => {
    if (!currentConversationId || messages.length === 0) return;

    AsyncStorage.setItem(
      `${CHAT_CACHE_KEY}_${currentConversationId}`,
      JSON.stringify(
        messages.map((m: any) => ({
          ...m,
          createdAt:
            m.createdAt instanceof Date
              ? m.createdAt.toISOString()
              : m.createdAt,
        }))
      )
    ).catch(() => {});
  }, [messages, currentConversationId]);

  /* ---------------- HELPERS ---------------- */
  const isSent = (msg: any) => {
    const senderId = msg.user?._id?.toString?.() || msg.user?._id;
    return senderId === currentUserId;
  };

  const handleSendMessage = async () => {
    const text = messageText.trim();
    if (!text || !sendMessage) return;
    setMessageText('');
    await sendMessage(text);
  };

  if (initLoading || (isLoading && messages.length === 0)) {
    return <LoadingSpinner fullScreen />;
  }

  /* ---------------- UI ---------------- */
  return (
    <View style={styles.container}>
      {/* ---------- HEADER ---------- */}
      <View style={styles.header}>
        <TouchableOpacity>
          <MaterialCommunityIcons name="cog-outline" size={24} />
        </TouchableOpacity>

        <View style={styles.headerActions}>
          <TouchableOpacity>
            <MaterialCommunityIcons name="phone-outline" size={24} />
          </TouchableOpacity>
          <TouchableOpacity>
            <MaterialCommunityIcons name="video-outline" size={24} />
          </TouchableOpacity>
        </View>
      </View>

      {/* ---------- MESSAGES ---------- */}
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id || Math.random().toString()}
        contentContainerStyle={styles.messagesList}
        refreshControl={
          <RefreshControl
            refreshing={!!isLoading}
            onRefresh={() =>
              currentConversationId &&
              setCurrentConversation?.(currentConversationId)
            }
          />
        }
        renderItem={({ item }) => (
          <View
            style={[
              styles.messageRow,
              isSent(item) ? styles.sentMessage : styles.receivedMessage,
            ]}
          >
            {!isSent(item) && (
              <MaterialCommunityIcons
                name="account-circle"
                size={32}
                color="#9ca3af"
                style={styles.avatar}
              />
            )}

            <Card
              style={{
                ...styles.messageBubble,
                ...(isSent(item) ? styles.sentBubble : styles.receivedBubble),
              }}
            >

              <Text
                style={[
                  styles.messageText,
                  isSent(item) ? styles.sentText : styles.receivedText,
                ]}
              >
                {item.text}
              </Text>
            </Card>

            {isSent(item) && (
              <MaterialCommunityIcons
                name="account-circle"
                size={32}
                color="#6366f1"
                style={styles.avatar}
              />
            )}
          </View>
        )}
      />

      {/* ---------- INPUT ---------- */}
      <View style={styles.inputContainer}>
        <View style={styles.inputRow}>
          <View style={styles.leftIcons}>
            <MaterialCommunityIcons name="camera-outline" size={22} />
            <MaterialCommunityIcons name="image-outline" size={22} />
            <MaterialCommunityIcons name="microphone-outline" size={22} />
          </View>

          <Input
            placeholder="Votre message..."
            value={messageText}
            onChangeText={setMessageText}
            multiline
            containerStyle={styles.inputField}
          />

          <TouchableOpacity
            onPress={() => bottomSheetRef.current?.expand()}
          >
            <MaterialCommunityIcons name="paperclip" size={22} />
          </TouchableOpacity>

          <TouchableOpacity
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

      {/* ---------- BOTTOM SHEET ---------- */}
      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose
      >
        <View style={styles.sheetContent}>
          {[
            { label: 'Document', icon: 'file-outline', color: '#6366f1' },
            { label: 'Caméra', icon: 'camera-outline', color: '#10b981' },
            { label: 'Galerie', icon: 'image-outline', color: '#f59e0b' },
            { label: 'Audio', icon: 'microphone-outline', color: '#ef4444' },
            { label: 'Catalogue', icon: 'store-outline', color: '#8b5cf6' },
            { label: 'Réponse rapide', icon: 'flash-outline', color: '#0ea5e9' },
            { label: 'Localisation', icon: 'map-marker-outline', color: '#22c55e' },
            { label: 'Contact', icon: 'account-outline', color: '#ec4899' },
            { label: 'Sondage', icon: 'poll', color: '#14b8a6' },
            { label: 'Évènement', icon: 'calendar-outline', color: '#f97316' },
            { label: 'Étudier avec IA', icon: 'brain', color: '#6366f1' },
          ].map((item) => (
            <View
              key={item.label}
              style={[
                styles.sheetCard,
                { backgroundColor: `${item.color}20` },
              ]}
            >
              <MaterialCommunityIcons
                name={item.icon as any}
                size={26}
                color={item.color}
              />
              <Text style={[styles.sheetLabel, { color: item.color }]}>
                {item.label}
              </Text>
            </View>
          ))}
        </View>
      </BottomSheet>
    </View>
  );
}

/* ---------------- STYLES ---------------- */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' , marginTop: 40,},

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
  },
  headerActions: { flexDirection: 'row', gap: 16 },

  messagesList: { padding: 16 },

  messageRow: { flexDirection: 'row', marginBottom: 12 },
  sentMessage: { justifyContent: 'flex-end' },
  receivedMessage: { justifyContent: 'flex-start' },

  messageBubble: {
    maxWidth: '65%',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
  },
  sentBubble: { backgroundColor: '#6366f1' },
  receivedBubble: { backgroundColor: '#f3f4f6' },

  messageText: { fontSize: 14, lineHeight: 20 },
  sentText: { color: '#fff' },
  receivedText: { color: '#1f2937' },

  avatar: { marginHorizontal: 6, alignSelf: 'flex-end' },

  inputContainer: {
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    backgroundColor: '#fff',
    padding: 12,
  },
  inputRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 8 },
  leftIcons: { flexDirection: 'row', gap: 8 },
  inputField: { flex: 1 },

  sheetContent: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
    gap: 16,
  },
  sheetCard: {
    width: '30%',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  sheetLabel: {
    marginTop: 6,
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },

  backButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 14,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    backgroundColor: '#fff',
  },
  backButtonText: {
    marginLeft: 8,
    fontWeight: '600',
    color: '#6366f1',
  },
});
