import React, { useState, useEffect } from 'react';
import FormField from '../Common/FormField';
import ActionButton from '../Common/ActionButton';
import { Job, JobType, JobPriority, JobStatus, User, ShipComponent, Ship } from '../../types';
import { Save, X } from 'lucide-react';
import { getUsers } from '../../utils/localStorageUtils';

interface JobFormProps {
  initialData?: Partial<Job>;
  components: ShipComponent[];
  ships: Ship[];
  onSubmit: (data: Omit<Job, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
  isSubmitting: boolean;
  currentComponentId?: string;
  currentShipId?: string;
}

const JobForm: React.FC<JobFormProps> = ({ 
  initialData, 
  components,
  ships,
  onSubmit, 
  onCancel,
  isSubmitting,
  currentComponentId,
  currentShipId
}) => {
  const [engineers, setEngineers] = useState<User[]>([]);
  const [selectedShipId, setSelectedShipId] = useState<string>(currentShipId || initialData?.shipId || '');
  const [filteredComponents, setFilteredComponents] = useState<ShipComponent[]>(components);
  
  const [formData, setFormData] = useState<Omit<Job, 'id' | 'createdAt' | 'updatedAt'>>({
    componentId: currentComponentId || '',
    shipId: currentShipId || '',
    type: 'Inspection',
    priority: 'Medium',
    status: 'Open',
    assignedEngineerId: '',
    scheduledDate: '',
    description: '',
    ...initialData,
    // Ensure dates are in the correct format for input fields
    scheduledDate: initialData?.scheduledDate 
      ? new Date(initialData.scheduledDate).toISOString().split('T')[0]
      : '',
    completedDate: initialData?.completedDate
      ? new Date(initialData.completedDate).toISOString().split('T')[0]
      : ''
  });
  
  const [errors, setErrors] = useState<{
    componentId?: string;
    shipId?: string;
    assignedEngineerId?: string;
    scheduledDate?: string;
  }>({});
  
  // Load engineers
  useEffect(() => {
    const users = getUsers();
    const engineerUsers = users.filter(user => user.role === 'Engineer');
    setEngineers(engineerUsers);
    
    // Set default engineer if needed
    if (!formData.assignedEngineerId && engineerUsers.length > 0) {
      setFormData(prev => ({
        ...prev,
        assignedEngineerId: engineerUsers[0].id
      }));
    }
  }, []);
  
  // Update form data when initialData changes
  useEffect(() => {
    if (initialData) {
      setFormData(prev => ({
        ...prev,
        ...initialData,
        // Ensure dates are in the correct format for input fields
        scheduledDate: initialData.scheduledDate 
          ? new Date(initialData.scheduledDate).toISOString().split('T')[0]
          : prev.scheduledDate,
        completedDate: initialData.completedDate
          ? new Date(initialData.completedDate).toISOString().split('T')[0]
          : prev.completedDate
      }));
    }
  }, [initialData]);
  
  // Filter components based on selected ship
  useEffect(() => {
    if (selectedShipId) {
      const filtered = components.filter(comp => comp.shipId === selectedShipId);
      setFilteredComponents(filtered);
    } else {
      setFilteredComponents(components);
    }
  }, [selectedShipId, components]);
  
  const validateForm = (): boolean => {
    const newErrors: typeof errors = {};
    
    if (!formData.componentId) {
      newErrors.componentId = 'Component is required';
    }
    
    if (!formData.shipId) {
      newErrors.shipId = 'Ship is required';
    }
    
    if (!formData.assignedEngineerId) {
      newErrors.assignedEngineerId = 'Assigned Engineer is required';
    }
    
    if (!formData.scheduledDate) {
      newErrors.scheduledDate = 'Scheduled date is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Special handling for ship selection to filter components
    if (name === 'shipId') {
      setSelectedShipId(value);
      
      // Clear componentId if the ship changes (unless we're in edit mode)
      if (!initialData?.id && formData.componentId) {
        const componentBelongsToShip = components.some(
          comp => comp.id === formData.componentId && comp.shipId === value
        );
        
        if (!componentBelongsToShip) {
          setFormData(prev => ({ ...prev, shipId: value, componentId: '' }));
          return;
        }
      }
    }
    
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when field is edited
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          label="Ship"
          name="shipId"
          type="select"
          value={formData.shipId}
          onChange={handleChange}
          required
          error={errors.shipId}
          disabled={!!currentShipId}
        >
          <option value="">Select a ship</option>
          {ships.map(ship => (
            <option key={ship.id} value={ship.id}>
              {ship.name} (IMO: {ship.imo})
            </option>
          ))}
        </FormField>
        
        <FormField
          label="Component"
          name="componentId"
          type="select"
          value={formData.componentId}
          onChange={handleChange}
          required
          error={errors.componentId}
          disabled={!!currentComponentId}
        >
          <option value="">Select a component</option>
          {filteredComponents.map(component => (
            <option key={component.id} value={component.id}>
              {component.name} (S/N: {component.serialNumber})
            </option>
          ))}
        </FormField>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FormField
          label="Job Type"
          name="type"
          type="select"
          value={formData.type}
          onChange={handleChange}
          required
        >
          <option value="Inspection">Inspection</option>
          <option value="Repair">Repair</option>
          <option value="Replacement">Replacement</option>
          <option value="Maintenance">Maintenance</option>
          <option value="Emergency">Emergency</option>
        </FormField>
        
        <FormField
          label="Priority"
          name="priority"
          type="select"
          value={formData.priority}
          onChange={handleChange}
          required
        >
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
          <option value="Critical">Critical</option>
        </FormField>
        
        <FormField
          label="Status"
          name="status"
          type="select"
          value={formData.status}
          onChange={handleChange}
          required
        >
          <option value="Open">Open</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
          <option value="Delayed">Delayed</option>
          <option value="Cancelled">Cancelled</option>
        </FormField>
      </div>
      
      <FormField
        label="Assigned Engineer"
        name="assignedEngineerId"
        type="select"
        value={formData.assignedEngineerId}
        onChange={handleChange}
        required
        error={errors.assignedEngineerId}
      >
        <option value="">Select an engineer</option>
        {engineers.map(engineer => (
          <option key={engineer.id} value={engineer.id}>
            {engineer.name || engineer.email}
          </option>
        ))}
      </FormField>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          label="Scheduled Date"
          name="scheduledDate"
          type="date"
          value={formData.scheduledDate}
          onChange={handleChange}
          required
          error={errors.scheduledDate}
        />
        
        {formData.status === 'Completed' && (
          <FormField
            label="Completed Date"
            name="completedDate"
            type="date"
            value={formData.completedDate || ''}
            onChange={handleChange}
          />
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          label="Estimated Duration (hours)"
          name="estimatedDuration"
          type="number"
          value={formData.estimatedDuration || ''}
          onChange={handleChange}
        />
        
        {formData.status === 'Completed' && (
          <FormField
            label="Actual Duration (hours)"
            name="actualDuration"
            type="number"
            value={formData.actualDuration || ''}
            onChange={handleChange}
          />
        )}
      </div>
      
      <FormField
        label="Description"
        name="description"
        type="textarea"
        value={formData.description || ''}
        onChange={handleChange}
        placeholder="Enter job description"
      />
      
      {formData.status !== 'Open' && (
        <FormField
          label="Notes"
          name="notes"
          type="textarea"
          value={formData.notes || ''}
          onChange={handleChange}
          placeholder="Enter job notes, progress updates, or issues encountered"
        />
      )}
      
      <div className="flex justify-end space-x-3">
        <ActionButton
          text="Cancel"
          onClick={onCancel}
          variant="secondary"
          icon={<X className="h-4 w-4" />}
        />
        
        <ActionButton
          text={initialData?.id ? "Update Job" : "Create Job"}
          onClick={() => {}}
          type="submit"
          variant="primary"
          icon={<Save className="h-4 w-4" />}
          disabled={isSubmitting}
        />
      </div>
    </form>
  );
};

export default JobForm;