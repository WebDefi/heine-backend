import { FastifyInstance, FastifyPluginCallback } from "fastify";
import {
  createNewsPost,
  deleteNewsPost,
  getAllNewsPosts,
  getNewsPost,
  updateNewsPostText,
  updateNewsPostTitle,
} from "../queries/newsPosts";
import { ErrorMessages, ErrorTypes } from "../utils/constants";
import { RequestError } from "../utils/requestError";

const news: FastifyPluginCallback = async function (fastify: FastifyInstance) {
  fastify.put("/create", {}, async (req, res) => {
    const newsPost = await createNewsPost(req.body);
    if (!newsPost) {
      res.send(
        new RequestError(
          400,
          ErrorTypes.invalidNewsPostDataError,
          ErrorMessages.invalidNewsPostDataError
        )
      );
      res.status(200).send(newsPost);
    }
  });

  fastify.get("/", {}, async (_req, res) => {
    const newsPosts = await getAllNewsPosts();
    if (!newsPosts) {
      res.send(
        new RequestError(
          400,
          ErrorTypes.invalidNewsPostDataError,
          ErrorMessages.newsPostsNotFoundError
        )
      );
    }
    return res.status(200).send(newsPosts);
  });

  fastify.get("/:newsPostId", {}, async (req: any, res: any) => {
    const newsPost = await getNewsPost(parseInt(req.params.newsPostId));
    if (!newsPost) {
      new RequestError(
        400,
        ErrorTypes.subcategoriesNotFoundError,
        ErrorMessages.subcategoriesNotFoundError
      );
    }
    return res.status(200).send(newsPost);
  });

  fastify.post("/:newsPostId/title", {}, async (req: any, res: any) => {
    const newsPost = await getNewsPost(parseInt(req.params.newsPostId));
    if (!newsPost) {
      return res.send(
        new RequestError(
          400,
          ErrorTypes.newsPostNotFoundError,
          ErrorMessages.newsPostsNotFoundError
        )
      );
    }
    const updatedNewsPost = await updateNewsPostTitle(
      req.params.newsPostId,
      req.body.title
    );
    if (!updatedNewsPost) {
      return res.send(
        new RequestError(
          400,
          ErrorTypes.invalidNewsPostDataError,
          ErrorMessages.invalidNewsPostDataError
        )
      );
    }
    return res.status(200).send(updatedNewsPost);
  });

  fastify.post("/:newsPostId/text", {}, async (req: any, res: any) => {
    const newsPost = await getNewsPost(parseInt(req.params.newsPostId));
    if (!newsPost) {
      return res.send(
        new RequestError(
          400,
          ErrorTypes.newsPostNotFoundError,
          ErrorMessages.newsPostsNotFoundError
        )
      );
    }
    const updatedNewsPost = await updateNewsPostText(
      req.params.newsPostId,
      req.body.text
    );
    if (!updatedNewsPost) {
      return res.send(
        new RequestError(
          400,
          ErrorTypes.invalidNewsPostDataError,
          ErrorMessages.invalidNewsPostDataError
        )
      );
    }
    return res.status(200).send(updatedNewsPost);
  });

  fastify.delete("/:newsPostId/delete", {}, async (req: any, res: any) => {
    const newsPost = await getNewsPost(req.params.newsPostId);
    if (!newsPost) {
      return res.send(
        new RequestError(
          400,
          ErrorTypes.newsPostNotFoundError,
          ErrorMessages.newsPostsNotFoundError
        )
      );
    }
    const deletedNewsPost = await deleteNewsPost(req.params.newsPostId);
    if (!deletedNewsPost) {
      return res.send(
        new RequestError(
          400,
          ErrorTypes.newsPostNotFoundError,
          ErrorMessages.newsPostsNotFoundError
        )
      );
    }
    return res.status(204).send(deleteNewsPost);
  });
};

export default news;
