import { Button } from '../ui/button'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '../ui/empty'
import { IconClockCode, IconPlus } from '@tabler/icons-react'

interface EmptyTaskArgs {
  callback: () => void
}

export default function EmptyTask({ callback }: EmptyTaskArgs) {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <IconClockCode />
        </EmptyMedia>
        <EmptyTitle>No Tasks Yet</EmptyTitle>
        <EmptyDescription>
          You haven&apos;t created any tasks yet. Get started by creating your
          task.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent className="flex-row justify-center gap-2">
        <Button type="button" onClick={callback}>
          <IconPlus /> Create Task
        </Button>
      </EmptyContent>
    </Empty>
  )
}
