import { Config, Configs, Input, Output } from "../types";
import { upload } from "../services/tinypng";

export default async function (i: Input, config: Config, configs: Configs): Promise<Output> {
  const key = configs.services?.["tinypng"]?.["key"];
  if (!key) {
    throw new Error("TinyPNG key not configured, please check your workflow config file");
  }

  const x = await Promise.all(i.images.map((image) => upload(image, key as string)));

  console.log(x);

  return { images: ["format"] } as Output;
}
