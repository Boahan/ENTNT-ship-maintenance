import { User, Ship, ShipComponent, Job, Notification } from '../types';

// Local storage keys
const USERS_KEY = 'entnt_users';
const SHIPS_KEY = 'entnt_ships';
const COMPONENTS_KEY = 'entnt_components';
const JOBS_KEY = 'entnt_jobs';
const NOTIFICATIONS_KEY = 'entnt_notifications';
const CURRENT_USER_KEY = 'entnt_current_user';

// Initialize the local storage with default data if empty
export const initializeLocalStorage = (): void => {
  if (!localStorage.getItem(USERS_KEY)) {
    const defaultUsers: User[] = [
      { id: '1', role: 'Admin', email: 'admin@entnt.in', password: 'admin123', name: 'Admin User' },
      { id: '2', role: 'Inspector', email: 'inspector@entnt.in', password: 'inspect123', name: 'Inspector User' },
      { id: '3', role: 'Engineer', email: 'engineer@entnt.in', password: 'engine123', name: 'Engineer User' },
    ];
    localStorage.setItem(USERS_KEY, JSON.stringify(defaultUsers));
  }

  if (!localStorage.getItem(SHIPS_KEY)) {
    const defaultShips: Ship[] = [
      { 
        id: 's1', 
        name: 'Ever Given', 
        imo: '9811000', 
        flag: 'Panama', 
        status: 'Active',
        registrationDate: '2018-05-15',
        lastInspectionDate: '2024-01-20',
        capacity: 20124,
        description: 'Container ship operated by Evergreen Marine'
      },
      { 
        id: 's2', 
        name: 'Maersk Alabama', 
        imo: '9164263', 
        flag: 'USA', 
        status: 'Under Maintenance',
        registrationDate: '2010-03-08',
        lastInspectionDate: '2023-11-15',
        capacity: 1092,
        description: 'Container ship operated by Maersk Line Limited'
      }
    ];
    localStorage.setItem(SHIPS_KEY, JSON.stringify(defaultShips));
  }

  if (!localStorage.getItem(COMPONENTS_KEY)) {
    const defaultComponents: ShipComponent[] = [
      { 
        id: 'c1', 
        shipId: 's1', 
        name: 'Main Engine', 
        serialNumber: 'ME-1234',
        installDate: '2020-01-10', 
        lastMaintenanceDate: '2024-03-12',
        status: 'Operational',
        manufacturer: 'Wärtsilä',
        category: 'Engine',
        nextMaintenanceDate: '2024-09-12',
        description: 'MAN B&W 11G95ME-C9 two-stroke diesel engine'
      },
      { 
        id: 'c2', 
        shipId: 's1', 
        name: 'Radar System', 
        serialNumber: 'RAD-5678',
        installDate: '2021-07-18', 
        lastMaintenanceDate: '2023-12-01',
        status: 'Needs Maintenance',
        manufacturer: 'Furuno',
        category: 'Navigation',
        nextMaintenanceDate: '2024-06-01',
        description: 'X-band radar system with ARPA functionality'
      },
      { 
        id: 'c3', 
        shipId: 's2', 
        name: 'Auxiliary Generator', 
        serialNumber: 'AG-9012',
        installDate: '2019-05-20', 
        lastMaintenanceDate: '2024-02-15',
        status: 'Operational',
        manufacturer: 'Caterpillar',
        category: 'Electrical',
        nextMaintenanceDate: '2024-08-15',
        description: 'Diesel generator providing auxiliary power'
      }
    ];
    localStorage.setItem(COMPONENTS_KEY, JSON.stringify(defaultComponents));
  }

  if (!localStorage.getItem(JOBS_KEY)) {
    const currentDate = new Date().toISOString();
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    
    const lastWeek = new Date();
    lastWeek.setDate(lastWeek.getDate() - 7);

    const defaultJobs: Job[] = [
      { 
        id: 'j1', 
        componentId: 'c1', 
        shipId: 's1', 
        type: 'Inspection', 
        priority: 'High',
        status: 'Open', 
        assignedEngineerId: '3', 
        scheduledDate: nextWeek.toISOString(),
        description: 'Regular inspection of main engine',
        estimatedDuration: 4,
        createdAt: currentDate,
        updatedAt: currentDate
      },
      { 
        id: 'j2', 
        componentId: 'c2', 
        shipId: 's1', 
        type: 'Maintenance', 
        priority: 'Medium',
        status: 'In Progress', 
        assignedEngineerId: '3', 
        scheduledDate: currentDate,
        description: 'Calibration of radar system',
        estimatedDuration: 2,
        createdAt: lastWeek.toISOString(),
        updatedAt: currentDate
      },
      { 
        id: 'j3', 
        componentId: 'c3', 
        shipId: 's2', 
        type: 'Repair', 
        priority: 'Critical',
        status: 'In Progress', 
        assignedEngineerId: '3', 
        scheduledDate: lastWeek.toISOString(),
        description: 'Fix auxiliary generator malfunction',
        estimatedDuration: 8,
        createdAt: lastWeek.toISOString(),
        updatedAt: currentDate
      }
    ];
    localStorage.setItem(JOBS_KEY, JSON.stringify(defaultJobs));
  }

  if (!localStorage.getItem(NOTIFICATIONS_KEY)) {
    const currentDate = new Date().toISOString();
    const defaultNotifications: Notification[] = [
      { 
        id: 'n1', 
        type: 'job_created', 
        message: 'New maintenance job created for Ever Given - Main Engine', 
        read: false, 
        createdAt: currentDate,
        relatedId: 'j1'
      },
      { 
        id: 'n2', 
        type: 'job_updated', 
        message: 'Job status updated to In Progress for Maersk Alabama - Auxiliary Generator', 
        read: false, 
        createdAt: currentDate,
        relatedId: 'j3'
      },
      { 
        id: 'n3', 
        type: 'component_alert', 
        message: 'Radar System on Ever Given needs maintenance', 
        read: true, 
        createdAt: currentDate,
        relatedId: 'c2'
      }
    ];
    localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(defaultNotifications));
  }
};

// Generic CRUD operations for localStorage
const getItems = <T>(key: string): T[] => {
  const items = localStorage.getItem(key);
  return items ? JSON.parse(items) : [];
};

const setItems = <T>(key: string, items: T[]): void => {
  localStorage.setItem(key, JSON.stringify(items));
};

const addItem = <T extends { id: string }>(key: string, item: T): T => {
  const items = getItems<T>(key);
  items.push(item);
  setItems(key, items);
  return item;
};

const updateItem = <T extends { id: string }>(key: string, id: string, updates: Partial<T>): T | null => {
  const items = getItems<T>(key);
  const index = items.findIndex(item => item.id === id);
  
  if (index === -1) return null;
  
  items[index] = { ...items[index], ...updates };
  setItems(key, items);
  return items[index];
};

const deleteItem = <T extends { id: string }>(key: string, id: string): boolean => {
  const items = getItems<T>(key);
  const filteredItems = items.filter(item => item.id !== id);
  
  if (filteredItems.length === items.length) return false;
  
  setItems(key, filteredItems);
  return true;
};

// User related operations
export const getUsers = (): User[] => getItems<User>(USERS_KEY);
export const getUserById = (id: string): User | null => getUsers().find(user => user.id === id) || null;
export const getUserByEmail = (email: string): User | null => getUsers().find(user => user.email === email) || null;
export const addUser = (user: User): User => addItem<User>(USERS_KEY, user);
export const updateUser = (id: string, updates: Partial<User>): User | null => updateItem<User>(USERS_KEY, id, updates);
export const deleteUser = (id: string): boolean => deleteItem<User>(USERS_KEY, id);

// Current user (session) operations
export const getCurrentUser = (): User | null => {
  const userJson = localStorage.getItem(CURRENT_USER_KEY);
  return userJson ? JSON.parse(userJson) : null;
};

export const setCurrentUser = (user: User): void => {
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
};

export const clearCurrentUser = (): void => {
  localStorage.removeItem(CURRENT_USER_KEY);
};

// Ship related operations
export const getShips = (): Ship[] => getItems<Ship>(SHIPS_KEY);
export const getShipById = (id: string): Ship | null => getShips().find(ship => ship.id === id) || null;
export const addShip = (ship: Ship): Ship => addItem<Ship>(SHIPS_KEY, ship);
export const updateShip = (id: string, updates: Partial<Ship>): Ship | null => updateItem<Ship>(SHIPS_KEY, id, updates);
export const deleteShip = (id: string): boolean => {
  // Also delete related components and jobs when a ship is deleted
  const components = getComponents().filter(comp => comp.shipId === id);
  components.forEach(comp => deleteComponent(comp.id));
  
  return deleteItem<Ship>(SHIPS_KEY, id);
};

// Component related operations
export const getComponents = (): ShipComponent[] => getItems<ShipComponent>(COMPONENTS_KEY);
export const getComponentById = (id: string): ShipComponent | null => getComponents().find(component => component.id === id) || null;
export const getComponentsByShipId = (shipId: string): ShipComponent[] => getComponents().filter(component => component.shipId === shipId);
export const addComponent = (component: ShipComponent): ShipComponent => addItem<ShipComponent>(COMPONENTS_KEY, component);
export const updateComponent = (id: string, updates: Partial<ShipComponent>): ShipComponent | null => updateItem<ShipComponent>(COMPONENTS_KEY, id, updates);
export const deleteComponent = (id: string): boolean => {
  // Also delete related jobs when a component is deleted
  const jobs = getJobs().filter(job => job.componentId === id);
  jobs.forEach(job => deleteJob(job.id));
  
  return deleteItem<ShipComponent>(COMPONENTS_KEY, id);
};

// Job related operations
export const getJobs = (): Job[] => getItems<Job>(JOBS_KEY);
export const getJobById = (id: string): Job | null => getJobs().find(job => job.id === id) || null;
export const getJobsByShipId = (shipId: string): Job[] => getJobs().filter(job => job.shipId === shipId);
export const getJobsByComponentId = (componentId: string): Job[] => getJobs().filter(job => job.componentId === componentId);
export const getJobsByEngineerId = (engineerId: string): Job[] => getJobs().filter(job => job.assignedEngineerId === engineerId);
export const addJob = (job: Job): Job => {
  const newJob = addItem<Job>(JOBS_KEY, job);
  
  // Create a notification for the new job
  const component = getComponentById(job.componentId);
  const ship = getShipById(job.shipId);
  
  if (component && ship) {
    addNotification({
      id: `n${Date.now()}`,
      type: 'job_created',
      message: `New ${job.type} job created for ${ship.name} - ${component.name}`,
      read: false,
      createdAt: new Date().toISOString(),
      relatedId: job.id
    });
  }
  
  return newJob;
};

export const updateJob = (id: string, updates: Partial<Job>): Job | null => {
  const job = getJobById(id);
  if (!job) return null;
  
  const updatedJob = updateItem<Job>(JOBS_KEY, id, {
    ...updates,
    updatedAt: new Date().toISOString()
  });
  
  // Create a notification for job status update
  if (updatedJob && updates.status && updates.status !== job.status) {
    const component = getComponentById(job.componentId);
    const ship = getShipById(job.shipId);
    
    if (component && ship) {
      let message = '';
      
      if (updates.status === 'Completed') {
        message = `Maintenance job completed for ${ship.name} - ${component.name}`;
        addNotification({
          id: `n${Date.now()}`,
          type: 'job_completed',
          message,
          read: false,
          createdAt: new Date().toISOString(),
          relatedId: job.id
        });
        
        // Update the component's last maintenance date
        updateComponent(component.id, {
          lastMaintenanceDate: new Date().toISOString(),
          status: 'Operational'
        });
      } else {
        message = `Job status updated to ${updates.status} for ${ship.name} - ${component.name}`;
        addNotification({
          id: `n${Date.now()}`,
          type: 'job_updated',
          message,
          read: false,
          createdAt: new Date().toISOString(),
          relatedId: job.id
        });
      }
    }
  }
  
  return updatedJob;
};

export const deleteJob = (id: string): boolean => deleteItem<Job>(JOBS_KEY, id);

// Notification related operations
export const getNotifications = (): Notification[] => getItems<Notification>(NOTIFICATIONS_KEY);
export const getUnreadNotifications = (): Notification[] => getNotifications().filter(notification => !notification.read);
export const addNotification = (notification: Notification): Notification => addItem<Notification>(NOTIFICATIONS_KEY, notification);
export const markNotificationAsRead = (id: string): Notification | null => updateItem<Notification>(NOTIFICATIONS_KEY, id, { read: true });
export const markAllNotificationsAsRead = (): void => {
  const notifications = getNotifications();
  notifications.forEach(notification => {
    if (!notification.read) {
      updateItem<Notification>(NOTIFICATIONS_KEY, notification.id, { read: true });
    }
  });
};
export const deleteNotification = (id: string): boolean => deleteItem<Notification>(NOTIFICATIONS_KEY, id);
export const clearAllNotifications = (): void => {
  setItems<Notification>(NOTIFICATIONS_KEY, []);
};

// Dashboard statistics
export const getDashboardStats = () => {
  const ships = getShips();
  const components = getComponents();
  const jobs = getJobs();
  
  const currentDate = new Date();
  
  return {
    totalShips: ships.length,
    activeShips: ships.filter(ship => ship.status === 'Active').length,
    underMaintenanceShips: ships.filter(ship => ship.status === 'Under Maintenance').length,
    totalComponents: components.length,
    componentsNeedingMaintenance: components.filter(comp => comp.status === 'Needs Maintenance').length,
    openJobs: jobs.filter(job => job.status === 'Open').length,
    inProgressJobs: jobs.filter(job => job.status === 'In Progress').length,
    completedJobs: jobs.filter(job => job.status === 'Completed').length,
    overdueJobs: jobs.filter(job => {
      const scheduledDate = new Date(job.scheduledDate);
      return scheduledDate < currentDate && job.status !== 'Completed';
    }).length,
    upcomingJobs: jobs.filter(job => {
      const scheduledDate = new Date(job.scheduledDate);
      const oneWeekLater = new Date();
      oneWeekLater.setDate(oneWeekLater.getDate() + 7);
      return scheduledDate > currentDate && scheduledDate <= oneWeekLater && job.status !== 'Completed';
    }).length
  };
};