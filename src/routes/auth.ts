import { FastifyInstance, FastifyPluginCallback, FastifyReply } from "fastify";

const auth: FastifyPluginCallback = async (fastify: FastifyInstance) => {
  fastify.post("/authenticate", async (req: any, res: FastifyReply) => {
    let user: string = req.body.user;
    let password: string = req.body.password;
    if (user === process.env.AUTH_USER && password === process.env.AUTH_PASS) {
      let token = Buffer.from(`${user}:${password}`).toString("base64");
      res.status(200).send({ token });
    } else {
      res.status(403).send({ error: "Invalid credentials" });
    }
  });
};

const authHook = async (req: any, res: any, done: any) => {
  if (req.method != "GET") {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = Buffer.from(token, "base64").toString("ascii");
    const [user, password] = decodedToken.split(":");
    if (user === process.env.AUTH_USER && password === process.env.AUTH_PASS) {
      done();
    } else {
      res.status(403).send({ error: "Invalid credentials" });
    }
  } else {
    done();
  }
};

export default auth;
export { authHook };
