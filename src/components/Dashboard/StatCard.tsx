import React from 'react';

interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  color: 'blue' | 'teal' | 'orange' | 'red' | 'green' | 'purple' | 'indigo';
  description?: string;
  change?: number;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  color,
  description,
  change
}) => {
  const colorClasses = {
    blue: 'bg-blue-500',
    teal: 'bg-teal-500',
    orange: 'bg-orange-500',
    red: 'bg-red-500',
    green: 'bg-green-500',
    purple: 'bg-purple-500',
    indigo: 'bg-indigo-500'
  };
  
  const bgColorClasses = {
    blue: 'bg-blue-100',
    teal: 'bg-teal-100',
    orange: 'bg-orange-100',
    red: 'bg-red-100',
    green: 'bg-green-100',
    purple: 'bg-purple-100',
    indigo: 'bg-indigo-100'
  };
  
  const textColorClasses = {
    blue: 'text-blue-500',
    teal: 'text-teal-500',
    orange: 'text-orange-500',
    red: 'text-red-500',
    green: 'text-green-500',
    purple: 'text-purple-500',
    indigo: 'text-indigo-500'
  };

  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="p-5">
        <div className="flex items-center">
          <div className={`flex-shrink-0 rounded-md p-3 ${bgColorClasses[color]}`}>
            <div className={`h-6 w-6 ${textColorClasses[color]}`}>{icon}</div>
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
              <dd>
                <div className="text-lg font-medium text-gray-900">{value}</div>
              </dd>
            </dl>
          </div>
        </div>
      </div>
      
      {(description || change !== undefined) && (
        <div className="bg-gray-50 px-5 py-3">
          <div className="text-sm">
            {description && <span className="text-gray-500">{description}</span>}
            
            {change !== undefined && (
              <span className={`ml-2 ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {change >= 0 ? '+' : ''}{change}%
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default StatCard;