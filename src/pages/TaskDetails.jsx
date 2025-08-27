import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTasks } from '../contexts/TaskContext.jsx';
import { useAuth } from '../contexts/AuthContext.jsx';
import TaskCard from '../components/task/TaskCard.jsx';

const TaskDetails = () => {
  const { id } = useParams();
  const { tasks, updateTask, completeTask, deleteTask } = useTasks();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const task = tasks.find(t => t.id === id);

  if (!task) return <div>Task not found</div>;

  const isOwner = task.owner === currentUser.id;
  const isAssignee = task.assignees.includes(currentUser.id);

  const handleStatusChange = (workflow) => {
    if (!isOwner && !isAssignee) return;
    updateTask(id, { status: { ...task.status, workflow } });
  };

  return (
    <div>
      <TaskCard task={task} detailed />
      {isOwner || isAssignee ? (
        <div>
          <select value={task.status.workflow} onChange={e => handleStatusChange(e.target.value)}>
            <option>No Action</option>
            <option>Accepted</option>
            <option>In Progress</option>
            <option>Done</option>
          </select>
          {isOwner && task.status.completion === 'Under Review' && (
            <button onClick={() => completeTask(id)}>Approve & Complete</button>
          )}
          {isOwner && <button onClick={() => deleteTask(id)}>Delete</button>}
        </div>
      ) : null}
      <button onClick={() => navigate('/dashboard')}>Back</button>
    </div>
  );
};

export default TaskDetails;