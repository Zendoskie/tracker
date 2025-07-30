# TRACKADEMIC 📱

> **Comprehensive Mobile Application for Academic Performance Tracking**

[![React Native](https://img.shields.io/badge/React%20Native-0.80.2-blue.svg)](https://reactnative.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-4.9.4-blue.svg)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-6.0+-green.svg)](https://mongodb.com/)

TRACKADEMIC is a futuristic, dark-themed mobile application designed to revolutionize academic performance tracking. Built with React Native and TypeScript, it provides real-time grade updates, QR code-based attendance tracking, and comprehensive analytics for students, parents, and instructors.

## ✨ Features

### 🎓 For Students
- **QR Code Scanner**: Quick attendance marking by scanning instructor-generated QR codes
- **Real-time Grades**: View grades and performance metrics instantly
- **Assignment Tracking**: Upload assignments and track submission status
- **Performance Analytics**: Visual charts showing academic progress and trends
- **Dark Mode UI**: Futuristic interface with neon accents and smooth animations

### 👨‍👩‍👧‍👦 For Parents
- **Child Monitoring**: Track multiple children's academic performance
- **Attendance Notifications**: Real-time alerts when children arrive at school
- **Performance Reports**: Comprehensive analytics and grade trends
- **Direct Communication**: Stay updated with academic progress

### 👨‍🏫 For Instructors
- **QR Code Generator**: Create time-limited QR codes for attendance tracking
- **Grade Management**: Efficient grade entry and management system
- **Student Analytics**: Monitor class performance and individual progress
- **Assignment Creation**: Create and manage assignments with file attachments
- **Real-time Notifications**: Instant updates when students mark attendance

## 🏗️ Technical Architecture

### Frontend (React Native + TypeScript)
```
src/
├── components/         # Reusable UI components
│   ├── common/        # Shared components
│   ├── charts/        # Data visualization components
│   └── forms/         # Form components
├── screens/           # Screen components
│   ├── auth/          # Authentication screens
│   ├── student/       # Student dashboard screens
│   ├── parent/        # Parent dashboard screens
│   └── instructor/    # Instructor dashboard screens
├── navigation/        # Navigation configuration
├── services/          # API services and utilities
├── store/             # Redux store and slices
├── types/             # TypeScript type definitions
├── utils/             # Utility functions and theme
└── assets/            # Images, fonts, and other assets
```

### Backend (Node.js + Express + TypeScript)
```
backend/src/
├── controllers/       # Route controllers
├── models/           # MongoDB/Mongoose models
├── routes/           # API route definitions
├── middleware/       # Authentication and validation middleware
├── utils/            # Utility functions
└── types/            # TypeScript type definitions
```

### Database Schema
- **Users**: Authentication and profile management
- **Students**: Student-specific data and relationships
- **Grades**: Grade tracking and analytics
- **Attendance**: QR code-based attendance records
- **QR Codes**: Time-limited attendance QR codes
- **Assignments**: Assignment management and submissions

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- React Native development environment
- MongoDB 6.0+
- Android Studio or Xcode for mobile development

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd TRACKADEMIC
   ```

2. **Install dependencies**
   ```bash
   npm run install-all
   ```

3. **Set up environment variables**
   ```bash
   # Create backend/.env file
   cd backend
   cp .env.example .env
   
   # Edit .env with your configuration:
   # MONGODB_URI=mongodb://localhost:27017/trackademic
   # JWT_SECRET=your-secret-key
   # PORT=3000
   ```

4. **Start MongoDB**
   ```bash
   # Using MongoDB service
   sudo service mongod start
   
   # Or using Docker
   docker run -d -p 27017:27017 --name mongodb mongo:latest
   ```

5. **Run the application**
   ```bash
   # Start both frontend and backend
   npm run dev
   
   # Or run separately:
   npm run backend    # Start backend server
   npm start         # Start React Native Metro bundler
   npm run android   # Run on Android
   npm run ios       # Run on iOS
   ```

## 📱 Screenshots

### Login Screen
- Futuristic dark theme with neon cyan accents
- Smooth gradient backgrounds
- Role-based access (Student/Parent/Instructor)

### Student Dashboard
- QR code scanner for attendance
- Real-time grade viewing
- Assignment upload functionality
- Performance analytics with charts

### Instructor Dashboard
- QR code generation for classes
- Student grade management
- Attendance tracking and analytics
- Class roster management

## 🛠️ API Endpoints

### Authentication
```
POST /api/auth/login          # User login
POST /api/auth/register       # User registration
GET  /api/auth/profile        # Get user profile
PUT  /api/auth/profile        # Update user profile
GET  /api/auth/verify         # Verify JWT token
```

### QR Code System
```
POST /api/qr/generate         # Generate QR code (Instructor only)
POST /api/qr/scan             # Scan QR code (Student only)
GET  /api/qr/active           # Get active QR codes
PUT  /api/qr/deactivate/:id   # Deactivate QR code
GET  /api/qr/:id/attendance   # Get attendance for QR code
```

### Student APIs
```
GET  /api/student/dashboard   # Student dashboard data
GET  /api/student/grades      # Student grades
GET  /api/student/attendance  # Student attendance
POST /api/student/assignment/upload  # Upload assignment
```

## 🎨 Design System

### Color Palette
- **Background**: `#0A0A0B` (Deep black)
- **Surface**: `#1A1A1D` (Dark gray)
- **Primary**: `#00F5FF` (Cyan neon)
- **Secondary**: `#7B68EE` (Medium slate blue)
- **Success**: `#00FF7F` (Spring green)
- **Warning**: `#FFD700` (Gold)
- **Error**: `#FF1744` (Red)

### Typography
- **Font Family**: System fonts with fallbacks
- **Sizes**: 12px to 48px scale
- **Weights**: Normal (400) to Bold (700)

### Components
- **Cards**: Rounded corners with subtle shadows and neon borders
- **Buttons**: Gradient backgrounds with glow effects
- **Inputs**: Dark backgrounds with focus glow animations
- **Navigation**: Bottom tabs with role-based color coding

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt for secure password storage
- **Role-Based Access**: Granular permissions for different user types
- **API Rate Limiting**: Protection against abuse
- **Input Validation**: Comprehensive request validation
- **CORS Configuration**: Secure cross-origin resource sharing

## 📊 Performance Analytics

### Student Analytics
- Grade trends and projections
- Attendance rate calculations
- Assignment completion tracking
- Performance comparisons

### Instructor Analytics
- Class performance overviews
- Individual student progress
- Attendance patterns
- Grade distribution charts

### Parent Analytics
- Child performance summaries
- Attendance notifications
- Progress comparisons
- Academic improvement suggestions

## 🔄 Real-time Features

- **Socket.io Integration**: Real-time notifications
- **Live Attendance Updates**: Instant parent notifications
- **Grade Notifications**: Immediate grade update alerts
- **QR Code Expiration**: Time-limited attendance codes

## 🧪 Testing

```bash
# Run frontend tests
npm test

# Run backend tests
cd backend && npm test

# Run linting
npm run lint
```

## 📦 Deployment

### Backend Deployment
```bash
# Build backend
npm run build-backend

# Start production server
npm run start-backend
```

### Mobile App Deployment
```bash
# Build Android APK
cd android && ./gradlew assembleRelease

# Build iOS IPA
cd ios && xcodebuild -workspace TRACKADEMIC.xcworkspace -scheme TRACKADEMIC archive
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📋 TODO / Roadmap

- [ ] Complete all dashboard implementations
- [ ] Add push notifications
- [ ] Implement file upload system
- [ ] Add offline mode support
- [ ] Create admin panel
- [ ] Add data export functionality
- [ ] Implement subscription system
- [ ] Add multi-language support

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

- **Development Team**: TRACKADEMIC Development Team
- **Project Type**: Academic Performance Tracking System
- **Platform**: Cross-platform (iOS & Android)
- **Architecture**: React Native + Node.js + MongoDB

## 📞 Support

For support and questions:
- Create an issue in this repository
- Email: support@trackademic.com
- Documentation: [docs.trackademic.com](https://docs.trackademic.com)

---

**TRACKADEMIC** - *Revolutionizing Academic Performance Tracking* 🚀