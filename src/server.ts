import fastify from "fastify";
import fastifyCors from "fastify-cors";
import accessories from "./routes/accessories";
import news from "./routes/news";
import products from "./routes/products";

const server = fastify({ logger: false });

server.register(fastifyCors, { origin: true });
server.register(products, { prefix: "/products" });
server.register(accessories, { prefix: "/accessories" });
server.register(news, { prefix: "/news" });
server.register(require("fastify-swagger"), {
  prefix: "swagger",
  swagger: {
    info: {
      title: "Swagger for API integratoin",
      description: "testing the fastify swagger api",
      version: "0.1.0",
    },
    host: "localhost",
    schemes: ["https"],
    consumes: ["application/json"],
    produces: ["application/json"],
  },
  exposeRoute: true,
});

export default server;
