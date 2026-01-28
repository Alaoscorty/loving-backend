import apiClient from './apiClient';

export interface PaymentIntent {
  clientSecret: string;
  publishableKey: string;
}

export interface PaymentMethod {
  id: string;
  type: string;
  card?: {
    brand: string;
    last4: string;
    expiryMonth: number;
    expiryYear: number;
  };
}

export interface PaymentRequest {
  bookingId: string;
  amount: number;
  paymentMethodId: string;
}

class PaymentService {
  async createPaymentIntent(bookingId: string, amount: number) {
    try {
      const response = await apiClient.post('/payments/intent', {
        bookingId,
        amount,
      });
      return response.data as PaymentIntent;
    } catch (error) {
      throw error;
    }
  }

  async confirmPayment(data: PaymentRequest) {
    try {
      const response = await apiClient.post('/payments/confirm', data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async getPaymentHistory(page: number = 1, limit: number = 10) {
    try {
      const response = await apiClient.get('/payments/history', {
        params: { page, limit },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async getPaymentMethods() {
    try {
      const response = await apiClient.get('/payments/methods');
      return response.data as PaymentMethod[];
    } catch (error) {
      throw error;
    }
  }

  async addPaymentMethod(paymentMethodId: string) {
    try {
      const response = await apiClient.post('/payments/methods', {
        paymentMethodId,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async deletePaymentMethod(methodId: string) {
    try {
      const response = await apiClient.delete(`/payments/methods/${methodId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async refund(paymentId: string, amount?: number) {
    try {
      const response = await apiClient.post(`/payments/${paymentId}/refund`, {
        amount,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

export const paymentService = new PaymentService();
