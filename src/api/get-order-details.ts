import { api } from '@/lib/axios'

import { Order } from '.'

export interface GetOrderDetailsResponse {
  id: string
  status: Order['status']
  totalInCents: number
  customer: {
    name: string
    email: string
    phone: string
  }
  orderItems: {
    id: string
    priceInCents: number
    quantity: number
    product: {
      name: string
    }
  }[]
  createdAt: string
}

export async function getOrderDetails(orderId: string) {
  const { data } = await api.get<GetOrderDetailsResponse>(`/orders/${orderId}`)

  return data
}
