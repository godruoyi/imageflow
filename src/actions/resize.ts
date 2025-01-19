import { Config, Input, Output } from "../types";
import tinypng from "../services/tinypng";
import { saveStreamToTmpFile, toImage } from "../support";

/**
 * Resize image with TinyPNG
 *
 * @param i the input must be an image path
 * @param config
 * @param services
 *
 * @returns the output is an image path
 */
export default async function (i: Input, config: Config, services: Record<string, Config>): Promise<Output> {
  const key = services?.["tinypng"]?.["apiKey"];
  if (!key) {
    throw new Error("TinyPNG key not configured, please check your workflow config file");
  }

  const url = await tinypng.upload(i.image.value, key as string);
  const stream = await tinypng.downloadAndResize(url, key as string, {
    method: config?.["type"] as string,
    width: config?.["width"] as number,
    height: config?.["height"] as number,
  });

  const tmp = await saveStreamToTmpFile(stream as NodeJS.ReadableStream, i.image.value);

  return { image: toImage(tmp) } as Output;
}
