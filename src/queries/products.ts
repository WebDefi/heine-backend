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
      nameRu: nameRu,
    },
  });
};

const updateProductNameUk = async function (productId: number, nameUk: string) {
  return await prisma.product.update({
    where: {
      id: productId,
    },
    data: {
      nameUk: nameUk,
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
      titleRu: titleRu,
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
      titleUk: titleUk,
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
      longCharsRu: longCharsRu,
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
      longCharsUk: longCharsUk,
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
      descriptionRu: descriptionRu,
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
      descriptionUk: descriptionUk,
    },
  });
};

// const updateProductConfiguration = async function (
//   productId: number,
//   configuration: any
// ) {
//   return await prisma.product.update({
//     where: {
//       id: productId,
//     },
//     data: {
//       configuration: configuration,
//     },
//   });
// };

// const updateProductDocuments = async function (
//   productId: number,
//   document: string
// ) {
//   return await prisma.product.update({
//     where: {
//       id: productId,
//     },
//     data: {
//       documents: {
//         push: document,
//       },
//     },
//   });
// };

export {
  createProduct,
  getProductById,
  getAllProductsBySubcategoryId,
  // updateProductConfiguration,
  // updateProductDocuments,
  updateProductNameRu,
  updateProductNameUk,
  updateProductTitleRu,
  updateProductTitleUk,
  updateProductShortChars,
  updateProductLongCharsRu,
  updateProductLongCharsUk,
  updateProductDescriptionRu,
  updateProductDescriptionUk,
};
