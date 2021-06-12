import { PrismaClient } from "@prisma/client";
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

const updateAccessoryCategoryNameRu = async function (
  accessoryCategoryId: number,
  nameRu: string
) {
  return await prisma.accessoryCategory.update({
    where: {
      id: accessoryCategoryId,
    },
    data: {
      nameRu: nameRu,
    },
  });
};

const updateAccessoryCategoryNameUk = async function (
  accessoryCategoryId: number,
  nameUk: string
) {
  return await prisma.accessoryCategory.update({
    where: {
      id: accessoryCategoryId,
    },
    data: {
      nameUk: nameUk,
    },
  });
};

const updateAccessoryCategoryTitleRu = async function (
  accessoryCategoryId: number,
  titleRu: string
) {
  return await prisma.accessoryCategory.update({
    where: {
      id: accessoryCategoryId,
    },
    data: {
      titleRu: titleRu,
    },
  });
};

const updateAccessoryCategoryTitleUk = async function (
  accessoryCategoryId: number,
  titleUk: string
) {
  return await prisma.accessoryCategory.update({
    where: {
      id: accessoryCategoryId,
    },
    data: {
      titleUk: titleUk,
    },
  });
};

const updateAccessoryCategoryPictureUrl = async function (
  accessoryCategoryId: number,
  pictureUrl: string
) {
  return await prisma.accessoryCategory.update({
    where: {
      id: accessoryCategoryId,
    },
    data: {
      pictureUrl: pictureUrl,
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
  updateAccessoryCategoryNameRu,
  updateAccessoryCategoryNameUk,
  updateAccessoryCategoryTitleRu,
  updateAccessoryCategoryTitleUk,
  updateAccessoryCategoryPictureUrl,
  deleteAccessoryCategory,
};
