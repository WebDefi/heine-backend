import { PrismaClient } from "@prisma/client";
import { deleteSubcategoriesByCategoryId } from "./subcategories";

const prisma = new PrismaClient();

const createCategory = async function (data: any) {
  return await prisma.category
    .create({
      data: { ...data },
    })
    .catch((error: any) => {
      return error.message;
    });
};

const getCategoryById = async function (categoryId: number) {
  return await prisma.category.findUnique({
    where: {
      id: categoryId,
    },
  });
};

const getAllCategories = async function () {
  return await prisma.category.findMany({});
};

const updateCategoryNameRu = async function (
  categoryId: number,
  nameRu: string
) {
  return await prisma.category.update({
    where: {
      id: categoryId,
    },
    data: {
      nameRu: nameRu,
    },
  });
};

const updateCategoryNameUk = async function (
  categoryId: number,
  nameUk: string
) {
  return await prisma.category.update({
    where: {
      id: categoryId,
    },
    data: {
      nameUk: nameUk,
    },
  });
};

const updateCategoryTitleRu = async function (
  categoryId: number,
  titleRu: string
) {
  return await prisma.category.update({
    where: {
      id: categoryId,
    },
    data: {
      titleRu: titleRu,
    },
  });
};

const updateCategoryTitleUk = async function (
  categoryId: number,
  titleUk: string
) {
  return await prisma.category.update({
    where: {
      id: categoryId,
    },
    data: {
      titleUk: titleUk,
    },
  });
};

const updateCategoryPictureUrl = async function (
  categoryId: number,
  pictureUrl: string
) {
  return await prisma.category.update({
    where: {
      id: categoryId,
    },
    data: {
      pictureUrl: pictureUrl,
    },
  });
};

const deleteCategory = async function (categoryId: number) {
  await deleteSubcategoriesByCategoryId(categoryId);
  return await prisma.category.delete({
    where: {
      id: categoryId,
    },
  });
};

export {
  createCategory,
  getCategoryById,
  getAllCategories,
  updateCategoryNameRu,
  updateCategoryNameUk,
  updateCategoryTitleRu,
  updateCategoryTitleUk,
  updateCategoryPictureUrl,
  deleteCategory,
};
