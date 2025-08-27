import React from 'react';
import { useTasks } from '../../contexts/TaskContext.jsx';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay } from 'date-fns';

const CalendarView = () => {
  const { selectedDate, setSelectedDate, getFilteredTasks } = useTasks();
  const monthStart = startOfMonth(selectedDate);
  const monthEnd = endOfMonth(selectedDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const handleDateClick = (day) => {
    setSelectedDate(day);
    // Could switch to day view
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)' }}>
      {days.map(day => {
        const tasksOnDay = getFilteredTasks(day, 'day');
        return (
          <div key={day} onClick={() => handleDateClick(day)} style={{ border: '1px solid #ccc', padding: 5 }}>
            {format(day, 'd')}
            {tasksOnDay.length > 0 && <span> ({tasksOnDay.length} tasks)</span>}
          </div>
        );
      })}
    </div>
  );
};

export default CalendarView;