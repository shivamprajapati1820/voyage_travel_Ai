/**
 * Pulse-animated placeholder shown while the route + travel options are
 * being fetched/computed. Uses Tailwind's built-in animate-pulse - no
 * extra CSS needed.
 */
const RoutePlannerSkeleton = () => (
  <div className="space-y-6">
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {[0, 1, 2, 3].map((i) => (
        <div key={i} className="animate-pulse space-y-3 rounded-2xl border border-slate-100 bg-white p-5">
          <div className="h-11 w-11 rounded-xl bg-slate-200" />
          <div className="h-4 w-1/2 rounded bg-slate-200" />
          <div className="h-3 w-3/4 rounded bg-slate-100" />
          <div className="h-3 w-2/3 rounded bg-slate-100" />
        </div>
      ))}
    </div>
    <div className="h-[360px] animate-pulse rounded-2xl bg-slate-100" />
  </div>
);

export default RoutePlannerSkeleton;