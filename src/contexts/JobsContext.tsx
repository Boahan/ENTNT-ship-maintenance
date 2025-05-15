import React, { createContext, useContext, useEffect, useState } from 'react';
import { Job, JobStatus } from '../types';
import { 
  getJobs, 
  getJobsByShipId, 
  getJobsByComponentId,
  getJobsByEngineerId,
  addJob, 
  updateJob, 
  deleteJob 
} from '../utils/localStorageUtils';
import { generateId } from '../utils/generateId';
import { useAuth } from './AuthContext';

interface JobsContextType {
  jobs: Job[];
  isLoading: boolean;
  error: string | null;
  getJobById: (id: string) => Job | undefined;
  getJobsForShip: (shipId: string) => Job[];
  getJobsForComponent: (componentId: string) => Job[];
  getJobsForEngineer: (engineerId: string) => Job[];
  createJob: (job: Omit<Job, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Job>;
  editJob: (id: string, updates: Partial<Job>) => Promise<Job | null>;
  updateJobStatus: (id: string, status: JobStatus) => Promise<Job | null>;
  removeJob: (id: string) => Promise<boolean>;
}

const JobsContext = createContext<JobsContextType | undefined>(undefined);

export const JobsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { checkPermission, user } = useAuth();

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = () => {
    try {
      const jobsData = getJobs();
      setJobs(jobsData);
      setIsLoading(false);
    } catch (error) {
      setError('Failed to load jobs');
      setIsLoading(false);
    }
  };

  const getJobById = (id: string) => {
    return jobs.find(job => job.id === id);
  };

  const getJobsForShip = (shipId: string) => {
    return jobs.filter(job => job.shipId === shipId);
  };

  const getJobsForComponent = (componentId: string) => {
    return jobs.filter(job => job.componentId === componentId);
  };

  const getJobsForEngineer = (engineerId: string) => {
    return jobs.filter(job => job.assignedEngineerId === engineerId);
  };

  const createJob = async (jobData: Omit<Job, 'id' | 'createdAt' | 'updatedAt'>): Promise<Job> => {
    if (!checkPermission('jobs', 'create')) {
      throw new Error('Unauthorized: You do not have permission to create jobs');
    }
    
    setIsLoading(true);
    try {
      // Simulate server delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const now = new Date().toISOString();
      const newJob: Job = {
        ...jobData,
        id: `j${generateId()}`,
        createdAt: now,
        updatedAt: now
      };
      
      const addedJob = addJob(newJob);
      setJobs(prev => [...prev, addedJob]);
      setIsLoading(false);
      return addedJob;
    } catch (error) {
      setError('Failed to create job');
      setIsLoading(false);
      throw error;
    }
  };

  const editJob = async (id: string, updates: Partial<Job>): Promise<Job | null> => {
    // If user is Engineer, they can only update their assigned jobs
    if (user?.role === 'Engineer' && getJobById(id)?.assignedEngineerId !== user.id) {
      throw new Error('Unauthorized: You can only update jobs assigned to you');
    }
    
    if (!checkPermission('jobs', 'edit')) {
      throw new Error('Unauthorized: You do not have permission to edit jobs');
    }
    
    setIsLoading(true);
    try {
      // Simulate server delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const updatedJob = updateJob(id, updates);
      
      if (updatedJob) {
        setJobs(prev => prev.map(job => job.id === id ? updatedJob : job));
      }
      
      setIsLoading(false);
      return updatedJob;
    } catch (error) {
      setError('Failed to update job');
      setIsLoading(false);
      throw error;
    }
  };

  const updateJobStatus = async (id: string, status: JobStatus): Promise<Job | null> => {
    // If user is Engineer, they can only update their assigned jobs
    if (user?.role === 'Engineer' && getJobById(id)?.assignedEngineerId !== user.id) {
      throw new Error('Unauthorized: You can only update jobs assigned to you');
    }
    
    if (!checkPermission('jobs', 'edit')) {
      throw new Error('Unauthorized: You do not have permission to edit jobs');
    }
    
    setIsLoading(true);
    try {
      // Simulate server delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const updates: Partial<Job> = { status };
      
      // If status is Completed, add completion date
      if (status === 'Completed') {
        updates.completedDate = new Date().toISOString();
      }
      
      const updatedJob = updateJob(id, updates);
      
      if (updatedJob) {
        setJobs(prev => prev.map(job => job.id === id ? updatedJob : job));
      }
      
      setIsLoading(false);
      return updatedJob;
    } catch (error) {
      setError('Failed to update job status');
      setIsLoading(false);
      throw error;
    }
  };

  const removeJob = async (id: string): Promise<boolean> => {
    if (!checkPermission('jobs', 'delete')) {
      throw new Error('Unauthorized: You do not have permission to delete jobs');
    }
    
    setIsLoading(true);
    try {
      // Simulate server delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const isDeleted = deleteJob(id);
      
      if (isDeleted) {
        setJobs(prev => prev.filter(job => job.id !== id));
      }
      
      setIsLoading(false);
      return isDeleted;
    } catch (error) {
      setError('Failed to delete job');
      setIsLoading(false);
      throw error;
    }
  };

  const value = {
    jobs,
    isLoading,
    error,
    getJobById,
    getJobsForShip,
    getJobsForComponent,
    getJobsForEngineer,
    createJob,
    editJob,
    updateJobStatus,
    removeJob
  };

  return <JobsContext.Provider value={value}>{children}</JobsContext.Provider>;
};

export const useJobs = (): JobsContextType => {
  const context = useContext(JobsContext);
  if (context === undefined) {
    throw new Error('useJobs must be used within a JobsProvider');
  }
  return context;
};