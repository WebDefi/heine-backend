import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const createNewsPost = async function (data: any) {
  return await prisma.newsPost
    .create({
      data: { ...data },
    })
    .catch((error: any) => {
      return error.message;
    });
};

const getNewsPost = async function (newsPostId: number) {
  return await prisma.newsPost.findUnique({
    where: {
      id: newsPostId,
    },
  });
};

const getAllNewsPosts = async function () {
  return await prisma.newsPost.findMany({});
};

const updateNewsPostTitle = async function (newsPostId: number, title: string) {
  return await prisma.newsPost.update({
    where: {
      id: newsPostId,
    },
    data: {
      title: title,
    },
  });
};

const updateNewsPostText = async function (newsPostId: number, text: string) {
  return await prisma.newsPost.update({
    where: {
      id: newsPostId,
    },
    data: {
      text: text,
    },
  });
};

const deleteNewsPost = async function (newPostId: number) {
  return await prisma.newsPost.delete({
    where: {
      id: newPostId,
    },
  });
};

export {
  createNewsPost,
  getNewsPost,
  getAllNewsPosts,
  updateNewsPostTitle,
  updateNewsPostText,
  deleteNewsPost,
};
