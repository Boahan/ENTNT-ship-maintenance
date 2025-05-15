// User related types
export type UserRole = 'Admin' | 'Inspector' | 'Engineer';

export interface User {
  id: string;
  email: string;
  password: string;
  role: UserRole;
  name?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// Ship related types
export type ShipStatus = 'Active' | 'Under Maintenance' | 'Docked' | 'Out of Service';

export interface Ship {
  id: string;
  name: string;
  imo: string;
  flag: string;
  status: ShipStatus;
  image?: string;
  lastInspectionDate?: string;
  registrationDate?: string;
  capacity?: number;
  description?: string;
}

// Component related types
export interface ShipComponent {
  id: string;
  shipId: string;
  name: string;
  serialNumber: string;
  installDate: string;
  lastMaintenanceDate: string;
  status?: 'Operational' | 'Needs Maintenance' | 'Failed';
  manufacturer?: string;
  category?: 'Engine' | 'Navigation' | 'Safety' | 'Hull' | 'Electrical' | 'Other';
  nextMaintenanceDate?: string;
  description?: string;
}

// Job related types
export type JobPriority = 'Low' | 'Medium' | 'High' | 'Critical';
export type JobStatus = 'Open' | 'In Progress' | 'Completed' | 'Delayed' | 'Cancelled';
export type JobType = 'Inspection' | 'Repair' | 'Replacement' | 'Maintenance' | 'Emergency';

export interface Job {
  id: string;
  componentId: string;
  shipId: string;
  type: JobType;
  priority: JobPriority;
  status: JobStatus;
  assignedEngineerId: string;
  scheduledDate: string;
  completedDate?: string;
  description?: string;
  notes?: string;
  estimatedDuration?: number; // in hours
  actualDuration?: number; // in hours
  createdAt: string;
  updatedAt: string;
}

// Notification related types
export type NotificationType = 'job_created' | 'job_updated' | 'job_completed' | 'component_alert';

export interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  read: boolean;
  createdAt: string;
  relatedId?: string; // Can be a job ID, ship ID, etc.
}

// Dashboard statistics
export interface DashboardStats {
  totalShips: number;
  activeShips: number;
  underMaintenanceShips: number;
  totalComponents: number;
  componentsNeedingMaintenance: number;
  openJobs: number;
  inProgressJobs: number;
  completedJobs: number;
  overdueJobs: number;
  upcomingJobs: number;
}