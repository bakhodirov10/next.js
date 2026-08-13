import { NextResponse } from "next/server";
import { productsData } from "./data";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
  const limit = Math.max(1, parseInt(searchParams.get("limit") || "4", 10));
  const sort = (searchParams.get("sort") || "asc").toLowerCase();
  const search = (searchParams.get("search") || "").trim().toLowerCase();
  const minPriceParam = searchParams.get("minPrice");
  const maxPriceParam = searchParams.get("maxPrice");

  const minPrice =
    minPriceParam !== null && minPriceParam !== "" && !isNaN(Number(minPriceParam))
      ? Number(minPriceParam)
      : null;
  const maxPrice =
    maxPriceParam !== null && maxPriceParam !== "" && !isNaN(Number(maxPriceParam))
      ? Number(maxPriceParam)
      : null;

  let filteredProducts = [...productsData];

  // Search filter (matches name, description, or category)
  if (search) {
    filteredProducts = filteredProducts.filter(
      (product) =>
        product.name.toLowerCase().includes(search) ||
        product.description.toLowerCase().includes(search) ||
        product.category.toLowerCase().includes(search)
    );
  }

  // Min price filter
  if (minPrice !== null) {
    filteredProducts = filteredProducts.filter((product) => product.price >= minPrice);
  }

  // Max price filter
  if (maxPrice !== null) {
    filteredProducts = filteredProducts.filter((product) => product.price <= maxPrice);
  }

  // Sorting
  filteredProducts.sort((a, b) => {
    if (sort === "desc" || sort === "z-a") {
      return b.name.localeCompare(a.name);
    }
    if (sort === "price-asc" || sort === "price-low") {
      return a.price - b.price;
    }
    if (sort === "price-desc" || sort === "price-high") {
      return b.price - a.price;
    }
    return a.name.localeCompare(b.name);
  });

  const total = filteredProducts.length;
  const totalPages = Math.ceil(total / limit) || 1;
  const startIndex = (page - 1) * limit;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + limit);

  return NextResponse.json({
    products: paginatedProducts,
    total,
    page,
    totalPages,
    limit,
    sort,
    search: searchParams.get("search") || "",
    minPrice: searchParams.get("minPrice") || "",
    maxPrice: searchParams.get("maxPrice") || "",
  });
}

