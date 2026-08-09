import { Item, ItemActions, ItemContent } from '../ui/item'
import { Skeleton } from '../ui/skeleton'

export default function TaskLoadingSkeleton() {
  return (
    <div className="flex flex-col gap-2 h-full">
      {Array.from({ length: 4 }, (_, i) => (
        <Item key={i} variant={'outline'}>
          <ItemContent>
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-3 w-64" />
          </ItemContent>
          <ItemActions>
            <Skeleton className="h-9 w-24" />
            <Skeleton className="size-9" />
            <Skeleton className="size-9" />
          </ItemActions>
        </Item>
      ))}
    </div>
  )
}
