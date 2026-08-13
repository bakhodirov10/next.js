import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-4">Biz haqimizda</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        Bu loyiha Next.js App Router yordamida yaratilgan bo&apos;lib, mahsulotlarni qidirish (search), minimal va maksimal narx bo&apos;yicha filtrlash (minPrice, maxPrice), tartiblash (sorting) hamda sahifalash (pagination) funksiyalarini namoyish etadi.
      </p>
      <Link href="/products" className="text-blue-600 hover:underline">
        Mahsulotlar sahifasiga o&apos;tish →
      </Link>
    </div>
  );
}

