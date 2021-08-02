import { FastifyReply, FastifyRequest } from "fastify";

export const onSendGenericLangHandler = (
  req: FastifyRequest,
  _rep: FastifyReply,
  payload: any,
  done: any
) => {
  const err = null;
  const lang = req.cookies.lang ?? "uk";
  payload = JSON.parse(payload);
  if (payload.length) {
    payload = payload.map((elObj: { [key: string]: any }) => {
      Object.keys(elObj).forEach((key: string) => {
        if (/_ru|_uk/.test(key)) {
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
    Object.keys(payload).forEach((key: string) => {
      if (/_ru|_uk/.test(key)) {
        if (new RegExp(`${lang}`).test(key)) {
          let tempValue = payload[key];
          let tempNewKey = key.split("_")[0];
          delete payload[key];
          payload[tempNewKey] = tempValue;
        } else {
          delete payload[key];
        }
      }
    });
  }
  payload = JSON.stringify(payload);
  done(err, payload);
};
