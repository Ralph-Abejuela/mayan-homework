import { IconBed, IconChecks, IconRunSprint } from '@tabler/icons-react'

export const statusList = {
  inactive: {
    title: 'Inactive',
    Icon: IconBed,
  },
  active: {
    title: 'Active',
    Icon: IconRunSprint,
  },
  completed: {
    title: 'Completed',
    Icon: IconChecks,
  },
} as const

export type StatusType = keyof typeof statusList

export interface TaskSchema {
  id: number
  title: string
  description: string
  status: StatusType
}
