import { http, HttpResponse } from 'msw'

import { GetMonthCanceledOrdersAmountResponse } from '..'

export const getMonthCanceledOrdersAmountMock = http.get<
  never,
  never,
  GetMonthCanceledOrdersAmountResponse
>('/metrics/month-canceled-orders-amount', () => {
  return HttpResponse.json({
    amount: 100,
    diffFromLastMonth: 10,
  })
})
