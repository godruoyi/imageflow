import { Config, Imager, Input, Output } from "../types";
import fs from "fs";
import { saveStreamToFile, toImage, toInput } from "../support";

/**
 * Overwrite the origin image with the processed image.
 *
 * @param i input, must be full image path
 * @param _config
 * @param _services
 * @param originImage
 */
export default async function (
  i: Input,
  _config: Config,
  _services: Record<string, Config>,
  originImage: Imager,
): Promise<Output> {
  const inputPath = i.image.value;
  const originPath = originImage.get().value;

  if (inputPath == originPath) {
    console.log("Skip Overwrite since origin image path same with processed image");

    return toInput(originPath) as Output;
  }

  const stream = fs.createReadStream(i.image.value as string);
  await saveStreamToFile(stream, originImage.get().value);

  return toInput(originPath) as Output;
}
