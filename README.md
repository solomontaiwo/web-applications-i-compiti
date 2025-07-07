# Compiti - Assignment Management System

A modern web application for managing educational assignments built with React and Node.js. Teachers can create assignments for student groups, and students can submit responses that teachers can evaluate.

## 🌟 Features

### For Teachers
- 📝 **Create assignments** with custom questions
- 👥 **Assign to student groups** (2-6 students per group)
- 📊 **View and evaluate responses** with scores (0-30)
- 📈 **Monitor class statistics** with sortable student performance data
- 🎯 **Track assignment progress** with completion rates

### For Students
- 📋 **View assigned tasks** with group information
- ✍️ **Submit responses** to open assignments
- 📊 **Check grades** and view evaluated assignments
- 👥 **See group members** for each assignment

### General Features
- 🌐 **Multilingual support** (Italian/English) with automatic language detection
- 🔐 **Role-based authentication** (Teacher/Student)
- 📱 **Responsive design** with modern Bootstrap UI
- ⚡ **Real-time updates** and instant feedback
- 🎨 **Clean, minimalist interface** with glassmorphism design

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/solomontaiwo/web-applications-I-compiti.git
   cd web-applications-I-compiti
   ```

2. **Install server dependencies**
   ```bash
   cd server
   npm install
   ```

3. **Install client dependencies**
   ```bash
   cd ../client
   npm install
   ```

4. **Start the development servers**

   **Terminal 1 - Backend:**
   ```bash
   cd server
   node index.mjs
   ```
   Server will run on http://localhost:3001

   **Terminal 2 - Frontend:**
   ```bash
   cd client
   npm run dev
   ```
   Client will run on http://localhost:5173

5. **Access the application**
   Open your browser and navigate to http://localhost:5173

## 👥 Default Users

The application comes with pre-configured users for testing:

### Teachers
- **Email:** docente1@aw1.it | **Password:** password
- **Email:** docente2@aw1.it | **Password:** password

### Students
- **Email:** studente01@aw1.it to studente20@aw1.it | **Password:** password

## 📁 Project Structure

```
web-applications-I-compiti/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── api/           # API service functions
│   │   ├── context/       # React Context (Auth)
│   │   ├── locales/       # i18n translation files
│   │   └── ...
│   ├── public/
│   └── package.json
├── server/                # Node.js backend
│   ├── controllers/       # Request handlers
│   ├── dao/              # Data Access Objects
│   ├── database/         # SQLite database & initialization
│   ├── middleware/       # Custom middleware
│   ├── routes/           # API route definitions
│   └── package.json
└── README.md
```

## 🛠 Tech Stack

### Frontend
- **React 19** - Modern UI library
- **React Router** - Client-side routing
- **Bootstrap 5** - Responsive CSS framework
- **react-i18next** - Internationalization
- **Vite** - Fast build tool

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **SQLite3** - Lightweight database
- **bcrypt** - Password hashing
- **express-session** - Session management

## 🌐 Internationalization

The application supports multiple languages with automatic detection:
- 🇮🇹 **Italian**
- 🇬🇧 **English**

Language is automatically detected from browser settings, with manual switching available in the navigation bar.

## 📊 Database Schema

The application uses SQLite with the following main tables:
- **users** - Teachers and students with authentication
- **assignments** - Assignment questions and metadata
- **assignment_groups** - Student-assignment relationships
- **responses** - Student submissions
- **evaluations** - Teacher scores and feedback

## 🔧 Available Scripts

### Client (Frontend)
```bash
npm run dev         # Start development server
npm run build       # Build for production
npm run preview     # Preview production build
npm run lint        # Run ESLint
```

### Server (Backend)
```bash
npm start           # Start the server
npm run dev         # Start with nodemon (development)
```


## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 👨‍💻 Author

**Solomon Taiwo**
- GitHub: [@solomontaiwo](https://github.com/solomontaiwo)
- Portfolio: [solomontaiwo.github.io](https://solomontaiwo.github.io/)
- Instagram: [@solomon.taiwo](https://instagram.com/solomon.taiwo)

---

⭐ **Star this repository if you find it helpful!**