import { Button } from '@/components/ui/button'
import { useState } from 'react'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu'
import { IconFilter, IconRefresh } from '@tabler/icons-react'
import type { StatusType } from './task'

const defaultValue: Record<StatusType, boolean> = {
  active: false,
  completed: false,
  inactive: false,
}

const selectedStatuses = (filter: Record<StatusType, boolean>): StatusType[] =>
  (Object.keys(filter) as StatusType[]).filter((k) => filter[k])

export function TaskFilter({
  handleFilter,
}: {
  handleFilter: (e: StatusType[]) => void
}) {
  const [activeFilter, setActiveFilter] =
    useState<Record<StatusType, boolean>>(defaultValue)

  const selected = selectedStatuses(activeFilter)
  const isAll =
    selected.length === 0 ||
    selected.length === Object.keys(activeFilter).length

  const handleToggle = (key: StatusType) => {
    const next = { ...activeFilter, [key]: !activeFilter[key] }
    setActiveFilter(next)
    handleFilter(selectedStatuses(next))
  }

  const clearFilters = () => {
    setActiveFilter(defaultValue)
    handleFilter([])
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          <IconFilter /> {selected.length > 0 && <span>{selected.length}</span>}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-40">
        <DropdownMenuGroup>
          <DropdownMenuLabel>Status Filter</DropdownMenuLabel>
          <DropdownMenuCheckboxItem
            checked={isAll}
            onCheckedChange={clearFilters}
          >
            All
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={activeFilter.inactive}
            onCheckedChange={() => handleToggle('inactive')}
          >
            Inactive
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={activeFilter.active}
            onCheckedChange={() => handleToggle('active')}
          >
            Active
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={activeFilter.completed}
            onCheckedChange={() => handleToggle('completed')}
          >
            Completed
          </DropdownMenuCheckboxItem>
        </DropdownMenuGroup>
        <Button
          variant={'outline'}
          size={'sm'}
          className="font-light mt-2 mb-1"
          onClick={clearFilters}
        >
          <IconRefresh />
          Clear All
        </Button>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
