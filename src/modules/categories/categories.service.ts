
import { StatusCodes } from "http-status-codes";
import { Prisma } from "../../../generated/prisma/client.js";
import { prisma } from "../../lib/prisma.js";
import { CustomError } from "../../ExceptionHandler/CustomError.js";


const createCategory = async (payload: Prisma.CategoryCreateInput) => {
  const existingCategory = await prisma.category.findFirst({
    where: {
      name: {
        equals: payload.name,
        mode: "insensitive",
      },
    },
  });

  if (existingCategory) {
    throw new CustomError(
      StatusCodes.CONFLICT,
      "Category already exists"
    );
  }

  return prisma.category.create({
    data: payload,
  });
};

const getAllCategories = async () => {
  return prisma.category.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
};

const getCategoryById = async (id: string) => {
  const category = await prisma.category.findUnique({
    where: { id },
  });

  if (!category) {
    throw new CustomError(
      StatusCodes.NOT_FOUND,
      "Category not found"
    );
  }

  return category;
};

const updateCategory = async (
  id: string,
  payload: Prisma.CategoryUpdateInput
) => {
  const category = await prisma.category.findUnique({
    where: { id },
  });

  if (!category) {
    throw new CustomError(
      StatusCodes.NOT_FOUND,
      "Category not found"
    );
  }

  if (payload.name) {
    const existingCategory = await prisma.category.findFirst({
      where: {
        id: {
          not: id,
        },
        name: {
          equals: String(payload.name),
          mode: "insensitive",
        },
      },
    });

    if (existingCategory) {
      throw new CustomError(
        StatusCodes.CONFLICT,
        "Category already exists"
      );
    }
  }

  return prisma.category.update({
    where: { id },
    data: payload,
  });
};

const deleteCategory = async (id: string) => {
  const category = await prisma.category.findUnique({
    where: { id },
  });

  if (!category) {
    throw new CustomError(
      StatusCodes.NOT_FOUND,
      "Category not found"
    );
  }

  await prisma.category.delete({
    where: { id },
  });

  return null;
};

export const categoriesService = {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
