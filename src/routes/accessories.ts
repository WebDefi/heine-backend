import { Accessory } from ".prisma/client";
import { FastifyInstance, FastifyPluginCallback } from "fastify";
import {
  createAccessory,
  getAllAccessorysByAccessorySubcategoryId,
} from "../queries/accessories";
import { getAllAccessoryCategories } from "../queries/accessoryCategories";
import { getAllAccessorySubcategoriesByCategoryId } from "../queries/accessorySubcategories";
import { ErrorMessages, ErrorTypes } from "../utils/constants";
import { RequestError } from "../utils/requestError";

const accessories: FastifyPluginCallback = async function (
  fastify: FastifyInstance
) {
  fastify.put("/accessory/create", {}, async (req, res) => {
    const accessory = await createAccessory(req.body);
    if (!accessory) {
      res.send(
        new RequestError(
          400,
          ErrorTypes.invalidAccessoryDataError,
          ErrorMessages.invalidAccessoryDataError
        )
      );
    }
    return res.status(200).send(accessory);
  });
  fastify.get("/", {}, async (_req, res) => {
    const accessoryCategories = await getAllAccessoryCategories();
    if (!accessoryCategories) {
      res.send(
        new RequestError(
          400,
          ErrorTypes.categoriesNotFoundError,
          ErrorMessages.categoriesNotFoundError
        )
      );
    }
    return res.status(200).send(accessoryCategories);
  });

  fastify.get("/:categoryId", {}, async (req: any, res: any) => {
    const subcategories = await getAllAccessorySubcategoriesByCategoryId(
      parseInt(req.params.categoryId)
    );
    if (!subcategories) {
      new RequestError(
        400,
        ErrorTypes.subcategoriesNotFoundError,
        ErrorMessages.subcategoriesNotFoundError
      );
    }
    const accessories: Accessory[] = [];
    for (let i = 0; i < subcategories.length; i++) {
      accessories.concat(
        await getAllAccessorysByAccessorySubcategoryId(subcategories[i].id)
      );
    }
    return res.status(200).send({ subcategories, accessories });
  });
};

export default accessories;
