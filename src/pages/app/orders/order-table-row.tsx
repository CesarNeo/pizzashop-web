import { useMutation, useQueryClient } from '@tanstack/react-query'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { ArrowRight, Search, X } from 'lucide-react'
import { useState } from 'react'

import {
  approveOrder,
  cancelOrder,
  deliverOrder,
  dispatchOrder,
  GetOrdersResponse,
  Order,
} from '@/api'
import OrderStatus from '@/components/order-status'
import { Button } from '@/components/ui/button'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import { TableCell, TableRow } from '@/components/ui/table'

import OrderDetails from './order-details'

interface OrderTableRowProps {
  order: Order
}

function OrderTableRow({ order }: OrderTableRowProps) {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const queryClient = useQueryClient()

  const orderTotalPrice = (order.total / 100).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })
  const orderCreatedAt = formatDistanceToNow(new Date(order.createdAt), {
    locale: ptBR,
    addSuffix: true,
  })
  const isPendingOrProcessing = ['pending', 'processing'].includes(order.status)

  function updateOrderStatusOnCache(orderId: string, status: Order['status']) {
    const ordersCached = queryClient.getQueriesData<GetOrdersResponse>({
      queryKey: ['orders'],
    })

    ordersCached.forEach(([cacheKey, cacheData]) => {
      if (!cacheData) return

      queryClient.setQueryData<GetOrdersResponse>(cacheKey, {
        ...cacheData,
        orders: cacheData.orders.map((order) => {
          if (order.orderId === orderId) {
            return {
              ...order,
              status,
            }
          }

          return order
        }),
      })
    })
  }

  const { mutateAsync: cancelOrderFn, isPending: isCancelingOrder } =
    useMutation({
      mutationFn: cancelOrder,
      onSuccess: async (_, orderId) =>
        updateOrderStatusOnCache(orderId, 'canceled'),
    })

  const { mutateAsync: approveOrderFn, isPending: isApprovingOrder } =
    useMutation({
      mutationFn: approveOrder,
      onSuccess: async (_, orderId) =>
        updateOrderStatusOnCache(orderId, 'processing'),
    })

  const { mutateAsync: dispatchOrderFn, isPending: isDispatchingOrder } =
    useMutation({
      mutationFn: dispatchOrder,
      onSuccess: async (_, orderId) =>
        updateOrderStatusOnCache(orderId, 'delivering'),
    })

  const { mutateAsync: deliverOrderFn, isPending: isDeliveringOrder } =
    useMutation({
      mutationFn: deliverOrder,
      onSuccess: async (_, orderId) =>
        updateOrderStatusOnCache(orderId, 'delivered'),
    })

  return (
    <TableRow>
      <TableCell>
        <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="xs">
              <Search className="h-3 w-3" />
              <span className="sr-only">Detalhes do pedido</span>
            </Button>
          </DialogTrigger>

          <OrderDetails orderId={order.orderId} open={isDetailsOpen} />
        </Dialog>
      </TableCell>
      <TableCell className="font-mono text-xs font-medium">
        {order.orderId}
      </TableCell>
      <TableCell className="text-muted-foreground">{orderCreatedAt}</TableCell>
      <TableCell>
        <OrderStatus status={order.status} />
      </TableCell>
      <TableCell className="font-medium">{order.customerName}</TableCell>
      <TableCell className="font-medium">{orderTotalPrice}</TableCell>
      <TableCell>
        {order.status === 'pending' && (
          <Button
            variant="outline"
            size="xs"
            onClick={() => approveOrderFn(order.orderId)}
            disabled={isApprovingOrder}
          >
            <ArrowRight className="mr-2 h-3 w-3" />
            Aprovar
          </Button>
        )}

        {order.status === 'processing' && (
          <Button
            variant="outline"
            size="xs"
            onClick={() => dispatchOrderFn(order.orderId)}
            disabled={isDispatchingOrder}
          >
            <ArrowRight className="mr-2 h-3 w-3" />
            Em entrega
          </Button>
        )}

        {order.status === 'delivering' && (
          <Button
            variant="outline"
            size="xs"
            onClick={() => deliverOrderFn(order.orderId)}
            disabled={isDeliveringOrder}
          >
            <ArrowRight className="mr-2 h-3 w-3" />
            Entregue
          </Button>
        )}
      </TableCell>
      <TableCell>
        {order.status !== 'delivered' && (
          <Button
            disabled={!isPendingOrProcessing || isCancelingOrder}
            variant="ghost"
            size="xs"
            onClick={() => cancelOrderFn(order.orderId)}
          >
            <X className="mr-2 h-3 w-3" />
            Cancelar
          </Button>
        )}
      </TableCell>
    </TableRow>
  )
}

export default OrderTableRow
