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
  // Stats simples du dashboard admin
  async getStats() {
    try {
      const response = await apiClient.get('/admin/stats');
      const data = response.data?.data || response.data;
      return data as AdminStats;
    } catch (error) {
      throw error;
    }
  }

  // Stats avancées pour le dashboard (période jour/semaine/mois/année)
  async getDashboardStats(params?: { period?: string }) {
    try {
      const response = await apiClient.get('/admin/dashboard', {
        params,
      });
      return response.data?.data || response.data;
    } catch (error) {
      throw error;
    }
  }

  // Données pour les graphiques du dashboard.
  // L'API backend n'est pas encore finalisée, on renvoie donc
  // une structure compatible avec `react-native-chart-kit`.
  async getChartData(_params?: { period?: string }) {
    // TODO: brancher sur de vraies données backend quand l'API sera prête
    const fallbackLabels = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
    return {
      revenueData: {
        labels: fallbackLabels,
        datasets: [
          {
            data: [120, 90, 140, 80, 160, 200, 130],
          },
        ],
      },
      bookingData: {
        labels: fallbackLabels,
        datasets: [
          {
            data: [5, 8, 4, 10, 7, 9, 6],
          },
        ],
      },
    };
  }

  // Alertes affichées dans le dashboard avancé
  async getAlerts(): Promise<Array<{ id: string; message: string; timestamp: string; color: string; icon: string }>> {
    // À terme : appeler un endpoint `/admin/alerts`
    return [];
  }

  // Actions urgentes affichées dans le dashboard avancé
  async getUrgentActions(): Promise<Array<{ id: string; title: string; description: string; severity: 'high' | 'medium' | 'low' }>> {
    // À terme : appeler un endpoint `/admin/urgent-actions`
    return [];
  }

  async getPendingProfiles(page: number = 1, limit: number = 10) {
    try {
      const response = await apiClient.get('/admin/profiles/pending', {
        params: { page, limit },
      });
      const data = response.data?.data || response.data || [];
      return Array.isArray(data) ? data : data.items || [];
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

  // Récupère la liste des utilisateurs.
  // Accepte soit (page, limit, search), soit un objet d'options.
  async getUsers(
    optionsOrPage:
      | { page?: number; limit?: number; search?: string; role?: string }
      | number = 1,
    limit: number = 10,
    search?: string
  ) {
    try {
      let page: number;
      let params: Record<string, unknown>;

      if (typeof optionsOrPage === 'number') {
        page = optionsOrPage;
        params = { page, limit, search };
      } else {
        page = optionsOrPage.page ?? 1;
        params = {
          page,
          limit: optionsOrPage.limit ?? limit,
          search: optionsOrPage.search,
          role: optionsOrPage.role,
        };
      }

      const response = await apiClient.get('/admin/users', {
        params,
      });
      const data = response.data?.data || response.data || [];
      return Array.isArray(data) ? data : data.items || [];
    } catch (error) {
      throw error;
    }
  }

  // Met à jour le statut d'un utilisateur (actif/suspendu/bloqué).
  // Cette méthode est un wrapper autour de `deactivateUser` / `reactivateUser`.
  async updateUserStatus(payload: {
    userId: string;
    status: 'active' | 'suspended' | 'blocked';
    reason?: string;
  }) {
    const { userId, status, reason } = payload;

    if (status === 'active') {
      return this.reactivateUser(userId);
    }

    // Pour l'instant, on utilise le même endpoint pour "suspended" et "blocked".
    // La logique plus fine pourra être ajoutée côté backend plus tard.
    return this.deactivateUser(userId, reason);
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

  async getReports(options?: { status?: string; page?: number; limit?: number }) {
    try {
      const response = await apiClient.get('/admin/reports', {
        params: {
          status: options?.status,
          page: options?.page ?? 1,
          limit: options?.limit ?? 20,
        },
      });
      const data = response.data?.data || response.data || [];
      return Array.isArray(data) ? data : data.items || [];
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

  // Wrapper utilisé par l'écran `reports.tsx`
  async updateReportStatus(payload: {
    reportId: string;
    status: string;
    resolution?: string;
  }) {
    const { reportId, status, resolution } = payload;
    return this.resolveReport(reportId, status, resolution);
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

  /** Commissions par période (semaine / mois / année) pour l'écran commissions */
  async getCommissions(period: 'week' | 'month' | 'year') {
    try {
      const response = await apiClient.get('/admin/commissions', {
        params: { period },
      });
      const data = response.data?.data || response.data;
      return (
        data ?? {
          currentRate: 0,
          totalCollected: 0,
          monthlyTotal: 0,
          details: [],
        }
      );
    } catch (error) {
      throw error;
    }
  }

  /** Mise à jour du taux de commission (pour l'écran commissions) */
  async updateCommissionRate(rate: number) {
    return this.updateCommissionSettings(rate);
  }

  /** Liste des profils avec filtre (pending / approved / rejected) pour l'écran validation */
  async getProfiles(filter: 'pending' | 'approved' | 'rejected') {
    if (filter === 'pending') {
      return this.getPendingProfiles(1, 50);
    }
    try {
      const response = await apiClient.get('/admin/profiles', {
        params: { status: filter },
      });
      const data = response.data?.data || response.data || [];
      return Array.isArray(data) ? data : data.items || [];
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
      const data = response.data?.data || response.data || [];
      return Array.isArray(data) ? data : data.items || [];
    } catch (error) {
      throw error;
    }
  }

  // Moderation methods
  async getModerationItems(type?: string, page: number = 1, limit: number = 10) {
    try {
      const response = await apiClient.get('/admin/moderation', {
        params: { type, page, limit },
      });
      const data = response.data?.data || response.data || [];
      return Array.isArray(data) ? data : data.items || [];
    } catch (error) {
      throw error;
    }
  }

  async approveModerationItem(itemId: string, notes?: string) {
    try {
      const response = await apiClient.post(
        `/admin/moderation/${itemId}/approve`,
        { notes }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async rejectModerationItem(itemId: string, reason: string) {
    try {
      const response = await apiClient.post(
        `/admin/moderation/${itemId}/reject`,
        { reason }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

export const adminService = new AdminService();
