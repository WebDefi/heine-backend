export const langParse = function(obj: any, lang: string) {
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