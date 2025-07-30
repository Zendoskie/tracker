import mongoose, { Document, Schema } from 'mongoose';
import { IQRCode } from '../types';

export interface QRCodeDocument extends IQRCode, Document {}

const QRCodeSchema = new Schema<QRCodeDocument>({
  instructor: { 
    type: Schema.Types.ObjectId, 
    ref: 'Instructor', 
    required: true 
  },
  class: { 
    type: String, 
    required: true 
  },
  code: { 
    type: String, 
    required: true,
    unique: true
  },
  expiresAt: { 
    type: Date, 
    required: true 
  },
  isActive: { 
    type: Boolean, 
    default: true 
  },
  scannedBy: [{ 
    type: Schema.Types.ObjectId, 
    ref: 'Student' 
  }]
}, {
  timestamps: true
});

// Auto-expire QR codes
QRCodeSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const QRCode = mongoose.model<QRCodeDocument>('QRCode', QRCodeSchema);