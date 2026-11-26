import { ReactNode, useState } from "react"
import {
  ColumnDef,
  RowData,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { ArrowDown, ArrowUp, ChevronsUpDown, Search } from "lucide-react"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

declare module "@tanstack/react-table" {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData extends RowData, TValue> {
    /** Right-align header and cells, e.g. for amounts */
    align?: "left" | "right"
  }
}

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  /** Shows a search box filtering across all columns */
  searchPlaceholder?: string
  /** Extra controls rendered next to the search box */
  toolbar?: ReactNode
  /** Rendered instead of the rows when there is no data at all */
  emptyState?: ReactNode
  loading?: boolean
}

export function DataTable<Tdata, TValue>({
  columns,
  data,
  searchPlaceholder,
  toolbar,
  emptyState,
  loading = false,
}: DataTableProps<Tdata, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [globalFilter, setGlobalFilter] = useState("")

  const table = useReactTable({
    data,
    columns,
    state: { sorting, globalFilter },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  })

  const rows = table.getRowModel().rows
  const showToolbar = searchPlaceholder !== undefined || toolbar

  return (
    <div className="overflow-hidden rounded-xl border bg-card shadow-card">
      {showToolbar && (
        <div className="flex flex-col gap-2 border-b p-3 sm:flex-row sm:items-center sm:justify-between">
          {searchPlaceholder !== undefined && (
            <div className="relative w-full sm:max-w-xs">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={globalFilter}
                onChange={(e) => setGlobalFilter(e.target.value)}
                placeholder={searchPlaceholder}
                className="h-8 pl-9"
                aria-label={searchPlaceholder}
              />
            </div>
          )}
          {toolbar && <div className="flex items-center gap-2">{toolbar}</div>}
        </div>
      )}
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className="hover:bg-transparent">
              {headerGroup.headers.map((header) => {
                const content = header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())
                const canSort = header.column.getCanSort() && typeof header.column.columnDef.header === "string"
                const sorted = header.column.getIsSorted()
                const alignRight = header.column.columnDef.meta?.align === "right"
                return (
                  <TableHead key={header.id} className={cn(alignRight && "text-right")}>
                    {canSort ? (
                      <button
                        type="button"
                        onClick={header.column.getToggleSortingHandler()}
                        className={cn(
                          "inline-flex items-center gap-1 rounded px-1 py-0.5 uppercase hover:text-foreground",
                          alignRight ? "-mr-1 flex-row-reverse" : "-ml-1"
                        )}
                      >
                        {content}
                        {sorted === "asc" ? <ArrowUp className="size-3" />
                          : sorted === "desc" ? <ArrowDown className="size-3" />
                          : <ChevronsUpDown className="size-3 opacity-40" />}
                      </button>
                    ) : content}
                  </TableHead>
                )
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {loading && data.length === 0 ? (
            Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i} className="hover:bg-transparent">
                {columns.map((_, j) => (
                  <TableCell key={j}><Skeleton className="h-4 w-full max-w-[8rem]" /></TableCell>
                ))}
              </TableRow>
            ))
          ) : rows.length ? (
            rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id} className={cn(cell.column.columnDef.meta?.align === "right" && "text-right")}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow className="hover:bg-transparent">
              <TableCell colSpan={columns.length} className={cn(!(data.length === 0 && emptyState) && "h-24 text-center text-muted-foreground")}>
                {data.length === 0 ? (emptyState ?? "No records.") : "No matching results."}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      {rows.length > 0 && (
        <div className="border-t px-4 py-2.5 text-xs text-muted-foreground">
          {globalFilter ? `${rows.length} of ${data.length}` : data.length} {data.length === 1 ? "record" : "records"}
        </div>
      )}
    </div>
  )
}
