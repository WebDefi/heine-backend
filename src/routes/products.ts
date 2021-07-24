import { FastifyInstance, FastifyPluginCallback, FastifyReply } from "fastify";
import {
  createProduct,
  deleteProduct,
  getAllProductsBySubcategoryId,
  getProductById,
  updateProduct,
  updateProductDocuments,
  updateProductFAQs,
  updateProductShortChars,
} from "../queries/products";
import { ErrorMessages, ErrorTypes, ObjectTypes } from "../utils/constants";
import { RequestError } from "../utils/requestError";
import {
  createCategory,
  deleteCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
} from "../queries/categories";
import {
  createSubcategory,
  deleteSubcategory,
  getAllSubcategoriesByCategoryId,
  getSubcategoryById,
  updateSubcategory,
} from "../queries/subcategories";
import { Category, Product, Subcategory } from ".prisma/client";
import { onSendGenericLangHandler } from "./onSendLangHook";
import { join, resolve } from "path";
import fileService from "../utils/fileService";
import dataService from "../utils/dataService";

const sendError = (
  res: any,
  status: number,
  errorType: any,
  errorMessage: any,
  objectType: any
) => {
  return res
    .status(status)
    .send(new RequestError(status, errorType, errorMessage, objectType));
};

const products: FastifyPluginCallback = async function (
  fastify: FastifyInstance
) {
  fastify.put("/category/create", {}, async (req: any, res: any) => {
    const imgBase64 = req.body.picture64;
    delete req.body["picture64"];
    const category = await createCategory(req.body);
    if (!category) {
      return sendError(
        res,
        400,
        ErrorTypes.invalidCreationDataError,
        ErrorMessages.invalidCreationDataError,
        ObjectTypes.category
      );
    } else {
      const fileName = req.body.pictureUrl;
      await updateCategory(category.id, {picture_url: dataService.imageUrlHandler(fileName, ObjectTypes.category, category.id)});
      const result: any = await fileService.createFile(
        join(
          resolve(__dirname, "../../"),
          `static/img/category/${category.id}/${fileName}`
        ),
        imgBase64
      );

      if (result.error) {
        return res.status(400).send(result);
      }
    }
    return res.status(200).send(category);
  });

  fastify.put("/subcategory/create", {}, async (req: any, res: any) => {
    const imgBase64 = req.body.picture64;
    delete req.body["picture64"];
    const subcategory = await createSubcategory(req.body);
    if (!subcategory) {
      return res
        .status(400)
        .send(
          new RequestError(
            400,
            ErrorTypes.invalidCreationDataError,
            ErrorMessages.invalidCreationDataError,
            ObjectTypes.subcategory
          )
        );
    } else {
      const fileName = req.body.pictureUrl;
      await updateSubcategory(subcategory.id, {picture_url: dataService.imageUrlHandler(fileName, ObjectTypes.subcategory, subcategory.id)})
      const result: any = await fileService.createFile(
        join(
          resolve(__dirname, "../../"),
          `static/img/subcategory/${subcategory.id}/${subcategory.pictureUrl}`
        ),
        imgBase64
      );
      if (result.error) {
        return res.status(400).send(result);
      }
    }
    return res.status(200).send(subcategory);
  });

  fastify.put("/product/create", {}, async (req: any, res: any) => {
    let body = req.body;
    const imageData = body.imageData;
    delete body["imageData"];
    const product = await createProduct({
      body,
      ...{ documents: Object.keys(imageData) },
    });
    if (!product) {
      return res
        .status(400)
        .send(
          new RequestError(
            400,
            ErrorTypes.invalidCreationDataError,
            ErrorMessages.invalidCreationDataError,
            ObjectTypes.product
          )
        );
    } else {
      for (let imgName in imageData) {
        const imgBase64 = imageData[imgName];
        const result: any = await fileService.createFile(
          join(
            resolve(__dirname, "../../"),
            `static/img/product/${product.id}/${imgName}`
          ),
          imgBase64
        );
        if (result.error) {
          return res.status(400).send(result);
        }
      }
    }
    return res.status(200).send(product);
  });

  fastify.get(
    "/",
    { onSend: onSendGenericLangHandler },
    async (_req: any, res: any) => {
      const categories = await getAllCategories();
      if (!categories) {
        return res
          .status(400)
          .send(
            new RequestError(
              400,
              ErrorTypes.notFoundError,
              ErrorMessages.notFoundError,
              ObjectTypes.category
            )
          );
      }
      return res.status(200).send(categories);
    }
  );

  fastify.get("/menu", {}, async (req: any, res: any) => {
    const categories: any = await getAllCategories();
    const lang = req.cookies.lang ?? "uk";
    // Add postClientRequest hook on cookie lang
    const data: { [key: string]: any } = {};
    if (!categories) {
      return res
        .status(400)
        .send(
          new RequestError(
            400,
            ErrorTypes.notFoundError,
            ErrorMessages.notFoundError,
            ObjectTypes.category
          )
        );
    }
    for (const category of categories) {
      let tempCategoryName =  dataService.getNameByLang(
        category.name_ru,
        category.name_uk,
        lang
      );
      data[tempCategoryName] = {};
      let subcategories: Subcategory[] = await getAllSubcategoriesByCategoryId(
        category.id
      );
      // let subcategoriesData: Array<any> = [];
      for (const subcategory of subcategories) {
        let tempSubCategoryName =  dataService.getNameByLang(
          subcategory.name_ru,
          subcategory.name_uk,
          lang
        );
        data[tempCategoryName][tempSubCategoryName] = {};
        let products = await getAllProductsBySubcategoryId(subcategory.id);
        // let productsData: Array<any> = [];
        for (const product of products) {
          let tempProductName =  dataService.getNameByLang(
            product.name_ru,
            product.name_uk,
            lang
          );
          data[tempCategoryName][tempSubCategoryName][tempProductName] =
            product.id;
        }
      }
    }
    return res.status(200).send(data);
  });

  fastify.get("/category/:categoryId", {}, async (req: any, res: any) => {
    const lang = req.cookies.lang ?? "uk";
    let category: Category | null = await getCategoryById(parseInt(req.params.categoryId));
    if(!category) {
      return res.status(400).send(new RequestError(400, ErrorTypes.notFoundError, ErrorMessages.notFoundError, ObjectTypes.category));
    }
    category = dataService.langParse(category, lang);
    category["pictureUrl"] = dataService.imageUrlHandler(category.pictureUrl, ObjectTypes.category, category.id);
    const subcategories: any = await getAllSubcategoriesByCategoryId(parseInt(req.params.categoryId));
    for (let i = 0; i < subcategories.length; i++) {
      subcategories[i] = dataService.langParse(subcategories[i], lang);
      let products = await getAllProductsBySubcategoryId(subcategories[i].id);
      products.forEach(
        (item, key, array) => (array[key] = dataService.langParse(item, lang))
      );
      subcategories[i] = {
        subcategory: subcategories[i],
        products: products,
      };
    }
    return res.status(200).send({ category, subcategories });
  });

  fastify.get("/subcategory/:subcategoryId", { onSend: onSendGenericLangHandler }, async (req: any, res: FastifyReply) => {
      const lang = req.cookies.lang ?? "uk";
      let subcategory: Subcategory | null = await getSubcategoryById(parseInt(req.params.subcategoryId));
      if (!subcategory) {
        return res
          .status(400)
          .send(
            new RequestError(
              400,
              ErrorTypes.notFoundError,
              ErrorMessages.notFoundError,
              ObjectTypes.subcategory
            )
          );
      }
      subcategory = dataService.langParse(subcategory, lang);
      const products: Product[] = await getAllProductsBySubcategoryId(parseInt(req.params.subcategoryId));
      products.forEach(
        (item, key, array) => (array[key] = dataService.langParse(item, lang))
      );
      return res.status(200).send({ subcategory, products });
    }
  );

  fastify.get(
    "/product/:productId",
    { onSend: onSendGenericLangHandler },
    async (req: any, res: FastifyReply) => {
      let product: Product | null = await getProductById(
        parseInt(req.params.productId)
      );
      if (!product) {
        return res
          .status(400)
          .send(
            new RequestError(
              400,
              ErrorTypes.notFoundError,
              ErrorMessages.notFoundError,
              ObjectTypes.product
            )
          );
      }
      product = dataService.langParse(product, req.cookies.lang ?? "uk");
      return res.status(200).send(product);
    }
  );

  fastify.patch(
    "/category/update/:categoryId",
    {},
    async (req: any, res: FastifyReply) => {
      const category: Category | null = await getCategoryById(
        parseInt(req.params.categoryId)
      );
      if (!category) {
        return res
          .status(400)
          .send(
            new RequestError(
              400,
              ErrorTypes.notFoundError,
              ErrorMessages.notFoundError,
              ObjectTypes.category
            )
          );
      }
      const updatedCategory: Category | null = await updateCategory(
        parseInt(req.params.categoryId),
        req.body
      );
      if (!updatedCategory) {
        return res
          .status(400)
          .send(
            new RequestError(
              400,
              ErrorTypes.invalidUpdateDataError,
              ErrorMessages.invalidUpdateDataError,
              ObjectTypes.category
            )
          );
      }
      return res.status(200).send(updatedCategory);
    }
  );

  fastify.patch(
    "/subcategory/update/:subcategoryId",
    {},
    async (req: any, res: FastifyReply) => {
      const subcategory: Subcategory | null = await getSubcategoryById(
        parseInt(req.params.subcategoryId)
      );
      if (!subcategory) {
        return res
          .status(400)
          .send(
            new RequestError(
              400,
              ErrorTypes.notFoundError,
              ErrorMessages.notFoundError,
              ObjectTypes.subcategory
            )
          );
      }
      const updatedSubcategory: Subcategory | null = await updateSubcategory(
        parseInt(req.params.subcategoryId),
        req.body
      );
      if (!updatedSubcategory) {
        return res
          .status(400)
          .send(
            new RequestError(
              400,
              ErrorTypes.invalidUpdateDataError,
              ErrorMessages.invalidUpdateDataError,
              ObjectTypes.category
            )
          );
      }
      return res.status(200).send(updatedSubcategory);
    }
  );

  fastify.patch(
    "/product/update/:productId",
    {},
    async (req: any, res: FastifyReply) => {
      const product: Product | null = await getProductById(
        parseInt(req.params.productId)
      );
      if (!product) {
        return res
          .status(400)
          .send(
            new RequestError(
              400,
              ErrorTypes.notFoundError,
              ErrorMessages.notFoundError,
              ObjectTypes.product
            )
          );
      }
      const updatedProduct: Product | null = await updateProduct(
        parseInt(req.params.productId),
        req.body
      );
      if (!updatedProduct) {
        return res
          .status(400)
          .send(
            new RequestError(
              400,
              ErrorTypes.invalidUpdateDataError,
              ErrorMessages.invalidUpdateDataError,
              ObjectTypes.product
            )
          );
      }
      return res.status(200).send(updatedProduct);
    }
  );

  fastify.patch(
    "/product/update/shortCharacteristics/:productId",
    {},
    async (req: any, res: FastifyReply) => {
      const product: Product | null = await getProductById(
        parseInt(req.params.productId)
      );
      if (!product) {
        return res
          .status(400)
          .send(
            new RequestError(
              400,
              ErrorTypes.notFoundError,
              ErrorMessages.notFoundError,
              ObjectTypes.product
            )
          );
      }
      const updatedProduct: Product | null = await updateProductShortChars(
        parseInt(req.params.productId),
        req.body
      );
      if (!updatedProduct) {
        return res
          .status(400)
          .send(
            new RequestError(
              400,
              ErrorTypes.invalidUpdateDataError,
              ErrorMessages.invalidUpdateDataError,
              ObjectTypes.product
            )
          );
      }
      return res.status(200).send(updatedProduct);
    }
  );

  fastify.patch(
    "/product/update/documents/:productId",
    {},
    async (req: any, res: FastifyReply) => {
      const product: Product | null = await getProductById(
        parseInt(req.params.productId)
      );
      if (!product) {
        return res
          .status(400)
          .send(
            new RequestError(
              400,
              ErrorTypes.notFoundError,
              ErrorMessages.notFoundError,
              ObjectTypes.product
            )
          );
      }
      const updatedProduct: Product | null = await updateProductDocuments(
        parseInt(req.params.productId),
        req.body
      );
      if (!updatedProduct) {
        return res
          .status(400)
          .send(
            new RequestError(
              400,
              ErrorTypes.invalidUpdateDataError,
              ErrorMessages.invalidUpdateDataError,
              ObjectTypes.product
            )
          );
      }
      return res.status(200).send(updatedProduct);
    }
  );

  fastify.patch(
    "/product/update/faqs/:productId",
    {},
    async (req: any, res: FastifyReply) => {
      const product: Product | null = await getProductById(
        parseInt(req.params.productId)
      );
      if (!product) {
        return res
          .status(400)
          .send(
            new RequestError(
              400,
              ErrorTypes.notFoundError,
              ErrorMessages.notFoundError,
              ObjectTypes.product
            )
          );
      }
      const updatedProduct: Product | null = await updateProductFAQs(
        parseInt(req.params.productId),
        req.body
      );
      if (!updatedProduct) {
        return res
          .status(400)
          .send(
            new RequestError(
              400,
              ErrorTypes.invalidUpdateDataError,
              ErrorMessages.invalidUpdateDataError,
              ObjectTypes.product
            )
          );
      }
      return res.status(200).send(updatedProduct);
    }
  );

  fastify.delete(
    "/category/delete/:categoryId",
    {},
    async (req: any, res: FastifyReply) => {
      const category: Category | null = await deleteCategory(
        parseInt(req.params.categoryId)
      );
      if (!category) {
        return res
          .status(400)
          .send(
            new RequestError(
              400,
              ErrorTypes.notFoundError,
              ErrorMessages.notFoundError,
              ObjectTypes.category
            )
          );
      } else {
        const result: any = await fileService.deleteFile(
          join(
            resolve(__dirname, "../../"),
            `/static/img/category/${category.id}/${category.pictureUrl}`
          )
        );
        if (result.error) {
          return res.status(400).send(result);
        }
      }
      return res.status(204).send();
    }
  );

  fastify.delete(
    "/subcategory/delete/:subcategoryId",
    {},
    async (req: any, res: FastifyReply) => {
      const subcategory = await deleteSubcategory(
        parseInt(req.params.subcategoryId)
      );
      if (!subcategory) {
        return res
          .status(400)
          .send(
            new RequestError(
              400,
              ErrorTypes.notFoundError,
              ErrorMessages.notFoundError,
              ObjectTypes.subcategory
            )
          );
      } else {
        const result: any = await fileService.deleteFile(
          join(
            resolve(__dirname, "../../"),
            `/static/img/subcategory/${subcategory.id}/${subcategory.pictureUrl}`
          )
        );
        if (result.error) {
          return res.status(400).status(result);
        }
      }
      return res.status(204).send();
    }
  );

  fastify.delete(
    "/product/delete/:productId",
    {},
    async (req: any, res: FastifyReply) => {
      const product = await deleteProduct(parseInt(req.params.productId));
      if (!product) {
        return res
          .status(400)
          .send(
            new RequestError(
              400,
              ErrorTypes.notFoundError,
              ErrorMessages.notFoundError,
              ObjectTypes.product
            )
          );
      } else {
        for (let imageName of product.documents) {
          let tempResult: any = await fileService.deleteFile(
            join(
              resolve(__dirname, "../../"),
              `/static/img/product/${product.id}/${imageName}`
            )
          );
          if (tempResult.error) {
            return res.status(400).send(tempResult);
          }
        }
      }
      return res.status(204).send();
    }
  );
};

export default products;
