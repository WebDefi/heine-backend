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

const getAllAccessorysByAccessorySubcategoryId = async function (
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
      nameRu: nameRu,
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
      nameUk: nameUk,
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
      titleRu: titleRu,
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
      titleUk: titleUk,
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
      longCharsRu: longCharsRu,
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
      longCharsUk: longCharsUk,
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
      descriptionRu: descriptionRu,
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
      descriptionUk: descriptionUk,
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

export {
  createAccessory,
  getAccessoryById,
  getAllAccessorysByAccessorySubcategoryId,
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
};
