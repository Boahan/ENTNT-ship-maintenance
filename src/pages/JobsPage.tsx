import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, FilterIcon, Calendar } from 'lucide-react';
import PageHeader from '../components/Common/PageHeader';
import ActionButton from '../components/Common/ActionButton';
import JobCard from '../components/Jobs/JobCard';
import Modal from '../components/Common/Modal';
import JobForm from '../components/Jobs/JobForm';
import EmptyState from '../components/Common/EmptyState';
import { useJobs } from '../contexts/JobsContext';
import { useComponents } from '../contexts/ComponentsContext';
import { useShips } from '../contexts/ShipsContext';
import { useAuth } from '../contexts/AuthContext';
import { formatDate } from '../utils/dateUtils';
import { Job, JobStatus, JobPriority } from '../types';

const JobsPage: React.FC = () => {
  const navigate = useNavigate();
  const { jobs, isLoading, createJob, editJob, updateJobStatus } = useJobs();
  const { components } = useComponents();
  const { ships } = useShips();
  const { checkPermission, user } = useAuth();
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [filterShipId, setFilterShipId] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [filterPriority, setFilterPriority] = useState<string>('');
  const [filterComponentId, setFilterComponentId] = useState<string>('');
  const [showOnlyMine, setShowOnlyMine] = useState<boolean>(user?.role === 'Engineer');
  
  const canCreate = checkPermission('jobs', 'create');
  const canEdit = checkPermission('jobs', 'edit');
  
  useEffect(() => {
    document.title = "Maintenance Jobs | ENTNT Marine";
  }, []);
  
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
  
  const handleEditJob = async (jobData: Omit<Job, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!selectedJob) return;
    
    setIsSubmitting(true);
    try {
      await editJob(selectedJob.id, jobData);
      setIsViewModalOpen(false);
      setSelectedJob(null);
    } catch (error) {
      console.error('Error updating job:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleUpdateStatus = async (id: string, status: JobStatus) => {
    setIsSubmitting(true);
    try {
      await updateJobStatus(id, status);
      
      // Update local state if we're viewing the job that was updated
      if (selectedJob && selectedJob.id === id) {
        setSelectedJob({ ...selectedJob, status });
      }
    } catch (error) {
      console.error('Error updating job status:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const resetFilters = () => {
    setSearchTerm('');
    setFilterShipId('');
    setFilterStatus('');
    setFilterPriority('');
    setFilterComponentId('');
    setShowOnlyMine(user?.role === 'Engineer');
  };
  
  const filteredJobs = jobs.filter(job => {
    // Filter by search term (checks component name)
    if (searchTerm) {
      const component = components.find(c => c.id === job.componentId);
      const componentNameMatch = component && component.name.toLowerCase().includes(searchTerm.toLowerCase());
      const descriptionMatch = job.description && job.description.toLowerCase().includes(searchTerm.toLowerCase());
      const shipName = ships.find(s => s.id === job.shipId)?.name;
      const shipNameMatch = shipName && shipName.toLowerCase().includes(searchTerm.toLowerCase());
      
      if (!componentNameMatch && !descriptionMatch && !shipNameMatch) {
        return false;
      }
    }
    
    // Filter by ship
    if (filterShipId && job.shipId !== filterShipId) {
      return false;
    }
    
    // Filter by status
    if (filterStatus && job.status !== filterStatus) {
      return false;
    }
    
    // Filter by priority
    if (filterPriority && job.priority !== filterPriority) {
      return false;
    }
    
    // Filter by component
    if (filterComponentId && job.componentId !== filterComponentId) {
      return false;
    }
    
    // Filter by assigned to me (for engineers)
    if (showOnlyMine && user?.role === 'Engineer' && job.assignedEngineerId !== user.id) {
      return false;
    }
    
    return true;
  });
  
  return (
    <div>
      <PageHeader
        title="Maintenance Jobs"
        subtitle="Manage and track maintenance activities across your fleet"
        actions={
          <div className="flex space-x-2">
            <button
              onClick={() => navigate('/calendar')}
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
            >
              <Calendar className="h-4 w-4 mr-1" />
              Calendar View
            </button>
            
            {canCreate && (
              <ActionButton
                text="Create Job"
                onClick={() => setIsCreateModalOpen(true)}
                icon={<Plus className="h-4 w-4" />}
              />
            )}
          </div>
        }
      />
      
      <div className="mb-6 bg-white rounded-lg shadow p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="lg:col-span-5">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                placeholder="Search by component name, ship name or description"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="ship-filter" className="block text-sm font-medium text-gray-700 mb-1">
              Ship
            </label>
            <select
              id="ship-filter"
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm rounded-md"
              value={filterShipId}
              onChange={(e) => setFilterShipId(e.target.value)}
            >
              <option value="">All Ships</option>
              {ships.map(ship => (
                <option key={ship.id} value={ship.id}>
                  {ship.name}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="component-filter" className="block text-sm font-medium text-gray-700 mb-1">
              Component
            </label>
            <select
              id="component-filter"
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm rounded-md"
              value={filterComponentId}
              onChange={(e) => setFilterComponentId(e.target.value)}
            >
              <option value="">All Components</option>
              {components.map(component => (
                <option key={component.id} value={component.id}>
                  {component.name}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              id="status-filter"
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm rounded-md"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="">All Statuses</option>
              <option value="Open">Open</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="Delayed">Delayed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="priority-filter" className="block text-sm font-medium text-gray-700 mb-1">
              Priority
            </label>
            <select
              id="priority-filter"
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm rounded-md"
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
            >
              <option value="">All Priorities</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Critical">Critical</option>
            </select>
          </div>
          
          <div className="flex items-center justify-between lg:col-span-5">
            {user?.role === 'Engineer' && (
              <div className="flex items-center">
                <input
                  id="show-mine"
                  type="checkbox"
                  className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                  checked={showOnlyMine}
                  onChange={(e) => setShowOnlyMine(e.target.checked)}
                />
                <label htmlFor="show-mine" className="ml-2 block text-sm text-gray-900">
                  Show only my assigned jobs
                </label>
              </div>
            )}
            
            <button
              className="text-sm text-gray-600 hover:text-gray-900 flex items-center"
              onClick={resetFilters}
            >
              <FilterIcon className="h-4 w-4 mr-1" />
              Reset Filters
            </button>
          </div>
        </div>
      </div>
      
      {isLoading ? (
        <div className="text-center py-12">
          <div className="spinner"></div>
          <p className="mt-2 text-gray-500">Loading maintenance jobs...</p>
        </div>
      ) : filteredJobs.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredJobs.map(job => (
            <JobCard
              key={job.id}
              job={job}
              onView={handleViewJob}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No maintenance jobs found"
          message={searchTerm || filterShipId || filterStatus || filterPriority || filterComponentId
            ? "Try adjusting your search terms or filters"
            : "Create your first maintenance job to start tracking maintenance activities"}
          icon={<Calendar className="h-6 w-6" />}
          action={
            canCreate && (
              <ActionButton
                text="Create Job"
                onClick={() => setIsCreateModalOpen(true)}
                icon={<Plus className="h-4 w-4" />}
              />
            )
          }
        />
      )}
      
      {/* Create Job Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create Maintenance Job"
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
      
      {/* View/Edit Job Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setSelectedJob(null);
        }}
        title={selectedJob ? `${selectedJob.type} Job` : 'Job Details'}
        size="lg"
      >
        {selectedJob && (
          <>
            {canEdit ? (
              <JobForm
                initialData={selectedJob}
                components={components}
                ships={ships}
                onSubmit={handleEditJob}
                onCancel={() => {
                  setIsViewModalOpen(false);
                  setSelectedJob(null);
                }}
                isSubmitting={isSubmitting}
              />
            ) : (
              <div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Job Details</h3>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <dl className="grid grid-cols-2 gap-x-4 gap-y-2">
                        <dt className="text-sm font-medium text-gray-500">Job Type:</dt>
                        <dd className="text-sm text-gray-900">{selectedJob.type}</dd>
                        
                        <dt className="text-sm font-medium text-gray-500">Priority:</dt>
                        <dd className="text-sm text-gray-900">{selectedJob.priority}</dd>
                        
                        <dt className="text-sm font-medium text-gray-500">Status:</dt>
                        <dd className="text-sm text-gray-900">{selectedJob.status}</dd>
                        
                        <dt className="text-sm font-medium text-gray-500">Scheduled:</dt>
                        <dd className="text-sm text-gray-900">
                          {formatDate(selectedJob.scheduledDate)}
                        </dd>
                        
                        {selectedJob.completedDate && (
                          <>
                            <dt className="text-sm font-medium text-gray-500">Completed:</dt>
                            <dd className="text-sm text-gray-900">
                              {formatDate(selectedJob.completedDate)}
                            </dd>
                          </>
                        )}
                      </dl>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Related Information</h3>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <dl className="grid grid-cols-1 gap-y-2">
                        <dt className="text-sm font-medium text-gray-500">Ship:</dt>
                        <dd className="text-sm text-gray-900">
                          {ships.find(s => s.id === selectedJob.shipId)?.name || 'Unknown Ship'}
                        </dd>
                        
                        <dt className="text-sm font-medium text-gray-500">Component:</dt>
                        <dd className="text-sm text-gray-900">
                          {components.find(c => c.id === selectedJob.componentId)?.name || 'Unknown Component'}
                        </dd>
                        
                        <dt className="text-sm font-medium text-gray-500">Assigned Engineer:</dt>
                        <dd className="text-sm text-gray-900">
                          {/* We'd need to fetch the engineer name here */}
                          Engineer (ID: {selectedJob.assignedEngineerId})
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
                
                {(selectedJob.description || selectedJob.notes) && (
                  <div className="mb-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Notes</h3>
                    <div className="bg-gray-50 rounded-lg p-4">
                      {selectedJob.description && (
                        <div className="mb-4">
                          <h4 className="text-sm font-medium text-gray-700">Description:</h4>
                          <p className="text-sm text-gray-900 mt-1">{selectedJob.description}</p>
                        </div>
                      )}
                      
                      {selectedJob.notes && (
                        <div>
                          <h4 className="text-sm font-medium text-gray-700">Work Notes:</h4>
                          <p className="text-sm text-gray-900 mt-1">{selectedJob.notes}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                
                {selectedJob.status !== 'Completed' && selectedJob.status !== 'Cancelled' && canEdit && (
                  <div className="border-t border-gray-200 pt-4">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Update Status</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedJob.status !== 'Open' && (
                        <button
                          onClick={() => handleUpdateStatus(selectedJob.id, 'Open')}
                          className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                          disabled={isSubmitting}
                        >
                          Set to Open
                        </button>
                      )}
                      
                      {selectedJob.status !== 'In Progress' && (
                        <button
                          onClick={() => handleUpdateStatus(selectedJob.id, 'In Progress')}
                          className="inline-flex items-center px-3 py-1.5 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                          disabled={isSubmitting}
                        >
                          Start Work
                        </button>
                      )}
                      
                      {selectedJob.status !== 'Completed' && (
                        <button
                          onClick={() => handleUpdateStatus(selectedJob.id, 'Completed')}
                          className="inline-flex items-center px-3 py-1.5 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                          disabled={isSubmitting}
                        >
                          Complete
                        </button>
                      )}
                      
                      {selectedJob.status !== 'Delayed' && (
                        <button
                          onClick={() => handleUpdateStatus(selectedJob.id, 'Delayed')}
                          className="inline-flex items-center px-3 py-1.5 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-yellow-600 hover:bg-yellow-700"
                          disabled={isSubmitting}
                        >
                          Mark Delayed
                        </button>
                      )}
                      
                      {selectedJob.status !== 'Cancelled' && (
                        <button
                          onClick={() => handleUpdateStatus(selectedJob.id, 'Cancelled')}
                          className="inline-flex items-center px-3 py-1.5 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
                          disabled={isSubmitting}
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </Modal>
    </div>
  );
};

export default JobsPage;