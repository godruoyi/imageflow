import { Config, Image, Imager, Input, Output } from "../types";
import tinypng from "../services/tinypng";

/**
 * Convert the image to a different format
 *
 * @param i Input
 * @param config
 * @param services
 * @param originImage
 */
export default async function (
  i: Input,
  config: Config,
  services: Record<string, Config>,
  originImage: Imager,
): Promise<Output> {
  const key = services?.["tinypng"]?.["apiKey"] as string;
  const privateUrl = await tinypng.upload(i as Image, key);
  const x = await tinypng.convert(privateUrl, key, { type: "" });
}
