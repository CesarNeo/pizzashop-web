import { http, HttpResponse } from 'msw'

import { GetOrderDetailsResponse } from '../get-order-details'

export const getOrderDetailsMock = http.get<
  { orderId: string },
  never,
  GetOrderDetailsResponse
>('/orders/:orderId', ({ params }) => {
  return HttpResponse.json({
    id: params.orderId,
    customer: {
      name: 'John Doe',
      email: 'johndoe@example.com',
      phone: '1234567890',
    },
    status: 'delivered',
    createdAt: new Date().toISOString(),
    orderItems: [
      {
        id: 'item-1',
        priceInCents: 1200,
        quantity: 2,
        product: {
          name: 'Pizza Margherita',
        },
      },
    ],
    totalInCents: 2400,
  })
})
