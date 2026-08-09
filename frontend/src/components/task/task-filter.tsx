import { Button } from '@/components/ui/button'
import { useMemo, useState } from 'react'
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

export function TaskFilter({
  handleFiter,
}: {
  handleFiter: (e: StatusType[]) => void
}) {
  const [activeFilter, setActiveFilter] =
    useState<Record<StatusType, boolean>>(defaultValue)

  const activeFilterLength = useMemo(
    () =>
      Object.entries(activeFilter)
        .filter(([_, status]) => status)
        .map(([value, _]) => value as StatusType).length,
    [activeFilter],
  )

  const isAll = useMemo(
    () =>
      activeFilterLength === 0 ||
      activeFilterLength === Object.values(activeFilter).length,
    [activeFilterLength, activeFilter],
  )

  const handleToggle = (key: StatusType) => {
    // console.log(activeFilter)
    setActiveFilter((prev) => ({ ...prev, [key]: !prev[key] }))
    const filters = Object.entries({
      ...activeFilter,
      [key]: !activeFilter[key],
    })
      .filter(([_, status]) => status)
      .map(([value, _]) => value as StatusType)
    handleFiter(filters)
  }

  const clearFilters = () => {
    setActiveFilter(defaultValue)
    handleFiter([])
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          <IconFilter />{' '}
          {activeFilterLength > 0 && <span>{activeFilterLength}</span>}
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
