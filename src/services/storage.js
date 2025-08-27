const USERS_KEY = 'users';
const CURRENT_USER_KEY = 'currentUser';
const TASKS_KEY = 'tasks';

export const getUsers = () => JSON.parse(localStorage.getItem(USERS_KEY)) || [];
export const saveUsers = (users) => localStorage.setItem(USERS_KEY, JSON.stringify(users));

export const getCurrentUser = () => JSON.parse(localStorage.getItem(CURRENT_USER_KEY));
export const saveCurrentUser = (user) => localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));

export const getTasks = () => JSON.parse(localStorage.getItem(TASKS_KEY)) || [];
export const saveTasks = (tasks) => localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));