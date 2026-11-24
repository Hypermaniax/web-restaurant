import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

interface ReportTableProps {
  headers: string[]
  rows: Array<Array<string | number>>
  footer?: Array<string | number>
}

export function ReportTable({ headers, rows, footer }: ReportTableProps) {
  return (
    <div className="border-pine/10 overflow-x-auto rounded-xl border">
      <Table>
        <TableHeader>
          <TableRow>
            {headers.map((header) => (
              <TableHead key={header}>{header}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row, rowIndex) => (
            <TableRow key={rowIndex}>
              {row.map((cell, cellIndex) => (
                <TableCell
                  key={`${rowIndex}-${cellIndex}`}
                  className={cellIndex === 0 ? 'font-medium' : undefined}
                >
                  {cell}
                </TableCell>
              ))}
            </TableRow>
          ))}
          {footer ? (
            <TableRow className="bg-muted/50 font-semibold">
              {footer.map((cell, index) => (
                <TableCell key={`footer-${index}`}>{cell}</TableCell>
              ))}
            </TableRow>
          ) : null}
        </TableBody>
      </Table>
    </div>
  )
}
