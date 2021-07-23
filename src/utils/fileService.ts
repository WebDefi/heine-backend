import { PathLike } from "fs";
import { outputFile, unlink } from "fs-extra";

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
  public async deleteFile(filePath: PathLike) {
    try {
      await unlink(filePath);
      return true;
    } catch (err) {
      console.log(err);
      return { error: err };
    }
  }
}

export default new FileService();
