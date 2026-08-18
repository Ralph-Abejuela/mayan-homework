import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { IconTrash } from '@tabler/icons-react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from '../ui/alert-dialog'
import { createTask, deleteTask, getTaskQuery } from '#/api/task.api'
import type { ApiError } from '#/api/task.api'
import type { TaskSchema } from './task'
import { useState } from 'react'

export default function DeleteTaskDialog({
  task,
  onOpenChange,
}: {
  task: TaskSchema | null
  onOpenChange: (open: boolean) => void
}) {
  const [snapshotTask, setSnapshotTask] = useState<TaskSchema | null>(task)
  const queryClient = useQueryClient()

  const createTaskMutation = useMutation({
    mutationFn: async (e: TaskSchema) => {
      await createTask(e)
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: getTaskQuery().queryKey })
      toast.success('Task delete undo')
    },
    onError: (error: ApiError) => {
      toast.error(error.message)
    },
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const taskDetails = await deleteTask(id)
      return taskDetails
    },
    onSuccess: () => {
      toast.success('Task deleted', {
        action: {
          label: 'Undo',
          onClick: () => {
            if (snapshotTask === null) {
              console.warn('No task to undo')
              return
            }
            createTaskMutation.mutate(snapshotTask)
          },
        },
      })
      onOpenChange(false)
    },
    onError: (error: ApiError) => {
      toast.error(error.message)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: getTaskQuery().queryKey })
    },
  })

  return (
    <AlertDialog open={task !== null} onOpenChange={onOpenChange}>
      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogMedia>
            <IconTrash />
          </AlertDialogMedia>
          <AlertDialogTitle>Delete task?</AlertDialogTitle>
          <AlertDialogDescription>
            &quot;{task?.title}&quot; will be permanently deleted. This action
            cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            disabled={deleteMutation.isPending}
            onClick={() => {
              if (task) {
                setSnapshotTask(task)
                deleteMutation.mutate(task.id)
              }
            }}
          >
            {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
