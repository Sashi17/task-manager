import React from 'react';
import { useTasks } from '../../contexts/TaskContext.jsx';
import TaskCard from '../task/TaskCard.jsx';
import { format } from 'date-fns';

const DayView = () => {
  const { selectedDate, getFilteredTasks } = useTasks();
  const filteredTasks = getFilteredTasks(selectedDate, 'day');
  const hours = Array.from({ length: 24 }, (_, i) => i);

  // Group tasks by hour (assuming time is HH:mm)
  const tasksByHour = hours.reduce((acc, hour) => {
    acc[hour] = filteredTasks.filter(t => t.time && parseInt(t.time.split(':')[0]) === hour);
    return acc;
  }, {});

  return (
    <div>
      <h2>Day View: {format(selectedDate, 'PPP')}</h2>
      {hours.map(hour => (
        <div key={hour}>
          <h3>{hour}:00</h3>
          {tasksByHour[hour].map(task => <TaskCard key={task.id} task={task} />)}
        </div>
      ))}
    </div>
  );
};

export default DayView;