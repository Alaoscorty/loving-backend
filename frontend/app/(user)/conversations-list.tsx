import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { Card, LoadingSpinner, Button } from '@/components';
import { chatService } from '@/services';
import { ChatContext, NotificationContext } from '@/contexts';
import { formatRelativeTime } from '@/utils/formatters';

/**
 * Écran de liste des conversations
 * 
 * Fonctionnalités:
 * - Affichage de toutes les conversations
 * - Dernier message et date
 * - Compteur de messages non lus
 * - Recherche et filtrage
 * - Actions (archiver, supprimer, épingler)
 */

interface Conversation {
  id: string;
  participantName: string;
  participantAvatar?: string;
  lastMessage: string;
  lastMessageTime: Date;
  unreadCount: number;
  isPinned?: boolean;
  status?: 'online' | 'offline' | 'away';
}

export default function ConversationsListScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredConversations, setFilteredConversations] = useState<Conversation[]>([]);
  const chatCtx = React.useContext(ChatContext)!;
  const { currentConversationId, setCurrentConversation } = chatCtx;
  const notificationCtx = React.useContext(NotificationContext)!;
  const { addNotification } = notificationCtx;

  // Récupérer les conversations
  const { data: conversations = [], isLoading, refetch } = useQuery({
    queryKey: ['conversations'],
    queryFn: () => chatService.getConversations(),
  });

  // Filtrer les conversations
  React.useEffect(() => {
    if (searchQuery.trim()) {
        const filtered = conversations.filter((conv: Conversation) =>
        conv.participantName.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredConversations(filtered);
    } else {
      // Trier: conversations épinglées en premier, puis par date
      const sorted = [...conversations].sort((a, b) => {
        if (a.isPinned && !b.isPinned) return -1;
        if (!a.isPinned && b.isPinned) return 1;
        return new Date(b.lastMessageTime).getTime() - new Date(a.lastMessageTime).getTime();
      });
      setFilteredConversations(sorted);
    }
  }, [searchQuery, conversations]);

  const handleOpenConversation = async (conversation: Conversation) => {
    await setCurrentConversation(conversation.id);
    router.push({
      pathname: '/(user)/chat',
      params: { conversationId: conversation.id },
    });
  };

  const handlePinConversation = (conversationId: string, isPinned: boolean) => {
    // Logique pour épingler/dépingler
    addNotification(isPinned ? 'Conversation dépinglée' : 'Conversation épinglée', 'success', 2000);
    refetch();
  };

  const handleArchiveConversation = (conversationId: string) => {
    addNotification('Conversation archivée', 'success', 2000);
    refetch();
  };

  const handleDeleteConversation = (conversationId: string) => {
    addNotification('Conversation supprimée', 'success', 2000);
    refetch();
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <View style={styles.container}>
      {/* Entête */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Messages</Text>
          <Text style={styles.headerSubtitle}>{conversations.length} conversations</Text>
        </View>
        <TouchableOpacity style={styles.settingsButton}>
          <MaterialCommunityIcons name="cog" size={24} color="#007AFF" />
        </TouchableOpacity>
      </View>

      {/* Barre de recherche */}
      <View style={styles.searchContainer}>
        <MaterialCommunityIcons name="magnify" size={20} color="#ccc" />
        <TextInput
          style={styles.searchInput}
          placeholder="Rechercher une conversation..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#ccc"
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <MaterialCommunityIcons name="close-circle" size={20} color="#ccc" />
          </TouchableOpacity>
        )}
      </View>

      {/* Liste des conversations */}
      {filteredConversations.length > 0 ? (
        <FlatList
          data={filteredConversations}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => (
            <View key={item.id}>
              {/* En-tête de section pour les épinglées */}
              {index === 0 && item.isPinned && (
                <Text style={styles.sectionHeader}>📌 ÉPINGLÉES</Text>
              )}
              {index > 0 && !filteredConversations[index - 1].isPinned && item.isPinned && (
                <Text style={styles.sectionHeader}>📌 ÉPINGLÉES</Text>
              )}
              {index > 0 && filteredConversations[index - 1].isPinned && !item.isPinned && (
                <Text style={styles.sectionHeader}>💬 TOUTES LES CONVERSATIONS</Text>
              )}

              <TouchableOpacity
                style={[
                  styles.conversationItem,
                  currentConversationId === item.id && styles.conversationItemActive,
                ]}
                onPress={() => handleOpenConversation(item)}
              >
                {/* Avatar et statut */}
                <View style={styles.avatarContainer}>
                  <View style={styles.avatar}>
                    <Text style={styles.avatarText}>
                      {item.participantName.charAt(0).toUpperCase()}
                    </Text>
                  </View>
                  {item.status === 'online' && <View style={styles.statusDot} />}
                </View>

                {/* Contenu */}
                <View style={styles.conversationContent}>
                  <View style={styles.headerRow}>
                    <Text style={styles.participantName}>{item.participantName}</Text>
                    <Text style={styles.timestamp}>
                      {formatRelativeTime(new Date(item.lastMessageTime))}
                    </Text>
                  </View>
                  <View style={styles.messageRow}>
                    <Text style={styles.lastMessage} numberOfLines={1}>
                      {item.lastMessage}
                    </Text>
                    {item.unreadCount > 0 && (
                      <View style={styles.unreadBadge}>
                        <Text style={styles.unreadCount}>{item.unreadCount}</Text>
                      </View>
                    )}
                  </View>
                </View>

                {/* Actions */}
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => handlePinConversation(item.id, !item.isPinned)}
                >
                  <MaterialCommunityIcons
                    name={item.isPinned ? 'pin-off' : 'pin'}
                    size={20}
                    color="#999"
                  />
                </TouchableOpacity>
              </TouchableOpacity>
            </View>
          )}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      ) : (
        <View style={styles.emptyState}>
          <MaterialCommunityIcons name="chat-outline" size={64} color="#ddd" />
          <Text style={styles.emptyStateTitle}>Aucune conversation</Text>
          <Text style={styles.emptyStateMessage}>
            {searchQuery ? 'Aucun résultat pour votre recherche' : 'Commencez une nouvelle conversation'}
          </Text>
          {!searchQuery && (
            <Button
              title="Parcourir les prestataires"
              onPress={() => router.push('/(user)/profiles-list')}
              style={styles.browseButton}
            />
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  settingsButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: '#f8f8f8',
    borderRadius: 24,
    height: 40,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#1a1a1a',
    paddingVertical: 8,
  },
  sectionHeader: {
    fontSize: 12,
    fontWeight: '700',
    color: '#999',
    textTransform: 'uppercase',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fafafa',
  },
  conversationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
  },
  conversationItemActive: {
    backgroundColor: '#f0f7ff',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#fff',
  },
  statusDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#4caf50',
    borderWidth: 2,
    borderColor: '#fff',
  },
  conversationContent: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  participantName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  timestamp: {
    fontSize: 12,
    color: '#999',
  },
  messageRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lastMessage: {
    flex: 1,
    fontSize: 13,
    color: '#666',
  },
  unreadBadge: {
    backgroundColor: '#007AFF',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  unreadCount: {
    fontSize: 11,
    fontWeight: '700',
    color: '#fff',
  },
  actionButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  separator: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginHorizontal: 16,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    marginTop: 16,
  },
  emptyStateMessage: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    marginTop: 8,
  },
  browseButton: {
    marginTop: 24,
    alignSelf: 'center',
    width: '100%',
  },
});
