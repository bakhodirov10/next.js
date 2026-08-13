import Link from "next/link";

export default function NotFound() {
  return (
    <div className="max-w-md mx-auto min-h-[60vh] px-4 flex flex-col items-center justify-center text-center">
      <h1 className="text-6xl font-extrabold text-gray-900 dark:text-white">404</h1>
      <h2 className="text-xl font-bold mt-4 text-gray-800 dark:text-gray-200">
        Sahifa topilmadi
      </h2>
      <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
        Siz qidirayotgan sahifa mavjud emas yoki ko&apos;chirilgan bo&apos;lishi mumkin.
      </p>
      <Link
        href="/products"
        className="mt-6 inline-flex items-center justify-center bg-black dark:bg-white text-white dark:text-black font-medium text-sm px-5 py-2.5 rounded-lg transition-colors hover:bg-gray-800 dark:hover:bg-gray-200"
      >
        Mahsulotlar sahifasiga qaytish
      </Link>
    </div>
  );
}
