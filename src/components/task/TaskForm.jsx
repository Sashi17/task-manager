import React, { useState } from 'react';
import { useTasks } from '../../contexts/TaskContext.jsx';
import UserSelector from '../user/UserSelector.jsx';
import { format } from 'date-fns';
import { FaTimes } from 'react-icons/fa';

const TaskForm = ({ onClose, selectedDate }) => {
  const { createTask } = useTasks();
  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('');
  const [date, setDate] = useState(format(selectedDate, 'yyyy-MM-dd'));
  const [startTime, setStartTime] = useState('19:00');
  const [endTime, setEndTime] = useState('20:00');
  const [type, setType] = useState('Task');
  const [color, setColor] = useState('Blue');
  const [notes, setNotes] = useState('');
  const [recurring, setRecurring] = useState('Does not repeat');
  const [assignees, setAssignees] = useState([]);
  const [reminders, setReminders] = useState(['5 minutes before']);
  
  const colorMap = { Red: '#f56565', Green: '#48bb78', Blue: '#4299e1', Yellow: '#ecc94b' };
  const reminderOptions = ['5 minutes before', '15 minutes before', '30 minutes before', '1 hour before', '1 day before'];

  const handleSubmit = (e) => {
    e.preventDefault();
    createTask({ title, company, date, startTime, endTime, type, color, notes, recurring, assignees, reminders });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 font-sans">
      <div className="bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-lg text-white">
        <div className="flex justify-between items-center mb-4">
            <div className="bg-gray-700 p-4 rounded-md w-full">
                <p className="text-lg font-semibold">{format(new Date(date), "MMMM do, yyyy")}</p>
                <p className="text-sm text-gray-400">Start: {startTime}</p>
            </div>
            <button onClick={onClose} className="p-2 ml-4 rounded-full hover:bg-gray-700"><FaTimes /></button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full p-2 bg-gray-700 border border-gray-600 rounded" required/>
                <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} className="w-full p-2 bg-gray-700 border border-gray-600 rounded" required/>
                <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} className="w-full p-2 bg-gray-700 border border-gray-600 rounded" />
            </div>

            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Enter task title" className="w-full p-2 bg-gray-700 border border-gray-600 rounded" required />
            <input type="text" value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Company (Optional)" className="w-full p-2 bg-gray-700 border border-gray-600 rounded" />
            
            <select value={type} onChange={(e) => setType(e.target.value)} className="w-full p-2 bg-gray-700 border border-gray-600 rounded">
                <option>Task</option> <option>Meeting</option> <option>Week-off</option>
            </select>

            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Notes (Optional)" className="w-full p-2 bg-gray-700 border border-gray-600 rounded" />

            <div>
                <label className="block text-gray-400 mb-2">Assign to One Person</label>
                <div className="p-2 bg-gray-700 rounded-md">
                   <UserSelector selected={assignees} onChange={setAssignees} multiple={false} />
                </div>
            </div>

            <select value={recurring} onChange={(e) => setRecurring(e.target.value)} className="w-full p-2 bg-gray-700 border border-gray-600 rounded">
                <option>Does not repeat</option> <option>Daily</option> <option>Weekdays</option> <option>Weekly</option> <option>Monthly</option> <option>Yearly</option>
            </select>

            <div>
              <label className="block text-gray-400 mb-2">Reminders</label>
              <div className="space-y-2">
                {reminderOptions.map(reminder => (
                  <label key={reminder} className="flex items-center space-x-3 cursor-pointer">
                    <input type="checkbox" checked={reminders.includes(reminder)} onChange={(e) => {
                       if (e.target.checked) setReminders([...reminders, reminder]);
                       else setReminders(reminders.filter(r => r !== reminder));
                     }} className="form-checkbox h-4 w-4 bg-gray-700 border-gray-600 rounded text-blue-500 focus:ring-blue-500" />
                    <span>{reminder}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-gray-400 mb-2">Color</label>
              <div className="flex space-x-3">
                {Object.entries(colorMap).map(([name, code]) => (
                  <button key={name} type="button" onClick={() => setColor(name)} className={`w-8 h-8 rounded-full transition-transform transform hover:scale-110 ${color === name ? 'ring-2 ring-offset-2 ring-offset-gray-800 ring-white' : ''}`} style={{ backgroundColor: code }} />
                ))}
              </div>
            </div>
          
            <div className="flex justify-end space-x-4 pt-4">
              <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-500">Cancel</button>
              <button type="submit" className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700">Create Event</button>
            </div>
        </form>
      </div>
    </div>
  );
};

export default TaskForm;