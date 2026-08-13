"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  description: string;
  image: string;
}

interface ProductsResponse {
  products: Product[];
  total: number;
  page: number;
  totalPages: number;
  limit: number;
  sort: string;
}

function ProductsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const pageParam = parseInt(searchParams.get("page") || "1", 10);
  const sortParam = searchParams.get("sort") || "asc";

  const [products, setProducts] = useState<Product[]>([]);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/products?page=${pageParam}&limit=4&sort=${sortParam}`
        );
        const data: ProductsResponse = await res.json();
        setProducts(data.products || []);
        setTotalPages(data.totalPages || 1);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, [pageParam, sortParam]);

  const handleSortChange = (newSort: string) => {
    router.push(`/products?page=1&sort=${newSort}`);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      router.push(`/products?page=${newPage}&sort=${sortParam}`);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-gray-200 dark:border-zinc-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            Mahsulotlar
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Har bir sahifada 4 ta mahsulot
          </p>
        </div>

        <div className="flex items-center gap-2">
          <label htmlFor="sort" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Saralash:
          </label>
          <select
            id="sort"
            value={sortParam}
            onChange={(e) => handleSortChange(e.target.value)}
            className="bg-white dark:bg-zinc-900 border border-gray-300 dark:border-zinc-700 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer shadow-sm"
          >
            <option value="asc">A – Z (Alifbo bo&apos;yicha)</option>
            <option value="desc">Z – A (Teskari alifbo)</option>
          </select>
        </div>
      </div>

      {loading ? (
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
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 min-h-[320px]">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl p-5 flex flex-col justify-between hover:shadow-md transition-shadow"
            >
              <div>
                <div className="w-full h-36 bg-gray-100 dark:bg-zinc-800 rounded-lg flex items-center justify-center text-5xl mb-4 select-none">
                  {product.image}
                </div>
                <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wide">
                  {product.category}
                </span>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mt-1">
                  {product.name}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                  {product.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-gray-100 dark:border-zinc-800 flex items-center justify-between">
                <span className="text-lg font-bold text-gray-900 dark:text-white">
                  ${product.price}
                </span>
                <Link
                  href={`/products/${product.id}`}
                  className="text-xs font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 border border-blue-200 dark:border-blue-900/50 px-3 py-1.5 rounded-md transition-colors"
                >
                  Batafsil
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-gray-200 dark:border-zinc-800 pt-6">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Sahifa <span className="font-semibold text-gray-900 dark:text-white">{pageParam}</span> / <span className="font-semibold text-gray-900 dark:text-white">{totalPages}</span>
        </p>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handlePageChange(pageParam - 1)}
            disabled={pageParam <= 1 || loading}
            className="px-3.5 py-1.5 text-sm font-medium border rounded-lg transition-colors border-gray-300 dark:border-zinc-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-800 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Previous
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
            <button
              key={pageNum}
              onClick={() => handlePageChange(pageNum)}
              disabled={loading}
              className={`w-9 h-9 text-sm font-medium rounded-lg transition-colors flex items-center justify-center ${
                pageNum === pageParam
                  ? "bg-black text-white dark:bg-white dark:text-black font-bold"
                  : "border border-gray-300 dark:border-zinc-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-800"
              }`}
            >
              {pageNum}
            </button>
          ))}

          <button
            onClick={() => handlePageChange(pageParam + 1)}
            disabled={pageParam >= totalPages || loading}
            className="px-3.5 py-1.5 text-sm font-medium border rounded-lg transition-colors border-gray-300 dark:border-zinc-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-800 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-5xl mx-auto px-4 py-12 text-center text-gray-500">
          Yuklanmoqda...
        </div>
      }
    >
      <ProductsContent />
    </Suspense>
  );
}
