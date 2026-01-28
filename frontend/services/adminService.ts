import apiClient from './apiClient';

export interface AdminStats {
  totalUsers: number;
  totalProviders: number;
  totalBookings: number;
  totalEarnings: number;
  totalCommissions: number;
  newUsersThisMonth: number;
  pendingValidations: number;
  reportedUsers: number;
}

export interface PendingProfile {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  photos: string[];
  description: string;
  verificationDocuments: string[];
  submittedAt: string;
  status: 'pending' | 'approved' | 'rejected';
}

export interface Report {
  id: string;
  reporterId: string;
  reportedUserId: string;
  reason: string;
  description: string;
  status: 'pending' | 'reviewed' | 'resolved';
  createdAt: string;
}

class AdminService {
  async getStats() {
    try {
      const response = await apiClient.get('/admin/stats');
      return response.data as AdminStats;
    } catch (error) {
      throw error;
    }
  }

  async getPendingProfiles(page: number = 1, limit: number = 10) {
    try {
      const response = await apiClient.get('/admin/pending-profiles', {
        params: { page, limit },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async approveProfile(profileId: string, notes?: string) {
    try {
      const response = await apiClient.post(
        `/admin/profiles/${profileId}/approve`,
        { notes }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async rejectProfile(profileId: string, reason: string) {
    try {
      const response = await apiClient.post(
        `/admin/profiles/${profileId}/reject`,
        { reason }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async getUsers(page: number = 1, limit: number = 10, search?: string) {
    try {
      const response = await apiClient.get('/admin/users', {
        params: { page, limit, search },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async deactivateUser(userId: string, reason?: string) {
    try {
      const response = await apiClient.post(
        `/admin/users/${userId}/deactivate`,
        { reason }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async reactivateUser(userId: string) {
    try {
      const response = await apiClient.post(
        `/admin/users/${userId}/reactivate`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async getReports(status?: string, page: number = 1, limit: number = 10) {
    try {
      const response = await apiClient.get('/admin/reports', {
        params: { status, page, limit },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async resolveReport(reportId: string, action: string, notes?: string) {
    try {
      const response = await apiClient.post(`/admin/reports/${reportId}/resolve`, {
        action,
        notes,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async getReviews(status?: string, page: number = 1, limit: number = 10) {
    try {
      const response = await apiClient.get('/admin/reviews', {
        params: { status, page, limit },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async approveReview(reviewId: string) {
    try {
      const response = await apiClient.post(
        `/admin/reviews/${reviewId}/approve`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async rejectReview(reviewId: string, reason: string) {
    try {
      const response = await apiClient.post(
        `/admin/reviews/${reviewId}/reject`,
        { reason }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async getCommissionSettings() {
    try {
      const response = await apiClient.get('/admin/commissions/settings');
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async updateCommissionSettings(percentage: number, fixedAmount?: number) {
    try {
      const response = await apiClient.put('/admin/commissions/settings', {
        percentage,
        fixedAmount,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async getLogs(type?: string, page: number = 1, limit: number = 20) {
    try {
      const response = await apiClient.get('/admin/logs', {
        params: { type, page, limit },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

export const adminService = new AdminService();
