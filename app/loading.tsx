export default function Loading() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-20 flex flex-col items-center justify-center">
      <div className="w-10 h-10 border-4 border-gray-200 border-t-black dark:border-zinc-800 dark:border-t-white rounded-full animate-spin mb-4" />
      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Yuklanmoqda...</p>
    </div>
  );
}
