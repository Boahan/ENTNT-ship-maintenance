import React from 'react';
import { ShipStatus, JobStatus, JobPriority } from '../../types';

interface StatusBadgeProps {
  status: ShipStatus | JobStatus | JobPriority | 'Operational' | 'Needs Maintenance' | 'Failed';
  size?: 'sm' | 'md' | 'lg';
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  let bgColor = '';
  let textColor = '';
  
  // Ship Status
  if (status === 'Active') {
    bgColor = 'bg-green-100';
    textColor = 'text-green-800';
  } else if (status === 'Under Maintenance') {
    bgColor = 'bg-yellow-100';
    textColor = 'text-yellow-800';
  } else if (status === 'Docked') {
    bgColor = 'bg-blue-100';
    textColor = 'text-blue-800';
  } else if (status === 'Out of Service') {
    bgColor = 'bg-red-100';
    textColor = 'text-red-800';
  }
  
  // Component Status
  else if (status === 'Operational') {
    bgColor = 'bg-green-100';
    textColor = 'text-green-800';
  } else if (status === 'Needs Maintenance') {
    bgColor = 'bg-yellow-100';
    textColor = 'text-yellow-800';
  } else if (status === 'Failed') {
    bgColor = 'bg-red-100';
    textColor = 'text-red-800';
  }
  
  // Job Status
  else if (status === 'Open') {
    bgColor = 'bg-blue-100';
    textColor = 'text-blue-800';
  } else if (status === 'In Progress') {
    bgColor = 'bg-purple-100';
    textColor = 'text-purple-800';
  } else if (status === 'Completed') {
    bgColor = 'bg-green-100';
    textColor = 'text-green-800';
  } else if (status === 'Delayed') {
    bgColor = 'bg-orange-100';
    textColor = 'text-orange-800';
  } else if (status === 'Cancelled') {
    bgColor = 'bg-gray-100';
    textColor = 'text-gray-800';
  }
  
  // Job Priority
  else if (status === 'Low') {
    bgColor = 'bg-gray-100';
    textColor = 'text-gray-800';
  } else if (status === 'Medium') {
    bgColor = 'bg-blue-100';
    textColor = 'text-blue-800';
  } else if (status === 'High') {
    bgColor = 'bg-orange-100';
    textColor = 'text-orange-800';
  } else if (status === 'Critical') {
    bgColor = 'bg-red-100';
    textColor = 'text-red-800';
  }
  
  // Default
  else {
    bgColor = 'bg-gray-100';
    textColor = 'text-gray-800';
  }
  
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-0.5 text-sm',
    lg: 'px-3 py-1 text-base'
  };
  
  return (
    <span
      className={`inline-flex items-center rounded-full font-medium ${bgColor} ${textColor} ${sizeClasses[size]}`}
    >
      {status}
    </span>
  );
};

export default StatusBadge;