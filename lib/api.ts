    import { Product, Category, Blog, User, Settings, Contact, Newsletter } from './types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Get auth token from localStorage
const getToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
};

// API request helper
const apiRequest = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const token = getToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'API request failed');
  }

  return data;
};

// Auth API
export const authAPI = {
  register: (userData: { name: string; email: string; password: string }) =>
    apiRequest<{ token: string; user: User }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    }),

  login: (credentials: { email: string; password: string }) =>
    apiRequest<{ token: string; user: User }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),

  forgotPassword: (email: string) =>
    apiRequest('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    }),

  resetPassword: (token: string, password: string) =>
    apiRequest('/auth/reset-password/' + token, {
      method: 'PUT',
      body: JSON.stringify({ password }),
    }),

  getMe: () => apiRequest<{ user: User }>('/auth/me'),

  updateProfile: (userData: Partial<User>) =>
    apiRequest<{ user: User }>('/auth/me', {
      method: 'PUT',
      body: JSON.stringify(userData),
    }),
};

// Products API
export const productsAPI = {
  getAll: (params?: {
    page?: number;
    limit?: number;
    category?: string;
    search?: string;
    tag?: string;
    sort?: string;
  }) => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.category) searchParams.append('category', params.category);
    if (params?.search) searchParams.append('search', params.search);
    if (params?.tag) searchParams.append('tag', params.tag);
    if (params?.sort) searchParams.append('sort', params.sort);

    return apiRequest<{
      products: Product[];
      total: number;
      page: number;
      pages: number;
    }>(`/products?${searchParams.toString()}`);
  },

  getFeatured: () =>
    apiRequest<{ products: Product[] }>('/products/featured'),

  getBySlug: (slug: string) =>
    apiRequest<{ product: Product }>(`/products/${slug}`),

  getRelated: (id: string) =>
    apiRequest<{ products: Product[] }>(`/products/related/${id}`),

  click: (id: string) => apiRequest(`/products/click/${id}`),
};

// Categories API
export const categoriesAPI = {
  getAll: () => apiRequest<{ categories: Category[] }>('/categories'),

  getBySlug: (slug: string) =>
    apiRequest<{ category: Category }>(`/categories/${slug}`),
};

// Blogs API
export const blogsAPI = {
  getAll: (params?: {
    page?: number;
    limit?: number;
    category?: string;
    search?: string;
    tag?: string;
  }) => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.category) searchParams.append('category', params.category);
    if (params?.search) searchParams.append('search', params.search);
    if (params?.tag) searchParams.append('tag', params.tag);

    return apiRequest<{
      blogs: Blog[];
      total: number;
      page: number;
      pages: number;
    }>(`/blogs?${searchParams.toString()}`);
  },

  getFeatured: () => apiRequest<{ blogs: Blog[] }>('/blogs/featured'),

  getBySlug: (slug: string) =>
    apiRequest<{ blog: Blog }>(`/blogs/${slug}`),

  addComment: (id: string, content: string) =>
    apiRequest(`/blogs/${id}/comments`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    }),
};

// Newsletter API
export const newsletterAPI = {
  subscribe: (email: string) =>
    apiRequest<{ message: string }>('/newsletter', {
      method: 'POST',
      body: JSON.stringify({ email }),
    }),

  unsubscribe: (email: string) =>
    apiRequest<{ message: string }>('/newsletter/unsubscribe', {
      method: 'PUT',
      body: JSON.stringify({ email }),
    }),
};

// Contact API
export const contactAPI = {
  submit: (contactData: {
    name: string;
    email: string;
    subject: string;
    message: string;
  }) =>
    apiRequest<{ message: string; contact: Contact }>('/contact', {
      method: 'POST',
      body: JSON.stringify(contactData),
    }),
};

// Settings API
export const settingsAPI = {
  get: () => apiRequest<{ settings: Settings }>('/settings'),
};

// User API
export const userAPI = {
  saveProduct: (productId: string) =>
    apiRequest(`/users/save-product/${productId}`, {
      method: 'POST',
    }),

  removeSavedProduct: (productId: string) =>
    apiRequest(`/users/save-product/${productId}`, {
      method: 'DELETE',
    }),

  getSavedProducts: () =>
    apiRequest<{ products: Product[] }>('/users/saved-products'),
};

export default {
  authAPI,
  productsAPI,
  categoriesAPI,
  blogsAPI,
  newsletterAPI,
  contactAPI,
  settingsAPI,
  userAPI,
};