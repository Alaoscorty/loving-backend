import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { bookingService } from '@/services/bookingService';

export default function ReviewsScreen() {
  const { bookingId } = useLocalSearchParams<{ bookingId: string }>();
  const { user } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [categories, setCategories] = useState({
    punctuality: 5,
    communication: 5,
    professionalism: 5,
  });

  const { data: booking, isLoading } = useQuery({
    queryKey: ['booking', bookingId],
    queryFn: () => bookingService.getBooking(bookingId!),
    enabled: !!bookingId,
  });

  const submitReviewMutation = useMutation({
    mutationFn: (data: any) => bookingService.submitReview(bookingId!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['booking', bookingId] });
      Alert.alert('Succès', 'Votre avis a été publié', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    },
    onError: (error: any) => {
      Alert.alert('Erreur', error.message || 'Impossible de publier l\'avis');
    },
  });

  const handleSubmit = () => {
    if (!comment.trim()) {
      Alert.alert('Erreur', 'Veuillez laisser un commentaire');
      return;
    }

    submitReviewMutation.mutate({
      rating,
      comment,
      categories,
    });
  };

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#6366f1" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Laisser un avis</Text>
        <Text style={styles.subtitle}>
          Partagez votre expérience avec {booking?.providerName}
        </Text>
      </View>

      <View style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.label}>Note globale</Text>
          <View style={styles.ratingContainer}>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity
                key={star}
                onPress={() => setRating(star)}
                style={styles.starButton}
              >
                <Text style={[styles.star, star <= rating && styles.starActive]}>
                  ★
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Ponctualité</Text>
          <View style={styles.ratingContainer}>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity
                key={star}
                onPress={() => setCategories({ ...categories, punctuality: star })}
                style={styles.starButton}
              >
                <Text
                  style={[
                    styles.star,
                    star <= categories.punctuality && styles.starActive,
                  ]}
                >
                  ★
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Communication</Text>
          <View style={styles.ratingContainer}>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity
                key={star}
                onPress={() => setCategories({ ...categories, communication: star })}
                style={styles.starButton}
              >
                <Text
                  style={[
                    styles.star,
                    star <= categories.communication && styles.starActive,
                  ]}
                >
                  ★
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Professionnalisme</Text>
          <View style={styles.ratingContainer}>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity
                key={star}
                onPress={() => setCategories({ ...categories, professionalism: star })}
                style={styles.starButton}
              >
                <Text
                  style={[
                    styles.star,
                    star <= categories.professionalism && styles.starActive,
                  ]}
                >
                  ★
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Commentaire</Text>
          <TextInput
            style={styles.textArea}
            placeholder="Partagez votre expérience..."
            placeholderTextColor="#999"
            value={comment}
            onChangeText={setComment}
            multiline
            numberOfLines={6}
            maxLength={1000}
          />
          <Text style={styles.charCount}>{comment.length}/1000</Text>
        </View>

        <TouchableOpacity
          style={[styles.button, submitReviewMutation.isPending && styles.buttonDisabled]}
          onPress={handleSubmit}
          disabled={submitReviewMutation.isPending}
        >
          {submitReviewMutation.isPending ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Publier l'avis</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#6366f1',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#e0e7ff',
  },
  content: {
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 12,
  },
  ratingContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  starButton: {
    padding: 4,
  },
  star: {
    fontSize: 32,
    color: '#e5e7eb',
  },
  starActive: {
    color: '#fbbf24',
  },
  textArea: {
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    minHeight: 120,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: '#e5e5e5',
  },
  charCount: {
    fontSize: 12,
    color: '#999',
    textAlign: 'right',
    marginTop: 8,
  },
  button: {
    backgroundColor: '#6366f1',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
