import Link from "next/link";

export default function Home() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-20 text-center flex flex-col items-center justify-center min-h-[70vh]">
      <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white">
        Next.js Products Filter, Search &amp; Pagination Demo
      </h1>
      <p className="mt-4 text-lg text-gray-600 dark:text-gray-400 max-w-xl">
        Next.js App Router va API handler orqali mahsulotlarni qidirish (search), narx bo&apos;yicha filtrlash (minPrice, maxPrice), saralash (sort) va sahifalash (pagination).
      </p>
      <div className="mt-8 flex gap-4">
        <Link
          href="/products"
          className="bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 px-6 py-3 rounded-lg font-medium transition-colors"
        >
          Mahsulotlarni ko&apos;rish →
        </Link>
      </div>
    </div>
  );
}

