import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const createAccessory = async function (data: any) {
  return await prisma.accessory
    .create({
      data: { ...data },
    })
    .catch((error: any) => {
      return error.message;
    });
};

const getAccessoryById = async function (accessoryId: number) {
  return await prisma.accessory.findUnique({
    where: {
      id: accessoryId,
    },
  });
};

const getAllAccessoriesByAccessorySubcategoryId = async function (
  accessorySubcategoryId: number
) {
  return await prisma.accessory.findMany({
    where: {
      accessorySubcategoryId: accessorySubcategoryId,
    },
  });
};

const updateAccessoryNameRu = async function (
  accessoryId: number,
  nameRu: string
) {
  return await prisma.accessory.update({
    where: {
      id: accessoryId,
    },
    data: {
      name_ru: nameRu,
    },
  });
};

const updateAccessoryNameUk = async function (
  accessoryId: number,
  nameUk: string
) {
  return await prisma.accessory.update({
    where: {
      id: accessoryId,
    },
    data: {
      name_uk: nameUk,
    },
  });
};

const updateAccessoryTitleRu = async function (
  accessoryId: number,
  titleRu: string
) {
  return await prisma.accessory.update({
    where: {
      id: accessoryId,
    },
    data: {
      title_ru: titleRu,
    },
  });
};

const updateAccessoryTitleUk = async function (
  accessoryId: number,
  titleUk: string
) {
  return await prisma.accessory.update({
    where: {
      id: accessoryId,
    },
    data: {
      title_uk: titleUk,
    },
  });
};

const updateAccessoryShortChars = async function (
  accessoryId: number,
  shortChars: any
) {
  return await prisma.accessory.update({
    where: {
      id: accessoryId,
    },
    data: {
      shortChars: shortChars,
    },
  });
};

const updateAccessoryLongCharsRu = async function (
  accessoryId: number,
  longCharsRu: string
) {
  return await prisma.accessory.update({
    where: {
      id: accessoryId,
    },
    data: {
      longChars_ru: longCharsRu,
    },
  });
};

const updateAccessoryLongCharsUk = async function (
  accessoryId: number,
  longCharsUk: string
) {
  return await prisma.accessory.update({
    where: {
      id: accessoryId,
    },
    data: {
      longChars_uk: longCharsUk,
    },
  });
};

const updateAccessoryDescriptionRu = async function (
  accessoryId: number,
  descriptionRu: string
) {
  return await prisma.accessory.update({
    where: {
      id: accessoryId,
    },
    data: {
      description_ru: descriptionRu,
    },
  });
};

const updateAccessoryDescriptionUk = async function (
  accessoryId: number,
  descriptionUk: string
) {
  return await prisma.accessory.update({
    where: {
      id: accessoryId,
    },
    data: {
      description_uk: descriptionUk,
    },
  });
};

const updateAccessoryConfiguration = async function (
  accessoryId: number,
  configuration: any
) {
  return await prisma.accessory.update({
    where: {
      id: accessoryId,
    },
    data: {
      configuration: configuration,
    },
  });
};

const updateAccessoryDocuments = async function (
  accessoryId: number,
  document: string
) {
  return await prisma.accessory.update({
    where: {
      id: accessoryId,
    },
    data: {
      documents: {
        push: document,
      },
    },
  });
};

const deleteAccessory = async function (accessoryId: number) {
  return await prisma.accessory.delete({
    where: { 
      id: accessoryId,
    },
  });
};

const deleteAccessoriesByAccessorySubcategoryId = async function (subcategoryId: number) {
  return await prisma.accessory.deleteMany({
    where: {
      accessorySubcategoryId: subcategoryId,
    },
  });
};

export {
  createAccessory,
  getAccessoryById,
  getAllAccessoriesByAccessorySubcategoryId,
  updateAccessoryConfiguration,
  updateAccessoryDocuments,
  updateAccessoryNameRu,
  updateAccessoryNameUk,
  updateAccessoryTitleRu,
  updateAccessoryTitleUk,
  updateAccessoryShortChars,
  updateAccessoryLongCharsRu,
  updateAccessoryLongCharsUk,
  updateAccessoryDescriptionRu,
  updateAccessoryDescriptionUk,
  deleteAccessory,
  deleteAccessoriesByAccessorySubcategoryId,
};
