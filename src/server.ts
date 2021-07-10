import fastify from "fastify";
import fastifyCors from "fastify-cors";
import { join, resolve } from "path";
import accessories from "./routes/accessories";
import news from "./routes/news";
import products from "./routes/products";
import cookie from "fastify-cookie";

const server = fastify({ logger: true });

server.register(fastifyCors, { origin: true });
server.register(products, { prefix: "/products" });
server.register(accessories, { prefix: "/accessories" });
server.register(news, { prefix: "/news" });
server.register(require("fastify-static"), {
  root: join(resolve(__dirname, "../"), "static"),
});
server.register(cookie, {
  secret: "aloha",
});

export default server;
