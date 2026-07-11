
import { StatusCodes } from "http-status-codes";

import { CustomError } from "../../ExceptionHandler/CustomError.js";
import { Prisma } from "../../../generated/prisma/client.js";
import { prisma } from "../../lib/prisma.js";

const createGear = async (
  providerId: string,
  payload: {
    categoryId?: string;
    category?: string;
    name: string;
    description: string;
    brand: string;
    pricePerDay: number;
    stock: number;
    imageUrl?: string;
  }
) => {
  const categoryId = payload.categoryId ?? payload.category;
  let categoryConnect;

  if (categoryId) {
    const category = await prisma.category.findUnique({
      where: {
        id: categoryId,
      },
    });

    if (!category) {
      throw new CustomError(
        StatusCodes.NOT_FOUND,
        "Category not found"
      );
    }

    categoryConnect = {
      category: {
        connect: {
          id: categoryId,
        },
      },
    };
  }

  return prisma.gearItem.create({
    data: {
      name: payload.name,
      description: payload.description,
      brand: payload.brand,
      pricePerDay: payload.pricePerDay,
      stockQuantity: payload.stock,
      images: payload.imageUrl ? [payload.imageUrl] : [],
      provider: {
        connect: {
          id: providerId,
        },
      },
      ...categoryConnect,
    },
    include: {
      category: true,
      provider: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });
};

const getAllGear = async () => {
  return prisma.gearItem.findMany({
    where: {
      isAvailable: true,
    },
    include: {
      category: true,
      provider: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

const getGearById = async (id: string) => {
  const gear = await prisma.gearItem.findUnique({
    where: { id },
    include: {
      category: true,
      provider: {
        select: {
          id: true,
          name: true,
        },
      },
      reviews: true,
    },
  });

  if (!gear) {
    throw new CustomError(
      StatusCodes.NOT_FOUND,
      "Gear not found"
    );
  }

  return gear;
};

const updateGear = async (
  id: string,
  providerId: string,
  payload: {
    categoryId?: string;
    category?: string;
    name?: string;
    description?: string;
    brand?: string;
    pricePerDay?: number;
    stock?: number;
    imageUrl?: string;
  }
) => {
  const gear = await prisma.gearItem.findUnique({
    where: { id },
  });

  if (!gear) {
    throw new CustomError(
      StatusCodes.NOT_FOUND,
      "Gear not found"
    );
  }

  if (gear.providerId !== providerId) {
    throw new CustomError(
      StatusCodes.FORBIDDEN,
      "You cannot update this gear"
    );
  }

  const updateData: Prisma.GearItemUpdateInput = {};
  const categoryId = payload.categoryId ?? payload.category;

  if (categoryId) {
    updateData.category = {
      connect: {
        id: categoryId,
      },
    };
  }

  if (payload.name !== undefined) {
    updateData.name = payload.name;
  }

  if (payload.description !== undefined) {
    updateData.description = payload.description;
  }

  if (payload.brand !== undefined) {
    updateData.brand = payload.brand;
  }

  if (payload.pricePerDay !== undefined) {
    updateData.pricePerDay = payload.pricePerDay;
  }

  if (payload.stock !== undefined) {
    updateData.stockQuantity = payload.stock;
  }

  if (payload.imageUrl !== undefined) {
    updateData.images = [payload.imageUrl];
  }

  return prisma.gearItem.update({
    where: { id },
    data: updateData,
    include: {
      category: true,
    },
  });
};

const deleteGear = async (
  id: string,
  providerId: string
) => {
  const gear = await prisma.gearItem.findUnique({
    where: { id },
  });

  if (!gear) {
    throw new CustomError(
      StatusCodes.NOT_FOUND,
      "Gear not found"
    );
  }

  if (gear.providerId !== providerId) {
    throw new CustomError(
      StatusCodes.FORBIDDEN,
      "You cannot delete this gear"
    );
  }

  await prisma.gearItem.delete({
    where: { id },
  });

  return null;
};

export const gearService = {
  createGear,
  getAllGear,
  getGearById,
  updateGear,
  deleteGear,
};
