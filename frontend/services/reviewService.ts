import apiClient from './apiClient';

export interface Review {
  id: string;
  bookingId: string;
  providerId: string;
  userId: string;
  rating: number;
  title: string;
  content: string;
  photos?: string[];
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  updatedAt: string;
}

export interface ReviewRequest {
  bookingId: string;
  providerId: string;
  rating: number;
  title: string;
  content: string;
  photos?: string[];
}

class ReviewService {
  async getProviderReviews(providerId: string, page: number = 1, limit: number = 10) {
    try {
      const response = await apiClient.get(`/reviews/provider/${providerId}`, {
        params: { page, limit },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async createReview(data: ReviewRequest) {
    try {
      const formData = new FormData();
      formData.append('bookingId', data.bookingId);
      formData.append('providerId', data.providerId);
      formData.append('rating', data.rating.toString());
      formData.append('title', data.title);
      formData.append('content', data.content);

      if (data.photos) {
        data.photos.forEach((photo, index) => {
          formData.append(`photos`, {
            uri: photo,
            type: 'image/jpeg',
            name: `review-${index}.jpg`,
          } as any);
        });
      }

      const response = await apiClient.post('/reviews', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async updateReview(reviewId: string, data: Partial<Review>) {
    try {
      const response = await apiClient.put(`/reviews/${reviewId}`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async deleteReview(reviewId: string) {
    try {
      const response = await apiClient.delete(`/reviews/${reviewId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async getUserReviews(page: number = 1, limit: number = 10) {
    try {
      const response = await apiClient.get('/reviews/user', {
        params: { page, limit },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async getReviewStats(providerId: string) {
    try {
      const response = await apiClient.get(
        `/reviews/provider/${providerId}/stats`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

export const reviewService = new ReviewService();
