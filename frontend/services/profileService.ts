import apiClient from './apiClient';

export interface Profile {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  description: string;
  age: number;
  location: string;
  photos: string[];
  rating: number;
  reviewCount: number;
  isVerified: boolean;
  rates: {
    hourly: number;
    daily: number;
  };
  availability: string[];
  services: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ProfileFilter {
  minAge?: number;
  maxAge?: number;
  location?: string;
  minRating?: number;
  services?: string[];
  priceRange?: {
    min: number;
    max: number;
  };
}

class ProfileService {
  async getProfiles(filters?: ProfileFilter, page: number = 1, limit: number = 10) {
    try {
      const response = await apiClient.get('/profiles', {
        params: {
          page,
          limit,
          ...filters,
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async getProfileById(profileId: string) {
    try {
      const response = await apiClient.get(`/profiles/${profileId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async updateProfile(profileId: string, data: Partial<Profile>) {
    try {
      const response = await apiClient.put(`/profiles/${profileId}`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async uploadProfilePhotos(profileId: string, photos: string[]) {
    try {
      const formData = new FormData();
      photos.forEach((photo, index) => {
        formData.append(`photos`, {
          uri: photo,
          type: 'image/jpeg',
          name: `profile-${index}.jpg`,
        } as any);
      });

      const response = await apiClient.post(
        `/profiles/${profileId}/photos`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async deleteProfilePhoto(profileId: string, photoUrl: string) {
    try {
      const response = await apiClient.delete(
        `/profiles/${profileId}/photos`,
        {
          data: { photoUrl },
        }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async searchProfiles(query: string) {
    try {
      const response = await apiClient.get('/profiles/search', {
        params: { query },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async getSuggestedProfiles(limit: number = 10) {
    try {
      const response = await apiClient.get('/profiles/suggested', {
        params: { limit },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async getUserStats(userId?: string) {
    try {
      const response = await apiClient.get(`/users/${userId || 'me'}/stats`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async getSecuritySettings(userId?: string) {
    try {
      const response = await apiClient.get(
        `/users/${userId || 'me'}/security-settings`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async changePassword(data: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }) {
    try {
      const response = await apiClient.post('/users/change-password', data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async enable2FA(data: { method: string; verificationCode: string }) {
    try {
      const response = await apiClient.post('/users/2fa/enable', data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

export const profileService = new ProfileService();
