import { FastifyInstance, FastifyPluginCallback } from "fastify";
import {
  createNewsPost,
  deleteNewsPost,
  getAllNewsPosts,
  getNewsPost,
  updateNewsPostText,
  updateNewsPostTitle,
} from "../queries/newsPosts";
import { ErrorMessages, ErrorTypes, ObjectTypes } from "../utils/constants";
import { RequestError } from "../utils/requestError";

const news: FastifyPluginCallback = async function (fastify: FastifyInstance) {
  fastify.put("/create", {}, async (req, res) => {
    const newsPost = await createNewsPost(req.body);
    if (!newsPost) {
      res.status(400).send(new RequestError(
          400,
          ErrorTypes.invalidCreationDataError,
          ErrorMessages.invalidCreationDataError,
          ObjectTypes.newsPost,
        ));
    }
    res.status(200).send(newsPost);
  });

  fastify.get("/", {}, async (_req, res) => {
    const newsPosts = await getAllNewsPosts();
    if (!newsPosts) {
      res.status(400).send(new RequestError(
          400,
          ErrorTypes.invalidCreationDataError,
          ErrorMessages.notFoundError,
          ObjectTypes.newsPost,
        ));
    }
    return res.status(200).send(newsPosts);
  });

  fastify.get("/:newsPostId", {}, async (req: any, res: any) => {
    const newsPost = await getNewsPost(parseInt(req.params.newsPostId));
    if (!newsPost) {
      res.status(400).send(new RequestError(
        400,
        ErrorTypes.notFoundError,
        ErrorMessages.notFoundError,
        ObjectTypes.newsPost,
      ));
    }
    return res.status(200).send(newsPost);
  });

  fastify.post("/update/title/:newsPostId", {}, async (req: any, res: any) => {
    const newsPost = await getNewsPost(parseInt(req.params.newsPostId));
    if (!newsPost) {
      return res.status(400).send(new RequestError(
          400,
          ErrorTypes.notFoundError,
          ErrorMessages.notFoundError,
          ObjectTypes.newsPost,
        ));
    }
    const updatedNewsPost = await updateNewsPostTitle(
      req.params.newsPostId,
      req.body.title
    );
    if (!updatedNewsPost) {
      return res.status(400).send(new RequestError(
          400,
          ErrorTypes.invalidCreationDataError,
          ErrorMessages.invalidCreationDataError,
          ObjectTypes.newsPost,
        ));
    }
    return res.status(200).send(updatedNewsPost);
  });

  fastify.patch("/update/text/:newsPostId", {}, async (req: any, res: any) => {
    const newsPost = await getNewsPost(parseInt(req.params.newsPostId));
    if (!newsPost) {
      return res.status(400).send(new RequestError(
          400,
          ErrorTypes.notFoundError,
          ErrorMessages.notFoundError,
          ObjectTypes.newsPost,
        ));
    }
    const updatedNewsPost = await updateNewsPostText(
      req.params.newsPostId,
      req.body.text
    );
    if (!updatedNewsPost) {
      return res.status(400).send(new RequestError(
          400,
          ErrorTypes.invalidCreationDataError,
          ErrorMessages.invalidCreationDataError,
          ObjectTypes.newsPost,
        ));
    }
    return res.status(200).send(updatedNewsPost);
  });

  fastify.delete("/:newsPostId/delete", {}, async (req: any, res: any) => {
    const newsPost = await getNewsPost(req.params.newsPostId);
    if (!newsPost) {
      return res.status(400).send(new RequestError(
          400,
          ErrorTypes.notFoundError,
          ErrorMessages.notFoundError,
          ObjectTypes.newsPost,
        ));
    }
    const deletedNewsPost = await deleteNewsPost(req.params.newsPostId);
    if (!deletedNewsPost) {
      return res.status(400).send(new RequestError(
          400,
          ErrorTypes.notFoundError,
          ErrorMessages.notFoundError,
          ObjectTypes.newsPost,
        ));
    }
    return res.status(204).send(deleteNewsPost);
  });
};

export default news;
