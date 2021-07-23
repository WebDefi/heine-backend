import { outputFile, unlink } from "fs-extra";
import { resolve } from "path";

class FileService {
  public async createFile(filePath: string, base64Data: string) {
    try {
      await outputFile(filePath, base64Data, "base64");
      return true;
    } catch (err) {
      console.log(err);
      return { error: err };
    }
  }
  public async deleteFile(filePath: string) {
    try {
      await unlink(resolve(filePath));
      return true;
    } catch (err) {
      console.log(err);
      return { error: err };
    }
  }
}

export default new FileService();
