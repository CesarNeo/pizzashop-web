import { useQuery } from '@tanstack/react-query'
import { Helmet } from 'react-helmet-async'
import { useSearchParams } from 'react-router-dom'
import { z } from 'zod'

import { getOrders } from '@/api'
import Pagination from '@/components/pagination'
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import OrderTableFilters from './order-table-filters'
import OrderTableRow from './order-table-row'

function Orders() {
  const [searchParams, setSearchParams] = useSearchParams()
  const pageIndex = z.coerce
    .number()
    .transform((page) => page - 1)
    .parse(searchParams.get('page') ?? 1)

  const { data: resultOrders } = useQuery({
    queryKey: ['orders', pageIndex],
    queryFn: () => getOrders({ pageIndex }),
  })

  function handlePaginate(pageIndex: number) {
    setSearchParams((prevParams) => {
      prevParams.set('page', String(pageIndex + 1))

      return prevParams
    })
  }

  return (
    <>
      <Helmet title="Pedidos" />

      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Pedidos</h1>

        <div className="space-y-2.5">
          <OrderTableFilters />

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[4rem]" />
                  <TableHead className="w-[8.75rem]">Identificador</TableHead>
                  <TableHead className="w-[11.25rem]">Realizado há</TableHead>
                  <TableHead className="w-[8.75rem]">Status</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead className="w-[8.75rem]">Total do pedido</TableHead>
                  <TableHead className="w-[10.25rem]" />
                  <TableHead className="w-[8.25rem]" />
                </TableRow>
              </TableHeader>

              <TableBody>
                {resultOrders &&
                  resultOrders.orders.map((order) => (
                    <OrderTableRow key={order.orderId} order={order} />
                  ))}
              </TableBody>
            </Table>
          </div>

          {resultOrders && (
            <Pagination
              onPageChange={handlePaginate}
              pageIndex={resultOrders.meta.pageIndex}
              perPage={resultOrders.meta.perPage}
              totalCount={resultOrders.meta.totalCount}
            />
          )}
        </div>
      </div>
    </>
  )
}

export default Orders
