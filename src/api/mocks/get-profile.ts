import { http, HttpResponse } from 'msw'

import { GetProfileResponse } from '../get-profile'

export const getProfileMock = http.get<never, never, GetProfileResponse>(
  'me',
  () => {
    return HttpResponse.json({
      id: 'user-id-1',
      name: 'John Doe',
      email: 'johndoe@example.com',
      createdAt: new Date('2021-01-01'),
      updatedAt: new Date('2021-01-01'),
      phone: '1234567890',
      role: 'manager',
    })
  },
)
