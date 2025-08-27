import React, { createContext, useState, useContext, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import {
  addDays,
  addWeeks,
  addMonths,
  addYears,
  format,
  isPast,
  startOfDay,
  isWeekend,
} from "date-fns";
import { getTasks, saveTasks } from "../services/storage.js";
import { useAuth } from "./AuthContext.jsx";

const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
  const { currentUser, users } = useAuth();
  const [tasks, setTasks] = useState(getTasks());
  const [viewMode, setViewMode] = useState("list"); // list, day, calendar
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [categoryFilter, setCategoryFilter] = useState("all"); // all, task, meeting, week-off

  useEffect(() => {
    saveTasks(tasks);
    // Mock reminder checks (in real app, use setInterval or web workers)
    tasks.forEach((task) => {
      if (task.date && isPast(new Date(task.date))) {
        // Mark overdue, but we handle in views
      }
      // Mock emails for reminders (5min,15min,etc) - in real, use backend scheduler
    });
  }, [tasks]);

  const createTask = (taskData) => {
    if (!currentUser) return;
    const newTask = {
      id: uuidv4(),
      owner: currentUser.id,
      assignees: taskData.assignees || [],
      status: { workflow: "No Action", completion: "Pending" },
      ...taskData,
      createdAt: new Date(),
    };
    setTasks([...tasks, newTask]);
    if (newTask.assignees.length > 0) {
      mockEmail(newTask.assignees, `New task assigned: ${newTask.title}`);
    }
    if (newTask.type === "Meeting") {
      mockEmail(newTask.assignees, `Meeting invitation: ${newTask.title}`);
    }
  };

  const updateTask = (id, updates) => {
    setTasks(tasks.map((t) => (t.id === id ? { ...t, ...updates } : t)));
    const task = tasks.find((t) => t.id === id);
    if (updates.status?.workflow === "Done" && task.assignees.length > 0) {
      // Enter Under Review for delegated
      updates.status.completion = "Under Review";
      mockEmail([task.owner], `Task ${task.title} ready for review`);
    } else if (
      updates.status?.workflow === "Done" &&
      task.owner === currentUser.id
    ) {
      updates.status.completion = "Completed";
      handleRecurring(task);
    }
    if (updates.assignees) {
      mockEmail(updates.assignees, `Task update: ${task.title}`);
    }
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter((t) => t.id !== id));
  };

  const completeTask = (id) => {
    const task = tasks.find((t) => t.id === id);
    if (task.owner !== currentUser.id) return alert("Only owner can complete");
    updateTask(id, { status: { ...task.status, completion: "Completed" } });
    handleRecurring(task);
  };

  const handleRecurring = (task) => {
    if (!task.recurring) return;
    let nextDate = new Date(task.date);
    switch (task.recurring) {
      case "Daily":
        nextDate = addDays(nextDate, 1);
        break;
      case "Weekdays":
        nextDate = addDays(nextDate, 1);
        while (isWeekend(nextDate)) nextDate = addDays(nextDate, 1); // Skip weekends
        break;
      case "Weekly":
        nextDate = addWeeks(nextDate, 1);
        break;
      case "Monthly":
        nextDate = addMonths(nextDate, 1);
        break;
      case "Yearly":
        nextDate = addYears(nextDate, 1);
        break;
      default:
        return;
    }
    const newRecurringTask = {
      ...task,
      id: uuidv4(),
      date: format(nextDate, "yyyy-MM-dd"),
      status: { workflow: "No Action", completion: "Pending" },
    };
    setTasks([...tasks, newRecurringTask]);
  };

  const mockEmail = (userIds, message) => {
    const emails = userIds
      .map((id) => users.find((u) => u.id === id)?.email)
      .filter(Boolean);
    console.log(`Mock email to ${emails.join(", ")}: ${message}`);
    alert(`Mock email sent: ${message}`);
  };

  const getUserTasks = () => {
    if (!currentUser) return [];
    return tasks.filter(
      (t) => t.owner === currentUser.id || t.assignees.includes(currentUser.id)
    );
  };

  const getOverdueTasks = () => {
    return getUserTasks().filter(
      (t) =>
        t.status.completion === "Pending" &&
        t.date &&
        isPast(startOfDay(new Date(t.date)))
    );
  };

  const getFilteredTasks = (date = selectedDate, mode = viewMode) => {
    let filtered = getUserTasks();
    if (categoryFilter !== "all")
      filtered = filtered.filter((t) => t.type === categoryFilter);
    if (mode === "day") {
      filtered = filtered.filter((t) => t.date === format(date, "yyyy-MM-dd"));
    }
    // Add more filters as needed
    return filtered;
  };

  return (
    <TaskContext.Provider
      value={{
        tasks: getUserTasks(),
        overdueTasks: getOverdueTasks(),
        createTask,
        updateTask,
        deleteTask,
        completeTask,
        viewMode,
        setViewMode,
        selectedDate,
        setSelectedDate,
        categoryFilter,
        setCategoryFilter,
        getFilteredTasks,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => useContext(TaskContext);
