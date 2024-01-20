import { zodResolver } from '@hookform/resolvers/zod'
import { Search, X } from 'lucide-react'
import { Controller, useForm } from 'react-hook-form'
import { useSearchParams } from 'react-router-dom'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const orderFiltersSchema = z.object({
  orderId: z.string().optional(),
  customerName: z.string().optional(),
  status: z
    .enum([
      'all',
      'pending',
      'canceled',
      'processing',
      'delivering',
      'delivered',
    ])
    .optional(),
})

type OrderFiltersSchema = z.infer<typeof orderFiltersSchema>

function OrderTableFilters() {
  const [searchParams, setSearchParams] = useSearchParams()
  const orderId = searchParams.get('orderId')
  const customerName = searchParams.get('customerName')
  const status = searchParams.get('status') as OrderFiltersSchema['status']

  const { register, handleSubmit, control, reset } =
    useForm<OrderFiltersSchema>({
      resolver: zodResolver(orderFiltersSchema),
      defaultValues: {
        orderId: orderId ?? '',
        customerName: customerName ?? '',
        status: status ?? 'all',
      },
    })

  const handleFilter = handleSubmit(({ orderId, customerName, status }) => {
    setSearchParams((prevParams) => {
      if (orderId) {
        prevParams.set('orderId', orderId)
      } else {
        prevParams.delete('orderId')
      }

      if (customerName) {
        prevParams.set('customerName', customerName)
      } else {
        prevParams.delete('customerName')
      }

      if (status) {
        prevParams.set('status', status)
      } else {
        prevParams.delete('status')
      }

      prevParams.set('page', '1')

      return prevParams
    })
  })

  function handleClearFilters() {
    setSearchParams((prevParams) => {
      prevParams.delete('orderId')
      prevParams.delete('customerName')
      prevParams.delete('status')
      prevParams.set('page', '1')

      return prevParams
    })

    reset()
  }

  return (
    <form className="flex items-center gap-2" onSubmit={handleFilter}>
      <span className="text-sm font-semibold">Filtros:</span>

      <Input
        placeholder="ID do pedido"
        className="h-8 w-auto"
        {...register('orderId')}
      />
      <Input
        placeholder="Nome do client"
        className="h-8 w-[20rem]"
        {...register('customerName')}
      />

      <Controller
        control={control}
        name="status"
        render={({ field }) => (
          <Select defaultValue="all" onValueChange={field.onChange} {...field}>
            <SelectTrigger className="h-8 w-[11.25rem]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos status</SelectItem>
              <SelectItem value="pending">Pendente</SelectItem>
              <SelectItem value="canceled">Cancelado</SelectItem>
              <SelectItem value="processing">Em preparo</SelectItem>
              <SelectItem value="delivering">Em entrega</SelectItem>
              <SelectItem value="delivered">Entregue</SelectItem>
            </SelectContent>
          </Select>
        )}
      />

      <Button type="submit" variant="secondary" size="xs">
        <Search className="mr-2 h-4 w-4" />
        Filtrar resultados
      </Button>

      <Button
        type="button"
        variant="outline"
        size="xs"
        onClick={handleClearFilters}
      >
        <X className="mr-2 h-4 w-4" />
        Remover filtros
      </Button>
    </form>
  )
}

export default OrderTableFilters
