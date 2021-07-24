import { AccessoryCategory, PrismaClient } from "@prisma/client";
import { deleteAccessorySubcategoriesByAccessoryCategoryId } from "./accessorySubcategories";

const prisma = new PrismaClient();

const createAccessoryCategory = async function (data: any) {
  return await prisma.accessoryCategory
    .create({
      data: { ...data },
    })
    .catch((error: any) => {
      return error.message;
    });
};

const getAccessoryCategoryById = async function (accessoryCategoryId: number) {
  return await prisma.accessoryCategory.findUnique({
    where: {
      id: accessoryCategoryId,
    },
  });
};

const getAllAccessoryCategories = async function () {
  return await prisma.accessoryCategory.findMany({});
};

const updateAccessoryCategory = async function (categoryId: number, data: any) {
  const category: AccessoryCategory | null = await getAccessoryCategoryById(categoryId);
  return await prisma.accessoryCategory.update({
    where: {
      id: categoryId,
    },
    data: {
      ...data,
    },
  });
};

const deleteAccessoryCategory = async function (categoryId: number) {
  await deleteAccessorySubcategoriesByAccessoryCategoryId(categoryId);
  return await prisma.accessoryCategory.delete({
    where: {
      id: categoryId,
    },
  });
};

export {
  createAccessoryCategory,
  getAccessoryCategoryById,
  getAllAccessoryCategories,
  updateAccessoryCategory,
  deleteAccessoryCategory,
};
