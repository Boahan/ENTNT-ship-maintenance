import React, { createContext, useContext, useEffect, useState } from 'react';
import { Notification } from '../types';
import { 
  getNotifications, 
  getUnreadNotifications,
  markNotificationAsRead, 
  markAllNotificationsAsRead,
  deleteNotification,
  clearAllNotifications
} from '../utils/localStorageUtils';
import { useAuth } from './AuthContext';

interface NotificationsContextType {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  error: string | null;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  dismissNotification: (id: string) => Promise<void>;
  clearAll: () => Promise<void>;
}

const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined);

export const NotificationsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { checkPermission } = useAuth();

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = () => {
    try {
      const notificationsData = getNotifications();
      const unread = getUnreadNotifications();
      
      setNotifications(notificationsData);
      setUnreadCount(unread.length);
      setIsLoading(false);
    } catch (error) {
      setError('Failed to load notifications');
      setIsLoading(false);
    }
  };

  const markAsRead = async (id: string): Promise<void> => {
    if (!checkPermission('notifications', 'edit')) {
      throw new Error('Unauthorized: You do not have permission to mark notifications as read');
    }
    
    try {
      // Simulate server delay
      await new Promise(resolve => setTimeout(resolve, 200));
      
      const updatedNotification = markNotificationAsRead(id);
      
      if (updatedNotification) {
        setNotifications(prev => 
          prev.map(notification => 
            notification.id === id ? { ...notification, read: true } : notification
          )
        );
        setUnreadCount(prev => prev - 1);
      }
    } catch (error) {
      setError('Failed to mark notification as read');
      throw error;
    }
  };

  const markAllAsRead = async (): Promise<void> => {
    if (!checkPermission('notifications', 'edit')) {
      throw new Error('Unauthorized: You do not have permission to mark notifications as read');
    }
    
    try {
      // Simulate server delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      markAllNotificationsAsRead();
      
      setNotifications(prev => 
        prev.map(notification => ({ ...notification, read: true }))
      );
      setUnreadCount(0);
    } catch (error) {
      setError('Failed to mark all notifications as read');
      throw error;
    }
  };

  const dismissNotification = async (id: string): Promise<void> => {
    if (!checkPermission('notifications', 'delete')) {
      throw new Error('Unauthorized: You do not have permission to dismiss notifications');
    }
    
    try {
      // Simulate server delay
      await new Promise(resolve => setTimeout(resolve, 200));
      
      const isDeleted = deleteNotification(id);
      
      if (isDeleted) {
        const notification = notifications.find(n => n.id === id);
        const wasUnread = notification && !notification.read;
        
        setNotifications(prev => prev.filter(notification => notification.id !== id));
        
        if (wasUnread) {
          setUnreadCount(prev => prev - 1);
        }
      }
    } catch (error) {
      setError('Failed to dismiss notification');
      throw error;
    }
  };

  const clearAll = async (): Promise<void> => {
    if (!checkPermission('notifications', 'delete')) {
      throw new Error('Unauthorized: You do not have permission to clear notifications');
    }
    
    try {
      // Simulate server delay
      await new Promise(resolve => setTimeout(resolve, 400));
      
      clearAllNotifications();
      
      setNotifications([]);
      setUnreadCount(0);
    } catch (error) {
      setError('Failed to clear notifications');
      throw error;
    }
  };

  const value = {
    notifications,
    unreadCount,
    isLoading,
    error,
    markAsRead,
    markAllAsRead,
    dismissNotification,
    clearAll
  };

  return <NotificationsContext.Provider value={value}>{children}</NotificationsContext.Provider>;
};

export const useNotifications = (): NotificationsContextType => {
  const context = useContext(NotificationsContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationsProvider');
  }
  return context;
};