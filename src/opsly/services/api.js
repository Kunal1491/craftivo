// Opsly API Client Services

const BASE_URL = 'http://localhost:5000/api';

const getHeaders = () => {
  const headers = {
    'Content-Type': 'application/json',
  };
  const token = localStorage.getItem('opsly_token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

const handleResponse = async (response) => {
  if (!response.ok) {
    let errorMessage = `HTTP error! status: ${response.status}`;
    try {
      const errData = await response.json();
      errorMessage = errData.error?.message || errData.message || errorMessage;
    } catch (e) {
      // Ignore JSON parsing errors for raw status messages
    }
    throw new Error(errorMessage);
  }
  return response.json();
};

export const api = {
  // Auth
  login: async (email, role) => {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ email, role })
    });
    return handleResponse(res);
  },

  getCurrentUser: async () => {
    const res = await fetch(`${BASE_URL}/auth/me`, {
      headers: getHeaders()
    });
    return handleResponse(res);
  },

  // Customers
  getCustomers: async () => {
    const res = await fetch(`${BASE_URL}/customers`, {
      headers: getHeaders()
    });
    return handleResponse(res);
  },

  getCustomerById: async (id) => {
    const res = await fetch(`${BASE_URL}/customers/${id}`, {
      headers: getHeaders()
    });
    return handleResponse(res);
  },

  createCustomer: async (customerData) => {
    const res = await fetch(`${BASE_URL}/customers`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(customerData)
    });
    return handleResponse(res);
  },

  updateCustomer: async (id, customerData) => {
    const res = await fetch(`${BASE_URL}/customers/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(customerData)
    });
    return handleResponse(res);
  },

  deleteCustomer: async (id) => {
    const res = await fetch(`${BASE_URL}/customers/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    return handleResponse(res);
  },

  // Projects
  getProjects: async () => {
    const res = await fetch(`${BASE_URL}/projects`, {
      headers: getHeaders()
    });
    return handleResponse(res);
  },

  getProjectById: async (id) => {
    const res = await fetch(`${BASE_URL}/projects/${id}`, {
      headers: getHeaders()
    });
    return handleResponse(res);
  },

  createProject: async (projectData) => {
    const res = await fetch(`${BASE_URL}/projects`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(projectData)
    });
    return handleResponse(res);
  },

  updateProject: async (id, projectData) => {
    const res = await fetch(`${BASE_URL}/projects/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(projectData)
    });
    return handleResponse(res);
  },

  deleteProject: async (id) => {
    const res = await fetch(`${BASE_URL}/projects/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    return handleResponse(res);
  },

  updateMilestone: async (milestoneId, status) => {
    const res = await fetch(`${BASE_URL}/projects/milestones/${milestoneId}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ status })
    });
    return handleResponse(res);
  },

  // Tasks
  getTasks: async () => {
    const res = await fetch(`${BASE_URL}/tasks`, {
      headers: getHeaders()
    });
    return handleResponse(res);
  },

  createTask: async (taskData) => {
    const res = await fetch(`${BASE_URL}/tasks`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(taskData)
    });
    return handleResponse(res);
  },

  updateTask: async (id, taskData) => {
    const res = await fetch(`${BASE_URL}/tasks/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(taskData)
    });
    return handleResponse(res);
  },

  deleteTask: async (id) => {
    const res = await fetch(`${BASE_URL}/tasks/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    return handleResponse(res);
  },

  // Invoices
  getInvoices: async () => {
    const res = await fetch(`${BASE_URL}/invoices`, {
      headers: getHeaders()
    });
    return handleResponse(res);
  },

  createInvoice: async (invoiceData) => {
    const res = await fetch(`${BASE_URL}/invoices`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(invoiceData)
    });
    return handleResponse(res);
  },

  updateInvoiceStatus: async (id, status) => {
    const res = await fetch(`${BASE_URL}/invoices/${id}/status`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ status })
    });
    return handleResponse(res);
  },

  // Activities
  getActivities: async () => {
    const res = await fetch(`${BASE_URL}/activities`, {
      headers: getHeaders()
    });
    return handleResponse(res);
  },

  // Notifications
  getNotifications: async () => {
    const res = await fetch(`${BASE_URL}/notifications`, {
      headers: getHeaders()
    });
    return handleResponse(res);
  },

  markNotificationRead: async (id) => {
    const res = await fetch(`${BASE_URL}/notifications/${id}/read`, {
      method: 'PUT',
      headers: getHeaders()
    });
    return handleResponse(res);
  },

  markAllNotificationsRead: async () => {
    const res = await fetch(`${BASE_URL}/notifications/read-all`, {
      method: 'POST',
      headers: getHeaders()
    });
    return handleResponse(res);
  },

  // Ask Opsly AI
  askAI: async (prompt) => {
    const res = await fetch(`${BASE_URL}/ai/ask`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ prompt })
    });
    return handleResponse(res);
  }
};
export default api;
