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
  search: string;
  minPrice: string;
  maxPrice: string;
}

function ProductsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const pageParam = parseInt(searchParams.get("page") || "1", 10);
  const sortParam = searchParams.get("sort") || "asc";
  const searchParam = searchParams.get("search") || "";
  const minPriceParam = searchParams.get("minPrice") || "";
  const maxPriceParam = searchParams.get("maxPrice") || "";

  // Local state for filter input fields
  const [searchQuery, setSearchQuery] = useState(searchParam);
  const [minPrice, setMinPrice] = useState(minPriceParam);
  const [maxPrice, setMaxPrice] = useState(maxPriceParam);

  const [products, setProducts] = useState<Product[]>([]);
  const [totalProducts, setTotalProducts] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);

  // Sync local inputs when URL searchParams change
  useEffect(() => {
    setSearchQuery(searchParam);
    setMinPrice(minPriceParam);
    setMaxPrice(maxPriceParam);
  }, [searchParam, minPriceParam, maxPriceParam]);

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      try {
        const query = new URLSearchParams({
          page: pageParam.toString(),
          limit: "4",
          sort: sortParam,
          ...(searchParam && { search: searchParam }),
          ...(minPriceParam && { minPrice: minPriceParam }),
          ...(maxPriceParam && { maxPrice: maxPriceParam }),
        });

        const res = await fetch(`/api/products?${query.toString()}`);
        const data: ProductsResponse = await res.json();
        setProducts(data.products || []);
        setTotalPages(data.totalPages || 1);
        setTotalProducts(data.total || 0);
      } catch (error) {
        console.error("Fetch products error:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, [pageParam, sortParam, searchParam, minPriceParam, maxPriceParam]);

  const applyFilters = (updates: {
    page?: number;
    sort?: string;
    search?: string;
    minPrice?: string;
    maxPrice?: string;
  }) => {
    const params = new URLSearchParams();

    const newPage = updates.page !== undefined ? updates.page : 1;
    const newSort = updates.sort !== undefined ? updates.sort : sortParam;
    const newSearch = updates.search !== undefined ? updates.search : searchQuery;
    const newMinPrice = updates.minPrice !== undefined ? updates.minPrice : minPrice;
    const newMaxPrice = updates.maxPrice !== undefined ? updates.maxPrice : maxPrice;

    if (newPage > 1) params.set("page", newPage.toString());
    if (newSort && newSort !== "asc") params.set("sort", newSort);
    if (newSearch.trim()) params.set("search", newSearch.trim());
    if (newMinPrice.trim()) params.set("minPrice", newMinPrice.trim());
    if (newMaxPrice.trim()) params.set("maxPrice", newMaxPrice.trim());

    const queryString = params.toString();
    router.push(queryString ? `/products?${queryString}` : "/products");
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    applyFilters({ page: 1 });
  };

  const handleSortChange = (newSort: string) => {
    applyFilters({ sort: newSort, page: 1 });
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      applyFilters({ page: newPage });
    }
  };

  const handleResetFilters = () => {
    setSearchQuery("");
    setMinPrice("");
    setMaxPrice("");
    router.push("/products");
  };

  const isFilterActive =
    !!searchParam || !!minPriceParam || !!maxPriceParam || sortParam !== "asc";

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-gray-200 dark:border-zinc-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            Mahsulotlar
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Jami {totalProducts} ta mahsulot topildi (har bir sahifada 4 ta)
          </p>
        </div>
      </div>

      {/* Filter and Search controls */}
      <div className="bg-gray-50 dark:bg-zinc-900/60 border border-gray-200 dark:border-zinc-800 rounded-xl p-4 mb-8">
        <form onSubmit={handleSearchSubmit} className="flex flex-col gap-4">
          {/* Top row: Search input */}
          <div className="relative w-full">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Mahsulot nomi, toifa yoki tavsif bo'yicha qidirish..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-white dark:bg-zinc-900 border border-gray-300 dark:border-zinc-700 rounded-lg text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition"
            />
          </div>

          {/* Bottom row: Min price, Max price, Sort, Apply & Reset buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 items-center">
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                Min Narx ($):
              </label>
              <input
                type="number"
                min="0"
                placeholder="Masalan: 100"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="w-full px-3 py-2 bg-white dark:bg-zinc-900 border border-gray-300 dark:border-zinc-700 rounded-lg text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                Max Narx ($):
              </label>
              <input
                type="number"
                min="0"
                placeholder="Masalan: 1000"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-full px-3 py-2 bg-white dark:bg-zinc-900 border border-gray-300 dark:border-zinc-700 rounded-lg text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                Saralash:
              </label>
              <select
                id="sort"
                value={sortParam}
                onChange={(e) => handleSortChange(e.target.value)}
                className="w-full bg-white dark:bg-zinc-900 border border-gray-300 dark:border-zinc-700 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer shadow-sm"
              >
                <option value="asc">A – Z (Alifbo bo&apos;yicha)</option>
                <option value="desc">Z – A (Teskari alifbo)</option>
                <option value="price-asc">Narx: Arzonidan qimmatiga</option>
                <option value="price-desc">Narx: Qimmatidan arzoniga</option>
              </select>
            </div>

            <div className="flex items-end gap-2 pt-5 sm:pt-0">
              <button
                type="submit"
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-4 rounded-lg transition shadow-sm cursor-pointer"
              >
                Filtrlash
              </button>

              {isFilterActive && (
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="bg-gray-200 dark:bg-zinc-800 hover:bg-gray-300 dark:hover:bg-zinc-700 text-gray-700 dark:text-gray-300 text-sm font-medium py-2 px-3 rounded-lg transition cursor-pointer"
                  title="Filtrlarni tozalash"
                >
                  Tozalash
                </button>
              )}
            </div>
          </div>
        </form>
      </div>

      {/* Product list or loading skeleton */}
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
      ) : products.length === 0 ? (
        <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl p-12 text-center min-h-[320px] flex flex-col items-center justify-center">
          <span className="text-4xl mb-3">🔍</span>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            Hech qanday mahsulot topilmadi
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 max-w-md">
            Qidiruv so&apos;rovini yoki narx parametrlarini o&apos;zgartirib ko&apos;ring.
          </p>
          {isFilterActive && (
            <button
              onClick={handleResetFilters}
              className="mt-4 px-4 py-2 text-xs font-semibold bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800/60 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/50 transition cursor-pointer"
            >
              Barcha filtrlarni tozalash
            </button>
          )}
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

      {/* Pagination controls */}
      {totalPages > 0 && products.length > 0 && (
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-gray-200 dark:border-zinc-800 pt-6">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Sahifa <span className="font-semibold text-gray-900 dark:text-white">{pageParam}</span> /{" "}
            <span className="font-semibold text-gray-900 dark:text-white">{totalPages}</span>
          </p>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(pageParam - 1)}
              disabled={pageParam <= 1 || loading}
              className="px-3.5 py-1.5 text-sm font-medium border rounded-lg transition-colors border-gray-300 dark:border-zinc-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-800 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              Previous
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
              <button
                key={pageNum}
                onClick={() => handlePageChange(pageNum)}
                disabled={loading}
                className={`w-9 h-9 text-sm font-medium rounded-lg transition-colors flex items-center justify-center cursor-pointer ${
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
              className="px-3.5 py-1.5 text-sm font-medium border rounded-lg transition-colors border-gray-300 dark:border-zinc-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-800 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              Next
            </button>
          </div>
        </div>
      )}
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

