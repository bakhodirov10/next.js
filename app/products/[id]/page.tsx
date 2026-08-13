import Link from "next/link";
import { notFound } from "next/navigation";
import { productsData } from "../../api/products/data";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = productsData.find((p) => p.id === id);

  if (!product) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Link
        href="/products"
        className="inline-flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white mb-6"
      >
        ← Barcha mahsulotlarga qaytish
      </Link>

      <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl p-8 flex flex-col md:flex-row gap-8 shadow-sm">
        <div className="w-full md:w-1/3 aspect-square bg-gray-100 dark:bg-zinc-800 rounded-xl flex items-center justify-center text-7xl select-none">
          {product.image}
        </div>
        <div className="flex-1 flex flex-col justify-center">
          <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 tracking-wider uppercase">
            {product.category}
          </span>
          <h1 className="text-3xl font-bold mt-2 text-gray-900 dark:text-white">
            {product.name}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-4 leading-relaxed">
            {product.description}
          </p>
          <div className="mt-6 flex items-center justify-between">
            <span className="text-2xl font-bold text-gray-900 dark:text-white">
              ${product.price}
            </span>
            <button className="bg-black hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-200 text-white dark:text-black font-medium px-6 py-2.5 rounded-lg transition-colors">
              Sotib olish
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
