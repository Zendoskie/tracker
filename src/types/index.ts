export interface User {
  id: string;
  email: string;
  userType: 'student' | 'parent' | 'instructor';
  profile: UserProfile;
}

export interface UserProfile {
  firstName: string;
  lastName: string;
  phone?: string;
  avatar?: string;
}

export interface Student {
  id: string;
  user: string;
  studentId: string;
  classLevel: string;
  parentId?: string;
  grades: Grade[];
  attendance: Attendance[];
  assignments: Assignment[];
}

export interface Grade {
  id: string;
  student: string;
  instructor: string;
  subject: string;
  assignment: string;
  score: number;
  maxScore: number;
  gradingPeriod: string;
  dateGraded: string;
}

export interface Assignment {
  id: string;
  title: string;
  description: string;
  subject: string;
  instructor: string;
  dueDate: string;
  maxScore: number;
  attachments?: string[];
  submissions?: Submission[];
}

export interface Submission {
  id: string;
  assignment: string;
  student: string;
  files: string[];
  submittedAt: string;
  grade?: Grade;
  feedback?: string;
}

export interface Attendance {
  id: string;
  student: string;
  instructor: string;
  class: string;
  date: string;
  timeIn?: string;
  timeOut?: string;
  status: 'present' | 'absent' | 'late' | 'excused';
  qrCodeScanned: boolean;
}

export interface QRCodeData {
  id: string;
  instructor: string;
  class: string;
  code: string;
  expiresAt: string;
  isActive: boolean;
  scannedBy: string[];
  dataURL?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export interface AppState {
  auth: AuthState;
  student?: StudentState;
  parent?: ParentState;
  instructor?: InstructorState;
}

export interface StudentState {
  grades: Grade[];
  attendance: Attendance[];
  assignments: Assignment[];
  notifications: Notification[];
  loading: boolean;
}

export interface ParentState {
  children: Student[];
  notifications: Notification[];
  loading: boolean;
}

export interface InstructorState {
  classes: string[];
  students: Student[];
  qrCodes: QRCodeData[];
  notifications: Notification[];
  loading: boolean;
}

export interface Notification {
  id: string;
  recipient: string;
  type: 'attendance' | 'grade' | 'assignment' | 'general';
  title: string;
  message: string;
  read: boolean;
  data?: any;
  createdAt: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  userType: 'student' | 'parent' | 'instructor';
  profile: UserProfile;
  studentId?: string;
  classLevel?: string;
  parentId?: string;
}

export interface DashboardStats {
  totalGrades: number;
  averageGrade: number;
  attendanceRate: number;
  pendingAssignments: number;
}

export interface PerformanceData {
  labels: string[];
  datasets: {
    data: number[];
    color?: () => string;
  }[];
}