import mongoose, { Document, Schema } from 'mongoose';
import { IGrade } from '../types';

export interface GradeDocument extends IGrade, Document {}

const GradeSchema = new Schema<GradeDocument>({
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
  subject: { 
    type: String, 
    required: true 
  },
  assignment: { 
    type: String, 
    required: true 
  },
  score: { 
    type: Number, 
    required: true,
    min: 0
  },
  maxScore: { 
    type: Number, 
    required: true,
    min: 1
  },
  gradingPeriod: { 
    type: String, 
    required: true 
  },
  dateGraded: { 
    type: Date, 
    required: true,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for better query performance
GradeSchema.index({ student: 1, subject: 1, gradingPeriod: 1 });

export const Grade = mongoose.model<GradeDocument>('Grade', GradeSchema);