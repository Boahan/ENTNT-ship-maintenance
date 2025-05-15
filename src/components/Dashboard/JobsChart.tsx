import React, { useEffect, useRef } from 'react';
import Card from '../Common/Card';

interface JobsChartProps {
  data: {
    openJobs: number;
    inProgressJobs: number;
    completedJobs: number;
    cancelledJobs?: number;
    delayedJobs?: number;
  };
}

const JobsChart: React.FC<JobsChartProps> = ({ data }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

    // Data
    const chartData = [
      { label: 'Open', value: data.openJobs, color: '#3B82F6' },
      { label: 'In Progress', value: data.inProgressJobs, color: '#8B5CF6' },
      { label: 'Completed', value: data.completedJobs, color: '#10B981' },
    ];

    if (data.delayedJobs) {
      chartData.push({ label: 'Delayed', value: data.delayedJobs, color: '#F59E0B' });
    }

    if (data.cancelledJobs) {
      chartData.push({ label: 'Cancelled', value: data.cancelledJobs, color: '#6B7280' });
    }

    // Calculate total
    const total = chartData.reduce((sum, item) => sum + item.value, 0);
    if (total === 0) return;

    // Draw chart
    let startAngle = 0;
    const centerX = canvasRef.current.width / 2;
    const centerY = canvasRef.current.height / 2;
    const radius = Math.min(centerX, centerY) - 10;

    chartData.forEach(item => {
      if (item.value === 0) return;
      
      const sliceAngle = (2 * Math.PI * item.value) / total;
      
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngle, startAngle + sliceAngle);
      ctx.closePath();
      
      ctx.fillStyle = item.color;
      ctx.fill();
      
      // Add label in the middle of the slice
      const labelAngle = startAngle + sliceAngle / 2;
      const labelX = centerX + Math.cos(labelAngle) * (radius * 0.7);
      const labelY = centerY + Math.sin(labelAngle) * (radius * 0.7);
      
      ctx.fillStyle = '#FFFFFF';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = '12px Arial';
      
      // Only show label if slice is big enough
      if (sliceAngle > 0.3) {
        ctx.fillText(item.label, labelX, labelY);
      }
      
      startAngle += sliceAngle;
    });

  }, [data]);

  return (
    <Card title="Maintenance Jobs Status">
      <div className="flex flex-col items-center">
        <div className="w-full h-64 relative">
          <canvas ref={canvasRef} width={300} height={200} className="mx-auto" />
        </div>
        
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-4 w-full">
          <div className="flex items-center">
            <span className="w-3 h-3 rounded-full bg-blue-500 mr-2"></span>
            <span className="text-sm text-gray-600">Open: {data.openJobs}</span>
          </div>
          <div className="flex items-center">
            <span className="w-3 h-3 rounded-full bg-purple-500 mr-2"></span>
            <span className="text-sm text-gray-600">In Progress: {data.inProgressJobs}</span>
          </div>
          <div className="flex items-center">
            <span className="w-3 h-3 rounded-full bg-green-500 mr-2"></span>
            <span className="text-sm text-gray-600">Completed: {data.completedJobs}</span>
          </div>
          {data.delayedJobs !== undefined && (
            <div className="flex items-center">
              <span className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></span>
              <span className="text-sm text-gray-600">Delayed: {data.delayedJobs}</span>
            </div>
          )}
          {data.cancelledJobs !== undefined && (
            <div className="flex items-center">
              <span className="w-3 h-3 rounded-full bg-gray-500 mr-2"></span>
              <span className="text-sm text-gray-600">Cancelled: {data.cancelledJobs}</span>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default JobsChart;