import { PathLike } from "fs";
import fs from "fs";

class FileService {
  public async createFile(
    filePath: PathLike,
    base64Data: string,
    writeErrorMethod: any
  ) {
    try {
      await fs.promises.writeFile(filePath, base64Data, "base64");
    } catch (err) {
      console.log(err);
      return writeErrorMethod();
    }
  }
  public async deleteFile(filePath: PathLike, writeErrorMethod: any) {
    try {
      await fs.promises.unlink(filePath);
    } catch (err) {
      console.log(err);
      return writeErrorMethod();
    }
  }
}

export default new FileService();
