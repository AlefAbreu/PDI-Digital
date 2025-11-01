import React, { useState } from 'react';
import type { DevelopmentActivity } from '../types';

interface CalendarViewProps {
  activities: DevelopmentActivity[];
}

const CalendarView: React.FC<CalendarViewProps> = ({ activities }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  const startDayOfWeek = startOfMonth.getDay(); // 0=Sunday, 1=Monday...
  const daysInMonth = endOfMonth.getDate();

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const emptyDays = Array.from({ length: startDayOfWeek }, (_, i) => i);

  const activitiesByDate: { [key: string]: DevelopmentActivity[] } = {};
  activities.forEach(activity => {
    const dateKey = new Date(activity.dueDate).toDateString();
    if (!activitiesByDate[dateKey]) {
      activitiesByDate[dateKey] = [];
    }
    activitiesByDate[dateKey].push(activity);
  });

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };
  
  const today = new Date();

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <button onClick={handlePrevMonth} className="px-3 py-1 bg-gray-200 rounded">&lt;</button>
        <h2 className="text-xl font-bold">
          {currentDate.toLocaleString('default', { month: 'long' })} {currentDate.getFullYear()}
        </h2>
        <button onClick={handleNextMonth} className="px-3 py-1 bg-gray-200 rounded">&gt;</button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center font-semibold text-gray-600">
        <div>Dom</div><div>Seg</div><div>Ter</div><div>Qua</div><div>Qui</div><div>Sex</div><div>Sáb</div>
      </div>
      <div className="grid grid-cols-7 gap-1 mt-1">
        {emptyDays.map(d => <div key={`empty-${d}`} className="border rounded-md h-28"></div>)}
        {days.map(day => {
          const dayDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
          const dateKey = dayDate.toDateString();
          const isToday = dayDate.toDateString() === today.toDateString();

          return (
            <div key={day} className={`border rounded-md h-32 p-1 overflow-y-auto ${isToday ? 'bg-blue-50 border-blue-200' : ''}`}>
              <div className={`font-bold text-sm ${isToday ? 'text-blue-600' : 'text-gray-700'}`}>{day}</div>
              <div className="mt-1 space-y-1">
                {activitiesByDate[dateKey]?.map(activity => (
                   <div key={activity.id} className="text-xs bg-blue-100 text-blue-800 p-1 rounded truncate" title={activity.title}>
                    {activity.title}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CalendarView;