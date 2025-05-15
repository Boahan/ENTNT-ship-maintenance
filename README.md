# ENTNT Ship Maintenance Dashboard

A comprehensive ship maintenance management system built with React, featuring role-based access control, real-time notifications, and interactive maintenance scheduling.

![Dashboard Overview]()

## Features

### Authentication & Authorization
- Role-based access control (Admin, Inspector, Engineer)
- Secure login with email/password
- Session persistence using localStorage
- Protected routes based on user roles

### Ships Management
![Ships Management]()

- Complete CRUD operations for ships
- Detailed ship profiles with maintenance history
- Status tracking (Active, Under Maintenance, Out of Service)
- Filter and search functionality

### Components Management
![Components]()

- Add, edit, and delete ship components
- Track installation and maintenance dates
- Component-specific maintenance history
- Maintenance due notifications

### Maintenance Jobs
![Maintenance Jobs]()

- Create and assign maintenance jobs
- Priority levels (Low, Medium, High, Critical)
- Status tracking (Open, In Progress, Completed, Cancelled)
- Filter jobs by ship, status, and priority

### Interactive Calendar
![Maintenance Calendar]()

- Monthly and weekly calendar views
- Visual representation of scheduled jobs
- Click-to-view job details
- Color-coded job priorities

### Real-time Notifications
- Job status updates
- Maintenance due alerts
- Dismissible notifications
- Unread notification counter

### KPI Dashboard
- Fleet overview statistics
- Components requiring maintenance
- Job status distribution
- Visual data representation using charts

## Technology Stack

- **Frontend Framework**: React 18
- **Routing**: React Router v6
- **Styling**: TailwindCSS
- **State Management**: Context API
- **Charts**: Chart.js
- **Icons**: Lucide React
- **Data Persistence**: localStorage
- **Type Safety**: TypeScript

## Getting Started

### Prerequisites
- Node.js 18.0 or higher
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/entnt-ship-maintenance.git
```

2. Install dependencies:
```bash
cd entnt-ship-maintenance
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Access the application at `http://localhost:5173`

### Default Login Credentials

| Role     | Email               | Password    |
|----------|---------------------|-------------|
| Admin    | admin@entnt.in      | admin123    |
| Inspector| inspector@entnt.in   | inspect123  |
| Engineer | engineer@entnt.in    | engine123   |

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Auth/            # Login and auth-related components
│   ├── Calendar/        # Calendar views and scheduling components
│   ├── Common/          # Generic shared components
│   ├── Components/      # Component management
│   ├── Dashboard/       # Dashboard widgets and charts
│   ├── Ships/           # Ship management components
│   ├── Components/      # Component management
│   ├── Jobs/            # Job management
│   ├── Jobs/            # Job listing
│   └── Ships/           # Components related to ship management
├── contexts/           # Global state management
├── pages/              # Main application pages
├── types/              # TypeScript types
└── utils/              # Utility functions
```

## Features by User Role

### Admin
- Full access to all features
- Create/Edit/Delete ships
- Manage users and permissions
- View all reports and statistics

### Inspector
- View all ships and components
- Create maintenance jobs
- Update component information
- View maintenance history

### Engineer
- View assigned maintenance jobs
- Update job status
- View component details
- Receive job notifications

## Data Persistence

All data is stored in localStorage with the following structure:

- `users`: User authentication and role information
- `ships`: Ship details and status
- `components`: Component information and maintenance history
- `jobs`: Maintenance job details and assignments
- `notifications`: System notifications and alerts

## Known Limitations

1. Data persistence is limited to browser storage
2. No real-time collaboration features
3. Calendar events limited to maintenance jobs
4. Chart rendering may be delayed on slower devices

## Future Enhancements

1. Dark mode support
2. Export reports to PDF/Excel
3. Image upload for ships and components
4. Advanced filtering and sorting options
5. Mobile app integration

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## Contact

For any queries or support, please contact:
- Email: shaswatgusain1@gmail.com
