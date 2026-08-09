import TaskList from '#/components/task/task-list'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({ component: Home })

function Home() {
  return (
    <div className="p-8 grid grid-rows-[auto_1fr] justify-center">
      <h1 className="text-4xl font-bold py-6">
        Homework Project -{' '}
        <span className="font-light tracking-tight">Ralph Luis Abejuela</span>
      </h1>
      <main className="w-full grid items-center">
        <TaskList />
      </main>
    </div>
  )
}
