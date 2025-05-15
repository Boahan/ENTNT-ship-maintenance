import React from 'react';
import { Job } from '../../types';
import { formatDate } from '../../utils/dateUtils';
import StatusBadge from '../Common/StatusBadge';
import { useComponents } from '../../contexts/ComponentsContext';
import { useShips } from '../../contexts/ShipsContext';

interface JobCardProps {
  job: Job;
  onView: (job: Job) => void;
}

const JobCard: React.FC<JobCardProps> = ({ job, onView }) => {
  const { getComponentById } = useComponents();
  const { getShipById } = useShips();
  
  const component = getComponentById(job.componentId);
  const ship = getShipById(job.shipId);
  
  const isOverdue = new Date(job.scheduledDate) < new Date() && job.status !== 'Completed';

  return (
    <div
      className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => onView(job)}
    >
      <div className="px-4 py-4 sm:px-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900 truncate">
            {job.type} - {component?.name || 'Unknown Component'}
          </h3>
          <div className="flex space-x-2">
            <StatusBadge status={job.priority} size="sm" />
            <StatusBadge status={job.status} size="sm" />
          </div>
        </div>
        <p className="mt-1 text-sm text-gray-600 truncate">
          Ship: {ship?.name || 'Unknown Ship'}
        </p>
      </div>
      
      <div className="px-4 py-4 sm:px-6 bg-gray-50">
        <dl className="grid grid-cols-2 gap-x-4 gap-y-2">
          <div className="col-span-1">
            <dt className="text-xs font-medium text-gray-500">Scheduled Date</dt>
            <dd className={`text-sm ${isOverdue ? 'text-red-600 font-medium' : 'text-gray-900'}`}>
              {formatDate(job.scheduledDate)}
              {isOverdue && ' (Overdue)'}
            </dd>
          </div>
          
          {job.completedDate && (
            <div className="col-span-1">
              <dt className="text-xs font-medium text-gray-500">Completed Date</dt>
              <dd className="text-sm text-gray-900">{formatDate(job.completedDate)}</dd>
            </div>
          )}
          
          <div className="col-span-2 mt-2">
            <dt className="text-xs font-medium text-gray-500">Description</dt>
            <dd className="text-sm text-gray-900 line-clamp-2">
              {job.description || 'No description provided'}
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
};

export default JobCard;