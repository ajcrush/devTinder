# DevTinder Backend

A Node.js backend application for a developer connection platform, featuring user authentication, profile management, connection requests, and real-time chat functionality.

## �� Project Structure

## 🚀 Core Features

1. **Authentication**

   - User signup and login
   - JWT-based authentication
   - Secure password handling with bcrypt

2. **Profile Management**

   - View and edit profile
   - Update password
   - Profile photo management

3. **Connection System**

   - Send connection requests
   - Accept/reject requests
   - View received requests
   - View established connections

4. **Real-time Chat**

   - Socket.io integration
   - Private chat rooms
   - Message persistence

5. **Email Notifications**
   - AWS SES integration
   - Automated notifications for connection requests
   - Daily digest of pending requests

## 🔧 Technical Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT
- **Real-time Communication**: Socket.io
- **Email Service**: AWS SES
- **Scheduled Tasks**: node-cron
- **Input Validation**: validator.js

## 🛠 Setup and Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   ```env
   PORT=3000
   DB_CONNECTION_SECRET=your_mongodb_uri
   JWT_SECRET_KEY=your_jwt_secret
   AWS_ACCESS_KEY=your_aws_access_key
   AWS_SECRET_KEY=your_aws_secret_key
   ```
4. Start the server:
   ```bash
   npm start
   ```

## 🔐 API Endpoints

### Authentication

- `POST /signup` - Register new user
- `POST /login` - User login
- `POST /logout` - User logout

### Profile

- `GET /profile/view` - View profile
- `PATCH /profile/edit` - Edit profile
- `PATCH /profile/password` - Update password

### Connection Requests

- `POST /request/send/:status/:userId` - Send connection request
- `POST /request/review/:status/:requestId` - Review received request
- `GET /user/request/received` - View received requests
- `GET /user/connections` - View established connections

### Chat

- `GET /chat/:targetUserId` - Get or create chat with user

### User Feed

- `GET /user/feed` - Get paginated user feed

## 🔄 WebSocket Events

- `joinChat` - Join a chat room
- `sendMessage` - Send a message
- `messageReceived` - Receive a message

## 🔍 Data Models

### User

- First name, last name
- Email, password
- Profile details (age, gender, photo, about)
- Skills (max 5)

### Connection Request

- From user, to user
- Status (ignored/interested/accepted/rejected)
- Timestamps

### Chat

- Participants
- Messages (sender, text, timestamp)

## 📅 Scheduled Tasks

- Daily email notifications for pending requests (8 AM)
- Automated cleanup tasks

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Input validation
- CORS protection
- Cookie-based token storage

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📝 License

[MIT License](LICENSE)
