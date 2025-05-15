import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon,
  List 
} from 'lucide-react';
import { Job } from '../../types';
import { 
  getMonthDays, 
  getWeekDays, 
  isSameDay, 
  formatDate 
} from '../../utils/dateUtils';
import JobCalendarCard from './JobCalendarCard';

interface CalendarViewProps {
  jobs: Job[];
  onViewJob: (job: Job) => void;
}

const CalendarView: React.FC<CalendarViewProps> = ({ jobs, onViewJob }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [viewMode, setViewMode] = useState<'month' | 'week'>('month');
  const [visibleDays, setVisibleDays] = useState<Date[]>([]);
  const [jobsByDate, setJobsByDate] = useState<Record<string, Job[]>>({});
  
  useEffect(() => {
    // Get visible days based on current view mode and date
    const days = viewMode === 'month' 
      ? getMonthDays(currentDate.getFullYear(), currentDate.getMonth())
      : getWeekDays(new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - currentDate.getDay()));
    
    setVisibleDays(days);
  }, [currentDate, viewMode]);
  
  useEffect(() => {
    // Group jobs by date
    const groupedJobs: Record<string, Job[]> = {};
    
    jobs.forEach(job => {
      const scheduledDate = new Date(job.scheduledDate);
      const dateKey = scheduledDate.toISOString().split('T')[0];
      
      if (!groupedJobs[dateKey]) {
        groupedJobs[dateKey] = [];
      }
      
      groupedJobs[dateKey].push(job);
    });
    
    setJobsByDate(groupedJobs);
  }, [jobs]);
  
  const handlePrev = () => {
    if (viewMode === 'month') {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    } else {
      const newDate = new Date(currentDate);
      newDate.setDate(newDate.getDate() - 7);
      setCurrentDate(newDate);
    }
  };
  
  const handleNext = () => {
    if (viewMode === 'month') {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    } else {
      const newDate = new Date(currentDate);
      newDate.setDate(newDate.getDate() + 7);
      setCurrentDate(newDate);
    }
  };
  
  const handleToday = () => {
    setCurrentDate(new Date());
  };
  
  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
  };
  
  const handleChangeViewMode = (mode: 'month' | 'week') => {
    setViewMode(mode);
    setSelectedDate(null);
  };
  
  const getJobsForDate = (date: Date): Job[] => {
    const dateKey = date.toISOString().split('T')[0];
    return jobsByDate[dateKey] || [];
  };
  
  const getDayClasses = (day: Date) => {
    const isToday = isSameDay(day, new Date());
    const isSelected = selectedDate ? isSameDay(day, selectedDate) : false;
    const hasJobs = getJobsForDate(day).length > 0;
    
    let classes = 'relative h-12 border-b border-r p-1 flex flex-col';
    
    // Weekend styling
    if (day.getDay() === 0 || day.getDay() === 6) {
      classes += ' bg-gray-50';
    }
    
    if (isToday) {
      classes += ' bg-blue-50';
    }
    
    if (isSelected) {
      classes += ' ring-2 ring-inset ring-teal-500';
    }
    
    if (hasJobs) {
      classes += ' font-medium';
    }
    
    return classes;
  };
  
  // Determine if the month view should show preceding/following month days
  const renderMonthView = () => {
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const startingDayOfWeek = firstDayOfMonth.getDay(); // 0 for Sunday, 1 for Monday, etc.
    
    // Get days from previous month to fill in the first week
    const prevMonthDays = [];
    const prevMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0);
    const daysInPrevMonth = prevMonth.getDate();
    
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      prevMonthDays.push(new Date(prevMonth.getFullYear(), prevMonth.getMonth(), daysInPrevMonth - i));
    }
    
    // Get days from next month to fill in the last week
    const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    const endingDayOfWeek = lastDayOfMonth.getDay();
    const nextMonthDays = [];
    
    for (let i = 1; i <= 6 - endingDayOfWeek; i++) {
      nextMonthDays.push(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, i));
    }
    
    // Combine all days for the calendar view
    const allDays = [...prevMonthDays, ...visibleDays, ...nextMonthDays];
    
    // Group days into weeks
    const weeks = [];
    for (let i = 0; i < allDays.length; i += 7) {
      weeks.push(allDays.slice(i, i + 7));
    }
    
    return (
      <div className="bg-white rounded-lg shadow">
        <div className="grid grid-cols-7 text-center text-xs font-medium text-gray-500 border-b">
          <div className="py-2">Sun</div>
          <div className="py-2">Mon</div>
          <div className="py-2">Tue</div>
          <div className="py-2">Wed</div>
          <div className="py-2">Thu</div>
          <div className="py-2">Fri</div>
          <div className="py-2">Sat</div>
        </div>
        
        <div className="grid grid-cols-7 border-l">
          {weeks.map((week, weekIndex) => (
            <React.Fragment key={weekIndex}>
              {week.map((day, dayIndex) => {
                const isCurrentMonth = day.getMonth() === currentDate.getMonth();
                const dayJobs = getJobsForDate(day);
                
                return (
                  <div 
                    key={dayIndex} 
                    className={`${getDayClasses(day)} ${!isCurrentMonth ? 'text-gray-400' : ''}`}
                    onClick={() => handleDateClick(day)}
                  >
                    <div className="flex justify-between">
                      <span className="text-sm">{day.getDate()}</span>
                      {dayJobs.length > 0 && (
                        <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-teal-100 bg-teal-600 rounded-full">
                          {dayJobs.length}
                        </span>
                      )}
                    </div>
                    {dayJobs.length > 0 && dayJobs.length <= 2 && (
                      <div className="mt-1 overflow-y-auto max-h-20 text-xs">
                        {dayJobs.map((job, index) => (
                          <div 
                            key={job.id} 
                            className="px-1 py-0.5 truncate rounded bg-blue-100 text-blue-800 mb-0.5"
                            onClick={(e) => {
                              e.stopPropagation();
                              onViewJob(job);
                            }}
                          >
                            {job.type}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </div>
    );
  };
  
  const renderWeekView = () => {
    return (
      <div className="bg-white rounded-lg shadow">
        <div className="grid grid-cols-7 text-center text-xs font-medium text-gray-500 border-b">
          {visibleDays.map((day, index) => (
            <div key={index} className="py-2">
              <div className="text-gray-900 text-sm">{day.getDate()}</div>
              <div>
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][day.getDay()]}
              </div>
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 border-l h-96">
          {visibleDays.map((day, index) => {
            const dayJobs = getJobsForDate(day);
            
            return (
              <div 
                key={index} 
                className={`${getDayClasses(day)} h-auto overflow-y-auto`}
                onClick={() => handleDateClick(day)}
              >
                {dayJobs.length > 0 ? (
                  <div className="mt-1 space-y-1">
                    {dayJobs.map(job => (
                      <div 
                        key={job.id} 
                        className="p-1 rounded bg-blue-100 text-blue-800 text-xs mb-1 cursor-pointer hover:bg-blue-200"
                        onClick={(e) => {
                          e.stopPropagation();
                          onViewJob(job);
                        }}
                      >
                        <div className="font-medium truncate">{job.type}</div>
                        <div className="truncate text-xs opacity-75">
                          {new Date(job.scheduledDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="h-full flex items-center justify-center text-gray-400 text-xs">
                    No jobs
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Calendar Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center bg-white p-4 rounded-lg shadow">
        <div className="flex items-center mb-4 sm:mb-0">
          <button
            onClick={handlePrev}
            className="p-1 rounded-full text-gray-600 hover:bg-gray-100"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          
          <h2 className="mx-4 text-lg font-semibold text-gray-900">
            {viewMode === 'month' ? (
              <span>
                {currentDate.toLocaleString('default', { month: 'long' })} {currentDate.getFullYear()}
              </span>
            ) : (
              <span>
                Week of {visibleDays[0]?.toLocaleDateString()}
              </span>
            )}
          </h2>
          
          <button
            onClick={handleNext}
            className="p-1 rounded-full text-gray-600 hover:bg-gray-100"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
          
          <button
            onClick={handleToday}
            className="ml-4 px-3 py-1 text-sm bg-teal-50 text-teal-700 rounded hover:bg-teal-100"
          >
            Today
          </button>
        </div>
        
        <div className="flex space-x-2">
          <button
            onClick={() => handleChangeViewMode('month')}
            className={`px-3 py-1 text-sm rounded flex items-center ${
              viewMode === 'month'
                ? 'bg-teal-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <CalendarIcon className="h-4 w-4 mr-1" />
            Month
          </button>
          
          <button
            onClick={() => handleChangeViewMode('week')}
            className={`px-3 py-1 text-sm rounded flex items-center ${
              viewMode === 'week'
                ? 'bg-teal-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <List className="h-4 w-4 mr-1" />
            Week
          </button>
        </div>
      </div>
      
      {/* Calendar View */}
      {viewMode === 'month' ? renderMonthView() : renderWeekView()}
      
      {/* Selected Date Jobs */}
      {selectedDate && (
        <div className="mt-6">
          <h3 className="text-lg font-medium mb-4">
            Jobs for {formatDate(selectedDate.toISOString())}
          </h3>
          
          <div className="space-y-4">
            {getJobsForDate(selectedDate).length > 0 ? (
              getJobsForDate(selectedDate).map(job => (
                <JobCalendarCard 
                  key={job.id} 
                  job={job} 
                  onClick={() => onViewJob(job)} 
                />
              ))
            ) : (
              <div className="bg-white p-6 rounded-lg shadow text-center text-gray-500">
                No jobs scheduled for this date
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarView;