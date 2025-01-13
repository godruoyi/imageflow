import { Config, Image, Input, Output } from "../types";
import fs from "fs";
import { saveStreamToFile, toImage } from "../support";

/**
 * Overwrite the origin image with the processed image.
 *
 * @param i
 * @param _config
 * @param _services
 * @param originImage
 */
export default async function (
  i: Input,
  _config: Config,
  _services: Record<string, Config>,
  originImage: Image,
): Promise<Output> {
  const stream = fs.createReadStream(i.image.value as string);

  const outputPath = await saveStreamToFile(stream, originImage.value);

  return { image: toImage(outputPath) } as Output;
}
