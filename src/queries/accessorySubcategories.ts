import { PrismaClient } from "@prisma/client";
import { deleteAccessoriesByAccessorySubcategoryId } from "./accessories";

const prisma = new PrismaClient();

const createAccessorySubcategory = async function (data: any) {
  return await prisma.accessorySubcategory
    .create({
      data: { ...data },
    })
    .catch((error: any) => {
      return error.message;
    });
};

const getAccessorySubcategoryById = async function (
  accessorySubcategoryId: number
) {
  return await prisma.accessorySubcategory.findUnique({
    where: {
      id: accessorySubcategoryId,
    },
  });
};

const getAllAccessorySubcategoriesByCategoryId = async function (
  categoryId: number
) {
  return await prisma.accessorySubcategory.findMany({
    where: {
      categoryId: categoryId,
    },
  });
};

const updateAccessorySubcategoryNameRu = async function (
  accessorySubcategoryId: number,
  nameRu: string
) {
  return await prisma.accessorySubcategory.update({
    where: {
      id: accessorySubcategoryId,
    },
    data: {
      name_ru: nameRu,
    },
  });
};

const updateAccessorySubcategoryNameUk = async function (
  accessorySubcategoryId: number,
  nameUk: string
) {
  return await prisma.accessorySubcategory.update({
    where: {
      id: accessorySubcategoryId,
    },
    data: {
      name_uk: nameUk,
    },
  });
};

const updateAccessorySubcategoryTitleRu = async function (
  accessorySubcategoryId: number,
  titleRu: string
) {
  return await prisma.accessorySubcategory.update({
    where: {
      id: accessorySubcategoryId,
    },
    data: {
      title_ru: titleRu,
    },
  });
};

const updateAccessorySubcategoryTitleUk = async function (
  accessorySubcategoryId: number,
  titleUk: string
) {
  return await prisma.accessorySubcategory.update({
    where: {
      id: accessorySubcategoryId,
    },
    data: {
      title_uk: titleUk,
    },
  });
};

const updateAccessorySubcategoryPictureUrl = async function (
  accessorySubcategoryId: number,
  pictureUrl: string
) {
  return await prisma.accessorySubcategory.update({
    where: {
      id: accessorySubcategoryId,
    },
    data: {
      pictureUrl: pictureUrl,
    },
  });
};

const deleteAccessorySubcategory = async function (subcategoryId: number) {
  await deleteAccessoriesByAccessorySubcategoryId(subcategoryId);
  return await prisma.accessorySubcategory.delete({
    where: {
      id: subcategoryId,
    },
  });
};

const deleteAccessorySubcategoriesByAccessoryCategoryId = async function (categoryId: number) {
  const subcategories = await prisma.accessorySubcategory.findMany({
    where: {
      categoryId: categoryId,
    },
  });
  console.log(subcategories);
  for(const subcategory of subcategories) {
    deleteAccessoriesByAccessorySubcategoryId(subcategory.id);
  };
  return await prisma.accessorySubcategory.deleteMany({
    where: {
      categoryId: categoryId,
    },
  });
};


export {
  createAccessorySubcategory,
  getAccessorySubcategoryById,
  getAllAccessorySubcategoriesByCategoryId,
  updateAccessorySubcategoryNameRu,
  updateAccessorySubcategoryNameUk,
  updateAccessorySubcategoryTitleRu,
  updateAccessorySubcategoryTitleUk,
  updateAccessorySubcategoryPictureUrl,
  deleteAccessorySubcategory,
  deleteAccessorySubcategoriesByAccessoryCategoryId,
};
