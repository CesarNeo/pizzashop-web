import { api } from '@/lib/axios'

export interface GetOrdersQuery {
  pageIndex?: number | null
}

export interface Order {
  orderId: string
  customerName: string
  total: number
  status: 'pending' | 'canceled' | 'processing' | 'delivering' | 'delivered'
  createdAt: Date
}

export interface GetOrdersResponse {
  orders: Order[]
  meta: {
    pageIndex: number
    perPage: number
    totalCount: number
  }
}

export async function getOrders({ pageIndex = 0 }: GetOrdersQuery) {
  const response = await api.get<GetOrdersResponse>('orders', {
    params: {
      pageIndex,
    },
  })

  return response.data
}
