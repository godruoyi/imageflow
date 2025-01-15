import { Config, Image, Input, Output } from "../types";
import fs from "fs";
import sharp from "sharp";
import path from "path";

export default async function(
  i: Input,
  config: Config,
  _services: Record<string, Config>,
  originImage: Image
): Promise<Output> {
  const format = config?.["format"] as string;
  const options = config?.["options"] as
    | sharp.OutputOptions
    | sharp.JpegOptions
    | sharp.PngOptions
    | sharp.WebpOptions
    | sharp.AvifOptions
    | sharp.HeifOptions
    | sharp.JxlOptions
    | sharp.GifOptions
    | sharp.Jp2Options
    | sharp.TiffOptions;

  // const image = fs.createReadStream(i.image.value);
  const newPath = path.join(
    path.dirname(originImage.value),
    path.basename(originImage.value, path.extname(originImage.value)) + "." + format?.toLocaleString()
  );

  await sharp(i.image.value)
    .toFormat(format as keyof sharp.FormatEnum, options)
    .toFile(newPath);

  console.log("Image has been formatted to", format, "and saved to", newPath);

  return i as Output;

  // const writeStream = fs.createWriteStream(originImage.value);
  // const transformer = sharp().toFormat(format as keyof sharp.FormatEnum, options);
  //
  // return new Promise((resolve, reject) => {
  //   image.pipe(transformer).pipe(writeStream);
  //
  //   writeStream.on("finish", () => {
  //     resolve({ image: originImage } as Output);
  //   });
  //   writeStream.on("error", reject);
  // });
}
