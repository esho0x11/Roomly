# 🏠 Roomly - Room Booking Platform

A full-stack web application for discovering, booking, and managing room reservations. Roomly provides a seamless experience for users to explore available rooms, make bookings, leave reviews, and manage their profiles.

This version also includes an admin login flow, booking approval workflow, ID verification, profile avatar uploads, and admin-only role management.

---

## ✨ Features

### User Features
- **User Authentication**: Secure sign-up and login with JWT tokens and bcrypt password hashing
- **Room Discovery**: Browse and search for available rooms with detailed information
- **Room Details**: View comprehensive room information including descriptions, prices, and amenities
- **Room Booking**: Book rooms with date selection and booking status tracking
- **Reviews & Ratings**: Leave reviews and ratings for rooms you've booked
- **User Dashboard**: Manage your bookings, reviews, and profile information
- **Document Upload**: Upload front and back ID images for booking verification
- **Profile Settings**: Edit profile details and upload a profile avatar
- **Approval Status**: See booking state as Under Review, Confirmed, or Rejected

### Room Management
- **Room Listings**: Browse all available rooms with filtering options
- **Room Details**: View room specifications, pricing, and availability
- **Booking Management**: Track all bookings with status updates and admin approval control

### Admin Capabilities
- **Admin Login**: Dedicated admin sign-in page at `/admin`
- **Role Management**: Promote or demote users from the dashboard
- **Admin Restrictions**: Only the main `.env` admin account can change user roles
- **Booking Review**: Approve or reject bookings after checking uploaded ID documents
- **Room Seeding**: Pre-populate database with sample rooms
- **User Management**: Manage user accounts and permissions

---

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js (REST API)
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens) + bcryptjs
- **File Upload**: Multer
- **CORS**: Cross-Origin Resource Sharing
- **Development**: Nodemon for hot reloading

### Frontend
- **Library**: React 18
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **Styling**: CSS
- **Build Tool**: React Scripts

---

## 📁 Project Structure

```
roomly-project/
├── backend/                          # Express API Server
│   ├── config/
│   │   └── db.js                    # MongoDB connection
│   ├── controllers/                 # Business logic
│   │   ├── authController.js        # Authentication
│   │   ├── adminAuthController.js   # Admin login
│   │   ├── bookingController.js     # Booking management
│   │   ├── documentController.js    # Document uploads
│   │   ├── reviewController.js      # Reviews & ratings
│   │   ├── roomController.js        # Room operations
│   │   └── userController.js        # User management
│   ├── middlewares/
│   │   ├── authMiddleware.js        # JWT verification
│   │   └── logging.js               # Request logging
│   ├── models/                      # Mongoose schemas
│   │   ├── Booking.js
│   │   ├── Document.js
│   │   ├── Review.js
│   │   ├── Room.js
│   │   └── User.js
│   ├── routes/                      # API endpoints
│   │   ├── authRoutes.js
│   │   ├── adminRoutes.js
│   │   ├── bookingRoutes.js
│   │   ├── documentRoutes.js
│   │   ├── reviewRoutes.js
│   │   ├── roomRoutes.js
│   │   └── userRoutes.js
│   ├── scripts/
│   │   └── seedRooms.js             # Database seeding
│   ├── uploads/                     # User file uploads
│   ├── index.js                     # Server entry point
│   └── package.json
│
├── frontend/                         # React Application
│   ├── src/
│   │   ├── components/              # Reusable UI components
│   │   │   ├── Footer.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── ProtectedRoute.jsx   # Auth protection
│   │   │   └── RoomCard.jsx
│   │   ├── pages/                   # Page components
│   │   │   ├── HomePage.jsx         # Landing page
│   │   │   ├── ExplorePage.jsx      # Room listing
│   │   │   ├── RoomDetailPage.jsx   # Room details
│   │   │   ├── BookingPage.jsx      # Booking form
│   │   │   ├── DashboardPage.jsx    # User dashboard
│   │   │   ├── AuthPage.jsx         # Login/Signup
│   │   │   ├── AdminPage.jsx        # Admin login page
│   │   │   ├── AboutPage.jsx        # About page
│   │   │   └── NotFoundPage.jsx     # 404 page
│   │   ├── context/
│   │   │   └── AuthContext.jsx      # Global auth state
│   │   ├── hooks/                   # Custom React hooks
│   │   ├── App.jsx                  # Root component
│   │   ├── index.js                 # React entry point
│   │   └── index.css                # Global styles
│   ├── public/
│   │   └── index.html
│   ├── build/                       # Production build
│   └── package.json
│
└── README.md                        # This file
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v14 or higher)
- **npm** or **yarn**
- **MongoDB** (local or cloud instance like MongoDB Atlas)

### Installation

#### 1. Clone the repository
```bash
git clone <repository-url>
cd roomly-project
```

#### 2. Backend Setup
```bash
cd backend

# Install dependencies
npm install

# Create .env file with required variables
cp .env.example .env  # (if available, otherwise create manually)

# Configure .env with your values (see Environment Variables section below)
```

#### 3. Frontend Setup
```bash
cd ../frontend

# Install dependencies
npm install

# The frontend is configured to proxy to http://localhost:5000 for API calls
```

---

## 🔧 Environment Variables

Create a `.env` file in the `backend/` directory with the following variables:

```env
PORT=5000
MONGODB_URI=mongodb://username:password@host:27017/roomly

JWT_SECRET=your_jwt_secret_key_here
ADMIN_PANEL_EMAIL=admin@roomly.local
ADMIN_PANEL_PASSWORD=your_admin_password

# Optional: file upload settings are handled in code
```

Notes:
- `ADMIN_PANEL_EMAIL` and `ADMIN_PANEL_PASSWORD` are used for the dedicated `/admin` login.
- Users promoted to admin can sign in through `/admin`, but only the main `.env` admin account can promote or demote users.

---

## ▶️ Running the Project

### Option 1: Run Both Servers Separately

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```
Server will run on `http://localhost:5000`

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```
Frontend will run on `http://localhost:3000`

### Option 2: Development Mode with Scripts

```bash
# Backend with hot reload
cd backend
npm run dev

# Frontend (in another terminal)
cd frontend
npm start
```

### Production Build

```bash
# Build the frontend
cd frontend
npm run build

# Run backend in production
cd backend
npm start
```

---

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current authenticated user
- `POST /api/admin/login` - Admin login

### Rooms
- `GET /api/rooms` - Get all rooms
- `GET /api/rooms/:id` - Get room details
- `POST /api/rooms` - Create room (admin)
- `PUT /api/rooms/:id` - Update room
- `DELETE /api/rooms/:id` - Delete room

### Bookings
- `POST /api/bookings` - Create booking
- `GET /api/bookings` - Get user bookings
- `GET /api/bookings/my` - Get current user's bookings
- `GET /api/bookings` - Get all bookings (admin)
- `GET /api/bookings/:id` - Get booking details
- `PATCH /api/bookings/:id/approve` - Approve booking (admin)
- `PATCH /api/bookings/:id/reject` - Reject booking (admin)
- `DELETE /api/bookings/:id` - Cancel booking

### Reviews
- `POST /api/reviews` - Leave a review
- `GET /api/reviews/room/:roomId` - Get room reviews
- `GET /api/reviews/:id` - Get review details
- `PUT /api/reviews/:id` - Update review
- `DELETE /api/reviews/:id` - Delete review

### Users
- `GET /api/users/profile` - Get current user profile
- `PUT /api/users/profile` - Update current user profile
- `POST /api/users/avatar` - Upload profile avatar
- `GET /api/users` - Get all users (admin)
- `PATCH /api/users/:id/promote` - Promote a user to admin (main admin only)
- `PATCH /api/users/:id/demote` - Remove admin role from a user (main admin only)

### Documents
- `POST /api/documents` - Upload document
- `GET /api/documents/me` - Get current user's uploaded ID documents
- `GET /api/documents/:id` - Get document
- `DELETE /api/documents/:id` - Delete document

---

## 📝 Available Scripts

### Backend Scripts
```bash
npm start       # Start production server
npm run dev     # Start with nodemon (hot reload)
npm run seed:rooms  # Seed database with sample rooms
```

### Frontend Scripts
```bash
npm start       # Start development server
npm run build   # Build for production
```

---

## 🔐 Authentication Flow

1. User signs up with email and password
2. Password is hashed using bcryptjs and stored in MongoDB
3. JWT token is generated upon successful login
4. Token is stored in client-side storage
5. Protected routes check token validity via `authMiddleware`
6. Token is included in Authorization header for protected API calls
7. Admins sign in from `/admin`, not from the normal `/auth` page
8. Only the main `.env` admin account can promote or demote users

---

## 📦 Database Models

### User Model
- Email, password (hashed), name
- Role support for `guest` and `admin`
- Profile information, avatar, verification status
- Timestamps

### Room Model
- Title, description, price
- Amenities, capacity, images
- Availability status

### Booking Model
- User reference, Room reference
- Check-in/check-out dates
- Status, approval status, uploaded ID snapshots, rejection reason, total price
- Timestamps

### Review Model
- User reference, Room reference
- Rating (1-5), comment
- Timestamps

### Document Model
- User reference
- Document file path
- Upload timestamp

### Admin Login
- `/admin` is the dedicated admin sign-in page
- The main `.env` admin account can manage roles
- Promoted admins can access the dashboard, but role changes remain restricted to the main admin account

---

## 🧪 Testing

Seed the database with sample rooms:
```bash
cd backend
npm run seed:rooms
```

---

## 🎨 Frontend Pages Overview

| Page | Path | Description |
|------|------|-------------|
| Home | `/` | Landing page with featured rooms |
| Explore | `/explore` | Browse all available rooms |
| Room Details | `/rooms/:id` | Detailed room information |
| Booking | `/booking` | Book a selected room |
| Dashboard | `/dashboard` | User's bookings and profile |
| Auth | `/auth` | Login/Signup page |
| Admin | `/admin` | Admin sign-in page |
| About | `/about` | About the platform |

---

## 🔒 Security Features

- JWT-based authentication
- Bcryptjs password hashing
- Protected routes with `ProtectedRoute` component
- CORS enabled for secure cross-origin requests
- Input validation on both client and server
- Admin role management is restricted to the main `.env` admin account

---

## 📈 Future Enhancements

- [ ] Payment gateway integration (Stripe/PayPal)
- [ ] Email notifications for bookings
- [ ] Advanced filtering and search
- [ ] User ratings and trust scores
- [ ] Room availability calendar
- [ ] Admin dashboard
- [ ] Multi-language support
- [ ] Mobile app (React Native)
- [ ] Real-time notifications (WebSocket)

---

## 🤝 Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 💬 Support

For support, email: support@roomly.com or open an issue on the repository.

---

## 🙏 Acknowledgments

- Express.js documentation
- MongoDB/Mongoose guides
- React documentation
- Community contributors

---

**Happy booking! 🎉**
