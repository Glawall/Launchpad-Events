# Launchpad-Events

# Community Events Platform

A modern web application for managing and participating in community events. Built with React, Node.js, Express, and PostgreSQL.

## Features

- 🎫 Event Creation and Management
- 👥 User Authentication with Role-Based Access
- 📅 Event Scheduling with Timezone Support
- 🔍 Paginated Event Listing
- 📱 Responsive Design
- 🎯 Event Type Categorization
- 📍 Venue Location Management
- 👤 Attendee Management

## Hosting

### Local Development

1. Navigate to the frontend directory:

```bash
cd Launchpad-Events
```

2. Install dependencies:

```bash
npm install
```

3. Create `.env.development` file:

```
VITE_BASE_PATH=/
```

4. Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Production Deployment

1. Create `.env.production` file:

```
VITE_BASE_PATH=/Launchpad-Events/
```

2. Build and deploy to GitHub Pages:

```bash
npm run deploy
```

The application will be deployed to `https://glawall.github.io/Launchpad-Events/`

## Test Users

### Admin User

```
Email:
Password:
```

### Regular User

```
Email:
Password:
```

## Tech Stack

### Frontend

- React 18
- React Router v6
- Axios for API calls
- TailwindCSS for styling
- Vite for build tooling

### Backend

- Node.js
- Express
- PostgreSQL
- bcrypt for password hashing
- JSON Web Tokens for authentication

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn
  `

The application will be available at:

- Frontend: http://localhost:5173
- Backend API: http://localhost:8004

## API Endpoints

### Events

- `GET /api/events` - Get all events (with pagination)
- `GET /api/events/:id` - Get event by ID
- `POST /api/admin/events` - Create new event (admin only)
- `PUT /api/admin/events/:id` - Update event (admin only)
- `DELETE /api/admin/events/:id` - Delete event (admin only)

### Users

- `GET /api/users/:id` - Get user profile
- `DELETE /api/users/:id` - Delete user account
- `GET /api/admin/users` - Get all users (admin only)
- `PATCH /api/admin/users/:id` - Update user (admin only)

### Event Attendance

- `POST /api/events/:eventId/users/:userId/attendees` - Register for event
- `DELETE /api/events/:eventId/users/:userId/attendees` - Cancel registration

## Testing

Run the test suite:

```bash
npm test
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
