import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, AuthState, UserRole } from '../types';
import { 
  getCurrentUser, 
  setCurrentUser, 
  clearCurrentUser, 
  getUserByEmail,
  initializeLocalStorage
} from '../utils/localStorageUtils';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  checkPermission: (resource: string, action: 'view' | 'create' | 'edit' | 'delete') => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null
  });

  useEffect(() => {
    // Initialize local storage with default data if empty
    initializeLocalStorage();
    
    // Check if user is already logged in
    const user = getCurrentUser();
    
    setState({
      user,
      isAuthenticated: !!user,
      isLoading: false,
      error: null
    });
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setState(prevState => ({ ...prevState, isLoading: true, error: null }));
    
    try {
      // Simulate server call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const user = getUserByEmail(email);
      
      if (!user || user.password !== password) {
        setState(prevState => ({
          ...prevState,
          isLoading: false,
          error: 'Invalid email or password'
        }));
        return false;
      }
      
      setCurrentUser(user);
      
      setState({
        user,
        isAuthenticated: true,
        isLoading: false,
        error: null
      });
      
      return true;
    } catch (error) {
      setState(prevState => ({
        ...prevState,
        isLoading: false,
        error: 'Failed to login. Please try again.'
      }));
      return false;
    }
  };

  const logout = () => {
    clearCurrentUser();
    setState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null
    });
  };

  const checkPermission = (
    resource: string, 
    action: 'view' | 'create' | 'edit' | 'delete'
  ): boolean => {
    // This is a simplified version; in a real app, you might want to use the roleUtils
    const { user } = state;
    if (!user) return false;
    
    const role = user.role as UserRole;
    
    // Admin has all permissions
    if (role === 'Admin') return true;
    
    // Inspector permissions
    if (role === 'Inspector') {
      if (resource === 'ships' && action === 'view') return true;
      if (resource === 'components' && ['view', 'create', 'edit'].includes(action)) return true;
      if (resource === 'jobs' && ['view', 'create', 'edit'].includes(action)) return true;
      return false;
    }
    
    // Engineer permissions
    if (role === 'Engineer') {
      if (['ships', 'components', 'jobs'].includes(resource) && action === 'view') return true;
      if (resource === 'jobs' && action === 'edit') return true;
      return false;
    }
    
    return false;
  };

  const value = {
    ...state,
    login,
    logout,
    checkPermission
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};