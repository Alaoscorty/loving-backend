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
}

export const bookingService = new BookingService();
