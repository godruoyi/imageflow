import { Config, Imager, Input, Output } from "../types";

/**
 * Convert the image to a different format
 *
 * @param i Input
 * @param _config
 * @param _services
 * @param _originImage
 */
export default async function (
  i: Input,
  _config: Config,
  _services: Record<string, Config>,
  _originImage: Imager,
): Promise<Output> {
  switch (i.type) {
    case "filepath":
      return;
    case "url":
      return { type: "filepath", value: i.value } as Output;
    default:
      throw new Error("unsupported input type in convert action");
  }
}

function convertFilepathImageFormat() {}

function convertURLImageFormat(url: string, newformat) {}
