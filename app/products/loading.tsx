export default function ProductsLoading() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-gray-200 dark:border-zinc-800 animate-pulse">
        <div className="h-8 bg-gray-200 dark:bg-zinc-800 rounded-lg w-48" />
        <div className="h-9 bg-gray-200 dark:bg-zinc-800 rounded-lg w-36" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 min-h-[320px]">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="border border-gray-200 dark:border-zinc-800 rounded-xl p-4 animate-pulse bg-gray-50 dark:bg-zinc-900 flex flex-col gap-4"
          >
            <div className="w-full h-36 bg-gray-200 dark:bg-zinc-800 rounded-lg" />
            <div className="h-4 bg-gray-200 dark:bg-zinc-800 rounded w-3/4" />
            <div className="h-4 bg-gray-200 dark:bg-zinc-800 rounded w-1/2" />
          </div>
        ))}
      </div>
    </div>
  );
}
