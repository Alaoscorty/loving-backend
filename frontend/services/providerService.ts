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
      const response = await apiClient.get('/providers/profile');
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async updateProviderProfile(data: any) {
    try {
      const response = await apiClient.put('/providers/profile', data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async getAvailability(startDate?: string, endDate?: string) {
    try {
      const response = await apiClient.get('/providers/availability', {
        params: { startDate, endDate },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async setAvailability(dates: string[], recurring: boolean = false) {
    try {
      const response = await apiClient.post('/providers/availability', {
        dates,
        recurring,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Alias pour correspondre aux appels `updateAvailability` dans les écrans
  async updateAvailability(dates: string[], recurring: boolean = false) {
    return this.setAvailability(dates, recurring);
  }

  async getEarnings(period: 'week' | 'month' | 'year' | 'all' = 'month') {
    try {
      const response = await apiClient.get('/providers/earnings', {
        params: { period },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async getEarningsDetail(page: number = 1, limit: number = 10) {
    try {
      const response = await apiClient.get('/providers/earnings/detail', {
        params: { page, limit },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async requestPayout(amount: number) {
    try {
      const response = await apiClient.post('/providers/payout', { amount });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async getPayoutHistory(page: number = 1, limit: number = 10) {
    try {
      const response = await apiClient.get('/providers/payout-history', {
        params: { page, limit },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async getStats() {
    try {
      const response = await apiClient.get('/providers/stats');
      return response.data as ProviderStats;
    } catch (error) {
      throw error;
    }
  }

  async blockUser(userId: string, reason?: string) {
    try {
      const response = await apiClient.post('/providers/block-user', {
        userId,
        reason,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async reportUser(userId: string, reason?: string) {
    try {
      const response = await apiClient.post('/providers/report-user', {
        userId,
        reason,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async getPremiumStatus() {
    try {
      const response = await apiClient.get('/providers/premium/status');
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async subscribePremium(planId: string) {
    try {
      const response = await apiClient.post('/providers/premium/subscribe', {
        planId,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async getBlockedUsers() {
    try {
      const response = await apiClient.get('/providers/blocked-users');
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async unblockUser(userId: string) {
    try {
      const response = await apiClient.delete(`/providers/blocked-users/${userId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

export const providerService = new ProviderService();
