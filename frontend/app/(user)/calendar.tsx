import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { useQuery } from '@tanstack/react-query';
import { bookingService } from '@/services/bookingService';
import { format } from 'date-fns';

export default function CalendarScreen() {
  const [selectedDate, setSelectedDate] = useState<string>(
    format(new Date(), 'yyyy-MM-dd')
  );

  const { data: bookings } = useQuery({
    queryKey: ['bookings', 'calendar'],
    queryFn: () => bookingService.getUserBookings(),
  });

  // Marquer les dates avec des réservations
  const markedDates: any = {};
  bookings?.forEach((booking: any) => {
    const date = format(new Date(booking.date), 'yyyy-MM-dd');
    markedDates[date] = {
      marked: true,
      dotColor: getStatusColor(booking.status),
      selected: date === selectedDate,
      selectedColor: '#6366f1',
    };
  });

  // Marquer la date sélectionnée
  if (selectedDate && !markedDates[selectedDate]) {
    markedDates[selectedDate] = {
      selected: true,
      selectedColor: '#6366f1',
    };
  }

  const selectedDateBookings = bookings?.filter(
    (booking: any) => format(new Date(booking.date), 'yyyy-MM-dd') === selectedDate
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return '#f59e0b';
      case 'accepted':
        return '#10b981';
      case 'completed':
        return '#6366f1';
      case 'cancelled':
        return '#6b7280';
      default:
        return '#6b7280';
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Mon agenda</Text>
      </View>

      <Calendar
        current={selectedDate}
        onDayPress={(day) => setSelectedDate(day.dateString)}
        markedDates={markedDates}
        theme={{
          todayTextColor: '#6366f1',
          selectedDayBackgroundColor: '#6366f1',
          selectedDayTextColor: '#fff',
          arrowColor: '#6366f1',
        }}
        style={styles.calendar}
      />

      <ScrollView style={styles.bookingsList}>
        <Text style={styles.sectionTitle}>
          Réservations du {format(new Date(selectedDate), 'dd MMMM yyyy')}
        </Text>

        {selectedDateBookings?.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyText}>Aucune réservation ce jour</Text>
          </View>
        ) : (
          selectedDateBookings?.map((booking: any) => (
            <View key={booking._id} style={styles.bookingItem}>
              <View style={styles.bookingTime}>
                <Text style={styles.timeText}>
                  {booking.startTime} - {booking.endTime}
                </Text>
              </View>
              <View style={styles.bookingDetails}>
                <Text style={styles.providerName}>{booking.providerName}</Text>
                <Text style={styles.serviceName}>{booking.serviceName}</Text>
                <View
                  style={[
                    styles.statusBadge,
                    { backgroundColor: getStatusColor(booking.status) },
                  ]}
                >
                  <Text style={styles.statusText}>{booking.status}</Text>
                </View>
              </View>
            </View>
          ))
        )}
      </ScrollView>
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
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#6366f1',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  calendar: {
    marginBottom: 16,
  },
  bookingsList: {
    flex: 1,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 16,
  },
  empty: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
  },
  bookingItem: {
    flexDirection: 'row',
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  bookingTime: {
    marginRight: 16,
    justifyContent: 'center',
  },
  timeText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6366f1',
  },
  bookingDetails: {
    flex: 1,
  },
  providerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  serviceName: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '600',
  },
});
