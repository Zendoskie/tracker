export interface IUser {
  _id: string;
  email: string;
  password: string;
  userType: 'student' | 'parent' | 'instructor';
  profile: IProfile;
  createdAt: Date;
  updatedAt: Date;
}

export interface IProfile {
  firstName: string;
  lastName: string;
  phone?: string;
  avatar?: string;
}

export interface IStudent {
  _id: string;
  user: string; // User ID
  studentId: string;
  classLevel: string;
  parentId?: string; // Parent User ID
  grades: IGrade[];
  attendance: IAttendance[];
  assignments: IAssignment[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IParent {
  _id: string;
  user: string; // User ID
  children: string[]; // Student IDs
  createdAt: Date;
  updatedAt: Date;
}

export interface IInstructor {
  _id: string;
  user: string; // User ID
  employeeId: string;
  department: string;
  subjects: string[];
  classes: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IGrade {
  _id: string;
  student: string; // Student ID
  instructor: string; // Instructor ID
  subject: string;
  assignment: string;
  score: number;
  maxScore: number;
  gradingPeriod: string;
  dateGraded: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface IAssignment {
  _id: string;
  title: string;
  description: string;
  subject: string;
  instructor: string; // Instructor ID
  dueDate: Date;
  maxScore: number;
  attachments?: string[];
  submissions?: ISubmission[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ISubmission {
  _id: string;
  assignment: string; // Assignment ID
  student: string; // Student ID
  files: string[];
  submittedAt: Date;
  grade?: IGrade;
  feedback?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IAttendance {
  _id: string;
  student: string; // Student ID
  instructor: string; // Instructor ID
  class: string;
  date: Date;
  timeIn?: Date;
  timeOut?: Date;
  status: 'present' | 'absent' | 'late' | 'excused';
  qrCodeScanned: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IQRCode {
  _id: string;
  instructor: string; // Instructor ID
  class: string;
  code: string;
  expiresAt: Date;
  isActive: boolean;
  scannedBy: string[]; // Student IDs
  createdAt: Date;
  updatedAt: Date;
}

export interface INotification {
  _id: string;
  recipient: string; // User ID
  type: 'attendance' | 'grade' | 'assignment' | 'general';
  title: string;
  message: string;
  read: boolean;
  data?: any;
  createdAt: Date;
  updatedAt: Date;
}