import { Config, Configs, Input, Output } from "../types";
import { downloadAndResize, upload } from "../services/tinypng";

export default async function (i: Input, config: Config, configs: Configs): Promise<Output> {
  const key = configs.services?.["tinypng"]?.["apiKey"];
  if (!key) {
    throw new Error("TinyPNG key not configured, please check your workflow config file");
  }

  const urls = await Promise.all(i.images.map((image) => upload(image, key as string)));
  const xxx = await Promise.all(
    urls.map((u) =>
      downloadAndResize(u, key as string, {
        method: config?.["type"] as string,
        width: config?.["width"] as number,
        height: config?.["height"] as number,
      }),
    ),
  );

  return { images: ["resize"] } as Output;
}
