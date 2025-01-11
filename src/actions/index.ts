import resize from "./resize";
import { ActionFn } from "../types";
import format from "./format";
import upload from "./upload";

const actions = {
  resize: resize,
  format: format,
  upload: upload,
};

export default function resolveAction(name: string): ActionFn {
  if (name in actions) {
    return actions[name as keyof typeof actions];
  }

  throw new Error(`Action not found: ${name}`);
}
