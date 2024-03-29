import { http, HttpResponse } from 'msw'

import { UpdateProfileBody } from '../update-profile'

export const updateProfileMock = http.put<never, UpdateProfileBody>(
  'profile',
  async ({ request }) => {
    const { name } = await request.json()

    if (name === 'Pizza Shop Updated') {
      return new HttpResponse(null, { status: 204 })
      console.log('')
    }

    return new HttpResponse(null, { status: 400 })
  },
)
