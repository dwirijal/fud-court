'use client'

import * as React from 'react'
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  useReactTable,
  type ExpandedState,
  type Row,
} from '@tanstack/react-table'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  renderRowSubComponent?: (row: Row<TData>) => React.ReactElement
  getRowCanExpand?: (row: Row<TData>) => boolean
}

export function DataTable<TData, TValue>({
  columns,
  data,
  renderRowSubComponent,
  getRowCanExpand,
}: DataTableProps<TData, TValue>) {
  const [expanded, setExpanded] = React.useState<ExpandedState>({})

  const table = useReactTable({
    data,
    columns,
    state: {
      expanded,
    },
    onExpandedChange: setExpanded,
    getRowCanExpand,
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
  })

  return (
    <Table>
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => {
              return (
                <TableHead key={header.id} className="text-xs uppercase tracking-wider text-muted-foreground">
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </TableHead>
              )
            })}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {table.getRowModel().rows?.length ? (
          table.getRowModel().rows.map((row) => (
            <React.Fragment key={row.id}>
              <TableRow
                data-state={row.getIsSelected() && 'selected'}
                className={row.getIsExpanded() ? 'border-b-0' : ''}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
              {row.getIsExpanded() && renderRowSubComponent && (
                <TableRow>
                  <TableCell colSpan={row.getVisibleCells().length} className="p-0">
                    {renderRowSubComponent(row)}
                  </TableCell>
                </TableRow>
              )}
            </React.Fragment>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={columns.length} className="h-24 text-center">
              Tidak ada hasil.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  )
}
