import mongoose, { Document, Schema } from 'mongoose';
import { IStudent } from '../types';

export interface StudentDocument extends IStudent, Document {}

const StudentSchema = new Schema<StudentDocument>({
  user: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true,
    unique: true
  },
  studentId: { 
    type: String, 
    required: true, 
    unique: true 
  },
  classLevel: { 
    type: String, 
    required: true 
  },
  parentId: { 
    type: Schema.Types.ObjectId, 
    ref: 'User'
  },
  grades: [{ 
    type: Schema.Types.ObjectId, 
    ref: 'Grade' 
  }],
  attendance: [{ 
    type: Schema.Types.ObjectId, 
    ref: 'Attendance' 
  }],
  assignments: [{ 
    type: Schema.Types.ObjectId, 
    ref: 'Assignment' 
  }]
}, {
  timestamps: true
});

export const Student = mongoose.model<StudentDocument>('Student', StudentSchema);