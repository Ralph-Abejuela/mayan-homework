import type { TaskSchema } from '#/components/task/task'
import { queryOptions } from '@tanstack/react-query'

export interface ApiError {
  message: string
  error: string
  statusCode: number
}

export const SERVER_URL =
  import.meta.env.VITE_SERVER_URL ?? 'http://localhost:30021'

async function getTasksList() {
  const result = await fetch(SERVER_URL + '/task')
  return await result.json()
}

export function getTaskQuery() {
  return queryOptions<TaskSchema[]>({
    queryKey: ['tasks'],
    queryFn: getTasksList,
  })
}
