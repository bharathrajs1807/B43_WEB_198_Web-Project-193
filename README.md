# ClubNexus

## Introduction
ClubNexus is a social networking platform for connecting with communities, participating in clubs, and engaging with posts. This application supports user authentication, profile management, club management, and interactive social features like posts, comments, likes, and dislikes.

## Project Type
Fullstack

## Deployed App
- Frontend Deployment link - https://clubnexus.netlify.app/
- Backend Deployment link - https://clubnexus.onrender.com/

## Features
- User Sign-up, Log-in, and Log-out
- Access Token and Refresh Token Authentication
- Profile Management
- Club Creation and Management
- Follow/Unfollow Clubs
- Create, Update, and Delete Posts
- Like, Dislike, and Comment on Posts
- Search for Users and Clubs

## Technolog Stack
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)
- **Password Management**: bcrypt.js
- **Real-time**: Socket.IO (Planned for Future)
- **Documentation**: Swagger (Planned for Future)

## Installation
1. Clone the repository:
    ```bash
    git clone https://github.com/bharathrajs1807/B43_WEB_198_Web-Project-193.git
    cd B43_WEB_198_Web-Project-193
    ```
2. Install dependencies:
    ```bash
    npm install
    ```
3. Create a `.env` file and configure environment variables:
    ```env
    PORT=3000
    ACCESS_TOKEN_SECRET_KEY=your_access_token_secret
    REFRESH_TOKEN_SECRET_KEY=your_refresh_token_secret
    MONGO_URI=your_mongo_db_connection_string
    ```
4. Start the server:
    ```bash
    npm start
    ```

## API Endpoints

### **Authentication**
- `POST /sign-up` - Create a new account
- `POST /log-in` - Log in to an account
- `POST /log-out` - Log out of an account
- `POST /refresh` - Generate a new access token using a refresh token

### **User Management**
- `GET /user/:username` - Get user details
- `PATCH /user/:username` - Update user details
- `PATCH /user/:username/change-password` - Change user password

### **Profile Management**
- `GET /profile/:username` - Get user profile
- `PATCH /profile/:username` - Update user profile

### **Club Management**
- `GET /club/:clubname` - Get club details
- `POST /club` - Create a new club
- `PATCH /club/:clubname` - Update club details

### **Post Management**
- `GET /post` - Get all posts from the user and followed clubs
- `POST /post` - Create a new post
- `PATCH /post/:postId` - Update a post
- `DELETE /post/:postId` - Delete a post
- `PATCH /post/:postId/update-likes` - Like a post
- `PATCH /post/:postId/update-dislikes` - Dislike a post
- `PATCH /post/:postId/add-comment` - Add a comment to a post
- `PATCH /post/:postId/delete-comment` - Delete a comment from a post

### **Search**
- `GET /search?query=` - Search for users or clubs

## Directory Structure
```bash
clubnexus/
├── config/
│   └── db.js
├── controllers/
│   ├── user.controller.js
│   ├── profile.controller.js
│   ├── club.controller.js
│   └── post.controller.js
├── middlewares/
│   └── authMiddleware.js
├── models/
│   ├── user.model.js
│   ├── profile.model.js
│   ├── club.model.js
│   └── post.model.js
├── routes/
│   ├── user.route.js
│   ├── profile.route.js
│   ├── club.route.js
│   └── post.route.js
├── .env
├── server.js
└── package.json
```

## Video Walkthrough of the project
https://drive.google.com/file/d/1j5SyPwxzf13I8HczvTJaOOYfeoeVBJcT/view?usp=drive_link

## Individual Presentation
https://drive.google.com/file/d/11TMubnoh_v1foKJPjEv8M-DnjL6iwINX/view?usp=drive_link

---

 ⁍ **Bharath Raj**:
 - Linkedin: https://www.linkedin.com/in/bharathrajs1807

