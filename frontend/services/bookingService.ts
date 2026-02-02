import apiClient from './apiClient';

export interface Booking {
  id: string;
  providerId: string;
  userId: string;
  startDate: string;
  endDate: string;
  status: 'pending' | 'accepted' | 'rejected' | 'cancelled' | 'completed';
  totalPrice: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BookingRequest {
  providerId: string;
  startDate: string;
  endDate: string;
  notes?: string;
}

class BookingService {
  async getUserBookings(status?: string) {
    try {
      const response = await apiClient.get('/bookings/user', {
        params: { status },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async getProviderBookings(status?: string) {
    try {
      const response = await apiClient.get('/bookings/provider', {
        params: { status },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Alias plus simple utilisé par certains écrans
  async getBooking(bookingId: string) {
    return this.getBookingById(bookingId);
  }

  async getBookingById(bookingId: string) {
    try {
      const response = await apiClient.get(`/bookings/${bookingId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async createBooking(data: BookingRequest) {
    try {
      const response = await apiClient.post('/bookings', data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async acceptBooking(bookingId: string) {
    return this.updateBookingStatus(bookingId, 'accepted');
  }

  async rejectBooking(bookingId: string, reason?: string) {
    try {
      const response = await apiClient.post(`/bookings/${bookingId}/reject`, {
        reason,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async updateBookingStatus(
    bookingId: string,
    status: 'accepted' | 'rejected' | 'cancelled' | 'completed'
  ) {
    try {
      const response = await apiClient.patch(`/bookings/${bookingId}`, {
        status,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async cancelBooking(bookingId: string, reason?: string) {
    try {
      const response = await apiClient.post(`/bookings/${bookingId}/cancel`, {
        reason,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async submitReview(
    bookingId: string,
    data: { rating: number; comment: string; categories?: Record<string, number> }
  ) {
    try {
      const response = await apiClient.post(`/bookings/${bookingId}/reviews`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async getAvailability(providerId: string, startDate: string, endDate: string) {
    try {
      const response = await apiClient.get(
        `/bookings/availability/${providerId}`,
        {
          params: { startDate, endDate },
        }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async getRecentBookings(options?: { limit?: number; status?: string }) {
    try {
      const response = await apiClient.get('/bookings/recent', {
        params: { limit: options?.limit || 5, status: options?.status },
      });
      return response?.data || response || [];
    } catch (error) {
      console.error('Erreur lors du chargement des réservations récentes:', error);
      return [];
    }
  }

  async getUserStats() {
    try {
      const response = await apiClient.get('/users/me/stats');
      return response?.data || {
        favoriteCount: 0,
        averageRating: 0,
        reviewCount: 0,
        totalBookings: 0,
      };
    } catch (error) {
      console.error('Erreur lors du chargement des stats:', error);
      return {
        favoriteCount: 0,
        averageRating: 0,
        reviewCount: 0,
        totalBookings: 0,
      };
    }
  }
}

export const bookingService = new BookingService();
