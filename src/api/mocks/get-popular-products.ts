import { http, HttpResponse } from 'msw'

import { GetPopularProductsResponse } from '../get-popular-products'

export const getPopularProductsMock = http.get<
  never,
  never,
  GetPopularProductsResponse
>('/metrics/popular-products', () => {
  return HttpResponse.json([
    {
      product: 'Coca-Cola',
      amount: 100,
    },
    {
      product: 'Fanta',
      amount: 200,
    },
    {
      product: 'Sprite',
      amount: 300,
    },
  ])
})
