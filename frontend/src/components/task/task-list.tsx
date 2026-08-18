import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { statusCycle, statusList } from './task'
import type { StatusType, TaskSchema } from './task'
import { useState } from 'react'
import { useDebounce } from '#/hooks/useDebounce'
import EmptyTask from './empty-task'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from '../ui/item'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { IconEdit, IconTrash } from '@tabler/icons-react'
import { TaskFilter } from './task-filter'
import TaskForm from './task-form'
import { getTaskQuery, updateTask } from '#/api/task.api'
import type { ApiError } from '#/api/task.api'
import { toast } from 'sonner'
import DeleteTaskDialog from './delete-task-dialog'
import TaskLoadingSkeleton from './loading-task-skeleton'

export default function TaskList() {
  const queryClient = useQueryClient()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusType[]>([])
  const [editTask, setEditTask] = useState<TaskSchema>()
  const [openFormDialog, setOpenFormDialog] = useState<boolean>(false)
  const [deleteTarget, setDeleteTarget] = useState<TaskSchema | null>(null)

  const debounceSearch = useDebounce(search, 300)
  const {
    data = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    ...getTaskQuery(),
    select: (response) => {
      const splitInput = debounceSearch.toLowerCase().split(' ')
      const lastWord = splitInput[splitInput.length - 1]

      const isLastWordStatus = Object.keys(statusCycle).includes(lastWord)

      const searchInput = isLastWordStatus
        ? splitInput.slice(0, -1).join(' ')
        : splitInput.join(' ')

      return response
        .filter(
          (res) =>
            // Search filters
            res.title.toLowerCase().includes(searchInput.trim()) &&
            (isLastWordStatus ? res.status === lastWord : true) &&
            // status filters
            (statusFilter.length === 0
              ? true
              : statusFilter.includes(res.status)),
        )
        .sort((a, b) => a.id - b.id)
    },
  })

  const rawData =
    queryClient.getQueryData<TaskSchema[]>(getTaskQuery().queryKey) || []

  const handleEdit = (task: TaskSchema) => {
    setEditTask(task)
    setOpenFormDialog(true)
  }

  const handleNew = () => {
    setEditTask(undefined)
    setOpenFormDialog(true)
  }

  const cycleStatusMutation = useMutation({
    mutationFn: async (vals: { id: number; status: StatusType }) => {
      await updateTask(vals.id, { status: vals.status })
    },
    onSuccess: () => {
      toast.success('Status updated')
    },
    onError: (error: ApiError) => {
      toast.error(error.message)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: getTaskQuery().queryKey })
    },
  })

  const handleCycleStatus = (id: number, status: StatusType) => {
    const newStatus = statusCycle[status] ?? 'inactive'
    cycleStatusMutation.mutate({ id, status: newStatus })
  }

  if (isLoading) {
    return <TaskLoadingSkeleton />
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 h-full">
        <p className="text-muted-foreground">Failed to load tasks.</p>
        <Button variant="outline" onClick={() => refetch()}>
          Retry
        </Button>
      </div>
    )
  }

  if (rawData.length === 0) {
    return (
      <>
        <EmptyTask callback={handleNew} />
        {openFormDialog && <TaskForm open onOpenChange={setOpenFormDialog} />}
      </>
    )
  }

  return (
    <div className="grid grid-rows-[auto_1fr] gap-4 h-full">
      <div className="flex gap-2">
        <Input
          placeholder="Search..."
          value={search}
          onChange={(e) => {
            setSearch(e.currentTarget.value)
          }}
        />
        <Button onClick={handleNew}>Create</Button>
        <TaskFilter handleFilter={setStatusFilter} />
      </div>
      <div className="flex flex-col gap-2 h-full">
        {data.length === 0 ? (
          <div>No Tasks found.</div>
        ) : (
          data.map((e) => {
            const statusTitle = statusList[e.status].title
            const StatusIcon = statusList[e.status].Icon
            return (
              <Item key={e.id} variant={'outline'}>
                <ItemContent>
                  <ItemTitle>{e.title}</ItemTitle>
                  <ItemDescription>{e.description}</ItemDescription>
                </ItemContent>
                <ItemActions>
                  <Button
                    variant={'outline'}
                    className="mr-4"
                    disabled={
                      cycleStatusMutation.isPending &&
                      cycleStatusMutation.variables.id === e.id
                    }
                    onClick={() => handleCycleStatus(e.id, e.status)}
                  >
                    <StatusIcon />
                    {statusTitle}
                  </Button>
                  <Button
                    variant={'secondary'}
                    size={'icon'}
                    onClick={() => handleEdit(e)}
                  >
                    <IconEdit />
                  </Button>
                  <Button
                    variant={'destructive'}
                    size={'icon'}
                    onClick={() => setDeleteTarget(e)}
                  >
                    <IconTrash />
                  </Button>
                </ItemActions>
              </Item>
            )
          })
        )}
      </div>

      <DeleteTaskDialog
        task={deleteTarget}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null)
        }}
      />

      {openFormDialog && (
        <TaskForm task={editTask} open onOpenChange={setOpenFormDialog} />
      )}
    </div>
  )
}
