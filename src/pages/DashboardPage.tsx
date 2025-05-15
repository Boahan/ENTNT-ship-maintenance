import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Ship, PenTool as Tool, Wrench, BarChart2, AlertTriangle } from 'lucide-react';
import PageHeader from '../components/Common/PageHeader';
import StatCard from '../components/Dashboard/StatCard';
import JobsChart from '../components/Dashboard/JobsChart';
import RecentJobsList from '../components/Dashboard/RecentJobsList';
import { getDashboardStats } from '../utils/localStorageUtils';
import { useJobs } from '../contexts/JobsContext';
import { useAuth } from '../contexts/AuthContext';

const DashboardPage: React.FC = () => {
  const { jobs } = useJobs();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const stats = getDashboardStats();
  
  // For engineer role, filter jobs by engineer ID
  const engineerJobs = user?.role === 'Engineer' 
    ? jobs.filter(job => job.assignedEngineerId === user.id)
    : jobs;
  
  const engineerCompletedJobs = engineerJobs.filter(job => job.status === 'Completed').length;
  const engineerInProgressJobs = engineerJobs.filter(job => job.status === 'In Progress').length;
  const engineerOpenJobs = engineerJobs.filter(job => job.status === 'Open').length;
  const engineerDelayedJobs = engineerJobs.filter(job => job.status === 'Delayed').length;
  const engineerCancelledJobs = engineerJobs.filter(job => job.status === 'Cancelled').length;
  
  useEffect(() => {
    document.title = "Dashboard | ENTNT Marine";
  }, []);

  return (
    <div>
      <PageHeader
        title={`${user?.role === 'Engineer' ? 'My' : ''} Dashboard`}
        subtitle={`Welcome, ${user?.name || user?.email}. Here's an overview of the maritime maintenance status.`}
      />
      
      <div className="grid gap-6 mb-8 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Ships"
          value={stats.totalShips}
          icon={<Ship />}
          color="blue"
          description={`${stats.activeShips} active ships`}
        />
        
        <StatCard
          title="Components"
          value={stats.totalComponents}
          icon={<Tool />}
          color="teal"
          description={`${stats.componentsNeedingMaintenance} need attention`}
        />
        
        <StatCard
          title={user?.role === 'Engineer' ? 'My Jobs' : 'Active Jobs'}
          value={user?.role === 'Engineer' ? engineerJobs.length : stats.openJobs + stats.inProgressJobs}
          icon={<Wrench />}
          color="indigo"
          description={`${user?.role === 'Engineer' ? engineerInProgressJobs : stats.inProgressJobs} in progress`}
        />
        
        <StatCard
          title="Overdue Jobs"
          value={stats.overdueJobs}
          icon={<AlertTriangle />}
          color="red"
          description="Requires immediate attention"
        />
      </div>
      
      <div className="grid gap-6 mb-8 md:grid-cols-2">
        <JobsChart 
          data={
            user?.role === 'Engineer'
              ? {
                  openJobs: engineerOpenJobs,
                  inProgressJobs: engineerInProgressJobs,
                  completedJobs: engineerCompletedJobs,
                  delayedJobs: engineerDelayedJobs,
                  cancelledJobs: engineerCancelledJobs
                }
              : {
                  openJobs: stats.openJobs,
                  inProgressJobs: stats.inProgressJobs,
                  completedJobs: stats.completedJobs
                }
          } 
        />
        
        <RecentJobsList 
          jobs={engineerJobs} 
          limit={7} 
        />
      </div>
      
      <div className="text-right mt-6">
        <button
          onClick={() => navigate('/jobs')}
          className="text-teal-600 hover:text-teal-800 font-medium flex items-center justify-center mx-auto md:mx-0 md:ml-auto"
        >
          <Wrench className="w-4 h-4 mr-1" />
          View All Maintenance Jobs
        </button>
      </div>
    </div>
  );
};

export default DashboardPage;