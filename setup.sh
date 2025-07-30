#!/bin/bash

echo "🚀 Setting up TRACKADEMIC..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

print_status "Node.js version: $(node --version)"

# Check if MongoDB is installed
if ! command -v mongod &> /dev/null; then
    print_warning "MongoDB not found. Please install MongoDB or use Docker."
    print_status "You can install MongoDB with: sudo apt-get install mongodb"
    print_status "Or use Docker: docker run -d -p 27017:27017 --name mongodb mongo:latest"
fi

# Clean previous installations
print_status "Cleaning previous installations..."
rm -rf node_modules package-lock.json
rm -rf backend/node_modules backend/package-lock.json

# Install frontend dependencies
print_status "Installing frontend dependencies..."
npm install

if [ $? -ne 0 ]; then
    print_error "Failed to install frontend dependencies"
    exit 1
fi

# Install backend dependencies
print_status "Installing backend dependencies..."
cd backend
npm install

if [ $? -ne 0 ]; then
    print_error "Failed to install backend dependencies"
    exit 1
fi

cd ..

# Create environment file if it doesn't exist
if [ ! -f "backend/.env" ]; then
    print_status "Creating environment file..."
    cp .env.example backend/.env 2>/dev/null || cp backend/.env.example backend/.env 2>/dev/null || echo "MONGODB_URI=mongodb://localhost:27017/trackademic
JWT_SECRET=trackademic-super-secret-jwt-key-2024-development
PORT=3000
NODE_ENV=development" > backend/.env
fi

# Check if MongoDB is running
print_status "Checking MongoDB connection..."
if command -v mongod &> /dev/null; then
    # Try to start MongoDB if it's not running
    sudo systemctl start mongod 2>/dev/null || true
    sudo service mongod start 2>/dev/null || true
fi

print_success "Setup completed! 🎉"
print_status ""
print_status "To start the application:"
print_status "  npm run dev        # Start both frontend and backend"
print_status ""
print_status "Or run separately:"
print_status "  npm run backend    # Start backend only"
print_status "  npm start          # Start frontend only"
print_status "  npm run android    # Run Android app"
print_status ""
print_status "Backend will run on: http://localhost:3000"
print_status "Frontend Metro bundler will run on: http://localhost:8081"
print_status ""
print_warning "Make sure MongoDB is running before starting the backend!"
print_status ""

# Ask if user wants to run the app now
read -p "Would you like to start the app now? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    print_status "Starting TRACKADEMIC..."
    npm run dev
fi