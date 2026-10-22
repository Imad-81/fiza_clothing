import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/api-require-admin";
import { withErrorHandler } from "@/lib/with-error-handler";
import { successResponse, errorResponse, notFoundResponse } from "@/lib/api-response";
import { slugify } from "@/lib/slugify";

interface RouteContext {
  params: Promise<{ id: string }>;
}

async function resolveCategoryId(req: Request, context?: RouteContext): Promise<string> {
  if (context?.params) {
    const p = await context.params;
    if (p.id) return p.id;
  }
  const url = new URL(req.url);
  return url.pathname.split("/").filter(Boolean).pop() ?? "";
}

const getCategory = async (req: Request, context?: RouteContext) => {
  const id = await resolveCategoryId(req, context);

  const category = await prisma.category.findUnique({
    where: { id },
  });

  if (!category) {
    return notFoundResponse("Category");
  }

  const productCount = await prisma.product.count({
    where: { category: category.name, deletedAt: null },
  });

  return successResponse({ ...category, productCount });
};

const updateCategory = async (req: Request, context?: RouteContext) => {
  const id = await resolveCategoryId(req, context);

  const existing = await prisma.category.findUnique({
    where: { id },
  });

  if (!existing) {
    return notFoundResponse("Category");
  }

  const body = (await req.json()) as {
    name?: string;
    slug?: string;
    gender?: string;
    description?: string | null;
    image?: string | null;
  };

  const name = body.name !== undefined ? body.name.trim() : existing.name;
  let slug = body.slug !== undefined ? body.slug.trim() : existing.slug;
  const gender = body.gender !== undefined ? body.gender.trim().toLowerCase() : existing.gender;
  const description = body.description !== undefined ? body.description?.trim() || null : existing.description;
  const image = body.image !== undefined ? body.image?.trim() || null : existing.image;

  if (!name) {
    return errorResponse("Category name is required", 400, {
      name: ["Name cannot be empty"],
    });
  }

  slug = slugify(slug || name);
  if (!slug) {
    return errorResponse("Invalid category slug", 400, {
      slug: ["Slug cannot be empty"],
    });
  }

  // Check unique name if changed
  if (name.toLowerCase() !== existing.name.toLowerCase()) {
    const duplicateName = await prisma.category.findFirst({
      where: {
        id: { not: id },
        name: { equals: name, mode: "insensitive" },
      },
    });
    if (duplicateName) {
      return errorResponse(`Category "${name}" already exists`, 400, {
        name: ["Category name must be unique"],
      });
    }
  }

  // Check unique slug if changed
  if (slug !== existing.slug) {
    const duplicateSlug = await prisma.category.findFirst({
      where: {
        id: { not: id },
        slug,
      },
    });
    if (duplicateSlug) {
      return errorResponse(`Slug "${slug}" is already in use by another category`, 400, {
        slug: ["Slug must be unique"],
      });
    }
  }

  const nameChanged = name !== existing.name;

  // Execute updates
  const updatedCategory = await prisma.category.update({
    where: { id },
    data: {
      name,
      slug,
      gender,
      description,
      image,
    },
  });

  // If category name was renamed, update existing products assigned to this category
  if (nameChanged) {
    await prisma.product.updateMany({
      where: { category: existing.name },
      data: { category: name },
    });
    await prisma.product.updateMany({
      where: { subCategory: existing.name },
      data: { subCategory: name },
    });
  }

  try {
    revalidatePath("/shop");
    revalidatePath(`/shop/${existing.slug}`);
    revalidatePath(`/shop/${slug}`);
    revalidatePath("/admin/categories");
    revalidatePath("/admin/products");
  } catch {
    // Non-fatal if revalidation fails in dev
  }

  const productCount = await prisma.product.count({
    where: { category: name, deletedAt: null },
  });

  return successResponse({ ...updatedCategory, productCount });
};

const deleteCategory = async (req: Request, context?: RouteContext) => {
  const id = await resolveCategoryId(req, context);

  const existing = await prisma.category.findUnique({
    where: { id },
  });

  if (!existing) {
    return notFoundResponse("Category");
  }

  // Check if any active products are assigned to this category
  const productCount = await prisma.product.count({
    where: { category: existing.name, deletedAt: null },
  });

  if (productCount > 0) {
    return errorResponse(
      `Cannot delete category "${existing.name}" because ${productCount} active product(s) are assigned to it. Please reassign or delete these products first.`,
      400,
      {
        products: [`${productCount} product(s) currently belong to this category`],
      },
    );
  }

  await prisma.category.delete({
    where: { id },
  });

  try {
    revalidatePath("/shop");
    revalidatePath(`/shop/${existing.slug}`);
    revalidatePath("/admin/categories");
    revalidatePath("/admin/products");
  } catch {
    // Non-fatal
  }

  return successResponse({ deleted: true, id, name: existing.name });
};

export const GET = requireAdmin(withErrorHandler(getCategory));
export const PUT = requireAdmin(withErrorHandler(updateCategory));
export const PATCH = requireAdmin(withErrorHandler(updateCategory));
export const DELETE = requireAdmin(withErrorHandler(deleteCategory));
