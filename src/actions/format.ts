import { Config, Imager, Input, Output } from "../types";
import path from "path";
import { toImage, toInput } from "../support";

/**
 * Format
 *
 * @param i
 * @param config
 * @param _services
 * @param originImage
 */
export default async function (
  i: Input,
  config: Config,
  _services: Record<string, Config>,
  originImage: Imager,
): Promise<Output> {
  console.log("TODO: cannot load share module");

  const format = config?.["format"] as string;

  // const image = fs.createReadStream(i.image.value);
  const originImagePath = originImage.get().value;
  const newPath = path.join(
    path.dirname(originImagePath),
    path.basename(originImagePath, path.extname(originImagePath)) + "." + format?.toLocaleString(),
  );

  console.log("Image has been formatted to", format, "and saved to", newPath);

  originImage.set(toImage(newPath));

  return toInput(newPath) as Output;
}
