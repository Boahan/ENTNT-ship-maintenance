import React from 'react';
import { Link } from 'react-router-dom';
import { Ship } from '../../types';
import StatusBadge from '../Common/StatusBadge';
import { Ship as ShipIcon } from 'lucide-react';

interface ShipCardProps {
  ship: Ship;
}

const ShipCard: React.FC<ShipCardProps> = ({ ship }) => {
  return (
    <Link
      to={`/ships/${ship.id}`}
      className="group block rounded-lg bg-white overflow-hidden shadow hover:shadow-md transition-shadow"
    >
      <div className="relative h-40 bg-navy-800 flex items-center justify-center">
        {ship.image ? (
          <img
            src={ship.image}
            alt={ship.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <ShipIcon className="text-teal-500 h-16 w-16" />
        )}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
          <StatusBadge status={ship.status} />
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-medium text-gray-900 group-hover:text-teal-600 transition-colors">
          {ship.name}
        </h3>
        <div className="mt-2 grid grid-cols-2 gap-2 text-sm text-gray-600">
          <div>
            <span className="block text-xs text-gray-500">IMO Number</span>
            <span className="font-medium">{ship.imo}</span>
          </div>
          <div>
            <span className="block text-xs text-gray-500">Flag</span>
            <span className="font-medium">{ship.flag}</span>
          </div>
          {ship.registrationDate && (
            <div>
              <span className="block text-xs text-gray-500">Registration</span>
              <span className="font-medium">{new Date(ship.registrationDate).toLocaleDateString()}</span>
            </div>
          )}
          {ship.lastInspectionDate && (
            <div>
              <span className="block text-xs text-gray-500">Last Inspection</span>
              <span className="font-medium">{new Date(ship.lastInspectionDate).toLocaleDateString()}</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ShipCard;