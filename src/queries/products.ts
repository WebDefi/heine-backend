import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const createProduct = async function (data: any) {
  return await prisma.product
    .create({
      data: { ...data },
    })
    .catch((error: any) => {
      return error.message;
    });
};

const getProductById = async function (productId: number) {
  return await prisma.product.findUnique({
    where: {
      id: productId,
    },
  });
};

const getAllProductsBySubcategoryId = async function (subcategoryId: number) {
  return await prisma.product.findMany({
    where: {
      subcategoryId: subcategoryId,
    },
  });
};

const updateProductNameRu = async function (productId: number, nameRu: string) {
  return await prisma.product.update({
    where: {
      id: productId,
    },
    data: {
      name_ru: nameRu,
    },
  });
};

const updateProductNameUk = async function (productId: number, nameUk: string) {
  return await prisma.product.update({
    where: {
      id: productId,
    },
    data: {
      name_uk: nameUk,
    },
  });
};

const updateProductTitleRu = async function (
  productId: number,
  titleRu: string
) {
  return await prisma.product.update({
    where: {
      id: productId,
    },
    data: {
      title_ru: titleRu,
    },
  });
};

const updateProductTitleUk = async function (
  productId: number,
  titleUk: string
) {
  return await prisma.product.update({
    where: {
      id: productId,
    },
    data: {
      title_uk: titleUk,
    },
  });
};

const updateProductShortChars = async function (
  productId: number,
  shortChars: any
) {
  return await prisma.product.update({
    where: {
      id: productId,
    },
    data: {
      shortChars: shortChars,
    },
  });
};

const updateProductLongCharsRu = async function (
  productId: number,
  longCharsRu: string
) {
  return await prisma.product.update({
    where: {
      id: productId,
    },
    data: {
      longChars_ru: longCharsRu,
    },
  });
};

const updateProductLongCharsUk = async function (
  productId: number,
  longCharsUk: string
) {
  return await prisma.product.update({
    where: {
      id: productId,
    },
    data: {
      longChars_uk: longCharsUk,
    },
  });
};

const updateProductDescriptionRu = async function (
  productId: number,
  descriptionRu: string
) {
  return await prisma.product.update({
    where: {
      id: productId,
    },
    data: {
      description_ru: descriptionRu,
    },
  });
};

const updateProductDescriptionUk = async function (
  productId: number,
  descriptionUk: string
) {
  return await prisma.product.update({
    where: {
      id: productId,
    },
    data: {
      description_uk: descriptionUk,
    },
  });
};

const updateProductConfiguration = async function (
  productId: number,
  configuration: any
) {
  return await prisma.product.update({
    where: {
      id: productId,
    },
    data: {
      configuration: configuration,
    },
  });
};

const updateProductDocuments = async function (
  productId: number,
  document: string
) {
  return await prisma.product.update({
    where: {
      id: productId,
    },
    data: {
      documents: {
        push: document,
      },
    },
  });
};

const updateProductFAQs = async function (
  productId: number,
  faqs: any
) {
  return await prisma.product.update({
    where: {
      id: productId,
    },
    data: {
      faqs: faqs,
    },
  });
};

const deleteProduct = async function (productId: number) {
  return await prisma.product.delete({
    where: { 
      id: productId,
    },
  });
};

const deleteProductsBySubcategoryId = async function (subcategoryId: number) {
  return await prisma.product.deleteMany({
    where: {
      subcategoryId: subcategoryId,
    },
  });
};

export {
  createProduct,
  getProductById,
  getAllProductsBySubcategoryId,
  updateProductConfiguration,
  updateProductDocuments,
  updateProductNameRu,
  updateProductNameUk,
  updateProductTitleRu,
  updateProductTitleUk,
  updateProductShortChars,
  updateProductLongCharsRu,
  updateProductLongCharsUk,
  updateProductDescriptionRu,
  updateProductDescriptionUk,
  updateProductFAQs,
  deleteProduct,
  deleteProductsBySubcategoryId,
};
