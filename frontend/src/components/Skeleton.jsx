export const SkeletonCard = () => (
  <div className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm animate-pulse">
    <div className="flex items-start justify-between gap-3 mb-4">
      <div className="space-y-2 flex-1">
        <div className="h-4 w-2/3 bg-black/10 rounded" />
        <div className="h-3 w-1/2 bg-black/10 rounded" />
      </div>
      <div className="h-6 w-20 bg-black/10 rounded-full" />
    </div>
    <div className="h-9 w-full bg-black/10 rounded-xl" />
  </div>
);

export const SkeletonGrid = ({ count = 4 }) => (
  <div className="grid md:grid-cols-2 gap-5">
    {Array.from({ length: count }).map((_, i) => (
      <SkeletonCard key={i} />
    ))}
  </div>
);

export const SkeletonStat = () => (
  <div className="rounded-2xl bg-white border border-black/5 p-6 shadow-sm animate-pulse">
    <div className="h-3 w-20 bg-black/10 rounded mb-3" />
    <div className="h-8 w-16 bg-black/10 rounded" />
  </div>
);