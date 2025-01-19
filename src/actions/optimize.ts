import { Config, Input, Output } from "../types";
import tinypng from "../services/tinypng";
import { saveStreamToTmpFile, toImage } from "../support";

export default async function (i: Input, config: Config, services: Record<string, Config>): Promise<Output> {
  const key = services?.["tinypng"]?.["apiKey"];
  if (!key) {
    throw new Error("TinyPNG key not configured, please check your workflow config file");
  }

  const t = config?.["type"] ?? "sharp";
  return await (t.toLocaleString() === "sharp" ? optimizeSharp : optimizeByTiny)(i, "");
}

async function optimizeByTiny(i: Input, key: string): Promise<Output> {
  const url = await tinypng.upload(i.image.value, key);
  const stream = await tinypng.download(url);
  const tmp = await saveStreamToTmpFile(stream as NodeJS.ReadableStream, i.image.value);

  return { image: toImage(tmp) } as Output;
}

async function optimizeSharp(): Promise<Output> {}
