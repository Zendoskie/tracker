import express from 'express';
import QRCodeLib from 'qrcode';
import { v4 as uuidv4 } from 'uuid';
import { QRCode } from '../models/QRCode';
import { Attendance } from '../models/Attendance';
import { Student } from '../models/Student';
import { authenticate, authorize, AuthRequest } from '../middleware/auth';

const router = express.Router();

// Generate QR Code (Instructor only)
router.post('/generate', authenticate, authorize(['instructor']), async (req: AuthRequest, res) => {
  try {
    const { className, duration = 30 } = req.body; // duration in minutes

    if (!req.user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    // Deactivate existing QR codes for this class
    await QRCode.updateMany(
      { instructor: req.user._id, class: className, isActive: true },
      { isActive: false }
    );

    // Generate unique code
    const code = uuidv4();
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + duration);

    // Create QR code record
    const qrCodeRecord = new QRCode({
      instructor: req.user._id,
      class: className,
      code,
      expiresAt,
      isActive: true
    });

    await qrCodeRecord.save();

    // Generate QR code image
    const qrCodeDataURL = await QRCodeLib.toDataURL(code, {
      width: 300,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    });

    res.json({
      message: 'QR Code generated successfully',
      qrCode: {
        id: qrCodeRecord._id,
        code,
        dataURL: qrCodeDataURL,
        expiresAt,
        className,
        duration
      }
    });
  } catch (error) {
    console.error('QR generation error:', error);
    res.status(500).json({ message: 'Failed to generate QR code', error: (error as Error).message });
  }
});

// Scan QR Code (Student only)
router.post('/scan', authenticate, authorize(['student']), async (req: AuthRequest, res) => {
  try {
    const { code } = req.body;

    if (!req.user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    // Find the QR code
    const qrCodeRecord = await QRCode.findOne({ 
      code, 
      isActive: true,
      expiresAt: { $gt: new Date() }
    }).populate('instructor');

    if (!qrCodeRecord) {
      return res.status(400).json({ message: 'Invalid or expired QR code' });
    }

    // Find student record
    const student = await Student.findOne({ user: req.user._id });
    if (!student) {
      return res.status(400).json({ message: 'Student record not found' });
    }

    // Check if student already scanned this QR code
    if (qrCodeRecord.scannedBy.includes(student._id as any)) {
      return res.status(400).json({ message: 'You have already marked attendance for this class' });
    }

    const now = new Date();
    const timeIn = now;

    // Create attendance record
    const attendance = new Attendance({
      student: student._id,
      instructor: qrCodeRecord.instructor,
      class: qrCodeRecord.class,
      date: now,
      timeIn,
      status: 'present',
      qrCodeScanned: true
    });

    await attendance.save();

    // Add student to scanned list
    qrCodeRecord.scannedBy.push(student._id as any);
    await qrCodeRecord.save();

    // Emit real-time notification to instructor and parent
    const io = req.app.get('io');
    
    // Notify instructor
    io.to(qrCodeRecord.instructor.toString()).emit('attendance_marked', {
      studentName: `${req.user.profile.firstName} ${req.user.profile.lastName}`,
      studentId: student.studentId,
      className: qrCodeRecord.class,
      timeIn,
      status: 'present'
    });

    // Notify parent if exists
    if (student.parentId) {
      io.to(student.parentId.toString()).emit('student_attendance', {
        studentName: `${req.user.profile.firstName} ${req.user.profile.lastName}`,
        className: qrCodeRecord.class,
        timeIn,
        status: 'present',
        message: `${req.user.profile.firstName} has arrived at ${qrCodeRecord.class}`
      });
    }

    res.json({
      message: 'Attendance marked successfully',
      attendance: {
        class: qrCodeRecord.class,
        timeIn,
        status: 'present'
      }
    });
  } catch (error) {
    console.error('QR scan error:', error);
    res.status(500).json({ message: 'Failed to scan QR code', error: (error as Error).message });
  }
});

// Get active QR codes for instructor
router.get('/active', authenticate, authorize(['instructor']), async (req: AuthRequest, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const activeQRCodes = await QRCode.find({
      instructor: req.user._id,
      isActive: true,
      expiresAt: { $gt: new Date() }
    }).populate('scannedBy', 'studentId profile');

    res.json(activeQRCodes);
  } catch (error) {
    console.error('QR fetch error:', error);
    res.status(500).json({ message: 'Failed to fetch QR codes', error: (error as Error).message });
  }
});

// Deactivate QR code
router.put('/deactivate/:qrId', authenticate, authorize(['instructor']), async (req: AuthRequest, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const qrCodeRecord = await QRCode.findOne({
      _id: req.params.qrId,
      instructor: req.user._id
    });

    if (!qrCodeRecord) {
      return res.status(404).json({ message: 'QR code not found' });
    }

    qrCodeRecord.isActive = false;
    await qrCodeRecord.save();

    res.json({ message: 'QR code deactivated successfully' });
  } catch (error) {
    console.error('QR deactivation error:', error);
    res.status(500).json({ message: 'Failed to deactivate QR code', error: (error as Error).message });
  }
});

// Get attendance by QR code (for instructors to see who scanned)
router.get('/:qrId/attendance', authenticate, authorize(['instructor']), async (req: AuthRequest, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const qrCodeRecord = await QRCode.findOne({
      _id: req.params.qrId,
      instructor: req.user._id
    }).populate({
      path: 'scannedBy',
      populate: {
        path: 'user',
        select: 'profile'
      }
    });

    if (!qrCodeRecord) {
      return res.status(404).json({ message: 'QR code not found' });
    }

    const attendanceRecords = await Attendance.find({
      instructor: req.user._id,
      class: qrCodeRecord.class,
      date: { 
        $gte: new Date(qrCodeRecord.createdAt.toDateString()),
        $lt: new Date(new Date(qrCodeRecord.createdAt).setDate(qrCodeRecord.createdAt.getDate() + 1))
      }
    }).populate({
      path: 'student',
      populate: {
        path: 'user',
        select: 'profile'
      }
    });

    res.json({
      qrCode: qrCodeRecord,
      attendance: attendanceRecords
    });
  } catch (error) {
    console.error('Attendance fetch error:', error);
    res.status(500).json({ message: 'Failed to fetch attendance', error: (error as Error).message });
  }
});

export default router;