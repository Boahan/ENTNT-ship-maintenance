import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import PageHeader from '../components/Common/PageHeader';
import ActionButton from '../components/Common/ActionButton';
import CalendarView from '../components/Calendar/CalendarView';
import Modal from '../components/Common/Modal';
import JobForm from '../components/Jobs/JobForm';
import { useJobs } from '../contexts/JobsContext';
import { useComponents } from '../contexts/ComponentsContext';
import { useShips } from '../contexts/ShipsContext';
import { useAuth } from '../contexts/AuthContext';
import { Job } from '../types';

const CalendarPage: React.FC = () => {
  const navigate = useNavigate();
  const { jobs, isLoading, createJob } = useJobs();
  const { components } = useComponents();
  const { ships } = useShips();
  const { checkPermission, user } = useAuth();
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const canCreate = checkPermission('jobs', 'create');
  
  // Filter jobs for Engineers to only show their assigned jobs
  const filteredJobs = user?.role === 'Engineer'
    ? jobs.filter(job => job.assignedEngineerId === user.id)
    : jobs;
  
  const handleCreateJob = async (jobData: Omit<Job, 'id' | 'createdAt' | 'updatedAt'>) => {
    setIsSubmitting(true);
    try {
      await createJob(jobData);
      setIsCreateModalOpen(false);
    } catch (error) {
      console.error('Error creating job:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleViewJob = (job: Job) => {
    setSelectedJob(job);
    setIsViewModalOpen(true);
  };

  return (
    <div>
      <PageHeader
        title="Maintenance Calendar"
        subtitle="Schedule and view upcoming maintenance activities"
        actions={
          canCreate && (
            <ActionButton
              text="Schedule Job"
              onClick={() => setIsCreateModalOpen(true)}
              icon={<Plus className="h-4 w-4" />}
            />
          )
        }
      />
      
      {isLoading ? (
        <div className="text-center py-12">
          <div className="spinner"></div>
          <p className="mt-2 text-gray-500">Loading calendar...</p>
        </div>
      ) : (
        <CalendarView 
          jobs={filteredJobs}
          onViewJob={handleViewJob}
        />
      )}
      
      {/* Create Job Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Schedule Maintenance Job"
        size="lg"
      >
        <JobForm
          components={components}
          ships={ships}
          onSubmit={handleCreateJob}
          onCancel={() => setIsCreateModalOpen(false)}
          isSubmitting={isSubmitting}
        />
      </Modal>
      
      {/* View Job Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setSelectedJob(null);
        }}
        title={selectedJob ? `Job: ${selectedJob.type}` : 'Job Details'}
      >
        {selectedJob && (
          <div>
            <p className="text-lg mb-4">
              To view complete details and manage this job, please go to the jobs page.
            </p>
            <div className="mt-4 text-center">
              <button
                onClick={() => {
                  setIsViewModalOpen(false);
                  navigate(`/jobs/${selectedJob.id}`);
                }}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
              >
                View Job Details
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default CalendarPage;