// Utilitário para chamadas da API
const API_BASE_URL = 'http://localhost:3001/api';

// Função para obter o token do localStorage
const getToken = () => {
  return localStorage.getItem('authToken');
};

// Função para configurar headers com autenticação
const getAuthHeaders = () => {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  
  return headers;
};

// Função genérica para fazer requisições
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    headers: getAuthHeaders(),
    ...options,
  };

  try {
    const response = await fetch(url, config);
    
    // Se a resposta não é ok, lançar erro
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    // Se é uma requisição DELETE que retorna 204, não tentar fazer parse JSON
    if (response.status === 204) {
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error(`API Error (${endpoint}):`, error);
    throw error;
  }
};

// Funções específicas da API
export const api = {
  // Autenticação
  auth: {
    register: (userData) => apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    }),
    login: (credentials) => apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),
    getProfile: () => apiRequest('/auth/me'),
    updateProfile: (userData) => apiRequest('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(userData),
    }),
    changePassword: (passwordData) => apiRequest('/auth/change-password', {
      method: 'POST',
      body: JSON.stringify(passwordData),
    }),
  },

  // Cursos
  courses: {
    getAll: (params = {}) => {
      const searchParams = new URLSearchParams(params);
      return apiRequest(`/courses?${searchParams}`);
    },
    getById: (id) => apiRequest(`/courses/${id}`),
    create: (courseData) => apiRequest('/courses', {
      method: 'POST',
      body: JSON.stringify(courseData),
    }),
    update: (id, courseData) => apiRequest(`/courses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(courseData),
    }),
    delete: (id) => apiRequest(`/courses/${id}`, {
      method: 'DELETE',
    }),
    getPlatforms: () => apiRequest('/courses/platforms/list'),
    getByUser: (userId) => apiRequest(`/courses/user/${userId}`),
  },

  // Avaliações
  ratings: {
    getAll: (params = {}) => {
      const searchParams = new URLSearchParams(params);
      return apiRequest(`/ratings?${searchParams}`);
    },
    getById: (id) => apiRequest(`/ratings/${id}`),
    getByCourse: (courseId, params = {}) => {
      const searchParams = new URLSearchParams(params);
      return apiRequest(`/ratings/course/${courseId}?${searchParams}`);
    },
    getByUser: (userId, params = {}) => {
      const searchParams = new URLSearchParams(params);
      return apiRequest(`/ratings/user/${userId}?${searchParams}`);
    },
    create: (ratingData) => apiRequest('/ratings', {
      method: 'POST',
      body: JSON.stringify(ratingData),
    }),
    update: (id, ratingData) => apiRequest(`/ratings/${id}`, {
      method: 'PUT',
      body: JSON.stringify(ratingData),
    }),
    delete: (id) => apiRequest(`/ratings/${id}`, {
      method: 'DELETE',
    }),
  },

  // Listas de usuário
  lists: {
    getMy: () => apiRequest('/lists/my'),
    addCourse: (courseId) => apiRequest('/lists/add', {
      method: 'POST',
      body: JSON.stringify({ courseId }),
    }),
    removeCourse: (courseId) => apiRequest(`/lists/remove/${courseId}`, {
      method: 'DELETE',
    }),
    getByUser: (userId) => apiRequest(`/lists/${userId}`),
  },

  // Cupons
  coupons: {
    getMy: () => apiRequest('/coupons/my'),
    create: (couponData) => apiRequest('/coupons', {
      method: 'POST',
      body: JSON.stringify(couponData),
    }),
    validate: (code) => apiRequest(`/coupons/validate/${code}`),
    use: (code) => apiRequest(`/coupons/use/${code}`, {
      method: 'POST',
    }),
    delete: (id) => apiRequest(`/coupons/${id}`, {
      method: 'DELETE',
    }),
  },

  // Usuários
  users: {
    getAll: (params = {}) => {
      const searchParams = new URLSearchParams(params);
      return apiRequest(`/users?${searchParams}`);
    },
    getById: (id) => apiRequest(`/users/${id}`),
  },
};

// Funções auxiliares
export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem('authToken', token);
  } else {
    localStorage.removeItem('authToken');
  }
};

export const clearAuthToken = () => {
  localStorage.removeItem('authToken');
};

export const isAuthenticated = () => {
  return !!getToken();
};

export default api;
