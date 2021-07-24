import dotenv from "dotenv";
import { ObjectTypes } from "./constants";

class DataService {
  constructor() {
    dotenv.config();
  }
  public langParse(obj: any, lang: string) {
    for(let key in obj) {
        if (/_ru|_uk/.test(key)) {
          if (new RegExp(`${lang}`).test(key)) {
            let newKey = key.split('_')[0];
            Object.assign(obj, {[newKey]: obj[key]});
            delete obj[key];
          } else {
            delete obj[key];
          }
        }
    }
    return obj;
  }
  public getNameByLang(nameRu: string, nameUk: string, lang: string) : string {
    return lang == "uk" ? nameUk : nameRu;
  }
  public imageUrlHandler(imageUrl: string, object: ObjectTypes, id: number) : string {
    return `http://${process.env.HOST}:${process.env.PORT}/img/${object.toLocaleLowerCase()}/${id}/${imageUrl}`;
  }
}

export default new DataService;