import React, { useState, useEffect } from 'react';
import FormField from '../Common/FormField';
import ActionButton from '../Common/ActionButton';
import { Ship, ShipStatus } from '../../types';
import { Save, X } from 'lucide-react';

interface ShipFormProps {
  initialData?: Partial<Ship>;
  onSubmit: (data: Omit<Ship, 'id'>) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

const ShipForm: React.FC<ShipFormProps> = ({ 
  initialData, 
  onSubmit, 
  onCancel,
  isSubmitting
}) => {
  const [formData, setFormData] = useState<Omit<Ship, 'id'>>({
    name: '',
    imo: '',
    flag: '',
    status: 'Active',
    ...initialData,
    // Ensure dates are in the correct format for input fields
    registrationDate: initialData?.registrationDate 
      ? new Date(initialData.registrationDate).toISOString().split('T')[0]
      : '',
    lastInspectionDate: initialData?.lastInspectionDate
      ? new Date(initialData.lastInspectionDate).toISOString().split('T')[0]
      : ''
  });
  
  const [errors, setErrors] = useState<{
    name?: string;
    imo?: string;
    flag?: string;
  }>({});
  
  useEffect(() => {
    if (initialData) {
      setFormData(prev => ({
        ...prev,
        ...initialData,
        // Ensure dates are in the correct format for input fields
        registrationDate: initialData.registrationDate 
          ? new Date(initialData.registrationDate).toISOString().split('T')[0]
          : prev.registrationDate,
        lastInspectionDate: initialData.lastInspectionDate
          ? new Date(initialData.lastInspectionDate).toISOString().split('T')[0]
          : prev.lastInspectionDate
      }));
    }
  }, [initialData]);
  
  const validateForm = (): boolean => {
    const newErrors: typeof errors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Ship name is required';
    }
    
    if (!formData.imo.trim()) {
      newErrors.imo = 'IMO number is required';
    } else if (!/^\d{7}$/.test(formData.imo)) {
      newErrors.imo = 'IMO number must be 7 digits';
    }
    
    if (!formData.flag.trim()) {
      newErrors.flag = 'Flag is required';
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
        label="Ship Name"
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="Enter ship name"
        required
        error={errors.name}
      />
      
      <FormField
        label="IMO Number"
        name="imo"
        value={formData.imo}
        onChange={handleChange}
        placeholder="7-digit IMO number"
        required
        error={errors.imo}
      />
      
      <FormField
        label="Flag (Country)"
        name="flag"
        value={formData.flag}
        onChange={handleChange}
        placeholder="Flag country"
        required
        error={errors.flag}
      />
      
      <FormField
        label="Status"
        name="status"
        type="select"
        value={formData.status}
        onChange={handleChange}
        required
      >
        <option value="Active">Active</option>
        <option value="Under Maintenance">Under Maintenance</option>
        <option value="Docked">Docked</option>
        <option value="Out of Service">Out of Service</option>
      </FormField>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          label="Registration Date"
          name="registrationDate"
          type="date"
          value={formData.registrationDate || ''}
          onChange={handleChange}
        />
        
        <FormField
          label="Last Inspection Date"
          name="lastInspectionDate"
          type="date"
          value={formData.lastInspectionDate || ''}
          onChange={handleChange}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          label="Capacity (TEU)"
          name="capacity"
          type="number"
          value={formData.capacity || ''}
          onChange={handleChange}
          placeholder="Capacity in TEU"
        />
        
        <FormField
          label="Image URL (Optional)"
          name="image"
          value={formData.image || ''}
          onChange={handleChange}
          placeholder="URL to ship image"
        />
      </div>
      
      <FormField
        label="Description"
        name="description"
        type="textarea"
        value={formData.description || ''}
        onChange={handleChange}
        placeholder="Enter ship description"
      />
      
      <div className="flex justify-end space-x-3">
        <ActionButton
          text="Cancel"
          onClick={onCancel}
          variant="secondary"
          icon={<X className="h-4 w-4" />}
        />
        
        <ActionButton
          text={initialData?.id ? "Update Ship" : "Create Ship"}
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

export default ShipForm;