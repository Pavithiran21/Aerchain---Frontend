# Aerchain Frontend

Voice-powered task management application built with React.

## Features

- 📋 **Task Management**: Create, update, delete, and view tasks
- 🎤 **Voice Input**: Add tasks using voice commands with AI parsing
- 📊 **Multiple Views**: Switch between Board (Kanban) and List views
- 🔍 **Advanced Filtering**: Filter by status, priority, search, and due date
- 📄 **Pagination**: Navigate through tasks with 5 items per page per status
- 🌓 **Dark Mode**: Toggle between light and dark themes
- 🎯 **Drag & Drop**: Reorder tasks in board view
- 🔔 **Toast Notifications**: Real-time feedback for all actions

## Setup

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Configure API URL:**
   Update `src/config.js` with your backend API URL:
   ```javascript
   const API_URL = "your-backend-url"
   export default API_URL;
   ```

3. **Start Development Server:**
   ```bash
   npm start
   ```
   App runs at `http://localhost:3000`

4. **Build for Production:**
   ```bash
   npm run build
   ```

## Tech Stack

- React 18
- React Toastify (notifications)
- Lucide React (icons)
- React Beautiful DnD (drag & drop)

## Project Structure

```
src/
├── components/
│   ├── TaskBoard.js       # Kanban board view
│   ├── TaskList.js        # List view
│   ├── TaskCard.js        # Individual task card
│   ├── TaskColumn.js      # Board column component
│   ├── TaskForm.js        # Create/edit task form
│   ├── TaskViewModal.js   # Task details modal
│   ├── VoiceInput.js      # Voice recording component
│   ├── FilterBar.js       # Search and filter controls
│   ├── Pagination.js      # Pagination controls
│   ├── ThemeToggle.js     # Dark/light mode toggle
│   ├── Notification.js    # Custom notification component
│   └── ConfirmDialog.js   # Confirmation dialog
├── App.js                 # Main application component
├── config.js              # API configuration
└── index.js               # Application entry point
```

## Available Scripts

- `npm start` - Run development server
- `npm build` - Create production build
- `npm test` - Run tests
- `npm eject` - Eject from Create React App

## Environment Variables

No environment variables required. Configure API URL in `src/config.js`.

## Deployment

This app is configured for deployment on Netlify. Build command: `npm run build`
