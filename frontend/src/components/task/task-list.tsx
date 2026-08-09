import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { statusList, type StatusType, type TaskSchema } from './task'
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
import { deleteTask, getTaskQuery, updateTask } from '#/api/task.api'

const statusCycle: Record<StatusType, string> = {
  inactive: 'active',
  active: 'completed',
  completed: 'inactive',
}

export default function TaskList() {
  const queryClient = useQueryClient()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusType[]>([])
  const [editTask, setEditTask] = useState<TaskSchema>()
  const [openFormDialog, setOpenFormDialog] = useState<boolean>(false)

  const debounceSearch = useDebounce(search, 300)
  const { data = [], isLoading } = useQuery({
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
              : statusFilter.includes(res.status as StatusType)),
        )
        .sort((a, b) => a.id - b.id)
    },
  })

  const rawData = queryClient.getQueryData<TaskSchema[]>(['tasks']) || []

  const handleEdit = (task: TaskSchema) => {
    setEditTask(task)
    setOpenFormDialog(true)
  }

  const handleNew = () => {
    console.log('newww')
    setEditTask(undefined)
    setOpenFormDialog(true)
  }

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await deleteTask(id)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: getTaskQuery().queryKey })
    },
  })

  const handleDelete = (id: number) => {
    deleteMutation.mutate(id)
  }

  const cycleStatusMutation = useMutation({
    mutationFn: async (vals: { id: number; status: string }) => {
      await updateTask(vals.id, { status: vals.status })
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: getTaskQuery().queryKey })
    },
  })

  const handleCycleStatus = (id: number, status: string) => {
    const newStatus =
      statusCycle[status as keyof typeof statusCycle] ?? 'inactive'
    cycleStatusMutation.mutate({ id, status: newStatus })
  }

  if (isLoading) {
    return <span>Loading...</span> // replace with skeleton
  }

  if (rawData.length === 0) {
    return (
      <>
        <EmptyTask callback={handleNew} />
        <TaskForm
          key={'new'}
          open={openFormDialog}
          onOpenChange={setOpenFormDialog}
        />
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
        <TaskFilter handleFiter={setStatusFilter} />
      </div>
      <div className="flex flex-col gap-2 h-full">
        {data.length === 0 ? (
          <div>No Tasks found.</div>
        ) : (
          data.map((e, key) => {
            const statusTitle = statusList[e.status as StatusType].title
            const StatusIcon = statusList[e.status as StatusType].Icon
            return (
              <Item key={key} variant={'outline'}>
                <ItemContent>
                  <ItemTitle>{e.title}</ItemTitle>
                  <ItemDescription>{e.description}</ItemDescription>
                </ItemContent>
                <ItemActions>
                  <Button
                    variant={'outline'}
                    className="mr-4"
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
                    onClick={() => handleDelete(e.id)}
                  >
                    <IconTrash />
                  </Button>
                </ItemActions>
              </Item>
            )
          })
        )}
      </div>

      <TaskForm
        key={editTask?.id ?? 'new'}
        task={editTask}
        open={openFormDialog}
        onOpenChange={setOpenFormDialog}
      />
    </div>
  )
}
