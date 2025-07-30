import mongoose, { Document, Schema } from 'mongoose';
import { IAttendance } from '../types';

export interface AttendanceDocument extends IAttendance, Document {}

const AttendanceSchema = new Schema<AttendanceDocument>({
  student: { 
    type: Schema.Types.ObjectId, 
    ref: 'Student', 
    required: true 
  },
  instructor: { 
    type: Schema.Types.ObjectId, 
    ref: 'Instructor', 
    required: true 
  },
  class: { 
    type: String, 
    required: true 
  },
  date: { 
    type: Date, 
    required: true,
    default: Date.now
  },
  timeIn: { 
    type: Date 
  },
  timeOut: { 
    type: Date 
  },
  status: { 
    type: String, 
    required: true,
    enum: ['present', 'absent', 'late', 'excused'],
    default: 'absent'
  },
  qrCodeScanned: { 
    type: Boolean, 
    default: false 
  }
}, {
  timestamps: true
});

// Index for better query performance
AttendanceSchema.index({ student: 1, date: 1 });
AttendanceSchema.index({ class: 1, date: 1 });

export const Attendance = mongoose.model<AttendanceDocument>('Attendance', AttendanceSchema);