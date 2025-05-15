# ENTNT Ship Maintenance Dashboard

A comprehensive ship maintenance management system built with React, featuring role-based access control, real-time notifications, and interactive maintenance scheduling.

![image](https://github.com/user-attachments/assets/6c05cdd2-d198-4287-9dbe-e28e9902be27)

# **Live Demo:** [entnt-ship.netlify.app](https://entnt-ship.netlify.app)

## Features

### Authentication & Authorization

![image](https://github.com/user-attachments/assets/cb3e0540-c6c2-452a-953b-95f2b1e3b46d)

- Role-based access control (Admin, Inspector, Engineer)
- Secure login with email/password
- Session persistence using localStorage
- Protected routes based on user roles

### Ships Management

![image](https://github.com/user-attachments/assets/ce064d4e-165d-46cd-8761-a265bce0d6fd)

- Complete CRUD operations for ships
- Detailed ship profiles with maintenance history
- Status tracking (Active, Under Maintenance, Out of Service)
- Filter and search functionality

### Components Management

![image](https://github.com/user-attachments/assets/8df93d63-8e6f-4017-96b5-41d5c80035bd)

- Add, edit, and delete ship components
- Track installation and maintenance dates
- Component-specific maintenance history
- Maintenance due notifications

### Maintenance Jobs

![image](https://github.com/user-attachments/assets/d75c3a19-ec5d-4762-9d2a-ed2ba9acb1ce)

- Create and assign maintenance jobs
- Priority levels (Low, Medium, High, Critical)
- Status tracking (Open, In Progress, Completed, Cancelled)
- Filter jobs by ship, status, and priority

### Interactive Calendar

![image](https://github.com/user-attachments/assets/2834e8ba-ee9b-4cfd-829f-cea148d7eedd)

- Monthly and weekly calendar views
- Visual representation of scheduled jobs
- Click-to-view job details
- Color-coded job priorities

### Real-time Notifications

![image](https://github.com/user-attachments/assets/c72f55fb-003c-453d-8393-a45194905706)

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
