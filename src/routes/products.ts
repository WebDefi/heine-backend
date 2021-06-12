import { FastifyInstance, FastifyPluginCallback, FastifyReply } from "fastify";
import {
  createProduct,
  deleteProduct,
  getAllProductsBySubcategoryId,
  getProductById,
  updateProductConfiguration,
  updateProductDescriptionUk,
  updateProductDocuments,
  updateProductFAQs,
  updateProductNameRu,
  updateProductNameUk,
  updateProductShortChars,
  updateProductTitleRu,
  updateProductTitleUk,
} from "../queries/products";
import { ErrorMessages, ErrorTypes, ObjectTypes } from "../utils/constants";
import { RequestError } from "../utils/requestError";
import { 
  createCategory, 
  deleteCategory, 
  getAllCategories, 
  getCategoryById, 
  updateCategoryNameRu, 
  updateCategoryNameUk,
  updateCategoryPictureUrl,
  updateCategoryTitleRu,
  updateCategoryTitleUk
} from "../queries/categories";
import {
  createSubcategory,
  deleteSubcategory,
  getAllSubcategoriesByCategoryId,
  getSubcategoryById,
  updateSubcategoryNameRu,
  updateSubcategoryNameUk,
  updateSubcategoryPictureUrl,
  updateSubcategoryTitleRu,
  updateSubcategoryTitleUk,
} from "../queries/subcategories";
import { Category, Product, Subcategory } from ".prisma/client";

const products: FastifyPluginCallback = async function (
  fastify: FastifyInstance
) {
  fastify.put("/category/create", {}, async (req: any, res: any) => {
    const category = await createCategory(req.body);
    if (!category) {
      return res.status(400).send(new RequestError(
            400,
            ErrorTypes.invalidCreationDataError,
            ErrorMessages.invalidCreationDataError,
            ObjectTypes.category,
          ));
    }
    return res.status(200).send(category);
  });

  fastify.put("/subcategory/create", {}, async (req: any, res: any) => {
    const subcategory = await createSubcategory(req.body);
    if (!subcategory) {
      return res.status(400).send(new RequestError(
            400,
            ErrorTypes.invalidCreationDataError,
            ErrorMessages.invalidCreationDataError,
            ObjectTypes.subcategory,
          ));
    }
    return res.status(200).send(subcategory);
  });

  fastify.put("/product/create", {}, async (req: any, res: any) => {
    const product = await createProduct(req.body);
    if (!product) {
      return res.status(400).send(new RequestError(
            400,
            ErrorTypes.invalidCreationDataError,
            ErrorMessages.invalidCreationDataError,
            ObjectTypes.product,
          ));
    }
    return res.status(200).send(product);
  });

  fastify.get("/", {}, async (_req: any, res: any) => {
    const categories = await getAllCategories();
    if (!categories) {
      return res.status(400).send(new RequestError(
            400,
            ErrorTypes.notFoundError,
            ErrorMessages.notFoundError,
            ObjectTypes.category,
          ));
    }
    return res.status(200).send(categories);
  });

  fastify.get("/menu", {}, async (_req: any, res: any) => {
    const categories: any = await getAllCategories();
    const data: Array<any> = [];
    if (!categories) {
      return res.status(400).send(new RequestError(
            400,
            ErrorTypes.notFoundError,
            ErrorMessages.notFoundError,
            ObjectTypes.category,
          ));
    }
    for (const category of categories) {
      let subcategories: Subcategory[] = await getAllSubcategoriesByCategoryId(category.id);
      let subcategoriesData: Array<any> = [];
      for (const subcategory of subcategories) {
        let products = await getAllProductsBySubcategoryId(subcategory.id);
        let productsData: Array<any> = [];
        for(const product of products) {
          productsData.push({
            nameRu: product.nameRu,
            nameUk: product.nameUk,
          });
        }
        subcategoriesData.push({
          subcategory: {
            nameRu: subcategory.nameRu,
            nameUk: subcategory.nameUk,
            products: productsData,
          },
        });
      }
      data.push({
        category: {
          nameRu: category.nameRu,
          nameUk: category.nameUk,
          subcategories: subcategoriesData,
        },
      });
    }
    return res.status(200).send(data);
  });

  fastify.get("/category/:categoryId", {}, async (req: any, res: any) => {
    const subcategories: any = await getAllSubcategoriesByCategoryId(
      parseInt(req.params.categoryId)
    );
    if (!subcategories) {
        return res.status(400).send(new RequestError(
            400,
            ErrorTypes.notFoundError,
            ErrorMessages.notFoundError,
            ObjectTypes.subcategory,
          ));
    }
    for (let i = 0; i < subcategories.length; i++) {
      subcategories[i] = { 
        subcategory: subcategories[i], 
        products: await getAllProductsBySubcategoryId(subcategories[i].id) 
      }
    }
    return res.status(200).send({ subcategories });
  });

  fastify.get("/subcategory/:subcategoryId", {}, async (req: any, res: FastifyReply) => {
      const subcategory = await getSubcategoryById(parseInt(req.params.subcategoryId));
      if (!subcategory) {
        return res.status(400).send(new RequestError(
            400,
            ErrorTypes.notFoundError,
            ErrorMessages.notFoundError,
            ObjectTypes.subcategory,
          ));
      }
      const products: Product[] = await getAllProductsBySubcategoryId(parseInt(req.params.subcategoryId));
      if (!products) {
        return res.status(400).send(new RequestError(
            400,
            ErrorTypes.notFoundError,
            ErrorMessages.notFoundError,
            ObjectTypes.product,
          ));
      }
      return res.status(200).send({ subcategory, products });
    }
  );

  fastify.get("/product/:productId", {}, async (req: any, res: FastifyReply) => {
      const product: Product | null = await getProductById(parseInt(req.params.productId));
      if (!product) {
        return res.status(400).send(new RequestError(
          400, 
          ErrorTypes.notFoundError, 
          ErrorMessages.notFoundError,
          ObjectTypes.product,
          ));
      }
      return res.status(200).send(product);
    }
  );

  fastify.patch("/category/update/nameRu/:categoryId", {}, async (req: any, res: FastifyReply) => {
    const category: Category | null = await getCategoryById(parseInt(req.params.categoryId));
    if (!category) {
      return res.status(400).send(new RequestError(
        400, 
        ErrorTypes.notFoundError, 
        ErrorMessages.notFoundError,
        ObjectTypes.category,
        ));
    }
    const updatedCategory: Category | null = await updateCategoryNameRu(parseInt(req.params.categoryId) ,req.body);
    if (!updatedCategory) {
      return res.status(400).send(new RequestError(
        400, ErrorTypes.invalidUpdateDataError, 
        ErrorMessages.invalidUpdateDataError,
        ObjectTypes.category,
        ));
    }
    return res.status(200).send(updatedCategory);
  });

  fastify.patch("/category/update/nameUk/:categoryId", {}, async (req: any, res: FastifyReply) => {
    const category: Category | null = await getCategoryById(parseInt(req.params.categoryId));
    if (!category) {
      return res.status(400).send(new RequestError(
        400, 
        ErrorTypes.notFoundError, 
        ErrorMessages.notFoundError,
        ObjectTypes.category,
        ));
    }
    const updatedCategory: Category | null = await updateCategoryNameUk(parseInt(req.params.categoryId) ,req.body);
    if (!updatedCategory) {
      return res.status(400).send(new RequestError(
        400, ErrorTypes.invalidUpdateDataError, 
        ErrorMessages.invalidUpdateDataError,
        ObjectTypes.category,
        ));
    }
    return res.status(200).send(updatedCategory);
  });

  fastify.patch("/category/update/titleRu/:categoryId", {}, async (req: any, res: FastifyReply) => {
    const category: Category | null = await getCategoryById(parseInt(req.params.categoryId));
    if (!category) {
      return res.status(400).send(new RequestError(
        400, 
        ErrorTypes.notFoundError, 
        ErrorMessages.notFoundError,
        ObjectTypes.category,
        ));
    }
    const updatedCategory: Category | null = await updateCategoryTitleRu(parseInt(req.params.categoryId) ,req.body);
    if (!updatedCategory) {
      return res.status(400).send(new RequestError(
        400, ErrorTypes.invalidUpdateDataError, 
        ErrorMessages.invalidUpdateDataError,
        ObjectTypes.category,
        ));
    }
    return res.status(200).send(updatedCategory);
  });

    fastify.patch("/category/update/titleUk/:categoryId", {}, async (req: any, res: FastifyReply) => {
    const category: Category | null = await getCategoryById(parseInt(req.params.categoryId));
    if (!category) {
      return res.status(400).send(new RequestError(
        400, 
        ErrorTypes.notFoundError, 
        ErrorMessages.notFoundError,
        ObjectTypes.category,
        ));
    }
    const updatedCategory: Category | null = await updateCategoryTitleUk(parseInt(req.params.categoryId) ,req.body);
    if (!updatedCategory) {
      return res.status(400).send(new RequestError(
        400, ErrorTypes.invalidUpdateDataError, 
        ErrorMessages.invalidUpdateDataError,
        ObjectTypes.category,
        ));
    }
    return res.status(200).send(updatedCategory);
  });

  fastify.patch("/category/update/pictureUrl/:categoryId", {}, async (req: any, res: FastifyReply) => {
    const category: Category | null = await getCategoryById(parseInt(req.params.categoryId));
    if (!category) {
      return res.status(400).send(new RequestError(
        400, 
        ErrorTypes.notFoundError, 
        ErrorMessages.notFoundError,
        ObjectTypes.category,
        ));
    }
    const updatedCategory: Category | null = await updateCategoryPictureUrl(parseInt(req.params.categoryId) ,req.body);
    if (!updatedCategory) {
      return res.status(400).send(new RequestError(
        400, ErrorTypes.invalidUpdateDataError, 
        ErrorMessages.invalidUpdateDataError,
        ObjectTypes.category,
        ));
    }
    return res.status(200).send(updatedCategory);
  });

  fastify.patch("/subcategory/update/nameRu/:subcategoryId", {}, async (req: any, res: FastifyReply) => {
    const subcategory: Subcategory | null = await getSubcategoryById(parseInt(req.params.subcategoryId));
    if (!subcategory) {
      return res.status(400).send(new RequestError(
        400, 
        ErrorTypes.notFoundError, 
        ErrorMessages.notFoundError,
        ObjectTypes.subcategory,
        ));
    }
    const updatedSubcategory: Subcategory | null = await updateSubcategoryNameRu(parseInt(req.params.subcategoryId) ,req.body);
    if (!updatedSubcategory) {
      return res.status(400).send(new RequestError(
        400, 
        ErrorTypes.invalidUpdateDataError, 
        ErrorMessages.invalidUpdateDataError,
        ObjectTypes.subcategory
        ));
    }
    return res.status(200).send(updatedSubcategory);
  });

  fastify.patch("/subcategory/update/nameUk/:subcategoryId", {}, async (req: any, res: FastifyReply) => {
    const subcategory: Subcategory | null = await getSubcategoryById(parseInt(req.params.subcategoryId));
    if (!subcategory) {
      return res.status(400).send(new RequestError(
        400, 
        ErrorTypes.notFoundError, 
        ErrorMessages.notFoundError,
        ObjectTypes.subcategory,
        ));
    }
    const updatedSubcategory: Subcategory | null = await updateSubcategoryNameUk(parseInt(req.params.subcategoryId) ,req.body);
    if (!updatedSubcategory) {
      return res.status(400).send(new RequestError(
        400, 
        ErrorTypes.invalidUpdateDataError, 
        ErrorMessages.invalidUpdateDataError,
        ObjectTypes.subcategory
        ));
    }
    return res.status(200).send(updatedSubcategory);
  });

  fastify.patch("/subcategory/update/titleRu/:subcategoryId", {}, async (req: any, res: FastifyReply) => {
    const subcategory: Subcategory | null = await getSubcategoryById(parseInt(req.params.subcategoryId));
    if (!subcategory) {
      return res.status(400).send(new RequestError(
        400, 
        ErrorTypes.notFoundError, 
        ErrorMessages.notFoundError,
        ObjectTypes.subcategory,
        ));
    }
    const updatedSubcategory: Subcategory | null = await updateSubcategoryTitleRu(parseInt(req.params.subcategoryId) ,req.body);
    if (!updatedSubcategory) {
      return res.status(400).send(new RequestError(
        400, 
        ErrorTypes.invalidUpdateDataError, 
        ErrorMessages.invalidUpdateDataError,
        ObjectTypes.subcategory
        ));
    }
    return res.status(200).send(updatedSubcategory);
  });

  fastify.patch("/subcategory/update/titleUk/:subcategoryId", {}, async (req: any, res: FastifyReply) => {
    const subcategory: Subcategory | null = await getSubcategoryById(parseInt(req.params.subcategoryId));
    if (!subcategory) {
      return res.status(400).send(new RequestError(
        400, 
        ErrorTypes.notFoundError, 
        ErrorMessages.notFoundError,
        ObjectTypes.subcategory,
        ));
    }
    const updatedSubcategory: Subcategory | null = await updateSubcategoryTitleUk(parseInt(req.params.subcategoryId) ,req.body);
    if (!updatedSubcategory) {
      return res.status(400).send(new RequestError(
        400, 
        ErrorTypes.invalidUpdateDataError, 
        ErrorMessages.invalidUpdateDataError,
        ObjectTypes.subcategory
        ));
    }
    return res.status(200).send(updatedSubcategory);
  });

  fastify.patch("/subcategory/update/pictureUrl/:subcategoryId", {}, async (req: any, res: FastifyReply) => {
    const subcategory: Subcategory | null = await getSubcategoryById(parseInt(req.params.subcategoryId));
    if (!subcategory) {
      return res.status(400).send(new RequestError(
        400, 
        ErrorTypes.notFoundError, 
        ErrorMessages.notFoundError,
        ObjectTypes.subcategory,
        ));
    }
    const updatedSubcategory: Subcategory | null = await updateSubcategoryPictureUrl(parseInt(req.params.subcategoryId) ,req.body);
    if (!updatedSubcategory) {
      return res.status(400).send(new RequestError(
        400, 
        ErrorTypes.invalidUpdateDataError, 
        ErrorMessages.invalidUpdateDataError,
        ObjectTypes.subcategory
        ));
    }
    return res.status(200).send(updatedSubcategory);
  });

  fastify.patch("/product/update/nameRu/:productId", {}, async (req: any, res: FastifyReply) => {
    const product: Product | null = await getProductById(parseInt(req.params.productId));
    if (!product) {
      return res.status(400).send(new RequestError(
        400, 
        ErrorTypes.notFoundError, 
        ErrorMessages.notFoundError,
        ObjectTypes.product,
        ));
    }
    const updatedProduct: Product | null = await updateProductNameRu(parseInt(req.params.productId) ,req.body);
    if (!updatedProduct) {
      return res.status(400).send(new RequestError(
        400, 
        ErrorTypes.invalidUpdateDataError, 
        ErrorMessages.invalidUpdateDataError,
        ObjectTypes.product
        ));
    }
    return res.status(200).send(updatedProduct);
  });

  fastify.patch("/product/update/nameUk/:productId", {}, async (req: any, res: FastifyReply) => {
    const product: Product | null = await getProductById(parseInt(req.params.productId));
    if (!product) {
      return res.status(400).send(new RequestError(
        400, 
        ErrorTypes.notFoundError, 
        ErrorMessages.notFoundError,
        ObjectTypes.product,
        ));
    }
    const updatedProduct: Product | null = await updateProductNameUk(parseInt(req.params.productId) ,req.body);
    if (!updatedProduct) {
      return res.status(400).send(new RequestError(
        400, 
        ErrorTypes.invalidUpdateDataError, 
        ErrorMessages.invalidUpdateDataError,
        ObjectTypes.product
        ));
    }
    return res.status(200).send(updatedProduct);
  });

  fastify.patch("/product/update/titleRu/:productId", {}, async (req: any, res: FastifyReply) => {
    const product: Product | null = await getProductById(parseInt(req.params.productId));
    if (!product) {
      return res.status(400).send(new RequestError(
        400, 
        ErrorTypes.notFoundError, 
        ErrorMessages.notFoundError,
        ObjectTypes.product,
        ));
    }
    const updatedProduct: Product | null = await updateProductTitleRu(parseInt(req.params.productId) ,req.body);
    if (!updatedProduct) {
      return res.status(400).send(new RequestError(
        400, 
        ErrorTypes.invalidUpdateDataError, 
        ErrorMessages.invalidUpdateDataError,
        ObjectTypes.product
        ));
    }
    return res.status(200).send(updatedProduct);
  });

  fastify.patch("/product/update/titleUk/:productId", {}, async (req: any, res: FastifyReply) => {
    const product: Product | null = await getProductById(parseInt(req.params.productId));
    if (!product) {
      return res.status(400).send(new RequestError(
        400, 
        ErrorTypes.notFoundError, 
        ErrorMessages.notFoundError,
        ObjectTypes.product,
        ));
    }
    const updatedProduct: Product | null = await updateProductTitleUk(parseInt(req.params.productId) ,req.body);
    if (!updatedProduct) {
      return res.status(400).send(new RequestError(
        400, 
        ErrorTypes.invalidUpdateDataError, 
        ErrorMessages.invalidUpdateDataError,
        ObjectTypes.product
        ));
    }
    return res.status(200).send(updatedProduct);
  });

    fastify.patch("/product/update/descriptionRu/:productId", {}, async (req: any, res: FastifyReply) => {
    const product: Product | null = await getProductById(parseInt(req.params.productId));
    if (!product) {
      return res.status(400).send(new RequestError(
        400, 
        ErrorTypes.notFoundError, 
        ErrorMessages.notFoundError,
        ObjectTypes.product,
        ));
    }
    const updatedProduct: Product | null = await updateProductNameRu(parseInt(req.params.productId) ,req.body);
    if (!updatedProduct) {
      return res.status(400).send(new RequestError(
        400, 
        ErrorTypes.invalidUpdateDataError, 
        ErrorMessages.invalidUpdateDataError,
        ObjectTypes.product
        ));
    }
    return res.status(200).send(updatedProduct);
  });

  fastify.patch("/product/update/descriptionUk/:productId", {}, async (req: any, res: FastifyReply) => {
    const product: Product | null = await getProductById(parseInt(req.params.productId));
    if (!product) {
      return res.status(400).send(new RequestError(
        400, 
        ErrorTypes.notFoundError, 
        ErrorMessages.notFoundError,
        ObjectTypes.product,
        ));
    }
    const updatedProduct: Product | null = await updateProductDescriptionUk(parseInt(req.params.productId) ,req.body);
    if (!updatedProduct) {
      return res.status(400).send(new RequestError(
        400, 
        ErrorTypes.invalidUpdateDataError, 
        ErrorMessages.invalidUpdateDataError,
        ObjectTypes.product
        ));
    }
    return res.status(200).send(updatedProduct);
  });

  fastify.patch("/product/update/shortCharacteristics/:productId", {}, async (req: any, res: FastifyReply) => {
    const product: Product | null = await getProductById(parseInt(req.params.productId));
    if (!product) {
      return res.status(400).send(new RequestError(
        400, 
        ErrorTypes.notFoundError, 
        ErrorMessages.notFoundError,
        ObjectTypes.product,
        ));
    }
    const updatedProduct: Product | null = await updateProductShortChars(parseInt(req.params.productId) ,req.body);
    if (!updatedProduct) {
      return res.status(400).send(new RequestError(
        400, 
        ErrorTypes.invalidUpdateDataError, 
        ErrorMessages.invalidUpdateDataError,
        ObjectTypes.product
        ));
    }
    return res.status(200).send(updatedProduct);
  });

  fastify.patch("/product/update/longCharacteristicsRu/:productId", {}, async (req: any, res: FastifyReply) => {
    const product: Product | null = await getProductById(parseInt(req.params.productId));
    if (!product) {
      return res.status(400).send(new RequestError(
        400, 
        ErrorTypes.notFoundError, 
        ErrorMessages.notFoundError,
        ObjectTypes.product,
        ));
    }
    const updatedProduct: Product | null = await updateProductDescriptionUk(parseInt(req.params.productId) ,req.body);
    if (!updatedProduct) {
      return res.status(400).send(new RequestError(
        400, 
        ErrorTypes.invalidUpdateDataError, 
        ErrorMessages.invalidUpdateDataError,
        ObjectTypes.product
        ));
    }
    return res.status(200).send(updatedProduct);
  });

  fastify.patch("/product/update/longCharacteristicsUk/:productId", {}, async (req: any, res: FastifyReply) => {
    const product: Product | null = await getProductById(parseInt(req.params.productId));
    if (!product) {
      return res.status(400).send(new RequestError(
        400, 
        ErrorTypes.notFoundError, 
        ErrorMessages.notFoundError,
        ObjectTypes.product,
        ));
    }
    const updatedProduct: Product | null = await updateProductDescriptionUk(parseInt(req.params.productId) ,req.body);
    if (!updatedProduct) {
      return res.status(400).send(new RequestError(
        400, 
        ErrorTypes.invalidUpdateDataError, 
        ErrorMessages.invalidUpdateDataError,
        ObjectTypes.product
        ));
    }
    return res.status(200).send(updatedProduct);
  });

  fastify.patch("/product/update/configuration/:productId", {}, async (req: any, res: FastifyReply) => {
    const product: Product | null = await getProductById(parseInt(req.params.productId));
    if (!product) {
      return res.status(400).send(new RequestError(
        400, 
        ErrorTypes.notFoundError, 
        ErrorMessages.notFoundError,
        ObjectTypes.product,
        ));
    }
    const updatedProduct: Product | null = await updateProductConfiguration(parseInt(req.params.productId) ,req.body);
    if (!updatedProduct) {
      return res.status(400).send(new RequestError(
        400, 
        ErrorTypes.invalidUpdateDataError, 
        ErrorMessages.invalidUpdateDataError,
        ObjectTypes.product
        ));
    }
    return res.status(200).send(updatedProduct);
  });

    fastify.patch("/product/update/documents/:productId", {}, async (req: any, res: FastifyReply) => {
    const product: Product | null = await getProductById(parseInt(req.params.productId));
    if (!product) {
      return res.status(400).send(new RequestError(
        400, 
        ErrorTypes.notFoundError, 
        ErrorMessages.notFoundError,
        ObjectTypes.product,
        ));
    }
    const updatedProduct: Product | null = await updateProductDocuments(parseInt(req.params.productId) ,req.body);
    if (!updatedProduct) {
      return res.status(400).send(new RequestError(
        400, 
        ErrorTypes.invalidUpdateDataError, 
        ErrorMessages.invalidUpdateDataError,
        ObjectTypes.product
        ));
    }
    return res.status(200).send(updatedProduct);
  });

  fastify.patch("/product/update/faqs/:productId", {}, async (req: any, res: FastifyReply) => {
    const product: Product | null = await getProductById(parseInt(req.params.productId));
    if (!product) {
      return res.status(400).send(new RequestError(
        400, 
        ErrorTypes.notFoundError, 
        ErrorMessages.notFoundError,
        ObjectTypes.product,
        ));
    }
    const updatedProduct: Product | null = await updateProductFAQs(parseInt(req.params.productId) ,req.body);
    if (!updatedProduct) {
      return res.status(400).send(new RequestError(
        400, 
        ErrorTypes.invalidUpdateDataError, 
        ErrorMessages.invalidUpdateDataError,
        ObjectTypes.product
        ));
    }
    return res.status(200).send(updatedProduct);
  });

  fastify.delete("/category/delete/:categoryId", {}, async (req: any, res: FastifyReply) => {
    const category: Category | null = await deleteCategory(parseInt(req.params.categoryId));
    if(!category) {
      return res.status(400).send(new RequestError(
        400, 
        ErrorTypes.notFoundError, 
        ErrorMessages.notFoundError,
        ObjectTypes.category,
        ));
    }
    return res.status(204).send();
  });

  fastify.delete("/subcategory/delete/:subcategoryId", {}, async (req: any, res: FastifyReply) => {
    const subcategory = await deleteSubcategory(parseInt(req.params.subcategoryId));
    if(!subcategory) {
      return res.status(400).send(new RequestError(
        400, 
        ErrorTypes.notFoundError, 
        ErrorMessages.notFoundError,
        ObjectTypes.subcategory,
        ));
    }
    return res.status(204).send();
  });

  fastify.delete("/product/delete/:productId", {}, async (req: any, res: FastifyReply) => {
    const product = await deleteProduct(parseInt(req.params.productId));
    if(!product) {
        return res.status(400).send(new RequestError(
            400,
            ErrorTypes.notFoundError,
            ErrorMessages.notFoundError,
            ObjectTypes.product,
          ));
    }
    return res.status(204).send();
  });
};

export default products;
