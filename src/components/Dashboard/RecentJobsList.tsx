import React from 'react';
import { Link } from 'react-router-dom';
import { Job, JobStatus } from '../../types';
import { formatDate } from '../../utils/dateUtils';
import StatusBadge from '../Common/StatusBadge';
import Card from '../Common/Card';

interface RecentJobsListProps {
  jobs: Job[];
  limit?: number;
  showTitle?: boolean;
}

const RecentJobsList: React.FC<RecentJobsListProps> = ({ 
  jobs, 
  limit = 5,
  showTitle = true 
}) => {
  const sortedJobs = [...jobs]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, limit);

  if (sortedJobs.length === 0) {
    return (
      <Card title={showTitle ? "Recent Maintenance Jobs" : undefined}>
        <div className="text-center text-gray-500 py-4">
          No recent jobs found
        </div>
      </Card>
    );
  }

  return (
    <Card title={showTitle ? "Recent Maintenance Jobs" : undefined}>
      <div className="overflow-hidden">
        <ul className="divide-y divide-gray-200">
          {sortedJobs.map((job) => (
            <li key={job.id} className="py-4">
              <Link
                to={`/jobs/${job.id}`}
                className="block hover:bg-gray-50 -mx-4 px-4 py-2 rounded-md transition-colors"
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-teal-600 truncate">{job.type}</p>
                  <StatusBadge status={job.status as JobStatus} size="sm" />
                </div>
                <div className="mt-2 sm:flex sm:justify-between">
                  <div className="sm:flex">
                    <p className="text-sm text-gray-500">
                      {job.description || `Job for component ID: ${job.componentId}`}
                    </p>
                  </div>
                  <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                    <p>
                      Scheduled: {formatDate(job.scheduledDate)}
                    </p>
                  </div>
                </div>
                <div className="mt-2 text-xs text-gray-500">
                  Last updated: {formatDate(job.updatedAt)}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-4 text-right">
        <Link
          to="/jobs"
          className="text-sm font-medium text-teal-600 hover:text-teal-500"
        >
          View all jobs
        </Link>
      </div>
    </Card>
  );
};

export default RecentJobsList;