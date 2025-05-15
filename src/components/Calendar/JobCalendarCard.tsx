import React from 'react';
import { Job } from '../../types';
import { useComponents } from '../../contexts/ComponentsContext';
import { useShips } from '../../contexts/ShipsContext';
import StatusBadge from '../Common/StatusBadge';
import { Clock, PenTool as Tool, Ship } from 'lucide-react';

interface JobCalendarCardProps {
  job: Job;
  onClick: () => void;
}

const JobCalendarCard: React.FC<JobCalendarCardProps> = ({ job, onClick }) => {
  const { getComponentById } = useComponents();
  const { getShipById } = useShips();
  
  const component = getComponentById(job.componentId);
  const ship = getShipById(job.shipId);

  return (
    <div 
      className="bg-white rounded-lg shadow-sm hover:shadow transition-shadow overflow-hidden border border-gray-200 cursor-pointer"
      onClick={onClick}
    >
      <div className="border-l-4 border-teal-500 pl-4 pr-6 py-4">
        <div className="flex justify-between items-start">
          <div>
            <h4 className="text-lg font-medium text-gray-900">{job.type}</h4>
            <p className="text-sm text-gray-500">
              {job.description || 'No description provided'}
            </p>
          </div>
          <div className="flex space-x-2">
            <StatusBadge status={job.priority} size="sm" />
            <StatusBadge status={job.status} size="sm" />
          </div>
        </div>
        
        <div className="mt-3 grid grid-cols-3 gap-4 text-sm">
          <div className="flex items-center text-gray-600">
            <Clock className="h-4 w-4 mr-1 text-gray-400" />
            {new Date(job.scheduledDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
          
          <div className="flex items-center text-gray-600">
            <Tool className="h-4 w-4 mr-1 text-gray-400" />
            {component?.name || 'Unknown Component'}
          </div>
          
          <div className="flex items-center text-gray-600">
            <Ship className="h-4 w-4 mr-1 text-gray-400" />
            {ship?.name || 'Unknown Ship'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobCalendarCard;