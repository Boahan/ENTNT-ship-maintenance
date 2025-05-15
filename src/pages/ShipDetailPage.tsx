import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, Trash, Plus, Calendar, Wrench, AlertTriangle, PenTool as Tool } from 'lucide-react';
import PageHeader from '../components/Common/PageHeader';
import ActionButton from '../components/Common/ActionButton';
import Card from '../components/Common/Card';
import Modal from '../components/Common/Modal';
import Tabs from '../components/Common/Tabs';
import StatusBadge from '../components/Common/StatusBadge';
import ShipForm from '../components/Ships/ShipForm';
import ComponentForm from '../components/Components/ComponentForm';
import ComponentCard from '../components/Components/ComponentCard';
import JobForm from '../components/Jobs/JobForm';
import JobCard from '../components/Jobs/JobCard';
import EmptyState from '../components/Common/EmptyState';
import { useShips } from '../contexts/ShipsContext';
import { useComponents } from '../contexts/ComponentsContext';
import { useJobs } from '../contexts/JobsContext';
import { useAuth } from '../contexts/AuthContext';
import { formatDate } from '../utils/dateUtils';
import { Ship, ShipComponent, Job } from '../types';

const ShipDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { ships, getShipById, editShip, removeShip } = useShips();
  const { components, getComponentsForShip, createComponent, editComponent, removeComponent } = useComponents();
  const { jobs, getJobsForShip, createJob, getJobsForComponent } = useJobs();
  const { checkPermission } = useAuth();
  
  const [ship, setShip] = useState<Ship | null>(null);
  const [shipComponents, setShipComponents] = useState<ShipComponent[]>([]);
  const [shipJobs, setShipJobs] = useState<Job[]>([]);
  
  // Modal states
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isComponentModalOpen, setIsComponentModalOpen] = useState(false);
  const [isComponentViewModalOpen, setIsComponentViewModalOpen] = useState(false);
  const [isJobModalOpen, setIsJobModalOpen] = useState(false);
  const [isJobViewModalOpen, setIsJobViewModalOpen] = useState(false);
  
  // Selected items for modals
  const [selectedComponent, setSelectedComponent] = useState<ShipComponent | null>(null);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  
  // Submission states
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Permissions
  const canEditShip = checkPermission('ships', 'edit');
  const canDeleteShip = checkPermission('ships', 'delete');
  const canCreateComponent = checkPermission('components', 'create');
  const canEditComponent = checkPermission('components', 'edit');
  const canDeleteComponent = checkPermission('components', 'delete');
  const canCreateJob = checkPermission('jobs', 'create');
  
  useEffect(() => {
    if (id) {
      const shipData = getShipById(id);
      if (shipData) {
        setShip(shipData);
        document.title = `${shipData.name} | ENTNT Marine`;
        
        // Load components for this ship
        const components = getComponentsForShip(id);
        setShipComponents(components);
        
        // Load jobs for this ship
        const jobs = getJobsForShip(id);
        setShipJobs(jobs);
      } else {
        navigate('/ships');
      }
    }
  }, [id, ships, components, jobs, getShipById, getComponentsForShip, getJobsForShip, navigate]);
  
  const handleEditShip = async (shipData: Omit<Ship, 'id'>) => {
    if (!ship) return;
    
    setIsSubmitting(true);
    try {
      await editShip(ship.id, shipData);
      setIsEditModalOpen(false);
    } catch (error) {
      console.error('Error updating ship:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleDeleteShip = async () => {
    if (!ship) return;
    
    setIsSubmitting(true);
    try {
      await removeShip(ship.id);
      setIsDeleteModalOpen(false);
      navigate('/ships');
    } catch (error) {
      console.error('Error deleting ship:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleCreateComponent = async (componentData: Omit<ShipComponent, 'id'>) => {
    setIsSubmitting(true);
    try {
      await createComponent(componentData);
      setIsComponentModalOpen(false);
    } catch (error) {
      console.error('Error creating component:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleViewComponent = (component: ShipComponent) => {
    setSelectedComponent(component);
    setIsComponentViewModalOpen(true);
  };
  
  const handleEditComponent = async (componentData: Omit<ShipComponent, 'id'>) => {
    if (!selectedComponent) return;
    
    setIsSubmitting(true);
    try {
      await editComponent(selectedComponent.id, componentData);
      setIsComponentViewModalOpen(false);
      setSelectedComponent(null);
    } catch (error) {
      console.error('Error updating component:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleDeleteComponent = async () => {
    if (!selectedComponent) return;
    
    setIsSubmitting(true);
    try {
      await removeComponent(selectedComponent.id);
      setIsComponentViewModalOpen(false);
      setSelectedComponent(null);
    } catch (error) {
      console.error('Error deleting component:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleCreateJob = async (jobData: Omit<Job, 'id' | 'createdAt' | 'updatedAt'>) => {
    setIsSubmitting(true);
    try {
      await createJob(jobData);
      setIsJobModalOpen(false);
    } catch (error) {
      console.error('Error creating job:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleViewJob = (job: Job) => {
    setSelectedJob(job);
    setIsJobViewModalOpen(true);
  };
  
  // Generate component jobs modal from component view modal
  const handleCreateJobForComponent = () => {
    setIsComponentViewModalOpen(false);
    setIsJobModalOpen(true);
  };
  
  // Stats for overview tab
  const activeComponents = shipComponents.filter(c => c.status === 'Operational').length;
  const needsMaintenanceComponents = shipComponents.filter(c => c.status === 'Needs Maintenance').length;
  const failedComponents = shipComponents.filter(c => c.status === 'Failed').length;
  
  const openJobs = shipJobs.filter(j => j.status === 'Open').length;
  const inProgressJobs = shipJobs.filter(j => j.status === 'In Progress').length;
  const completedJobs = shipJobs.filter(j => j.status === 'Completed').length;
  
  if (!ship) {
    return (
      <div className="text-center py-12">
        <div className="spinner"></div>
        <p className="mt-2 text-gray-500">Loading ship details...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <button
          onClick={() => navigate('/ships')}
          className="text-gray-500 hover:text-gray-700 flex items-center mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Ships
        </button>
        
        <PageHeader
          title={ship.name}
          subtitle={`IMO Number: ${ship.imo} | Flag: ${ship.flag}`}
          actions={
            <div className="flex space-x-2">
              {canEditShip && (
                <ActionButton
                  text="Edit"
                  onClick={() => setIsEditModalOpen(true)}
                  variant="secondary"
                  icon={<Edit className="h-4 w-4" />}
                />
              )}
              
              {canDeleteShip && (
                <ActionButton
                  text="Delete"
                  onClick={() => setIsDeleteModalOpen(true)}
                  variant="danger"
                  icon={<Trash className="h-4 w-4" />}
                />
              )}
            </div>
          }
        />
      </div>
      
      <div className="flex items-center mb-6 space-x-2">
        <StatusBadge status={ship.status} size="lg" />
        
        {ship.registrationDate && (
          <span className="text-sm text-gray-500">
            Registered on {formatDate(ship.registrationDate)}
          </span>
        )}
      </div>
      
      <Tabs
        tabs={[
          {
            id: 'overview',
            label: 'Overview',
            content: (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Components</h3>
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-2xl font-bold text-green-600">{activeComponents}</div>
                        <div className="text-sm text-gray-500">Operational</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-yellow-600">{needsMaintenanceComponents}</div>
                        <div className="text-sm text-gray-500">Needs Maintenance</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-red-600">{failedComponents}</div>
                        <div className="text-sm text-gray-500">Failed</div>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <button
                        onClick={() => setIsComponentModalOpen(true)}
                        className="text-teal-600 hover:text-teal-800 text-sm font-medium"
                        disabled={!canCreateComponent}
                      >
                        <Plus className="h-4 w-4 inline mr-1" />
                        Add Component
                      </button>
                    </div>
                  </Card>
                  
                  <Card>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Maintenance Jobs</h3>
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-2xl font-bold text-blue-600">{openJobs}</div>
                        <div className="text-sm text-gray-500">Open</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-purple-600">{inProgressJobs}</div>
                        <div className="text-sm text-gray-500">In Progress</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-green-600">{completedJobs}</div>
                        <div className="text-sm text-gray-500">Completed</div>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <button
                        onClick={() => setIsJobModalOpen(true)}
                        className="text-teal-600 hover:text-teal-800 text-sm font-medium"
                        disabled={!canCreateJob}
                      >
                        <Plus className="h-4 w-4 inline mr-1" />
                        Create Job
                      </button>
                    </div>
                  </Card>
                  
                  <Card>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Ship Details</h3>
                    <dl className="grid grid-cols-2 gap-x-4 gap-y-2">
                      <dt className="text-sm font-medium text-gray-500">Status</dt>
                      <dd className="text-sm text-gray-900">{ship.status}</dd>
                      
                      <dt className="text-sm font-medium text-gray-500">Last Inspection</dt>
                      <dd className="text-sm text-gray-900">
                        {ship.lastInspectionDate ? formatDate(ship.lastInspectionDate) : 'N/A'}
                      </dd>
                      
                      <dt className="text-sm font-medium text-gray-500">Registration</dt>
                      <dd className="text-sm text-gray-900">
                        {ship.registrationDate ? formatDate(ship.registrationDate) : 'N/A'}
                      </dd>
                      
                      {ship.capacity && (
                        <>
                          <dt className="text-sm font-medium text-gray-500">Capacity</dt>
                          <dd className="text-sm text-gray-900">{ship.capacity} TEU</dd>
                        </>
                      )}
                    </dl>
                  </Card>
                </div>
                
                {ship.description && (
                  <Card>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Description</h3>
                    <p className="text-gray-700">{ship.description}</p>
                  </Card>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card title="Recent Components">
                    {shipComponents.length > 0 ? (
                      <div className="space-y-4">
                        {shipComponents.slice(0, 3).map(component => (
                          <div 
                            key={component.id}
                            className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
                            onClick={() => handleViewComponent(component)}
                          >
                            <div className="flex justify-between items-center">
                              <h4 className="text-base font-medium text-gray-900">{component.name}</h4>
                              <StatusBadge status={component.status || 'Operational'} size="sm" />
                            </div>
                            <p className="text-sm text-gray-500 mt-1">SN: {component.serialNumber}</p>
                          </div>
                        ))}
                        <div className="text-center mt-4">
                          <button
                            className="text-teal-600 hover:text-teal-800 text-sm font-medium"
                            onClick={() => document.getElementById('components-tab')?.click()}
                          >
                            View All Components
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center text-gray-500 py-4">
                        No components added yet
                      </div>
                    )}
                  </Card>
                  
                  <Card title="Recent Maintenance Jobs">
                    {shipJobs.length > 0 ? (
                      <div className="space-y-4">
                        {shipJobs.slice(0, 3).map(job => (
                          <div 
                            key={job.id}
                            className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
                            onClick={() => handleViewJob(job)}
                          >
                            <div className="flex justify-between items-center">
                              <h4 className="text-base font-medium text-gray-900">{job.type}</h4>
                              <StatusBadge status={job.status} size="sm" />
                            </div>
                            <p className="text-sm text-gray-500 mt-1">
                              Scheduled: {formatDate(job.scheduledDate)}
                            </p>
                          </div>
                        ))}
                        <div className="text-center mt-4">
                          <button
                            className="text-teal-600 hover:text-teal-800 text-sm font-medium"
                            onClick={() => document.getElementById('maintenance-tab')?.click()}
                          >
                            View All Jobs
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center text-gray-500 py-4">
                        No maintenance jobs scheduled yet
                      </div>
                    )}
                  </Card>
                </div>
              </div>
            ),
          },
          {
            id: 'components',
            label: 'Components',
            content: (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-medium">Installed Components</h3>
                  {canCreateComponent && (
                    <ActionButton
                      text="Add Component"
                      onClick={() => setIsComponentModalOpen(true)}
                      icon={<Plus className="h-4 w-4" />}
                      size="sm"
                    />
                  )}
                </div>
                
                {shipComponents.length > 0 ? (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {shipComponents.map(component => (
                      <ComponentCard
                        key={component.id}
                        component={component}
                        onView={handleViewComponent}
                      />
                    ))}
                  </div>
                ) : (
                  <EmptyState
                    title="No components found"
                    message="Add components to manage maintenance for this ship"
                    icon={<Tool className="h-6 w-6" />}
                    action={
                      canCreateComponent && (
                        <ActionButton
                          text="Add Component"
                          onClick={() => setIsComponentModalOpen(true)}
                          icon={<Plus className="h-4 w-4" />}
                        />
                      )
                    }
                  />
                )}
              </div>
            ),
          },
          {
            id: 'maintenance',
            label: 'Maintenance',
            content: (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-medium">Maintenance Jobs</h3>
                  {canCreateJob && (
                    <ActionButton
                      text="Create Job"
                      onClick={() => setIsJobModalOpen(true)}
                      icon={<Plus className="h-4 w-4" />}
                      size="sm"
                    />
                  )}
                </div>
                
                {shipJobs.length > 0 ? (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {shipJobs.map(job => (
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
                    message="Create maintenance jobs to keep track of ship maintenance"
                    icon={<Wrench className="h-6 w-6" />}
                    action={
                      canCreateJob && (
                        <ActionButton
                          text="Create Job"
                          onClick={() => setIsJobModalOpen(true)}
                          icon={<Plus className="h-4 w-4" />}
                        />
                      )
                    }
                  />
                )}
              </div>
            ),
          },
          {
            id: 'calendar',
            label: 'Calendar',
            content: (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-medium">Maintenance Calendar</h3>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => navigate('/calendar')}
                      className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded text-gray-700 bg-white hover:bg-gray-50"
                    >
                      <Calendar className="h-4 w-4 mr-1" />
                      View Full Calendar
                    </button>
                    
                    {canCreateJob && (
                      <ActionButton
                        text="Schedule Job"
                        onClick={() => setIsJobModalOpen(true)}
                        icon={<Plus className="h-4 w-4" />}
                        size="sm"
                      />
                    )}
                  </div>
                </div>
                
                {shipJobs.length > 0 ? (
                  <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200">
                      <h3 className="text-base font-medium text-gray-900">
                        Upcoming Maintenance
                      </h3>
                    </div>
                    <ul className="divide-y divide-gray-200">
                      {shipJobs
                        .filter(job => job.status !== 'Completed' && job.status !== 'Cancelled')
                        .sort((a, b) => new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime())
                        .slice(0, 10)
                        .map(job => {
                          const isOverdue = new Date(job.scheduledDate) < new Date();
                          return (
                            <li key={job.id} className="px-6 py-4 hover:bg-gray-50">
                              <button
                                className="w-full text-left"
                                onClick={() => handleViewJob(job)}
                              >
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center">
                                    {isOverdue && (
                                      <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
                                    )}
                                    <div>
                                      <p className="text-sm font-medium text-gray-900">
                                        {job.type}
                                      </p>
                                      <p className="text-sm text-gray-500">
                                        {formatDate(job.scheduledDate)}
                                        {isOverdue && (
                                          <span className="text-red-600 ml-2">
                                            Overdue
                                          </span>
                                        )}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="flex space-x-2">
                                    <StatusBadge status={job.priority} size="sm" />
                                    <StatusBadge status={job.status} size="sm" />
                                  </div>
                                </div>
                              </button>
                            </li>
                          );
                        })}
                    </ul>
                  </div>
                ) : (
                  <EmptyState
                    title="No scheduled maintenance"
                    message="Create maintenance jobs to see them in the calendar"
                    icon={<Calendar className="h-6 w-6" />}
                    action={
                      canCreateJob && (
                        <ActionButton
                          text="Schedule Maintenance"
                          onClick={() => setIsJobModalOpen(true)}
                          icon={<Plus className="h-4 w-4" />}
                        />
                      )
                    }
                  />
                )}
              </div>
            ),
          },
        ]}
      />
      
      {/* Edit Ship Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Ship Details"
      >
        <ShipForm
          initialData={ship}
          onSubmit={handleEditShip}
          onCancel={() => setIsEditModalOpen(false)}
          isSubmitting={isSubmitting}
        />
      </Modal>
      
      {/* Delete Ship Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Ship"
        footer={
          <div className="flex justify-end space-x-3">
            <ActionButton
              text="Cancel"
              onClick={() => setIsDeleteModalOpen(false)}
              variant="secondary"
            />
            <ActionButton
              text="Delete"
              onClick={handleDeleteShip}
              variant="danger"
              disabled={isSubmitting}
            />
          </div>
        }
      >
        <div className="space-y-4">
          <div className="bg-red-50 p-4 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-5 w-5 text-red-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Warning</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>
                    Are you sure you want to delete the ship "{ship.name}"? This action cannot be undone.
                  </p>
                  <p className="mt-2">
                    All components and maintenance jobs associated with this ship will be permanently deleted.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <p className="text-sm text-gray-600">
            To confirm, please acknowledge that you understand the consequences of this action.
          </p>
        </div>
      </Modal>
      
      {/* Add Component Modal */}
      <Modal
        isOpen={isComponentModalOpen}
        onClose={() => setIsComponentModalOpen(false)}
        title="Add Component to Ship"
      >
        <ComponentForm
          ships={ships}
          onSubmit={handleCreateComponent}
          onCancel={() => setIsComponentModalOpen(false)}
          isSubmitting={isSubmitting}
          currentShipId={ship.id}
        />
      </Modal>
      
      {/* View/Edit Component Modal */}
      <Modal
        isOpen={isComponentViewModalOpen}
        onClose={() => {
          setIsComponentViewModalOpen(false);
          setSelectedComponent(null);
        }}
        title={selectedComponent ? selectedComponent.name : 'Component Details'}
      >
        {selectedComponent && (
          <div>
            <div className="mb-4 flex justify-between">
              <StatusBadge status={selectedComponent.status || 'Operational'} />
              <div className="flex space-x-2">
                {canEditComponent && (
                  <button
                    onClick={() => {
                      setIsComponentViewModalOpen(false);
                      setIsComponentModalOpen(true);
                    }}
                    className="text-teal-600 hover:text-teal-800"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                )}
                
                {canDeleteComponent && (
                  <button
                    onClick={handleDeleteComponent}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
            
            <dl className="grid grid-cols-2 gap-x-4 gap-y-3 mb-6">
              <dt className="text-sm font-medium text-gray-500">Serial Number</dt>
              <dd className="text-sm text-gray-900">{selectedComponent.serialNumber}</dd>
              
              <dt className="text-sm font-medium text-gray-500">Category</dt>
              <dd className="text-sm text-gray-900">{selectedComponent.category || 'Not specified'}</dd>
              
              <dt className="text-sm font-medium text-gray-500">Manufacturer</dt>
              <dd className="text-sm text-gray-900">{selectedComponent.manufacturer || 'Not specified'}</dd>
              
              <dt className="text-sm font-medium text-gray-500">Installation Date</dt>
              <dd className="text-sm text-gray-900">{formatDate(selectedComponent.installDate)}</dd>
              
              <dt className="text-sm font-medium text-gray-500">Last Maintenance</dt>
              <dd className="text-sm text-gray-900">{formatDate(selectedComponent.lastMaintenanceDate)}</dd>
              
              {selectedComponent.nextMaintenanceDate && (
                <>
                  <dt className="text-sm font-medium text-gray-500">Next Maintenance</dt>
                  <dd className="text-sm text-gray-900">
                    {formatDate(selectedComponent.nextMaintenanceDate)}
                  </dd>
                </>
              )}
              
              {selectedComponent.description && (
                <>
                  <dt className="text-sm font-medium text-gray-500 col-span-2">Description</dt>
                  <dd className="text-sm text-gray-900 col-span-2">{selectedComponent.description}</dd>
                </>
              )}
            </dl>
            
            {/* Maintenance history */}
            <div className="mt-6 border-t border-gray-200 pt-6">
              <h4 className="text-base font-medium text-gray-900 mb-4">Maintenance History</h4>
              
              {getJobsForComponent(selectedComponent.id).length > 0 ? (
                <ul className="divide-y divide-gray-200 border border-gray-200 rounded-md overflow-hidden">
                  {getJobsForComponent(selectedComponent.id)
                    .sort((a, b) => new Date(b.scheduledDate).getTime() - new Date(a.scheduledDate).getTime())
                    .map(job => (
                      <li 
                        key={job.id}
                        className="px-4 py-3 hover:bg-gray-50 cursor-pointer"
                        onClick={() => {
                          setSelectedComponent(null);
                          setIsComponentViewModalOpen(false);
                          setSelectedJob(job);
                          setIsJobViewModalOpen(true);
                        }}
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <span className="text-sm font-medium text-gray-900">{job.type}</span>
                            <p className="text-xs text-gray-500">
                              {formatDate(job.scheduledDate)}
                            </p>
                          </div>
                          <StatusBadge status={job.status} size="sm" />
                        </div>
                      </li>
                    ))
                  }
                </ul>
              ) : (
                <div className="text-center text-gray-500 py-4 border border-gray-200 rounded-md">
                  No maintenance history available
                </div>
              )}
              
              {canCreateJob && (
                <div className="mt-4 text-center">
                  <button
                    onClick={handleCreateJobForComponent}
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Create Maintenance Job
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>
      
      {/* Create Job Modal */}
      <Modal
        isOpen={isJobModalOpen}
        onClose={() => setIsJobModalOpen(false)}
        title="Create Maintenance Job"
        size="lg"
      >
        <JobForm
          components={components}
          ships={ships}
          onSubmit={handleCreateJob}
          onCancel={() => setIsJobModalOpen(false)}
          isSubmitting={isSubmitting}
          currentShipId={ship.id}
          currentComponentId={selectedComponent?.id}
        />
      </Modal>
      
      {/* View Job Modal */}
      <Modal
        isOpen={isJobViewModalOpen}
        onClose={() => {
          setIsJobViewModalOpen(false);
          setSelectedJob(null);
        }}
        title="Maintenance Job Details"
      >
        {selectedJob && (
          <div>
            <div className="mb-4 flex justify-between">
              <div className="flex space-x-2">
                <StatusBadge status={selectedJob.priority} />
                <StatusBadge status={selectedJob.status} />
              </div>
            </div>
            
            <dl className="grid grid-cols-2 gap-x-4 gap-y-3 mb-6">
              <dt className="text-sm font-medium text-gray-500">Job Type</dt>
              <dd className="text-sm text-gray-900">{selectedJob.type}</dd>
              
              <dt className="text-sm font-medium text-gray-500">Component</dt>
              <dd className="text-sm text-gray-900">
                {getComponentById(selectedJob.componentId)?.name || 'Unknown Component'}
              </dd>
              
              <dt className="text-sm font-medium text-gray-500">Scheduled Date</dt>
              <dd className="text-sm text-gray-900">{formatDate(selectedJob.scheduledDate)}</dd>
              
              {selectedJob.completedDate && (
                <>
                  <dt className="text-sm font-medium text-gray-500">Completed Date</dt>
                  <dd className="text-sm text-gray-900">{formatDate(selectedJob.completedDate)}</dd>
                </>
              )}
              
              <dt className="text-sm font-medium text-gray-500">Estimated Duration</dt>
              <dd className="text-sm text-gray-900">
                {selectedJob.estimatedDuration ? `${selectedJob.estimatedDuration} hours` : 'Not specified'}
              </dd>
              
              {selectedJob.actualDuration && (
                <>
                  <dt className="text-sm font-medium text-gray-500">Actual Duration</dt>
                  <dd className="text-sm text-gray-900">{selectedJob.actualDuration} hours</dd>
                </>
              )}
              
              {selectedJob.description && (
                <>
                  <dt className="text-sm font-medium text-gray-500 col-span-2">Description</dt>
                  <dd className="text-sm text-gray-900 col-span-2">{selectedJob.description}</dd>
                </>
              )}
              
              {selectedJob.notes && (
                <>
                  <dt className="text-sm font-medium text-gray-500 col-span-2">Notes</dt>
                  <dd className="text-sm text-gray-900 col-span-2">{selectedJob.notes}</dd>
                </>
              )}
            </dl>
            
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex justify-end space-x-3">
                <ActionButton
                  text="Close"
                  onClick={() => {
                    setIsJobViewModalOpen(false);
                    setSelectedJob(null);
                  }}
                  variant="secondary"
                />
                
                <button
                  onClick={() => {
                    setIsJobViewModalOpen(false);
                    navigate(`/jobs/${selectedJob.id}`);
                  }}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                >
                  View Full Details
                </button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ShipDetailPage;