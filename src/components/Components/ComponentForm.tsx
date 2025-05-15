import React, { useState, useEffect } from 'react';
import FormField from '../Common/FormField';
import ActionButton from '../Common/ActionButton';
import { ShipComponent, Ship } from '../../types';
import { Save, X } from 'lucide-react';
import { getNextMaintenanceDate } from '../../utils/dateUtils';

interface ComponentFormProps {
  initialData?: Partial<ShipComponent>;
  ships: Ship[];
  onSubmit: (data: Omit<ShipComponent, 'id'>) => void;
  onCancel: () => void;
  isSubmitting: boolean;
  currentShipId?: string;
}

const ComponentForm: React.FC<ComponentFormProps> = ({ 
  initialData, 
  ships,
  onSubmit, 
  onCancel,
  isSubmitting,
  currentShipId
}) => {
  const [formData, setFormData] = useState<Omit<ShipComponent, 'id'>>({
    shipId: currentShipId || '',
    name: '',
    serialNumber: '',
    installDate: '',
    lastMaintenanceDate: '',
    status: 'Operational',
    ...initialData,
    // Ensure dates are in the correct format for input fields
    installDate: initialData?.installDate 
      ? new Date(initialData.installDate).toISOString().split('T')[0]
      : '',
    lastMaintenanceDate: initialData?.lastMaintenanceDate
      ? new Date(initialData.lastMaintenanceDate).toISOString().split('T')[0]
      : '',
    nextMaintenanceDate: initialData?.nextMaintenanceDate
      ? new Date(initialData.nextMaintenanceDate).toISOString().split('T')[0]
      : ''
  });
  
  const [errors, setErrors] = useState<{
    name?: string;
    serialNumber?: string;
    shipId?: string;
    installDate?: string;
    lastMaintenanceDate?: string;
  }>({});
  
  useEffect(() => {
    if (initialData) {
      setFormData(prev => ({
        ...prev,
        ...initialData,
        // Ensure dates are in the correct format for input fields
        installDate: initialData.installDate 
          ? new Date(initialData.installDate).toISOString().split('T')[0]
          : prev.installDate,
        lastMaintenanceDate: initialData.lastMaintenanceDate
          ? new Date(initialData.lastMaintenanceDate).toISOString().split('T')[0]
          : prev.lastMaintenanceDate,
        nextMaintenanceDate: initialData.nextMaintenanceDate
          ? new Date(initialData.nextMaintenanceDate).toISOString().split('T')[0]
          : prev.nextMaintenanceDate
      }));
    }
  }, [initialData]);

  // Update next maintenance date when last maintenance date changes
  useEffect(() => {
    if (formData.lastMaintenanceDate && !formData.nextMaintenanceDate) {
      const nextDate = getNextMaintenanceDate(formData.lastMaintenanceDate);
      setFormData(prev => ({ 
        ...prev, 
        nextMaintenanceDate: new Date(nextDate).toISOString().split('T')[0]
      }));
    }
  }, [formData.lastMaintenanceDate]);
  
  const validateForm = (): boolean => {
    const newErrors: typeof errors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Component name is required';
    }
    
    if (!formData.serialNumber.trim()) {
      newErrors.serialNumber = 'Serial number is required';
    }
    
    if (!formData.shipId) {
      newErrors.shipId = 'Ship is required';
    }
    
    if (!formData.installDate) {
      newErrors.installDate = 'Installation date is required';
    }
    
    if (!formData.lastMaintenanceDate) {
      newErrors.lastMaintenanceDate = 'Last maintenance date is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
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
      <FormField
        label="Component Name"
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="Enter component name"
        required
        error={errors.name}
      />
      
      <FormField
        label="Serial Number"
        name="serialNumber"
        value={formData.serialNumber}
        onChange={handleChange}
        placeholder="Enter serial number"
        required
        error={errors.serialNumber}
      />
      
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
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          label="Category"
          name="category"
          type="select"
          value={formData.category || ''}
          onChange={handleChange}
        >
          <option value="">Select a category</option>
          <option value="Engine">Engine</option>
          <option value="Navigation">Navigation</option>
          <option value="Safety">Safety</option>
          <option value="Hull">Hull</option>
          <option value="Electrical">Electrical</option>
          <option value="Other">Other</option>
        </FormField>
        
        <FormField
          label="Manufacturer"
          name="manufacturer"
          value={formData.manufacturer || ''}
          onChange={handleChange}
          placeholder="Enter manufacturer"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FormField
          label="Installation Date"
          name="installDate"
          type="date"
          value={formData.installDate}
          onChange={handleChange}
          required
          error={errors.installDate}
        />
        
        <FormField
          label="Last Maintenance Date"
          name="lastMaintenanceDate"
          type="date"
          value={formData.lastMaintenanceDate}
          onChange={handleChange}
          required
          error={errors.lastMaintenanceDate}
        />
        
        <FormField
          label="Next Maintenance Date"
          name="nextMaintenanceDate"
          type="date"
          value={formData.nextMaintenanceDate || ''}
          onChange={handleChange}
        />
      </div>
      
      <FormField
        label="Status"
        name="status"
        type="select"
        value={formData.status || 'Operational'}
        onChange={handleChange}
      >
        <option value="Operational">Operational</option>
        <option value="Needs Maintenance">Needs Maintenance</option>
        <option value="Failed">Failed</option>
      </FormField>
      
      <FormField
        label="Description"
        name="description"
        type="textarea"
        value={formData.description || ''}
        onChange={handleChange}
        placeholder="Enter component description"
      />
      
      <div className="flex justify-end space-x-3">
        <ActionButton
          text="Cancel"
          onClick={onCancel}
          variant="secondary"
          icon={<X className="h-4 w-4" />}
        />
        
        <ActionButton
          text={initialData?.id ? "Update Component" : "Create Component"}
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

export default ComponentForm;