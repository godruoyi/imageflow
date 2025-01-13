import { Config, Input, Output } from "../types";
import { download, upload } from "../services/tinypng";
import { saveStreamToTmpFile, toImage } from "../support";

export default async function (i: Input, config: Config, services: Record<string, Config>): Promise<Output> {
  const key = services?.["tinypng"]?.["apiKey"];
  if (!key) {
    throw new Error("TinyPNG key not configured, please check your workflow config file");
  }

  const url = await upload(i.image.value, key as string);
  const stream = await download(url);
  const tmp = await saveStreamToTmpFile(stream as NodeJS.ReadableStream, i.image.value);

  return { image: toImage(tmp) } as Output;
}
