import { PrismaClient } from "@prisma/client";
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
      nameRu: nameRu,
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
      nameUk: nameUk,
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
      titleRu: titleRu,
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
      titleUk: titleUk,
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
  console.log(subcategories);
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
  updateSubcategoryNameRu,
  updateSubcategoryNameUk,
  updateSubcategoryTitleRu,
  updateSubcategoryTitleUk,
  updateSubcategoryPictureUrl,
  deleteSubcategory,
  deleteSubcategoriesByCategoryId,
};
