
import { StatusCodes } from "http-status-codes";

import { CustomError } from "../../ExceptionHandler/CustomError.js";
import { Prisma } from "../../../generated/prisma/client.js";
import { prisma } from "../../lib/prisma.js";

const createGear = async (
  providerId: string,
  payload: Prisma.GearItemCreateInput
) => {
  const category = await prisma.category.findUnique({
    where: {
      id: payload.category.connect?.id,
    },
  });

  if (!category) {
    throw new CustomError(
      StatusCodes.NOT_FOUND,
      "Category not found"
    );
  }

  return prisma.gearItem.create({
    data: {
      ...payload,
      provider: {
        connect: {
          id: providerId,
        },
      },
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
      isActive: true,
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
  payload: Prisma.GearItemUpdateInput
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

  return prisma.gearItem.update({
    where: { id },
    data: payload,
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
