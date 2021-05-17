import fastify from "fastify";
import fastifyCors from "fastify-cors";
import accessories from "./routes/accessories";
import news from "./routes/news";
import products from "./routes/products";

const server = fastify({ logger: true });

server.register(fastifyCors, { origin: true });
server.register(products, { prefix: "/products" });
server.register(accessories, { prefix: "/accessories" });
server.register(news, { prefix: "/news" });

export default server;
