import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"

export function CompaniesTableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="rounded-xl border border-gray-700/50 overflow-hidden shadow-2xl backdrop-blur-sm animate-pulse">
      <Table>
        {/* Header (static, but pulsing) */}
        <TableHeader className="bg-gradient-to-r from-gray-900/80 to-gray-800/80">
          <TableRow className="border-gray-700/50">
            {["Company","Role","Type","Package","Deadline","Status","Drive Type","Notes","Link","Actions"].map((label) => (
              <TableHead key={label}>
                <div className="h-4 w-20 bg-gray-700 rounded-md" />
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>

        {/* Body: multiple skeleton rows */}
        <TableBody>
          {Array.from({ length: rows }).map((_, idx) => (
            <TableRow
              key={idx}
              className="border-gray-700/50"
            >
              {Array(10).fill(0).map((_, cell) => (
                <TableCell key={cell}>
                  <div className="h-4 bg-gray-700 rounded-md w-full" />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
