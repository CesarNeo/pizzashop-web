import { api } from '@/lib/axios'

export interface Order {
  orderId: string
  customerName: string
  total: number
  status: 'pending' | 'canceled' | 'processing' | 'delivering' | 'delivered'
  createdAt: Date
}

export interface GetOrdersQuery {
  pageIndex?: number | null
  orderId?: string | null
  customerName?: string | null
  status?: Order['status'] | 'all' | null
}

export interface GetOrdersResponse {
  orders: Order[]
  meta: {
    pageIndex: number
    perPage: number
    totalCount: number
  }
}

export async function getOrders({
  pageIndex = 0,
  customerName,
  orderId,
  status,
}: GetOrdersQuery) {
  const response = await api.get<GetOrdersResponse>('orders', {
    params: {
      pageIndex,
      customerName,
      orderId,
      status: status === 'all' ? undefined : status,
    },
  })

  return response.data
}
