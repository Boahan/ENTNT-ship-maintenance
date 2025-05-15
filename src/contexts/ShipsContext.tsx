import React, { createContext, useContext, useEffect, useState } from 'react';
import { Ship } from '../types';
import { getShips, addShip, updateShip, deleteShip } from '../utils/localStorageUtils';
import { generateId } from '../utils/generateId';
import { useAuth } from './AuthContext';

interface ShipsContextType {
  ships: Ship[];
  isLoading: boolean;
  error: string | null;
  getShipById: (id: string) => Ship | undefined;
  createShip: (ship: Omit<Ship, 'id'>) => Promise<Ship>;
  editShip: (id: string, updates: Partial<Ship>) => Promise<Ship | null>;
  removeShip: (id: string) => Promise<boolean>;
}

const ShipsContext = createContext<ShipsContextType | undefined>(undefined);

export const ShipsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [ships, setShips] = useState<Ship[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { checkPermission } = useAuth();

  useEffect(() => {
    loadShips();
  }, []);

  const loadShips = () => {
    try {
      const shipsData = getShips();
      setShips(shipsData);
      setIsLoading(false);
    } catch (error) {
      setError('Failed to load ships');
      setIsLoading(false);
    }
  };

  const getShipById = (id: string) => {
    return ships.find(ship => ship.id === id);
  };

  const createShip = async (shipData: Omit<Ship, 'id'>): Promise<Ship> => {
    if (!checkPermission('ships', 'create')) {
      throw new Error('Unauthorized: You do not have permission to create ships');
    }
    
    setIsLoading(true);
    try {
      // Simulate server delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newShip: Ship = {
        ...shipData,
        id: `s${generateId()}`
      };
      
      const addedShip = addShip(newShip);
      setShips(prev => [...prev, addedShip]);
      setIsLoading(false);
      return addedShip;
    } catch (error) {
      setError('Failed to create ship');
      setIsLoading(false);
      throw error;
    }
  };

  const editShip = async (id: string, updates: Partial<Ship>): Promise<Ship | null> => {
    if (!checkPermission('ships', 'edit')) {
      throw new Error('Unauthorized: You do not have permission to edit ships');
    }
    
    setIsLoading(true);
    try {
      // Simulate server delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const updatedShip = updateShip(id, updates);
      
      if (updatedShip) {
        setShips(prev => prev.map(ship => ship.id === id ? updatedShip : ship));
      }
      
      setIsLoading(false);
      return updatedShip;
    } catch (error) {
      setError('Failed to update ship');
      setIsLoading(false);
      throw error;
    }
  };

  const removeShip = async (id: string): Promise<boolean> => {
    if (!checkPermission('ships', 'delete')) {
      throw new Error('Unauthorized: You do not have permission to delete ships');
    }
    
    setIsLoading(true);
    try {
      // Simulate server delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const isDeleted = deleteShip(id);
      
      if (isDeleted) {
        setShips(prev => prev.filter(ship => ship.id !== id));
      }
      
      setIsLoading(false);
      return isDeleted;
    } catch (error) {
      setError('Failed to delete ship');
      setIsLoading(false);
      throw error;
    }
  };

  const value = {
    ships,
    isLoading,
    error,
    getShipById,
    createShip,
    editShip,
    removeShip
  };

  return <ShipsContext.Provider value={value}>{children}</ShipsContext.Provider>;
};

export const useShips = (): ShipsContextType => {
  const context = useContext(ShipsContext);
  if (context === undefined) {
    throw new Error('useShips must be used within a ShipsProvider');
  }
  return context;
};