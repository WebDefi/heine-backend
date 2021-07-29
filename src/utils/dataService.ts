import dotenv from "dotenv";
import { ObjectTypes } from "./constants";

class DataService {
  constructor() {
    dotenv.config();
  }
  public langParse(obj: any, lang: string) {
    for (let key in obj) {
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
  public getNameByLang(nameRu: string, nameUk: string, lang: string) {
    return lang == "uk" ? nameUk : nameRu;
  }
  public imageUrlHandler(obj: any, type: ObjectTypes) {
    for (let key in obj) {
      if (key == "pictureUrl") {
        obj[key] = `http://${"116.202.243.73"}:${"3000"}/img/${type.toLocaleLowerCase()}/${obj["id"]}/${obj[key]}`;
      }
    }
    return obj;
  }
  public beautifyObj(obj: any, lang: string, type: ObjectTypes) {
    obj = this.langParse(obj, lang), this.imageUrlHandler(obj, type);
    return obj;
  }
}

export default new DataService;