import resize from "./resize";
import { ActionFn } from "../types";
import upload from "./upload";
import overwrite from "./overwrite";
import convert from "./convert";

const actions = {
  resize: resize,
  convert: convert,
  upload: upload,
  overwrite: overwrite,
};

export default function resolveAction(name: string): ActionFn {
  if (name in actions) {
    return actions[name as keyof typeof actions];
  }

  throw new Error(`Action not found: ${name}`);
}
