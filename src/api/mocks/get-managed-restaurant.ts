import { http, HttpResponse } from 'msw'

import { GetManagedRestaurantResponse } from '../get-managed-restaurant'

export const getManagedRestaurantMock = http.get<
  never,
  never,
  GetManagedRestaurantResponse
>('managed-restaurant', () => {
  return HttpResponse.json({
    id: 'restaurant-id-1',
    name: 'Restaurant Name',
    managerId: 'user-id-1',
    description: 'Restaurant description',
    createdAt: new Date('2021-01-01'),
    updatedAt: new Date('2021-01-01'),
  })
})
