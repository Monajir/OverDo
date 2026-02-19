import api from '../api/axios';
import type { User, Task, Work, UserPreferences, CreateTaskInput, CreateWorkInput } from '../types';

// ---- User API ----

export async function fetchCurrentUser(): Promise<User> {
  const response = await api.get('/user/me');
  return response.data;
}

export async function updateUserPreferences(prefs: Partial<UserPreferences>): Promise<User> {
  // Backend expects { preferences: { ... } }
  const response = await api.put('/settings', { preferences: prefs });
  return response.data;
}

// ---- Work API ----

export async function fetchWorks(): Promise<Work[]> {
  const response = await api.get('/work');
  return response.data;
}

export async function createWork(data: CreateWorkInput): Promise<Work> {
  const response = await api.post('/work', data);
  return response.data;
}

// NOTE: Backend workRoutes.js does not currently have an update route.
export async function updateWork(_id: string, data: Partial<Work>): Promise<Work> {
  console.warn('updateWork is not implemented on the backend');
  return data as Work;
}

export async function deleteWork(id: string): Promise<void> {
  await api.delete(`/work/${id}`);
}

// ---- Task API ----

export async function fetchTasks(): Promise<Task[]> {
  const response = await api.get('/task');
  // Backend returns { tasks: Task[], pomodoros: Pomodoro[] }
  return response.data.tasks;
}

export async function createTask(data: CreateTaskInput): Promise<Task> {
  const response = await api.post('/task', data);
  return response.data;
}

export async function updateTask(id: string, data: Partial<Task>): Promise<Task> {
  const response = await api.put(`/task/${id}`, data);
  return response.data;
}

export async function deleteTask(id: string): Promise<void> {
  await api.delete(`/task/${id}`);
}

export async function incrementPomodoro(taskId: string, duration: number): Promise<{ task: Task, user: User }> {
  const response = await api.put(`/task/${taskId}/pomodoro`, { duration });
  return response.data;
}

export async function markTaskComplete(taskId: string): Promise<{ task: Task, user: User }> {
  const response = await api.post(`/task/${taskId}/complete`);
  return response.data;
}

export async function uploadAttachment(taskId: string, file: File): Promise<Task> {
  const formData = new FormData(); formData.append('file', file);
  const response = await api.post(`/task/${taskId}/attachment`, formData);
  return response.data;
}

// Backend expects index
export async function deleteAttachment(taskId: string, index: number): Promise<Task> {
  const response = await api.delete(`/task/${taskId}/attachment/${index}`);
  return response.data;
}

// ---- Messages API ----
export async function fetchMessages(): Promise<any> {
  const response = await api.get('/messages');
  return response.data;
}