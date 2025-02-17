# Launchpad-Events

A web application for managing and participating in community events. Built with React, Node.js, Express, PostgreSQL and utilises Google Calendar API and Google OAuth. Admin Users can create, edit and manage events, along with users. Users can register for events and sync them with their Google Calendar.

## Features

- 🎫 Event Creation and Management
- 👥 User Authentication with Role-Based Access
- 📅 Event Scheduling with Timezone Support
- 🔍 Paginated Event Listing with Sorting
- 📱 Responsive Design
- 🎯 Event Type Categorization and Filtering
- 📍 Venue Location Management
- 👤 Attendee Management
- 📆 Google Calendar Integration and Oauth Integration
- 🗓️ Interactive Calendar View

### Admin Capabilities

- Create, edit and delete events
- Manage event types
- View and manage attendees
- Remove attendees from events
- Manage user accounts

### User Capabilities

- Browse and register for events
- Cancel event registration
- Add events to Google Calendar
- View events in calendar or list view
- Filter events by type
- Sort events by date or title

## Live Demo

The application is currently deployed at:

Frontend: https://theeventhivecouk.co.uk/
Backend API: https://launchpad-events-api.onrender.com

Please note: The site might take a minute to initially load as it's hosted on a free service.

Test Account Credentials:

- Admin: sarahjohnsontest84@gmail.com (password: adminpassword123)
- User: emmawilsontest84@gmail.com (password: password123)

## Setting Up for Local Development

### Essential Software to Install First

1. **Visual Studio Code (VS Code)**

   - Download from: https://code.visualstudio.com/
   - Install by following the installation wizard

2. **Node.js**

   - Download from: https://nodejs.org/
   - Choose the "LTS" (Long Term Support) version
   - Install by following the installation wizard
   - To verify installation, open Terminal (steps below) and type: `node --version`

3. **PostgreSQL**
   - Download from: https://www.postgresql.org/download/
   - Follow installation instructions for your operating system
   - Remember the password you set during installation!

### How to Open Terminal/Command Prompt

**On Windows:**

- Press `Windows + R`
- Type `cmd` and press Enter
  OR
- Right-click the Start button
- Select "Windows Terminal" or "Command Prompt"

**On Mac:**

- Press `Command + Space`
- Type "Terminal"
- Press Enter

### How to Fork and Clone the Repository

1. Create a GitHub account if you don't have one
2. Go to https://github.com/GLAWall/Launchpad-Events
3. Click the "Fork" button in the top right corner
4. Once forked, click the green "Code" button
5. Copy the HTTPS URL
6. In your terminal, navigate to where you want to store the project:

   ```bash
   # On Windows, for example:
   cd C:\Users\YourUsername\Documents

   # On Mac/Linux:
   cd ~/Documents
   ```

7. Clone your forked repository:
   ```bash
   git clone [paste-the-url-you-copied]
   ```

### Google Calendar Setup

1. Go to https://console.cloud.google.com/
2. Sign in with your Google account
3. Click "Create Project" at the top
4. Name your project and click "Create"
5. From the left menu, go to "APIs & Services" > "Library"
6. Search for "Google Calendar API" and enable it
7. Go to "APIs & Services" > "Credentials"
8. Click "Create Credentials" > "OAuth 2.0 Client ID"
9. Add `http://localhost:5173` to authorized JavaScript origins
10. Save your Client ID and API Key for later use

### Backend Setup

1. Open VS Code
2. Go to File > Open Folder and select the backend folder
3. Open a new terminal in VS Code (Terminal > New Terminal)
4. Install required packages:

   ```bash
   npm install
   ```

5. Create two new files in the backend folder:

   Create a file named `.env`:

   ```
   ADMIN_PASSWORD=your_admin_password
   USER_PASSWORD=your_user_password
   ```

   Create a file named `.env.development`:

   ```
   PGDATABASE=community_events
   ```

6. Set up the database:

   ```bash
   npm run setup-dbs
   npm run seed-dev
   ```

7. Start the server:
   ```bash
   npm run dev
   ```

### Frontend Setup

1. Open a new VS Code window
2. Open the Launchpad-Events folder
3. Open a new terminal in VS Code
4. Install packages:

   ```bash
   npm install
   ```

5. Create a file named `.env.development` with your Google credentials:

   ```
   VITE_GOOGLE_CLIENT_ID=your_google_client_id
   VITE_GOOGLE_API_KEY=your_google_api_key
   ```

6. Start the development server:

   ```bash
   npm run dev
   ```

7. Open your browser and go to: http://localhost:5173

### Test Users Available

- Admin: sarahjohnsontest84@gmail.com (password: whatever you set as ADMIN_PASSWORD)
- User: emmawilsontest84@gmail.com (password: whatever you set as USER_PASSWORD)

## Troubleshooting Common Issues

1. **"command not found: npm"**

   - This means Node.js isn't installed properly
   - Try reinstalling Node.js

2. **Database connection errors**

   - Make sure PostgreSQL is running
   - Check that your database names match exactly

3. **Port already in use**
   - Try closing other terminal windows
   - Or change the port in your environment files

Need help? Create an issue on the GitHub repository!

## Tech Stack

### Frontend

- React 18
- React Router v6
- Axios for API calls
- Vite for build tooling
- Google Calendar API for event syncing

### Backend

- Node.js
- Express
- PostgreSQL
- bcrypt for password hashing
- JSON Web Tokens for authentication

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## API Endpoints

### Auth

- `POST /api/auth/login` - User login

### Events

- `GET /api/events` - Get all events
- `GET /api/events/:id` - Get event by ID
- `POST /api/admin/events` - Create new event (admin only)
- `PATCH /api/admin/events/:id` - Update event (admin only)
- `DELETE /api/admin/events/:id` - Delete event (admin only)

### Users

- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID (requires authentication)
- `POST /api/users` - Create new user
- `DELETE /api/users/:id` - Delete user (requires authentication)
- `PATCH /api/admin/users/:id` - Update user (admin only)

### Event Types

- `GET /api/event-types` - Get all event types
- `GET /api/event-types/:id` - Get event type by ID
- `POST /api/admin/event-types` - Create event type (admin only)
- `PATCH /api/admin/event-types/:id` - Update event type (admin only)
- `DELETE /api/admin/event-types/:id` - Delete event type (admin only)

### Event Attendance

- `POST /api/events/:eventId/users/:userId/attendees` - Register for event (requires authentication)
- `DELETE /api/events/:eventId/users/:userId/attendees` - Cancel registration (requires authentication)
