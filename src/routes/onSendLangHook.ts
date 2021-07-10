import { FastifyReply, FastifyRequest } from "fastify";

const onSendGenericLangHandler = (
  req: FastifyRequest,
  rep: FastifyReply,
  payload: any,
  done: any
) => {
  const lang = req.cookies.lang ?? "uk";

  const staticLangRegxp = new RegExp("_ru|_uk", "gi");
  if (payload.length) {
    payload = payload.map((elObj: { [key: string]: any }) => {
      // payload = [ {}, {}, {}]
      Object.keys(elObj).forEach((key: string) => {
        if (staticLangRegxp.test(key)) {
          // title_ru == true title_uk == true
          if (new RegExp(`${lang}`).test(key)) {
            let tempValue = elObj[key];
            let tempNewKey = key.split("_")[0];
            delete elObj[key];
            elObj[tempNewKey] = tempValue;
          } else {
            delete elObj[key];
          }
        }
      });
      return elObj;
    });
  } else {
    Object.keys(payload).forEach((key: string) => {}); // payload = {}
  }
  Object.assign(rep, { payload });
  done();
};
