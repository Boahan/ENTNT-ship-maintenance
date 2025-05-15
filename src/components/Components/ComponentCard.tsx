import React from 'react';
import { ShipComponent } from '../../types';
import { formatDate, isOverdue } from '../../utils/dateUtils';
import StatusBadge from '../Common/StatusBadge';

interface ComponentCardProps {
  component: ShipComponent;
  onView: (component: ShipComponent) => void;
  showShipName?: boolean;
  shipName?: string;
}

const ComponentCard: React.FC<ComponentCardProps> = ({ 
  component, 
  onView,
  showShipName = false,
  shipName
}) => {
  const isMaintenanceOverdue = component.nextMaintenanceDate 
    ? isOverdue(component.nextMaintenanceDate)
    : false;

  return (
    <div
      className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => onView(component)}
    >
      <div className="px-4 py-5 sm:px-6 flex justify-between items-start">
        <div>
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            {component.name}
          </h3>
          {showShipName && shipName && (
            <p className="text-sm text-gray-500">
              Installed on: <span className="font-medium">{shipName}</span>
            </p>
          )}
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            S/N: {component.serialNumber}
          </p>
        </div>
        <StatusBadge status={component.status || 'Operational'} />
      </div>
      <div className="border-t border-gray-200 px-4 py-5 sm:px-6 bg-gray-50">
        <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-4">
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500">Installed</dt>
            <dd className="mt-1 text-sm text-gray-900">{formatDate(component.installDate)}</dd>
          </div>
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500">Last Maintenance</dt>
            <dd className="mt-1 text-sm text-gray-900">{formatDate(component.lastMaintenanceDate)}</dd>
          </div>
          
          {component.manufacturer && (
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Manufacturer</dt>
              <dd className="mt-1 text-sm text-gray-900">{component.manufacturer}</dd>
            </div>
          )}
          
          {component.category && (
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Category</dt>
              <dd className="mt-1 text-sm text-gray-900">{component.category}</dd>
            </div>
          )}
          
          {component.nextMaintenanceDate && (
            <div className="sm:col-span-2">
              <dt className="text-sm font-medium text-gray-500">Next Scheduled Maintenance</dt>
              <dd className={`mt-1 text-sm ${isMaintenanceOverdue ? 'text-red-600 font-medium' : 'text-gray-900'}`}>
                {formatDate(component.nextMaintenanceDate)}
                {isMaintenanceOverdue && ' (OVERDUE)'}
              </dd>
            </div>
          )}
        </dl>
      </div>
    </div>
  );
};

export default ComponentCard;