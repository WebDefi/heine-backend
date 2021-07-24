import { AccessorySubcategory, PrismaClient } from "@prisma/client";
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

const updateAccessorySubcategory = async function (subcategoryId: number, data: any) {
  const subcategory: AccessorySubcategory | null = await getAccessorySubcategoryById(subcategoryId);
  return await prisma.subcategory.update({
    where: {
      id: subcategoryId,
    },
    data: {
      ...data,
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
  updateAccessorySubcategory,
  deleteAccessorySubcategory,
  deleteAccessorySubcategoriesByAccessoryCategoryId,
};
