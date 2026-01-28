import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { profileService } from '@/services/profileService';
import { Card, FilterBar, LoadingSpinner } from '@/components';

export default function ProfileListScreen() {
  const [filters, setFilters] = useState({});
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

  const { data: profiles, isLoading, refetch } = useQuery({
    queryKey: ['profiles', filters],
    queryFn: () => profileService.getProfiles(filters),
  });

  const filterOptions = [
    { id: 'verified', label: 'Vérifiés' },
    { id: 'highly-rated', label: 'Top notés', icon: 'star' },
    { id: 'new', label: 'Nouveaux', icon: 'new-box' },
  ];

  const handleFilterChange = (filterId: string) => {
    setSelectedFilters((prev) =>
      prev.includes(filterId)
        ? prev.filter((f) => f !== filterId)
        : [...prev, filterId]
    );
  };

  if (isLoading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refetch} />}
    >
      <FilterBar
        filters={filterOptions}
        selectedFilters={selectedFilters}
        onFilterChange={handleFilterChange}
        multiSelect
        showAdvancedButton
      />

      <View style={styles.content}>
        {profiles?.data?.map((profile: any) => (
          <Card key={profile.id} style={styles.profileCard}>
            <View style={styles.profileHeader}>
              <Text style={styles.name}>{profile.firstName} {profile.lastName}</Text>
              <Text style={styles.location}>📍 {profile.location}</Text>
            </View>
            <Text style={styles.description} numberOfLines={2}>
              {profile.description}
            </Text>
            <View style={styles.footer}>
              <Text style={styles.rating}>⭐ {profile.rating.toFixed(1)}</Text>
              <Text style={styles.price}>{profile.rates?.hourly}€/h</Text>
            </View>
          </Card>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  content: {
    padding: 16,
  },
  profileCard: {
    marginBottom: 12,
  },
  profileHeader: {
    marginBottom: 8,
  },
  name: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 4,
  },
  location: {
    fontSize: 14,
    color: '#6b7280',
  },
  description: {
    fontSize: 14,
    color: '#4b5563',
    marginBottom: 12,
    lineHeight: 20,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
    paddingTop: 12,
  },
  rating: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6366f1',
  },
  price: {
    fontSize: 16,
    fontWeight: '700',
    color: '#10b981',
  },
});
