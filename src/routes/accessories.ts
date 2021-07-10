import { Accessory, AccessoryCategory, AccessorySubcategory } from "@prisma/client";
import { FastifyInstance, FastifyPluginCallback, FastifyReply } from "fastify";
import {
  createAccessory,
  deleteAccessory,
  getAccessoryById,
  getAllAccessoriesByAccessorySubcategoryId,
  updateAccessoryConfiguration,
  updateAccessoryDescriptionRu,
  updateAccessoryDescriptionUk,
  updateAccessoryDocuments,
  updateAccessoryLongCharsRu,
  updateAccessoryLongCharsUk,
  updateAccessoryNameRu,
  updateAccessoryNameUk,
  updateAccessoryShortChars,
  updateAccessoryTitleRu,
  updateAccessoryTitleUk,
} from "../queries/accessories";
import { 
  createAccessoryCategory, 
  deleteAccessoryCategory, 
  getAccessoryCategoryById, 
  getAllAccessoryCategories, 
  updateAccessoryCategoryNameRu, 
  updateAccessoryCategoryNameUk, 
  updateAccessoryCategoryPictureUrl, 
  updateAccessoryCategoryTitleRu, 
  updateAccessoryCategoryTitleUk 
} from "../queries/accessoryCategories";
import { 
  createAccessorySubcategory, 
  deleteAccessorySubcategory, 
  getAccessorySubcategoryById, 
  getAllAccessorySubcategoriesByCategoryId, 
  updateAccessorySubcategoryNameRu, 
  updateAccessorySubcategoryNameUk, 
  updateAccessorySubcategoryPictureUrl, 
  updateAccessorySubcategoryTitleRu, 
  updateAccessorySubcategoryTitleUk 
} from "../queries/accessorySubcategories";
import { ErrorMessages, ErrorTypes, ObjectTypes } from "../utils/constants";
import { RequestError } from "../utils/requestError";

const accessories: FastifyPluginCallback = async function (
  fastify: FastifyInstance
) {
  fastify.put("/accessoryCategory/create", {}, async (req: any, res: FastifyReply) => {
    const accessoryCategory: AccessoryCategory = await createAccessoryCategory(req.body);
    if (!accessoryCategory) {
      return res.status(400).send(new RequestError(
            400,
            ErrorTypes.invalidCreationDataError,
            ErrorMessages.invalidCreationDataError,
            ObjectTypes.accessoryCategory,
          ));
    }
    return res.status(200).send(accessoryCategory);
  });

  fastify.put("/accessorySubcategory/create", {}, async (req: any, res: FastifyReply) => {
    const accessorySubcategory: AccessorySubcategory = await createAccessorySubcategory(req.body);
    if (!accessorySubcategory) {
      return res.status(400).send(new RequestError(
            400,
            ErrorTypes.invalidCreationDataError,
            ErrorMessages.invalidCreationDataError,
            ObjectTypes.accessorySubcategory,
          ));
    }
    return res.status(200).send(accessorySubcategory);
  });

  fastify.put("/accessory/create", {}, async (req: any, res: FastifyReply) => {
    const accessory: Accessory = await createAccessory(req.body);
    if (!accessory) {
      res.status(400).send(new RequestError(
          400,
          ErrorTypes.invalidCreationDataError,
          ErrorMessages.invalidCreationDataError,
          ObjectTypes.accessory,
        ));
    }
    return res.status(200).send(accessory);
  });

  fastify.get("/", {}, async (_req, res) => {
    const accessoryCategories: any = await getAllAccessoryCategories();
    if (!accessoryCategories) {
      res.send(new RequestError(
          400,
          ErrorTypes.notFoundError,
          ErrorMessages.notFoundError,
          ObjectTypes.accessoryCategory,
        ));
    }
    return res.status(200).send(accessoryCategories);
  });

const getNameByLang = (nameRu: string, nameUk: string, lang: string) => {
  return lang == 'ru' ? nameRu.split('_')[0] : nameUk.split('_')[0];
}

  fastify.get("/menu", {}, async (_req: any, res: any) => {
    const categories: any = await getAllAccessoryCategories();
    const lang = _req.cookies.lang ?? 'uk';
    // Add postClientRequest hook on cookie lang
    const data: {[key: string]: any} = {};
    if (!categories) {
      return res.status(400).send(new RequestError(
            400,
            ErrorTypes.notFoundError,
            ErrorMessages.notFoundError,
            ObjectTypes.category,
          ));
    }
    for (const category of categories) {
      let tempCategoryName = getNameByLang(category.name_ru, category.name_uk, lang);
      data[tempCategoryName] = {};
      let subcategories: AccessorySubcategory[] = await getAllAccessorySubcategoriesByCategoryId(category.id);
      for (const subcategory of subcategories) {
        let tempSubCategoryName = getNameByLang(subcategory.name_ru, subcategory.name_uk, lang);
        data[tempCategoryName][tempSubCategoryName] = {}
        let accessories = await getAllAccessoriesByAccessorySubcategoryId(subcategory.id);
        for(const accessory of accessories) {
          let tempProductName = getNameByLang(accessory.name_ru, accessory.name_uk, lang);
          data[tempCategoryName][tempSubCategoryName][tempProductName] = accessory.id;
        }
      }
    }
    return res.status(200).send(data);
  });

  fastify.get("/accessoryCategory/:categoryId", {}, async (req: any, res: any) => {
    const accessorySubcategories: any = await getAllAccessorySubcategoriesByCategoryId(
      parseInt(req.params.categoryId)
    );
    if (!accessorySubcategories) {
        return res.status(400).send(new RequestError(
            400,
            ErrorTypes.notFoundError,
            ErrorMessages.notFoundError,
            ObjectTypes.accessorySubcategory,
          ));
    }
    for (let i = 0; i < accessorySubcategories.length; i++) {
      accessorySubcategories[i] = { 
        subcategory: accessorySubcategories[i], 
        products: await getAllAccessoriesByAccessorySubcategoryId(accessorySubcategories[i].id) 
      }
    }
    return res.status(200).send({ accessorySubcategories });
  });

  fastify.get("/accessorySubcategory/:subcategoryId", {}, async (req: any, res: FastifyReply) => {
      const accessorySubcategory: AccessorySubcategory | null = await getAccessorySubcategoryById(parseInt(req.params.subcategoryId));
      if (!accessorySubcategory) {
        return res.status(400).send(new RequestError(
            400,
            ErrorTypes.notFoundError,
            ErrorMessages.notFoundError,
            ObjectTypes.accessorySubcategory,
          ));
      }
      const accessories: Accessory[] = await getAllAccessoriesByAccessorySubcategoryId(parseInt(req.params.subcategoryId));
      if (!accessories) {
        return res.status(400).send(new RequestError(
            400,
            ErrorTypes.notFoundError,
            ErrorMessages.notFoundError,
            ObjectTypes.accessory,
          ));
      }
      return res.status(200).send({ accessorySubcategory, accessories });
    }
  );

  fastify.get("/accessory/:accessoryId", {}, async (req: any, res: FastifyReply) => {
      const accessory: Accessory | null = await getAccessoryById(parseInt(req.params.accessoryId));
      if (!accessory) {
        return res.status(400).send(new RequestError(
          400, 
          ErrorTypes.notFoundError, 
          ErrorMessages.notFoundError,
          ObjectTypes.accessory,
          ));
      }
      return res.status(200).send(accessory);
    }
  );

  fastify.patch("/accessoryCategory/update/nameRu/:categoryId", {}, async (req: any, res: FastifyReply) => {
    const accessoryCategory: AccessoryCategory | null = await getAccessoryCategoryById(parseInt(req.params.categoryId));
    if (!accessoryCategory) {
      return res.status(400).send(new RequestError(
        400, 
        ErrorTypes.notFoundError, 
        ErrorMessages.notFoundError,
        ObjectTypes.accessoryCategory,
        ));
    }
    const updatedCategory: AccessoryCategory | null = await updateAccessoryCategoryNameRu(parseInt(req.params.categoryId) ,req.body);
    if (!updatedCategory) {
      return res.status(400).send(new RequestError(
        400, ErrorTypes.invalidUpdateDataError, 
        ErrorMessages.invalidUpdateDataError,
        ObjectTypes.category,
        ));
    }
    return res.status(200).send(updatedCategory);
  });
  
  fastify.patch("/accessoryCategory/update/nameUk/:categoryId", {}, async (req: any, res: FastifyReply) => {
    const accessoryCategory: AccessoryCategory | null = await getAccessoryCategoryById(parseInt(req.params.categoryId));
    if (!accessoryCategory) {
      return res.status(400).send(new RequestError(
        400, 
        ErrorTypes.notFoundError, 
        ErrorMessages.notFoundError,
        ObjectTypes.accessoryCategory,
        ));
    }
    const updatedCategory: AccessoryCategory | null = await updateAccessoryCategoryNameUk(parseInt(req.params.categoryId) ,req.body);
    if (!updatedCategory) {
      return res.status(400).send(new RequestError(
        400, ErrorTypes.invalidUpdateDataError, 
        ErrorMessages.invalidUpdateDataError,
        ObjectTypes.accessoryCategory,
        ));
    }
    return res.status(200).send(updatedCategory);
  });
  
  fastify.patch("/accessoryCategory/update/titleRu/:categoryId", {}, async (req: any, res: FastifyReply) => {
    const accessoryCategory: AccessoryCategory | null = await getAccessoryCategoryById(parseInt(req.params.categoryId));
    if (!accessoryCategory) {
      return res.status(400).send(new RequestError(
        400, 
        ErrorTypes.notFoundError, 
        ErrorMessages.notFoundError,
        ObjectTypes.accessoryCategory,
        ));
    }
    const updatedCategory: AccessoryCategory | null = await updateAccessoryCategoryTitleRu(parseInt(req.params.categoryId) ,req.body);
    if (!updatedCategory) {
      return res.status(400).send(new RequestError(
        400, ErrorTypes.invalidUpdateDataError, 
        ErrorMessages.invalidUpdateDataError,
        ObjectTypes.accessoryCategory,
        ));
    }
    return res.status(200).send(updatedCategory);
  });
    
  fastify.patch("/accessoryCategory/update/titleUk/:categoryId", {}, async (req: any, res: FastifyReply) => {
    const accessoryCategory: AccessoryCategory | null = await getAccessoryCategoryById(parseInt(req.params.categoryId));
    if (!accessoryCategory) {
      return res.status(400).send(new RequestError(
        400, 
        ErrorTypes.notFoundError, 
        ErrorMessages.notFoundError,
        ObjectTypes.accessoryCategory,
        ));
    }
    const updatedCategory: AccessoryCategory | null = await updateAccessoryCategoryTitleUk(parseInt(req.params.categoryId) ,req.body);
    if (!updatedCategory) {
      return res.status(400).send(new RequestError(
        400, ErrorTypes.invalidUpdateDataError, 
        ErrorMessages.invalidUpdateDataError,
        ObjectTypes.accessoryCategory,
        ));
    }
    return res.status(200).send(updatedCategory);
  });
  
  fastify.patch("/accessoryCategory/update/pictureUrl/:categoryId", {}, async (req: any, res: FastifyReply) => {
    const accessoryCategory: AccessoryCategory | null = await getAccessoryCategoryById(parseInt(req.params.categoryId));
    if (!accessoryCategory) {
      return res.status(400).send(new RequestError(
        400, 
        ErrorTypes.notFoundError, 
        ErrorMessages.notFoundError,
        ObjectTypes.accessoryCategory,
        ));
    }
    const updatedCategory: AccessoryCategory | null = await updateAccessoryCategoryPictureUrl(parseInt(req.params.categoryId) ,req.body);
    if (!updatedCategory) {
      return res.status(400).send(new RequestError(
        400, ErrorTypes.invalidUpdateDataError, 
        ErrorMessages.invalidUpdateDataError,
        ObjectTypes.accessoryCategory,
        ));
    }
    return res.status(200).send(updatedCategory);
  });
    
  fastify.patch("/accessorySubcategory/update/nameRu/:subcategoryId", {}, async (req: any, res: FastifyReply) => {
    const accessorySubcategory: AccessorySubcategory | null = await getAccessorySubcategoryById(parseInt(req.params.subcategoryId));
    if (!accessorySubcategory) {
      return res.status(400).send(new RequestError(
        400, 
        ErrorTypes.notFoundError, 
        ErrorMessages.notFoundError,
        ObjectTypes.accessorySubcategory,
        ));
    }
    const updatedSubcategory: AccessorySubcategory | null = await updateAccessorySubcategoryNameRu(parseInt(req.params.subcategoryId) ,req.body);
    if (!updatedSubcategory) {
      return res.status(400).send(new RequestError(
        400, ErrorTypes.invalidUpdateDataError, 
        ErrorMessages.invalidUpdateDataError,
        ObjectTypes.accessorySubcategory,
        ));
    }
    return res.status(200).send(updatedSubcategory);
  });
      
  fastify.patch("/accessorySubcategory/update/nameUk/:subcategoryId", {}, async (req: any, res: FastifyReply) => {
    const accessorySubcategory: AccessorySubcategory | null = await getAccessorySubcategoryById(parseInt(req.params.subcategoryId));
    if (!accessorySubcategory) {
      return res.status(400).send(new RequestError(
        400, 
        ErrorTypes.notFoundError, 
        ErrorMessages.notFoundError,
        ObjectTypes.accessorySubcategory,
        ));
    }
    const updatedSubcategory: AccessorySubcategory | null = await updateAccessorySubcategoryNameUk(parseInt(req.params.subcategoryId) ,req.body);
    if (!updatedSubcategory) {
      return res.status(400).send(new RequestError(
        400, ErrorTypes.invalidUpdateDataError, 
        ErrorMessages.invalidUpdateDataError,
        ObjectTypes.accessorySubcategory,
        ));
    }
    return res.status(200).send(updatedSubcategory);
  });
      
  fastify.patch("/accessorySubcategory/update/titleRu/:subcategoryId", {}, async (req: any, res: FastifyReply) => {
    const accessorySubcategory: AccessorySubcategory | null = await getAccessorySubcategoryById(parseInt(req.params.subcategoryId));
    if (!accessorySubcategory) {
      return res.status(400).send(new RequestError(
        400, 
        ErrorTypes.notFoundError, 
        ErrorMessages.notFoundError,
        ObjectTypes.accessorySubcategory,
        ));
    }
    const updatedSubcategory: AccessorySubcategory | null = await updateAccessorySubcategoryTitleRu(parseInt(req.params.subcategoryId) ,req.body);
    if (!updatedSubcategory) {
      return res.status(400).send(new RequestError(
        400, ErrorTypes.invalidUpdateDataError, 
        ErrorMessages.invalidUpdateDataError,
        ObjectTypes.accessorySubcategory,
        ));
    }
    return res.status(200).send(updatedSubcategory);
  });
      
  fastify.patch("/accessorySubcategory/update/titleUk/:subcategoryId", {}, async (req: any, res: FastifyReply) => {
    const accessorySubcategory: AccessorySubcategory | null = await getAccessorySubcategoryById(parseInt(req.params.subcategoryId));
    if (!accessorySubcategory) {
      return res.status(400).send(new RequestError(
        400, 
        ErrorTypes.notFoundError, 
        ErrorMessages.notFoundError,
        ObjectTypes.accessorySubcategory,
        ));
    }
    const updatedSubcategory: AccessorySubcategory | null = await updateAccessorySubcategoryTitleUk(parseInt(req.params.subcategoryId) ,req.body);
    if (!updatedSubcategory) {
      return res.status(400).send(new RequestError(
        400, ErrorTypes.invalidUpdateDataError, 
        ErrorMessages.invalidUpdateDataError,
        ObjectTypes.accessorySubcategory,
        ));
    }
    return res.status(200).send(updatedSubcategory);
  });
      
  fastify.patch("/accessorySubcategory/update/pictureUrl/:subcategoryId", {}, async (req: any, res: FastifyReply) => {
    const accessorySubcategory: AccessorySubcategory | null = await getAccessorySubcategoryById(parseInt(req.params.subcategoryId));
    if (!accessorySubcategory) {
      return res.status(400).send(new RequestError(
        400, 
        ErrorTypes.notFoundError, 
        ErrorMessages.notFoundError,
        ObjectTypes.accessorySubcategory,
        ));
    }
    const updatedSubcategory: AccessorySubcategory | null = await updateAccessorySubcategoryPictureUrl(parseInt(req.params.subcategoryId) ,req.body);
    if (!updatedSubcategory) {
      return res.status(400).send(new RequestError(
        400, ErrorTypes.invalidUpdateDataError, 
        ErrorMessages.invalidUpdateDataError,
        ObjectTypes.accessorySubcategory,
        ));
    }
    return res.status(200).send(updatedSubcategory);
  });
  
  fastify.patch("/accessory/update/nameRu/:accessoryId", {}, async (req: any, res: FastifyReply) => {
    const accessory: Accessory | null = await getAccessoryById(parseInt(req.params.accessoryId));
    if (!accessory) {
      return res.status(400).send(new RequestError(
        400, 
        ErrorTypes.notFoundError, 
        ErrorMessages.notFoundError,
        ObjectTypes.accessory,
        ));
    }
    const updatedAccessory: Accessory | null = await updateAccessoryNameRu(parseInt(req.params.accessoryId) ,req.body);
    if (!updatedAccessory) {
      return res.status(400).send(new RequestError(
        400, 
        ErrorTypes.invalidUpdateDataError, 
        ErrorMessages.invalidUpdateDataError,
        ObjectTypes.accessory
        ));
    }
    return res.status(200).send(updatedAccessory);
  });
  
  fastify.patch("/accessory/update/nameUk/:accessoryId", {}, async (req: any, res: FastifyReply) => {
    const accessory: Accessory | null = await getAccessoryById(parseInt(req.params.accessoryId));
    if (!accessory) {
      return res.status(400).send(new RequestError(
        400, 
        ErrorTypes.notFoundError, 
        ErrorMessages.notFoundError,
        ObjectTypes.accessory,
        ));
    }
    const updatedAccessory: Accessory | null = await updateAccessoryNameUk(parseInt(req.params.accessoryId) ,req.body);
    if (!updatedAccessory) {
      return res.status(400).send(new RequestError(
        400, 
        ErrorTypes.invalidUpdateDataError, 
        ErrorMessages.invalidUpdateDataError,
        ObjectTypes.accessory
        ));
    }
    return res.status(200).send(updatedAccessory);
  });
  
  fastify.patch("/accessory/update/titleRu/:accessoryId", {}, async (req: any, res: FastifyReply) => {
    const accessory: Accessory | null = await getAccessoryById(parseInt(req.params.accessoryId));
    if (!accessory) {
      return res.status(400).send(new RequestError(
        400, 
        ErrorTypes.notFoundError, 
        ErrorMessages.notFoundError,
        ObjectTypes.accessory,
        ));
    }
    const updatedAccessory: Accessory | null = await updateAccessoryTitleRu(parseInt(req.params.accessoryId) ,req.body);
    if (!updatedAccessory) {
      return res.status(400).send(new RequestError(
        400, 
        ErrorTypes.invalidUpdateDataError, 
        ErrorMessages.invalidUpdateDataError,
        ObjectTypes.accessory
        ));
    }
    return res.status(200).send(updatedAccessory);
  });
  
  fastify.patch("/accessory/update/titleUk/:accessoryId", {}, async (req: any, res: FastifyReply) => {
    const accessory: Accessory | null = await getAccessoryById(parseInt(req.params.accessoryId));
    if (!accessory) {
      return res.status(400).send(new RequestError(
        400, 
        ErrorTypes.notFoundError, 
        ErrorMessages.notFoundError,
        ObjectTypes.accessory,
        ));
    }
    const updatedAccessory: Accessory | null = await updateAccessoryTitleUk(parseInt(req.params.accessoryId) ,req.body);
    if (!updatedAccessory) {
      return res.status(400).send(new RequestError(
        400, 
        ErrorTypes.invalidUpdateDataError, 
        ErrorMessages.invalidUpdateDataError,
        ObjectTypes.accessory
        ));
    }
    return res.status(200).send(updatedAccessory);
  });
  
  
  fastify.patch("/accessory/update/descriptionRu/:accessoryId", {}, async (req: any, res: FastifyReply) => {
    const accessory: Accessory | null = await getAccessoryById(parseInt(req.params.accessoryId));
    if (!accessory) {
      return res.status(400).send(new RequestError(
        400, 
        ErrorTypes.notFoundError, 
        ErrorMessages.notFoundError,
        ObjectTypes.accessory,
        ));
    }
    const updatedAccessory: Accessory | null = await updateAccessoryDescriptionRu(parseInt(req.params.accessoryId) ,req.body);
    if (!updatedAccessory) {
      return res.status(400).send(new RequestError(
        400, 
        ErrorTypes.invalidUpdateDataError, 
        ErrorMessages.invalidUpdateDataError,
        ObjectTypes.accessory
        ));
    }
    return res.status(200).send(updatedAccessory);
  });
  
  
  fastify.patch("/accessory/update/descriptionUk/:accessoryId", {}, async (req: any, res: FastifyReply) => {
    const accessory: Accessory | null = await getAccessoryById(parseInt(req.params.accessoryId));
    if (!accessory) {
      return res.status(400).send(new RequestError(
        400, 
        ErrorTypes.notFoundError, 
        ErrorMessages.notFoundError,
        ObjectTypes.accessory,
        ));
    }
    const updatedAccessory: Accessory | null = await updateAccessoryDescriptionUk(parseInt(req.params.accessoryId) ,req.body);
    if (!updatedAccessory) {
      return res.status(400).send(new RequestError(
        400, 
        ErrorTypes.invalidUpdateDataError, 
        ErrorMessages.invalidUpdateDataError,
        ObjectTypes.accessory
        ));
    }
    return res.status(200).send(updatedAccessory);
  });

  fastify.patch("/accessory/update/shortCharacteristics/:accessoryId", {}, async (req: any, res: FastifyReply) => {
    const accessory: Accessory | null = await getAccessoryById(parseInt(req.params.accessoryId));
    if (!accessory) {
      return res.status(400).send(new RequestError(
        400, 
        ErrorTypes.notFoundError, 
        ErrorMessages.notFoundError,
        ObjectTypes.accessory,
        ));
    }
    const updatedAccessory: Accessory | null = await updateAccessoryShortChars(parseInt(req.params.accessoryId) ,req.body);
    if (!updatedAccessory) {
      return res.status(400).send(new RequestError(
        400, 
        ErrorTypes.invalidUpdateDataError, 
        ErrorMessages.invalidUpdateDataError,
        ObjectTypes.accessory
        ));
    }
    return res.status(200).send(updatedAccessory);
  });    

  fastify.patch("/accessory/update/longCharacteristicsRu/:accessoryId", {}, async (req: any, res: FastifyReply) => {
    const accessory: Accessory | null = await getAccessoryById(parseInt(req.params.accessoryId));
    if (!accessory) {
      return res.status(400).send(new RequestError(
        400, 
        ErrorTypes.notFoundError, 
        ErrorMessages.notFoundError,
        ObjectTypes.accessory,
        ));
    }
    const updatedAccessory: Accessory | null = await updateAccessoryLongCharsRu(parseInt(req.params.accessoryId) ,req.body);
    if (!updatedAccessory) {
      return res.status(400).send(new RequestError(
        400, 
        ErrorTypes.invalidUpdateDataError, 
        ErrorMessages.invalidUpdateDataError,
        ObjectTypes.accessory
        ));
    }
    return res.status(200).send(updatedAccessory);
  });


  fastify.patch("/accessory/update/longCharacteristicsUk/:accessoryId", {}, async (req: any, res: FastifyReply) => {
    const accessory: Accessory | null = await getAccessoryById(parseInt(req.params.accessoryId));
    if (!accessory) {
      return res.status(400).send(new RequestError(
        400, 
        ErrorTypes.notFoundError, 
        ErrorMessages.notFoundError,
        ObjectTypes.accessory,
        ));
    }
    const updatedAccessory: Accessory | null = await updateAccessoryLongCharsUk(parseInt(req.params.accessoryId) ,req.body);
    if (!updatedAccessory) {
      return res.status(400).send(new RequestError(
        400, 
        ErrorTypes.invalidUpdateDataError, 
        ErrorMessages.invalidUpdateDataError,
        ObjectTypes.accessory
        ));
    }
    return res.status(200).send(updatedAccessory);
  });


  fastify.patch("/accessory/update/configuration/:accessoryId", {}, async (req: any, res: FastifyReply) => {
    const accessory: Accessory | null = await getAccessoryById(parseInt(req.params.accessoryId));
    if (!accessory) {
      return res.status(400).send(new RequestError(
        400, 
        ErrorTypes.notFoundError, 
        ErrorMessages.notFoundError,
        ObjectTypes.accessory,
        ));
    }
    const updatedAccessory: Accessory | null = await updateAccessoryConfiguration(parseInt(req.params.accessoryId) ,req.body);
    if (!updatedAccessory) {
      return res.status(400).send(new RequestError(
        400, 
        ErrorTypes.invalidUpdateDataError, 
        ErrorMessages.invalidUpdateDataError,
        ObjectTypes.accessory
        ));
    }
    return res.status(200).send(updatedAccessory);
  });


  fastify.patch("/accessory/update/documents/:accessoryId", {}, async (req: any, res: FastifyReply) => {
    const accessory: Accessory | null = await getAccessoryById(parseInt(req.params.accessoryId));
    if (!accessory) {
      return res.status(400).send(new RequestError(
        400, 
        ErrorTypes.notFoundError, 
        ErrorMessages.notFoundError,
        ObjectTypes.accessory,
        ));
    }
    const updatedAccessory: Accessory | null = await updateAccessoryDocuments(parseInt(req.params.accessoryId) ,req.body);
    if (!updatedAccessory) {
      return res.status(400).send(new RequestError(
        400, 
        ErrorTypes.invalidUpdateDataError, 
        ErrorMessages.invalidUpdateDataError,
        ObjectTypes.accessory
        ));
    }
    return res.status(200).send(updatedAccessory);
  });

  fastify.delete("/accessoryCategory/delete/:categoryId", {}, async (req: any, res: FastifyReply) => {
    const category: AccessoryCategory | null = await deleteAccessoryCategory(parseInt(req.params.categoryId));
    if(!category) {
      return res.status(400).send(new RequestError(
        400, 
        ErrorTypes.notFoundError, 
        ErrorMessages.notFoundError,
        ObjectTypes.accessoryCategory,
        ));
    }
    return res.status(204).send();
  });
  
  fastify.delete("/accessorySubcategory/delete/:subcategoryId", {}, async (req: any, res: FastifyReply) => {
    const subcategory = await deleteAccessorySubcategory(parseInt(req.params.subcategoryId));
    if(!subcategory) {
      return res.status(400).send(new RequestError(
        400, 
        ErrorTypes.notFoundError, 
        ErrorMessages.notFoundError,
        ObjectTypes.accessorySubcategory,
        ));
    }
    return res.status(204).send();
  });
  
  fastify.delete("/product/delete/:productId", {}, async (req: any, res: FastifyReply) => {
    const accessory = await deleteAccessory(parseInt(req.params.productId));
    if(!accessory) {
        return res.status(400).send(new RequestError(
            400,
            ErrorTypes.notFoundError,
            ErrorMessages.notFoundError,
            ObjectTypes.accessory,
          ));
    }
    return res.status(204).send();
  });
};

export default accessories;
