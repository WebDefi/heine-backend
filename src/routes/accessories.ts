import { Accessory, AccessoryCategory, AccessorySubcategory } from "@prisma/client";
import { FastifyInstance, FastifyPluginCallback, FastifyReply } from "fastify";
import {
  createAccessory,
  deleteAccessory,
  getAccessoryById,
  getAllAccessoriesByAccessorySubcategoryId,
  updateAccessory,
  updateAccessoryConfiguration,
  updateAccessoryDocuments,
  updateAccessoryShortChars,
} from "../queries/accessories";
import { 
  createAccessoryCategory, 
  deleteAccessoryCategory, 
  getAccessoryCategoryById, 
  getAllAccessoryCategories,
  updateAccessoryCategory
} from "../queries/accessoryCategories";
import { 
  createAccessorySubcategory, 
  deleteAccessorySubcategory, 
  getAccessorySubcategoryById, 
  getAllAccessorySubcategoriesByCategoryId,
  updateAccessorySubcategory
} from "../queries/accessorySubcategories";
import { ErrorMessages, ErrorTypes, ObjectTypes } from "../utils/constants";
import { RequestError } from "../utils/requestError";
import { onSendGenericLangHandler } from "./onSendLangHook";
import { join, resolve } from "path";
import dataService from "../utils/dataService";
import fileService from "../utils/fileService";

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

const accessories: FastifyPluginCallback = async function (
  fastify: FastifyInstance
) {
  fastify.put("/accessoryCategory/create", {}, async (req: any, res: FastifyReply) => {
    const imgBase64 = req.body.picture64;
    delete req.body["picture64"];
    const accessoryCategory = await createAccessoryCategory(req.body);
    if (!accessoryCategory) {
      return sendError(
        res,
        400,
        ErrorTypes.invalidCreationDataError,
        ErrorMessages.invalidCreationDataError,
        ObjectTypes.accessoryCategory
      );
    } else {
      const fileName = req.body.pictureUrl;
      await updateAccessoryCategory(accessoryCategory.id, {picture_url: dataService.imageUrlHandler(fileName, ObjectTypes.accessoryCategory, accessoryCategory.id)});
      const result: any = await fileService.createFile(
        join(
          resolve(__dirname, "../../"),
          `static/img/${ObjectTypes.accessoryCategory}/${accessoryCategory.id}/${fileName}`
        ),
        imgBase64
      );

      if (result.error) {
        return res.status(400).send({ error: result.err });
      }
    }
    return res.status(200).send(accessoryCategory);
  });

  fastify.put("/accessorySubcategory/create", {}, async (req: any, res: FastifyReply) => {
    const imgBase64 = req.body.picture64;
    delete req.body["picture64"];
    const accessorySubcategory = await createAccessorySubcategory(req.body);
    if (!accessorySubcategory) {
      return sendError(
        res,
        400,
        ErrorTypes.invalidCreationDataError,
        ErrorMessages.invalidCreationDataError,
        ObjectTypes.accessorySubcategory
      );
    } else {
      const fileName = req.body.pictureUrl;
      await updateAccessorySubcategory(accessorySubcategory.id, {picture_url: dataService.imageUrlHandler(fileName, ObjectTypes.accessorySubcategory, accessorySubcategory.id)});
      const result: any = await fileService.createFile(
        join(
          resolve(__dirname, "../../"),
          `static/img/${ObjectTypes.accessorySubcategory}/${accessorySubcategory.id}/${fileName}`
        ),
        imgBase64
      );

      if (result.error) {
        return res.status(400).send({ error: result.err });
      }
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

  fastify.get("/", {onSend: onSendGenericLangHandler}, async (_req, res) => {
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
  return lang == 'ru' ? nameRu : nameUk;
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
    const lang = req.cookies.lang ?? "uk";
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
      accessorySubcategories[i] = dataService.langParse(accessorySubcategories[i], lang);
      let accessories = await getAllAccessoriesByAccessorySubcategoryId(accessorySubcategories[i].id);
      accessories.forEach((item, key, array) => array[key] = dataService.langParse(item, lang));
      accessorySubcategories[i] = { 
        subcategory: accessorySubcategories[i], 
        products: accessories,
      }
    }
    return res.status(200).send({ accessorySubcategories });
  });

  fastify.get("/accessorySubcategory/:subcategoryId", {}, async (req: any, res: FastifyReply) => {
      const lang = req.cookies.lang ?? "uk";
      let accessorySubcategory: AccessorySubcategory | null = await getAccessorySubcategoryById(parseInt(req.params.subcategoryId));
      if (!accessorySubcategory) {
        return res.status(400).send(new RequestError(
            400,
            ErrorTypes.notFoundError,
            ErrorMessages.notFoundError,
            ObjectTypes.accessorySubcategory,
          ));
      }
      accessorySubcategory = dataService.langParse(accessorySubcategory, lang);
      const accessories: Accessory[] = await getAllAccessoriesByAccessorySubcategoryId(parseInt(req.params.subcategoryId));
      if (!accessories) {
        return res.status(400).send(new RequestError(
            400,
            ErrorTypes.notFoundError,
            ErrorMessages.notFoundError,
            ObjectTypes.accessory,
          ));
      }
      accessories.forEach((item, key, array) => array[key] = dataService.langParse(item, lang));
      return res.status(200).send({ accessorySubcategory, accessories });
    }
  );

  fastify.get("/accessory/:accessoryId", {}, async (req: any, res: FastifyReply) => {
    const lang = req.cookies.lang ?? "uk";
    let accessory: Accessory | null = await getAccessoryById(parseInt(req.params.accessoryId));
    if (!accessory) {
      return res.status(400).send(new RequestError(
        400, 
        ErrorTypes.notFoundError, 
        ErrorMessages.notFoundError,
        ObjectTypes.accessory,
        ));
    }
    accessory = dataService.langParse(accessory, lang);
    return res.status(200).send(accessory);
  }
);

fastify.patch(
    "/accessoryCategory/update/:categoryId",
    {},
    async (req: any, res: FastifyReply) => {
      const category: AccessoryCategory | null = await getAccessoryCategoryById(
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
              ObjectTypes.accessoryCategory
            )
          );
      }
      const updatedCategory: AccessoryCategory | null = await updateAccessoryCategory(
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
              ObjectTypes.accessoryCategory
            )
          );
      }
      return res.status(200).send(updatedCategory);
    }
  );

  fastify.patch(
    "/accessorySubcategory/update/:subcategoryId",
    {},
    async (req: any, res: FastifyReply) => {
      const subcategory: AccessorySubcategory | null = await getAccessorySubcategoryById(
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
              ObjectTypes.accessorySubcategory
            )
          );
      }
      const updatedSubcategory: AccessorySubcategory | null = await updateAccessorySubcategory(
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
              ObjectTypes.accessorySubcategory
            )
          );
      }
      return res.status(200).send(updatedSubcategory);
    }
  );

  fastify.patch(
    "/product/update/:accessoryId",
    {},
    async (req: any, res: FastifyReply) => {
      const accessory: Accessory | null = await getAccessoryById(
        parseInt(req.params.accessoryId)
      );
      if (!accessory) {
        return res
          .status(400)
          .send(
            new RequestError(
              400,
              ErrorTypes.notFoundError,
              ErrorMessages.notFoundError,
              ObjectTypes.accessory,
            )
          );
      }
      const updatedAccessory: Accessory | null = await updateAccessory(
        parseInt(req.params.accessoryId),
        req.body
      );
      if (!updateAccessory) {
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
      return res.status(200).send(updateAccessory);
    }
  );

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
  
  fastify.delete("/accessory/delete/:accessoryId", {}, async (req: any, res: FastifyReply) => {
    const accessory = await deleteAccessory(parseInt(req.params.accessoryId));
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
