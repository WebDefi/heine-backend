import { FastifyInstance, FastifyPluginCallback } from "fastify";
import {
  createProduct,
  getAllProductsBySubcategoryId,
  getProductById,
} from "../queries/products";
import { ErrorMessages, ErrorTypes } from "../utils/constants";
import { RequestError } from "../utils/requestError";
import { getAllCategories } from "../queries/categories";
import { getAllSubcategoriesByCategoryId } from "../queries/subcategories";
import { Product } from ".prisma/client";

const products: FastifyPluginCallback = async function (
  fastify: FastifyInstance
) {
  fastify.put("/product/create", {}, async (req: any, res: any) => {
    const product = await createProduct(req.body);
    if (!product) {
      return res
        .status(400)
        .send(
          new RequestError(
            400,
            ErrorTypes.invalidProductDataError,
            ErrorMessages.invalidProductDataError
          )
        );
    }
    return res.status(200).send(product);
  });

  fastify.get("/product/:productId", {}, async (req: any, res: any) => {
    const product = await getProductById(parseInt(req.params.productId));
    if (!product) {
      res.send(
        400,
        ErrorTypes.productNotFoundError,
        ErrorMessages.productNotFoundError
      );
    }
    return res.status(200).send(product);
  });

  fastify.get("/", {}, async (_req: any, res: any) => {
    const categories = await getAllCategories();
    if (!categories) {
      res.send(
        400,
        ErrorTypes.categoriesNotFoundError,
        ErrorMessages.categoriesNotFoundError
      );
    }
    return res.status(200).send(categories);
  });

  fastify.get("/:categoryId", {}, async (req: any, res: any) => {
    const subcategories = await getAllSubcategoriesByCategoryId(
      parseInt(req.params.categoryId)
    );
    if (!subcategories) {
      new RequestError(
        400,
        ErrorTypes.subcategoriesNotFoundError,
        ErrorMessages.subcategoriesNotFoundError
      );
    }
    const products: Product[] = [];
    for (let i = 0; i < subcategories.length; i++) {
      products.concat(await getAllProductsBySubcategoryId(subcategories[i].id));
    }
    return res.status(200).send({ subcategories, products });
  });
};

export default products;
