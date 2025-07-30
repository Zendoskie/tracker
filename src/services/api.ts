import axios, { AxiosInstance, AxiosResponse } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LoginCredentials, RegisterData, User, QRCodeData } from '../types';

// Base configuration
const BASE_URL = __DEV__ ? 'http://localhost:3000/api' : 'https://your-production-api.com/api';

class APIService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor to add auth token
    this.api.interceptors.request.use(
      async (config) => {
        const token = await AsyncStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor for error handling
    this.api.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          // Token expired, clear storage
          await AsyncStorage.multiRemove(['token', 'user']);
        }
        return Promise.reject(error);
      }
    );
  }

  // Generic request method
  private async request<T>(
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    url: string,
    data?: any
  ): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.api.request({
        method,
        url,
        data,
      });
      return response.data;
    } catch (error: any) {
      throw error;
    }
  }

  // Authentication API
  async login(credentials: LoginCredentials) {
    return this.request<{ token: string; user: User; message: string }>('POST', '/auth/login', credentials);
  }

  async register(userData: RegisterData) {
    return this.request<{ token: string; user: User; message: string }>('POST', '/auth/register', userData);
  }

  async verifyToken(token: string) {
    return this.request<{ valid: boolean; user: User }>('GET', '/auth/verify');
  }

  async getProfile() {
    return this.request<User>('GET', '/auth/profile');
  }

  async updateProfile(profileData: Partial<User>) {
    return this.request<{ user: User; message: string }>('PUT', '/auth/profile', profileData);
  }

  // QR Code API
  async generateQRCode(className: string, duration?: number) {
    return this.request<{ 
      qrCode: QRCodeData & { dataURL: string }; 
      message: string 
    }>('POST', '/qr/generate', { className, duration });
  }

  async scanQRCode(code: string) {
    return this.request<{ 
      attendance: any; 
      message: string 
    }>('POST', '/qr/scan', { code });
  }

  async getActiveQRCodes() {
    return this.request<QRCodeData[]>('GET', '/qr/active');
  }

  async deactivateQRCode(qrId: string) {
    return this.request<{ message: string }>('PUT', `/qr/deactivate/${qrId}`);
  }

  async getQRAttendance(qrId: string) {
    return this.request<{ qrCode: QRCodeData; attendance: any[] }>('GET', `/qr/${qrId}/attendance`);
  }

  // Student API
  async getStudentDashboard() {
    return this.request<any>('GET', '/student/dashboard');
  }

  async getStudentGrades() {
    return this.request<any>('GET', '/student/grades');
  }

  async getStudentAttendance() {
    return this.request<any>('GET', '/student/attendance');
  }

  async uploadAssignment(assignmentData: FormData) {
    return this.request<any>('POST', '/student/assignment/upload');
  }

  // Parent API
  async getParentDashboard() {
    return this.request<any>('GET', '/parent/dashboard');
  }

  async getChildrenPerformance() {
    return this.request<any>('GET', '/parent/children/performance');
  }

  async getChildrenAttendance() {
    return this.request<any>('GET', '/parent/children/attendance');
  }

  // Instructor API
  async getInstructorDashboard() {
    return this.request<any>('GET', '/instructor/dashboard');
  }

  async manageGrades(gradeData: any) {
    return this.request<any>('POST', '/instructor/grades', gradeData);
  }

  async getClassStudents(classId: string) {
    return this.request<any>('GET', `/instructor/class/${classId}/students`);
  }

  async createAssignment(assignmentData: any) {
    return this.request<any>('POST', '/instructor/assignments', assignmentData);
  }

  // Health check
  async healthCheck() {
    return this.request<{ status: string; timestamp: string }>('GET', '/health');
  }
}

// Create and export API instances
export const apiService = new APIService();

// Export specific API groups for easier imports
export const authAPI = {
  login: (credentials: LoginCredentials) => apiService.login(credentials),
  register: (userData: RegisterData) => apiService.register(userData),
  verifyToken: (token: string) => apiService.verifyToken(token),
  getProfile: () => apiService.getProfile(),
  updateProfile: (profileData: Partial<User>) => apiService.updateProfile(profileData),
};

export const qrAPI = {
  generate: (className: string, duration?: number) => apiService.generateQRCode(className, duration),
  scan: (code: string) => apiService.scanQRCode(code),
  getActive: () => apiService.getActiveQRCodes(),
  deactivate: (qrId: string) => apiService.deactivateQRCode(qrId),
  getAttendance: (qrId: string) => apiService.getQRAttendance(qrId),
};

export const studentAPI = {
  getDashboard: () => apiService.getStudentDashboard(),
  getGrades: () => apiService.getStudentGrades(),
  getAttendance: () => apiService.getStudentAttendance(),
  uploadAssignment: (data: FormData) => apiService.uploadAssignment(data),
};

export const parentAPI = {
  getDashboard: () => apiService.getParentDashboard(),
  getChildrenPerformance: () => apiService.getChildrenPerformance(),
  getChildrenAttendance: () => apiService.getChildrenAttendance(),
};

export const instructorAPI = {
  getDashboard: () => apiService.getInstructorDashboard(),
  manageGrades: (data: any) => apiService.manageGrades(data),
  getClassStudents: (classId: string) => apiService.getClassStudents(classId),
  createAssignment: (data: any) => apiService.createAssignment(data),
};

export default apiService;