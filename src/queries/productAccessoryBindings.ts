import { PrismaClient, ProducAccessoryBinding } from "@prisma/client";

const prisma = new PrismaClient();

const createProductAccesoryEntry = async function (
  productId: number,
  accessoryId: number
) {
  return await prisma.producAccessoryBinding
    .create({
      data: {
        productId,
        accessoryId,
      },
    })
    .catch((error: any) => {
      return error.message;
    });
};

const deleteProductAccessoryEntry = async function (
  productId: number,
  accessoryId: number
) {
  return await prisma.producAccessoryBinding.delete({
    where: {
      productId_accessoryId: {
        productId,
        accessoryId,
      },
    },
  });
};

export { createProductAccesoryEntry, deleteProductAccessoryEntry };
