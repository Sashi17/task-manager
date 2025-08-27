import React from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { useAuth } from '../../contexts/AuthContext.jsx';

const TaskCard = ({ task, detailed = false }) => {
  const { currentUser, users } = useAuth();
  const isOverdue = task.status.completion === 'Pending' && task.date && isPast(startOfDay(new Date(task.date)));
  const assigneeNames = task.assignees.map(id => users.find(u => u.id === id)?.email || 'Unknown').join(', ');
  const ownerName = users.find(u => u.id === task.owner)?.email || 'Unknown';

  return (
    <div className={`task-card ${task.color.toLowerCase()} ${isOverdue ? 'overdue' : ''}`}>
      <h3>{task.title}</h3>
      <p>Type: {task.type}</p>
      <p>Date: {task.date ? format(new Date(task.date), 'PPP') : 'No date'}</p>
      <p>Time: {task.time || 'No time'}</p>
      <p>Status: {task.status.workflow} - {task.status.completion}</p>
      <p>Owner: {ownerName}</p>
      <p>Assignees: {assigneeNames || 'None'}</p>
      {detailed && <p>Notes: {task.notes}</p>}
      {detailed && task.recurring && <p>Recurring: {task.recurring}</p>}
      {!detailed && <Link to={`/task/${task.id}`}>Details</Link>}
    </div>
  );
};

export default TaskCard;