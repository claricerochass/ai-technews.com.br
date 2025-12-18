export function LoadingSkeleton() {
  return (
    <div className="divide-y divide-border">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="flex gap-4 p-4">
          <div className="h-20 w-28 flex-shrink-0 animate-pulse rounded-md bg-secondary" />
          <div className="flex flex-1 flex-col justify-between py-0.5">
            <div>
              <div className="h-4 w-3/4 animate-pulse rounded bg-secondary" />
              <div className="mt-2 h-3 w-full animate-pulse rounded bg-secondary" />
            </div>
            <div className="mt-2 flex items-center gap-2">
              <div className="h-4 w-12 animate-pulse rounded bg-secondary" />
              <div className="h-3 w-20 animate-pulse rounded bg-secondary" />
              <div className="h-3 w-16 animate-pulse rounded bg-secondary" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
