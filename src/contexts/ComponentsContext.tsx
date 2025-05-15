import React, { createContext, useContext, useEffect, useState } from 'react';
import { ShipComponent } from '../types';
import { 
  getComponents, 
  getComponentsByShipId, 
  addComponent, 
  updateComponent, 
  deleteComponent 
} from '../utils/localStorageUtils';
import { generateId } from '../utils/generateId';
import { useAuth } from './AuthContext';

interface ComponentsContextType {
  components: ShipComponent[];
  isLoading: boolean;
  error: string | null;
  getComponentById: (id: string) => ShipComponent | undefined;
  getComponentsForShip: (shipId: string) => ShipComponent[];
  createComponent: (component: Omit<ShipComponent, 'id'>) => Promise<ShipComponent>;
  editComponent: (id: string, updates: Partial<ShipComponent>) => Promise<ShipComponent | null>;
  removeComponent: (id: string) => Promise<boolean>;
}

const ComponentsContext = createContext<ComponentsContextType | undefined>(undefined);

export const ComponentsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [components, setComponents] = useState<ShipComponent[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { checkPermission } = useAuth();

  useEffect(() => {
    loadComponents();
  }, []);

  const loadComponents = () => {
    try {
      const componentsData = getComponents();
      setComponents(componentsData);
      setIsLoading(false);
    } catch (error) {
      setError('Failed to load components');
      setIsLoading(false);
    }
  };

  const getComponentById = (id: string) => {
    return components.find(component => component.id === id);
  };

  const getComponentsForShip = (shipId: string) => {
    return components.filter(component => component.shipId === shipId);
  };

  const createComponent = async (componentData: Omit<ShipComponent, 'id'>): Promise<ShipComponent> => {
    if (!checkPermission('components', 'create')) {
      throw new Error('Unauthorized: You do not have permission to create components');
    }
    
    setIsLoading(true);
    try {
      // Simulate server delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newComponent: ShipComponent = {
        ...componentData,
        id: `c${generateId()}`
      };
      
      const addedComponent = addComponent(newComponent);
      setComponents(prev => [...prev, addedComponent]);
      setIsLoading(false);
      return addedComponent;
    } catch (error) {
      setError('Failed to create component');
      setIsLoading(false);
      throw error;
    }
  };

  const editComponent = async (id: string, updates: Partial<ShipComponent>): Promise<ShipComponent | null> => {
    if (!checkPermission('components', 'edit')) {
      throw new Error('Unauthorized: You do not have permission to edit components');
    }
    
    setIsLoading(true);
    try {
      // Simulate server delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const updatedComponent = updateComponent(id, updates);
      
      if (updatedComponent) {
        setComponents(prev => prev.map(component => component.id === id ? updatedComponent : component));
      }
      
      setIsLoading(false);
      return updatedComponent;
    } catch (error) {
      setError('Failed to update component');
      setIsLoading(false);
      throw error;
    }
  };

  const removeComponent = async (id: string): Promise<boolean> => {
    if (!checkPermission('components', 'delete')) {
      throw new Error('Unauthorized: You do not have permission to delete components');
    }
    
    setIsLoading(true);
    try {
      // Simulate server delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const isDeleted = deleteComponent(id);
      
      if (isDeleted) {
        setComponents(prev => prev.filter(component => component.id !== id));
      }
      
      setIsLoading(false);
      return isDeleted;
    } catch (error) {
      setError('Failed to delete component');
      setIsLoading(false);
      throw error;
    }
  };

  const value = {
    components,
    isLoading,
    error,
    getComponentById,
    getComponentsForShip,
    createComponent,
    editComponent,
    removeComponent
  };

  return <ComponentsContext.Provider value={value}>{children}</ComponentsContext.Provider>;
};

export const useComponents = (): ComponentsContextType => {
  const context = useContext(ComponentsContext);
  if (context === undefined) {
    throw new Error('useComponents must be used within a ComponentsProvider');
  }
  return context;
};