import apiClient from './apiClient';

export interface Earning {
  id: string;
  bookingId: string;
  amount: number;
  commission: number;
  netAmount: number;
  date: string;
  status: 'pending' | 'completed';
}

export interface ProviderStats {
  totalEarnings: number;
  pendingEarnings: number;
  availableBalance: number;
  bookingsCompleted: number;
  averageRating: number;
  reviewCount: number;
}

class ProviderService {
  async getProviderProfile() {
    try {
      const response = await apiClient.get('/provider/profile');
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async updateProviderProfile(data: any) {
    try {
      const response = await apiClient.put('/provider/profile', data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async getAvailability(startDate: string, endDate: string) {
    try {
      const response = await apiClient.get('/provider/availability', {
        params: { startDate, endDate },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async setAvailability(dates: string[], recurring: boolean = false) {
    try {
      const response = await apiClient.post('/provider/availability', {
        dates,
        recurring,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async getEarnings(period: 'week' | 'month' | 'year' | 'all' = 'month') {
    try {
      const response = await apiClient.get('/provider/earnings', {
        params: { period },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async getEarningsDetail(page: number = 1, limit: number = 10) {
    try {
      const response = await apiClient.get('/provider/earnings/detail', {
        params: { page, limit },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async requestPayout(amount: number) {
    try {
      const response = await apiClient.post('/provider/payout', { amount });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async getPayoutHistory(page: number = 1, limit: number = 10) {
    try {
      const response = await apiClient.get('/provider/payout-history', {
        params: { page, limit },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async getStats() {
    try {
      const response = await apiClient.get('/provider/stats');
      return response.data as ProviderStats;
    } catch (error) {
      throw error;
    }
  }

  async blockUser(userId: string, reason?: string) {
    try {
      const response = await apiClient.post('/provider/block-user', {
        userId,
        reason,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async getBlockedUsers() {
    try {
      const response = await apiClient.get('/provider/blocked-users');
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async unblockUser(userId: string) {
    try {
      const response = await apiClient.delete(`/provider/blocked-users/${userId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

export const providerService = new ProviderService();
