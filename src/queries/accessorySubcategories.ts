import { PrismaClient } from "@prisma/client";

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
      nameRu: nameRu,
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
      nameUk: nameUk,
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
      titleRu: titleRu,
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
      titleUk: titleUk,
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

export {
  createAccessorySubcategory,
  getAccessorySubcategoryById,
  getAllAccessorySubcategoriesByCategoryId,
  updateAccessorySubcategoryNameRu,
  updateAccessorySubcategoryNameUk,
  updateAccessorySubcategoryTitleRu,
  updateAccessorySubcategoryTitleUk,
  updateAccessorySubcategoryPictureUrl,
};
