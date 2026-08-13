import Link from "next/link";

export default function ContactPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-4">Aloqa</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        Savollaringiz bolsa, biz bilan boglanishingiz mumkin.
      </p>
      <Link href="/products" className="text-blue-600 hover:underline">
        Mahsulotlar sahifasiga otish →
      </Link>
    </div>
  );
}
