const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.DEV
    ? 'https://microdos-api-03a4b6586106.herokuapp.com'
    : '/api');

export interface User {
  id: string;
  email: string;
  name: string;
  image?: string;
}

export interface AuthResponse {
  message: string;
  user: User;
}

export interface ApiError {
  error: string;
  message?: string;
  details?: any;
}

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;

    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      credentials: 'include',
      ...options,
    };

    const response = await fetch(url, config);

    if (!response.ok) {
      const error: ApiError = await response.json().catch(() => ({
        error: 'Network error',
        message: 'Failed to connect to server',
      }));
      throw new Error(error.message || error.error || 'Request failed');
    }

    return response.json();
  }

  // Auth endpoints
  async signup(data: {
    email: string;
    password: string;
    name: string;
  }): Promise<AuthResponse> {
    return this.request<AuthResponse>('/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async login(data: {
    email: string;
    password: string;
  }): Promise<AuthResponse> {
    return this.request<AuthResponse>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async logout(): Promise<{ message: string }> {
    return this.request<{ message: string }>('/api/auth/logout', {
      method: 'POST',
    });
  }

  async getMe(): Promise<{ user: User }> {
    return this.request<{ user: User }>('/api/auth/me');
  }

  async getUserProfile(): Promise<{ user: User & { createdAt: string } }> {
    return this.request<{ user: User & { createdAt: string } }>(
      '/api/user/profile'
    );
  }

  async getUserCount(): Promise<{ success: boolean; count: number }> {
    return this.request<{ success: boolean; count: number }>('/api/user/count');
  }

  // Health check
  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    return this.request<{ status: string; timestamp: string }>('/api/health');
  }

  // Microdose endpoints
  async calculateMicrodoseTemporary(params: {
    gender: string;
    weight: number;
    substance: string;
    intakeForm: string;
    sensitivity: number;
    goal: string;
    experience?: string;
    currentMedication?: string;
  }): Promise<{ success: boolean; result: any; tempCalculationId: string }> {
    const sessionId = this.generateSessionId();
    return this.request<{
      success: boolean;
      result: any;
      tempCalculationId: string;
    }>('/api/microdose/calculate-temporary', {
      method: 'POST',
      body: JSON.stringify(params),
      headers: {
        'Content-Type': 'application/json',
        'X-Session-ID': sessionId,
      },
    });
  }

  private generateSessionId(): string {
    return (
      'session_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now()
    );
  }

  async registerWithCalculation(data: {
    email: string;
    name: string;
    password: string;
    tempCalculationId: string;
  }): Promise<{ success: boolean; user: any; profile: any }> {
    return this.request<{ success: boolean; user: any; profile: any }>(
      '/api/microdose/register-with-calculation',
      {
        method: 'POST',
        body: JSON.stringify(data),
      }
    );
  }

  async getTempCalculation(
    id: string
  ): Promise<{ success: boolean; calculation: any }> {
    return this.request<{ success: boolean; calculation: any }>(
      `/api/microdose/temp-calculation/${id}`
    );
  }

  async calculateMicrodose(params: {
    gender: string;
    weight: number;
    substance: string;
    intakeForm: string;
    sensitivity: number;
    goal: string;
    experience?: string;
    currentMedication?: string;
  }): Promise<{ success: boolean; result: any }> {
    return this.request<{ success: boolean; result: any }>(
      '/api/microdose/calculate-temporary',
      {
        method: 'POST',
        body: JSON.stringify(params),
      }
    );
  }

  async saveMicrodoseProfile(params: {
    gender: string;
    weight: number;
    substance: string;
    intakeForm: string;
    sensitivity: number;
    goal: string;
    experience?: string;
    currentMedication?: string;
  }): Promise<{ success: boolean; profile: any; calculation: any }> {
    return this.request<{ success: boolean; profile: any; calculation: any }>(
      '/api/microdose/save-profile',
      {
        method: 'POST',
        body: JSON.stringify(params),
      }
    );
  }

  async getMicrodoseProfile(): Promise<{ success: boolean; profile: any }> {
    return this.request<{ success: boolean; profile: any }>(
      '/api/microdose/profile'
    );
  }

  async getSubstances(): Promise<{ success: boolean; substances: any[] }> {
    return this.request<{ success: boolean; substances: any[] }>(
      '/api/microdose/substances'
    );
  }

  async getActivities(): Promise<{ success: boolean; activities: any[] }> {
    return this.request<{ success: boolean; activities: any[] }>(
      '/api/microdose/activities'
    );
  }

  // Protocol methods
  async createProtocol(data: {
    type: 'fadiman' | 'stamets' | 'custom';
    name: string;
    startDate: string;
    cycleLength: number;
    settings: any;
    notificationSettings: any;
  }): Promise<{ success: boolean; protocol: any; events: any[] }> {
    return this.request<{ success: boolean; protocol: any; events: any[] }>(
      '/api/protocol/create',
      {
        method: 'POST',
        body: JSON.stringify(data),
      }
    );
  }

  async getProtocols(): Promise<{ success: boolean; protocols: any[] }> {
    return this.request<{ success: boolean; protocols: any[] }>(
      '/api/protocol/list'
    );
  }

  async getProtocol(id: string): Promise<{ success: boolean; protocol: any }> {
    return this.request<{ success: boolean; protocol: any }>(
      `/api/protocol/${id}`
    );
  }

  async deleteProtocol(
    id: string
  ): Promise<{ success: boolean; message: string }> {
    return this.request<{ success: boolean; message: string }>(
      `/api/protocol/${id}`,
      {
        method: 'DELETE',
      }
    );
  }

  // Journal methods
  async createJournalEntry(data: {
    eventId: string;
    type: 'intention' | 'reflection' | 'assessment';
    content: any;
  }): Promise<{ success: boolean; journalEntry: any }> {
    return this.request<{ success: boolean; journalEntry: any }>(
      '/api/journal/entry',
      {
        method: 'POST',
        body: JSON.stringify(data),
      }
    );
  }

  async getJournalEntries(
    eventId?: string
  ): Promise<{ success: boolean; entries: any[] }> {
    const url = eventId
      ? `/api/journal/entries/${eventId}`
      : '/api/journal/entries';
    return this.request<{ success: boolean; entries: any[] }>(url);
  }

  async updateJournalEntry(
    id: string,
    data: any
  ): Promise<{ success: boolean; journalEntry: any }> {
    return this.request<{ success: boolean; journalEntry: any }>(
      `/api/journal/entry/${id}`,
      {
        method: 'PUT',
        body: JSON.stringify(data),
      }
    );
  }

  async deleteJournalEntry(
    id: string
  ): Promise<{ success: boolean; message: string }> {
    return this.request<{ success: boolean; message: string }>(
      `/api/journal/entry/${id}`,
      {
        method: 'DELETE',
      }
    );
  }

  async getJournalAnalytics(
    days?: number
  ): Promise<{ success: boolean; analytics: any }> {
    const url = days
      ? `/api/journal/analytics?days=${days}`
      : '/api/journal/analytics';
    return this.request<{ success: boolean; analytics: any }>(url);
  }

  async getAdherenceData(
    days?: number
  ): Promise<{ success: boolean; adherence: any }> {
    const url = days
      ? `/api/journal/adherence?days=${days}`
      : '/api/journal/adherence';
    return this.request<{ success: boolean; adherence: any }>(url);
  }

  // Notification methods
  async getNotifications(
    limit?: number,
    status?: string
  ): Promise<{ success: boolean; notifications: any[] }> {
    const params = new URLSearchParams();
    if (limit) params.append('limit', limit.toString());
    if (status) params.append('status', status);

    const url = `/api/notification/list${
      params.toString() ? `?${params.toString()}` : ''
    }`;
    return this.request<{ success: boolean; notifications: any[] }>(url);
  }

  async getPendingNotifications(): Promise<{
    success: boolean;
    notifications: any[];
  }> {
    return this.request<{ success: boolean; notifications: any[] }>(
      '/api/notification/pending'
    );
  }

  async markNotificationSent(
    notificationId: string
  ): Promise<{ success: boolean; notification: any }> {
    return this.request<{ success: boolean; notification: any }>(
      '/api/notification/mark-sent',
      {
        method: 'POST',
        body: JSON.stringify({ notificationId }),
      }
    );
  }

  async updateNotificationStatus(
    id: string,
    status: string
  ): Promise<{ success: boolean; notification: any }> {
    return this.request<{ success: boolean; notification: any }>(
      `/api/notification/${id}/status`,
      {
        method: 'PUT',
        body: JSON.stringify({ status }),
      }
    );
  }

  async deleteNotification(
    id: string
  ): Promise<{ success: boolean; message: string }> {
    return this.request<{ success: boolean; message: string }>(
      `/api/notification/${id}`,
      {
        method: 'DELETE',
      }
    );
  }

  async cleanupNotifications(
    daysOld?: number
  ): Promise<{ success: boolean; deletedCount: number; message: string }> {
    return this.request<{
      success: boolean;
      deletedCount: number;
      message: string;
    }>('/api/notification/cleanup', {
      method: 'POST',
      body: JSON.stringify({ daysOld }),
    });
  }

  // Feedback methods
  getTopReviews = async (): Promise<Review[]> => {
    return this.request<Review[]>('/api/feedback/reviews/top');
  };

  getReviews = async (params?: {
    page?: number;
    limit?: number;
    sortBy?: 'date' | 'rating';
    sortOrder?: 'asc' | 'desc';
  }): Promise<{
    reviews: Review[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  }> => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.sortBy) searchParams.append('sortBy', params.sortBy);
    if (params?.sortOrder) searchParams.append('sortOrder', params.sortOrder);

    const url = `/api/feedback/reviews${
      searchParams.toString() ? `?${searchParams.toString()}` : ''
    }`;
    return this.request<{
      reviews: Review[];
      pagination: {
        page: number;
        limit: number;
        total: number;
        pages: number;
      };
    }>(url);
  };

  createReview = async (
    data: {
      rating: number;
      comment: string;
    },
    headers?: Record<string, string>
  ): Promise<Review> => {
    return this.request<Review>('/api/feedback/reviews', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: headers || {},
    });
  };

  updateReview = async (
    id: string,
    data: {
      rating?: number;
      comment?: string;
    }
  ): Promise<Review> => {
    return this.request<Review>(`/api/feedback/reviews/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  };

  deleteReview = async (
    id: string,
    headers?: Record<string, string>
  ): Promise<void> => {
    return this.request<void>(`/api/feedback/reviews/${id}`, {
      method: 'DELETE',
      headers: headers || {},
    });
  };

  toggleReviewLike = async (id: string): Promise<{ liked: boolean }> => {
    return this.request<{ liked: boolean }>(
      `/api/feedback/reviews/${id}/like`,
      {
        method: 'POST',
      }
    );
  };

  getSuggestions = async (): Promise<Suggestion[]> => {
    return this.request<Suggestion[]>('/api/feedback/suggestions');
  };

  createSuggestion = async (
    data: {
      title: string;
      description: string;
      category: 'UI/UX' | 'Features' | 'Microdoses' | 'Werbung';
    },
    headers?: Record<string, string>
  ): Promise<Suggestion> => {
    return this.request<Suggestion>('/api/feedback/suggestions', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: headers || {},
    });
  };

  updateSuggestion = async (
    id: string,
    data: {
      title?: string;
      description?: string;
      category?: 'UI/UX' | 'Features' | 'Microdoses' | 'Werbung';
    }
  ): Promise<Suggestion> => {
    return this.request<Suggestion>(`/api/feedback/suggestions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  };

  deleteSuggestion = async (
    id: string,
    headers?: Record<string, string>
  ): Promise<void> => {
    return this.request<void>(`/api/feedback/suggestions/${id}`, {
      method: 'DELETE',
      headers: headers || {},
    });
  };

  toggleSuggestionLike = async (id: string): Promise<{ liked: boolean }> => {
    return this.request<{ liked: boolean }>(
      `/api/feedback/suggestions/${id}/like`,
      {
        method: 'POST',
      }
    );
  };

  // Test method for creating reviews without authentication
  createTestReview = async (data: {
    rating: number;
    comment: string;
  }): Promise<Review> => {
    return this.request<Review>('/api/feedback/test/review', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  };
}

export interface Review {
  id: string;
  userId: string;
  rating: number;
  comment: string;
  createdAt: string;
  user: {
    name: string;
  };
  likes: Array<{ id: string; userId: string }>;
}

export interface Suggestion {
  id: string;
  userId: string;
  title: string;
  description: string;
  category: string;
  createdAt: string;
  likes: Array<{ id: string; userId: string }>;
}

export const apiClient = new ApiClient(API_BASE_URL);
