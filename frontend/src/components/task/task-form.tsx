import { z } from 'zod'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog'
import {
  Field,
  FieldContent,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
  FieldTitle,
} from '../ui/field'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { statusList, type TaskSchema } from './task'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { RadioGroup, RadioGroupItem } from '../ui/radio-group'
import { Button } from '../ui/button'
import { Textarea } from '../ui/textarea'

const formSchema = z.object({
  title: z.string().min(1, 'title must not be empty.'),
  description: z.string().catch(''),
  status: z.string().optional(),
})

type formType = z.infer<typeof formSchema>

export default function TaskForm({
  task,
  open = false,
  onOpenChange,
}: {
  task?: TaskSchema
  open?: boolean
  onOpenChange?: (e: boolean) => void
}) {
  const queryClient = useQueryClient()
  const isEdit = task !== undefined

  const createTask = useMutation({
    mutationFn: async (e: formType) => {
      const method = isEdit ? 'PATCH' : 'POST'
      await fetch(`http://localhost:3001/task${isEdit ? `/${task?.id}` : ''}`, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(e),
      })
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
    },
  })

  const { handleSubmit, control } = useForm<formType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: task?.title ?? '',
      description: task?.description ?? '',
      status: task?.status ?? 'inactive',
    },
  })

  const onSubmit = (e: formType) => {
    createTask.mutate(e)
    onOpenChange?.(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <form id="task-form" onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {isEdit ? 'Edit Task' : 'Create new Task'}
            </DialogTitle>
            <DialogDescription>
              {isEdit
                ? 'Make changes to your task and click save.'
                : 'Create your new task and click save.'}
            </DialogDescription>
          </DialogHeader>
          <FieldGroup>
            <Controller
              name="title"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    {...field}
                    id="title"
                    aria-invalid={fieldState.invalid}
                    placeholder="Plan Task"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="description"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    {...field}
                    id="description"
                    aria-invalid={fieldState.invalid}
                    placeholder="Plan Task"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            {isEdit && (
              <Controller
                control={control}
                name="status"
                render={({ field, fieldState }) => (
                  <FieldSet data-invalid={fieldState.invalid}>
                    <Label>Status</Label>
                    <RadioGroup
                      name={field.name}
                      value={field.value}
                      onValueChange={field.onChange}
                      aria-invalid={fieldState.invalid}
                      className="grid grid-cols-3"
                    >
                      {Object.entries(statusList).map(([key, value]) => (
                        <FieldLabel key={key} htmlFor={`${key}-status`}>
                          <Field orientation={'horizontal'}>
                            <FieldContent>
                              <value.Icon />
                              <FieldTitle>{value.title}</FieldTitle>
                            </FieldContent>
                            <RadioGroupItem
                              value={key}
                              id={`${key}-status`}
                              aria-invalid={fieldState.invalid}
                              className="hidden"
                            />
                          </Field>
                        </FieldLabel>
                      ))}
                    </RadioGroup>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </FieldSet>
                )}
              />
            )}
          </FieldGroup>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" form="task-form">
              Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  )
}
