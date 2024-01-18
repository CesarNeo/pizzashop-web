import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import {
  getManagedRestaurant,
  GetManagedRestaurantResponse,
  updateProfile,
} from '@/api'

import { Button } from './ui/button'
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Textarea } from './ui/textarea'

const storeProfileSchema = z.object({
  name: z.string().min(1),
  description: z.string().nullable(),
})

type StoreProfileSchema = z.infer<typeof storeProfileSchema>

function StoreProfileDialog() {
  const queryClient = useQueryClient()
  const { data: managedRestaurant } = useQuery({
    queryKey: ['managed-restaurant'],
    queryFn: getManagedRestaurant,
    staleTime: Infinity,
  })

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<StoreProfileSchema>({
    resolver: zodResolver(storeProfileSchema),
    values: {
      name: managedRestaurant?.name ?? '',
      description: managedRestaurant?.description ?? '',
    },
  })

  function updateManagedRestaurantCached({
    name,
    description,
  }: StoreProfileSchema) {
    const managedRestaurantCached =
      queryClient.getQueryData<GetManagedRestaurantResponse>([
        'managed-restaurant',
      ])

    if (managedRestaurantCached) {
      queryClient.setQueryData<GetManagedRestaurantResponse>(
        ['managed-restaurant'],
        {
          ...managedRestaurantCached,
          name,
          description,
        },
      )
    }

    return { managedRestaurantCached }
  }

  const { mutateAsync: updateProfileFn } = useMutation({
    mutationFn: updateProfile,
    onMutate({ name, description }) {
      return updateManagedRestaurantCached({ name, description })
    },
    onError(_, __, context) {
      if (context?.managedRestaurantCached) {
        updateManagedRestaurantCached(context.managedRestaurantCached)
      }
    },
  })

  const onSubmit = handleSubmit(async ({ name, description }) => {
    try {
      await updateProfileFn({ name, description })

      toast.success('Perfil atualizado com sucesso!')
    } catch {
      toast.error('Erro ao atualizar perfil, tente novamente!')
    }
  })

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Perfil da loja</DialogTitle>

        <DialogDescription>
          Atualize as informações da sua loja para que seus clientes possam te
          encontrar.
        </DialogDescription>
      </DialogHeader>

      <form onSubmit={onSubmit}>
        <div className="space-y-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right" htmlFor="name">
              Nome
            </Label>
            <Input className="col-span-3" id="name" {...register('name')} />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right" htmlFor="description">
              Descrição
            </Label>
            <Textarea
              className="col-span-3"
              id="description"
              {...register('description')}
            />
          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="ghost" type="button">
              Cancelar
            </Button>
          </DialogClose>
          <Button variant="success" type="submit" disabled={isSubmitting}>
            Salvar
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  )
}

export default StoreProfileDialog
