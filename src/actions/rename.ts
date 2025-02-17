import { Config, Input, Output } from "../types";
import path from "path";
import { saveStreamToFile } from "../supports/file";
import fs from "fs";

export default async function (i: Input, config: Config): Promise<Output> {
  const to = config?.["to"] as string;
  const filename = formatFileName(to, i.value);
  const inputFileName = path.basename(i.value);

  if (inputFileName === filename) {
    return i as Output;
  }

  const newfile = i.value.replace(path.basename(i.value), filename);
  await saveStreamToFile(fs.createReadStream(i.value), newfile);

  fs.unlinkSync(i.value);

  return { type: "filepath", value: newfile } as Output;
}

function formatFileName(to: string, image: string): string {
  // todo

  return path.basename(image);
}
