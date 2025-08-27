import React from 'react';
import { useTasks } from '../../contexts/TaskContext.jsx';
import TaskCard from './TaskCard.jsx';

const TaskList = () => {
  const { getFilteredTasks } = useTasks();
  const filteredTasks = getFilteredTasks();

  return (
    <div>
      {filteredTasks.map(task => <TaskCard key={task.id} task={task} />)}
    </div>
  );
};

export default TaskList;