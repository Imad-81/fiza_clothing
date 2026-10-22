import { prisma } from "@/lib/prisma";
import { successResponse } from "@/lib/api-response";
import { withErrorHandler } from "@/lib/with-error-handler";

export const dynamic = "force-dynamic";

const getPublicCategories = async () => {
  const categories = await prisma.category.findMany({
    select: {
      id: true,
      name: true,
      slug: true,
      gender: true,
      description: true,
      image: true,
    },
    orderBy: [{ gender: "asc" }, { name: "asc" }],
  });

  return successResponse(categories);
};

export const GET = withErrorHandler(getPublicCategories);
