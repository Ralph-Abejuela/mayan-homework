import type { StatusType, TaskSchema } from '#/components/task/task'
import { queryOptions } from '@tanstack/react-query'

export interface ApiError {
  message: string
  error: string
  statusCode: number
}

export const SERVER_URL =
  import.meta.env.VITE_SERVER_URL ?? 'http://localhost:3001'

export interface TaskPayload {
  title: string
  description: string
  status?: StatusType
}

async function parseError(response: Response): Promise<ApiError> {
  const errorBody = await response.json().catch(() => ({}))
  return {
    message:
      errorBody.message || `Request failed with status ${response.status}`,
    error: errorBody.error || 'UNKNOWN_ERROR',
    statusCode: response.status,
  }
}

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, init)
  if (!response.ok) {
    throw await parseError(response)
  }
  if (response.status === 204) {
    return undefined as T
  }
  return (await response.json()) as T
}

export async function getTasksList() {
  return request<TaskSchema[]>(SERVER_URL + '/task')
}

export async function createTask(payload: TaskPayload): Promise<void> {
  await request(SERVER_URL + '/task', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
}

export async function updateTask(
  id: number,
  payload: Partial<TaskPayload>,
): Promise<void> {
  await request(SERVER_URL + '/task/' + id, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
}

export async function deleteTask(id: number): Promise<void> {
  await request(SERVER_URL + '/task/' + id, { method: 'DELETE' })
}

export function getTaskQuery() {
  return queryOptions<TaskSchema[]>({
    queryKey: ['tasks'],
    queryFn: getTasksList,
  })
}
