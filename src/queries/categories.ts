import { Category, PrismaClient } from "@prisma/client";
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

const updateCategory = async function (categoryId: number, data: any) {
  const category: Category | null = await getCategoryById(categoryId);
  return await prisma.category.update({
    where: {
      id: categoryId,
    },
    data: {
      name_ru: data.name_ru ?? category?.name_ru,
      name_uk: data.name_uk ?? category?.name_uk,
      title_ru: data.title_ru ?? category?.title_ru,
      title_uk: data.title_uk ?? category?.title_uk,
      pictureUrl: data.pictureUrl ?? category?.pictureUrl,
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
  updateCategory,
  deleteCategory,
};
