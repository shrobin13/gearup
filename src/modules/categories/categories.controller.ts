import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";

import { catchAsync } from "../../utils/catchAsync.js";
import sendResponse from "../../utils/sendResponse.js";
import { categoriesService } from "./categories.service.js";

const createCategory = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await categoriesService.createCategory(req.body);

    sendResponse(res, {
      statusCode: StatusCodes.CREATED,
      success: true,
      message: "Category created successfully",
      data: result,
    });
  }
);

const getAllCategories = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await categoriesService.getAllCategories();

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Categories retrieved successfully",
      data: result,
    });
  }
);

const getCategoryById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const result = await categoriesService.getCategoryById(id as string);

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Category retrieved successfully",
      data: result,
    });
  }
);

const updateCategory = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const { id } = req.params;

    const result = await categoriesService.updateCategory(id as string, req.body);

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Category updated successfully",
      data: result,
    });
  }
);

const deleteCategory = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const { id } = req.params;

    const result = await categoriesService.deleteCategory(id as string);

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Category deleted successfully",
      data: result,
    });
  }
);

export const categoriesController = {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
