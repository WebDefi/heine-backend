import { ErrorTypes, ObjectTypes } from "./constants";

export class RequestError {
  statusCode: number;
  type: ErrorTypes;
  message: string;
  object: ObjectTypes
  time: number;

  constructor(statusCode: number, type: ErrorTypes, message: string, object: ObjectTypes) {
    this.statusCode = statusCode;
    this.type = type;
    this.message = message;
    this.object = object;
    this.time = Date.now();
  }
}
