import { PrismaClient, Subcategory } from "@prisma/client";
import { deleteProductsBySubcategoryId } from "./products";

const prisma = new PrismaClient();

const createSubcategory = async function (data: any) {
  return await prisma.subcategory
    .create({
      data: { ...data },
    })
    .catch((error: any) => {
      return error.message;
    });
};

const getSubcategoryById = async function (subcategoryId: number) {
  return await prisma.subcategory.findUnique({
    where: {
      id: subcategoryId,
    },
  });
};

const getAllSubcategoriesByCategoryId = async function (categoryId: number) {
  return await prisma.subcategory.findMany({
    where: {
      categoryId: categoryId,
    },
  });
};

const updateSubcategoryNameRu = async function (
  subcategoryId: number,
  nameRu: string
) {
  return await prisma.subcategory.update({
    where: {
      id: subcategoryId,
    },
    data: {
      name_ru: nameRu,
    },
  });
};

const updateSubcategoryNameUk = async function (
  subcategoryId: number,
  nameUk: string
) {
  return await prisma.subcategory.update({
    where: {
      id: subcategoryId,
    },
    data: {
      name_uk: nameUk,
    },
  });
};

const updateSubcategoryTitleRu = async function (
  subcategoryId: number,
  titleRu: string
) {
  return await prisma.subcategory.update({
    where: {
      id: subcategoryId,
    },
    data: {
      title_ru: titleRu,
    },
  });
};

const updateSubcategoryTitleUk = async function (
  subcategoryId: number,
  titleUk: string
) {
  return await prisma.subcategory.update({
    where: {
      id: subcategoryId,
    },
    data: {
      title_uk: titleUk,
    },
  });
};

const updateSubcategoryPictureUrl = async function (
  subcategoryId: number,
  pictureUrl: string
) {
  return await prisma.subcategory.update({
    where: {
      id: subcategoryId,
    },
    data: {
      pictureUrl: pictureUrl,
    },
  });
};

const updateSubcategory = async function (subcategoryId: number, data: any) {
  const subcategory: Subcategory | null = await getSubcategoryById(subcategoryId);
  return await prisma.subcategory.update({
    where: {
      id: subcategoryId,
    },
    data: {
      name_ru: data.name_ru ?? subcategory?.name_ru,
      name_uk: data.name_uk ?? subcategory?.name_uk,
      title_ru: data.title_ru ?? subcategory?.title_ru,
      title_uk: data.title_uk ?? subcategory?.title_uk,
      pictureUrl: data.pictureUrl ?? subcategory?.pictureUrl,
    },
  });
};

const deleteSubcategory = async function (subcategoryId: number) {
  await deleteProductsBySubcategoryId(subcategoryId);
  return await prisma.subcategory.delete({
    where: {
      id: subcategoryId,
    },
  });
};

const deleteSubcategoriesByCategoryId = async function (categoryId: number) {
  const subcategories = await prisma.subcategory.findMany({
    where: {
      categoryId: categoryId,
    },
  });
  for(const subcategory of subcategories) {
    deleteProductsBySubcategoryId(subcategory.id);
  };
  return await prisma.subcategory.deleteMany({
    where: {
      categoryId: categoryId,
    },
  });
};

export {
  createSubcategory,
  getSubcategoryById,
  getAllSubcategoriesByCategoryId,
  updateSubcategory,
  deleteSubcategory,
  deleteSubcategoriesByCategoryId,
};
