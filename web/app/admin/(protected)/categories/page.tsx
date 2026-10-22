import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import {
  CategoryManagerClient,
  type CategoryItem,
} from "./category-manager-client";

export const metadata: Metadata = {
  title: "Categories",
  description: "Customize and manage product categories.",
  robots: { index: false, follow: false },
};

export default async function AdminCategoriesPage() {
  const [categories, productCounts] = await Promise.all([
    prisma.category.findMany({
      orderBy: [{ gender: "asc" }, { name: "asc" }],
    }),
    prisma.product.groupBy({
      by: ["category"],
      where: { deletedAt: null },
      _count: { id: true },
    }),
  ]);

  const countMap = new Map(productCounts.map((p) => [p.category, p._count.id]));

  const initialCategories: CategoryItem[] = categories.map((cat) => ({
    id: cat.id,
    name: cat.name,
    slug: cat.slug,
    gender: cat.gender,
    description: cat.description,
    image: cat.image,
    productCount: countMap.get(cat.name) ?? 0,
    createdAt: cat.createdAt.toISOString(),
  }));

  return <CategoryManagerClient initialCategories={initialCategories} />;
}
