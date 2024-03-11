import { http, HttpResponse } from 'msw'

import { GetDailyRevenueInPeriodResponse } from '../get-daily-revenue-in-period'

export const getDailyRevenueInPeriodMock = http.get<
  never,
  never,
  GetDailyRevenueInPeriodResponse
>('/metrics/daily-receipt-in-period', () => {
  return HttpResponse.json([
    {
      date: '2021-01-01',
      receipt: 100,
    },
    {
      date: '2021-01-02',
      receipt: 200,
    },
    {
      date: '2021-01-03',
      receipt: 300,
    },
  ])
})
