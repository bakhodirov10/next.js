import { NextResponse } from "next/server";
import { productsData } from "./data";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
  const limit = Math.max(1, parseInt(searchParams.get("limit") || "4", 10));
  const sort = (searchParams.get("sort") || "asc").toLowerCase();

  const sortedProducts = [...productsData].sort((a, b) => {
    if (sort === "desc" || sort === "z-a") {
      return b.name.localeCompare(a.name);
    }
    return a.name.localeCompare(b.name);
  });

  const total = sortedProducts.length;
  const totalPages = Math.ceil(total / limit) || 1;
  const startIndex = (page - 1) * limit;
  const paginatedProducts = sortedProducts.slice(startIndex, startIndex + limit);

  return NextResponse.json({
    products: paginatedProducts,
    total,
    page,
    totalPages,
    limit,
    sort,
  });
}
