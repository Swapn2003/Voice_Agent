import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for logging
apiClient.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => {
    console.log(`API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('API Response Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export class CaseService {
  
  static async getCases(filters = {}) {
    try {
      const params = new URLSearchParams();
      
      // Add filter parameters if they exist
      if (filters.status) params.append('status', filters.status);
      if (filters.type) params.append('type', filters.type);
      if (filters.owner) params.append('owner', filters.owner);
      if (filters.bank) params.append('bank', filters.bank);
      if (filters.dateFrom) params.append('dateFrom', filters.dateFrom);
      if (filters.dateTo) params.append('dateTo', filters.dateTo);
      
      const response = await apiClient.get(`/cases?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching cases:', error);
      throw new Error('Failed to fetch cases');
    }
  }
  
  static async getCase(caseId) {
    try {
      const response = await apiClient.get(`/cases/${caseId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching case:', error);
      throw new Error('Failed to fetch case');
    }
  }
  
  static async createCase(caseData) {
    try {
      const response = await apiClient.post('/cases', caseData);
      return response.data;
    } catch (error) {
      console.error('Error creating case:', error);
      throw new Error('Failed to create case');
    }
  }
  
  static async updateCase(caseId, caseData) {
    try {
      const response = await apiClient.put(`/cases/${caseId}`, caseData);
      return response.data;
    } catch (error) {
      console.error('Error updating case:', error);
      throw new Error('Failed to update case');
    }
  }
  
  static async emailBank(caseId) {
    try {
      const response = await apiClient.post(`/cases/${caseId}/email`);
      return response.data;
    } catch (error) {
      console.error('Error sending email:', error);
      throw new Error('Failed to send email to bank');
    }
  }
  
  static async uploadEvidence(caseId, file) {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await apiClient.post(`/cases/${caseId}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error uploading evidence:', error);
      throw new Error('Failed to upload evidence');
    }
  }
  
  static async uploadAlertFile(file) {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await apiClient.post('/cases/upload-alert', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error uploading alert file:', error);
      throw new Error('Failed to upload alert file');
    }
  }
}

export default CaseService;



