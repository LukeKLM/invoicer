import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

function SkeletonCard({ rows }: { rows: number }) {
  return (
    <Card>
      <CardHeader className="p-5 pb-4">
        <Skeleton className="h-4 w-24" />
      </CardHeader>
      <CardContent className="grid grid-cols-1 gap-x-6 gap-y-4 p-5 pt-0 sm:grid-cols-2">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-4 w-32" />
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

export function ContactDetailSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2" aria-busy="true" aria-label="Loading">
      <SkeletonCard rows={4} />
      <SkeletonCard rows={4} />
    </div>
  )
}
