import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/api-require-admin";
import { withErrorHandler } from "@/lib/with-error-handler";
import { errorResponse, successResponse } from "@/lib/api-response";
import { slugify } from "@/lib/slugify";

const listCategories = async () => {
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

  const enriched = categories.map((cat) => ({
    ...cat,
    productCount: countMap.get(cat.name) ?? 0,
  }));

  return successResponse(enriched);
};

const createCategory = async (req: Request) => {
  const body = (await req.json()) as {
    name?: string;
    slug?: string;
    gender?: string;
    description?: string | null;
    image?: string | null;
  };

  const name = body.name?.trim();
  let slug = body.slug?.trim();
  const gender = body.gender?.trim().toLowerCase() || "women";
  const description = body.description?.trim() || null;
  const image = body.image?.trim() || null;

  if (!name) {
    return errorResponse("Category name is required", 400, {
      name: ["Name is required"],
    });
  }

  if (!slug) {
    slug = slugify(name);
  } else {
    slug = slugify(slug);
  }

  if (!slug) {
    return errorResponse("Invalid category slug", 400, {
      slug: ["Slug cannot be empty"],
    });
  }

  // Check if name already exists (case-insensitive)
  const existingName = await prisma.category.findFirst({
    where: { name: { equals: name, mode: "insensitive" } },
  });
  if (existingName) {
    return errorResponse(`Category "${name}" already exists`, 400, {
      name: ["Category name must be unique"],
    });
  }

  // Check if slug already exists
  const existingSlug = await prisma.category.findUnique({
    where: { slug },
  });
  if (existingSlug) {
    return errorResponse(`Category with slug "${slug}" already exists`, 400, {
      slug: ["Slug must be unique"],
    });
  }

  const category = await prisma.category.create({
    data: {
      name,
      slug,
      gender,
      description,
      image,
    },
  });

  try {
    revalidatePath("/");
    revalidatePath("/shop");
    revalidatePath(`/shop/${slug}`);
    revalidatePath("/admin/categories");
    revalidatePath("/admin/products");
  } catch {
    // Non-fatal
  }

  return successResponse(category, 201);
};

export const GET = requireAdmin(withErrorHandler(listCategories));
export const POST = requireAdmin(withErrorHandler(createCategory));