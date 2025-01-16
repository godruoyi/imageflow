import { Config, Image, Input, Output } from "../types";
import path from "path";
import sharp from "sharp";

export default async function (
  i: Input,
  config: Config,
  _services: Record<string, Config>,
  originImage: Image,
): Promise<Output> {
  const format = config?.["format"] as string;
  const options = config?.["options"] as sharp.JpegOptions | sharp.PngOptions | sharp.WebpOptions | sharp.AvifOptions;

  // const image = fs.createReadStream(i.image.value);
  const newPath = path.join(
    path.dirname(originImage.value),
    path.basename(originImage.value, path.extname(originImage.value)) + "." + format?.toLocaleString(),
  );

  console.log("Image has been formatted to", format, "and saved to", newPath);

  await sharp(originImage.value)
    .toFormat(format as keyof sharp.FormatEnum, options)
    .toFile(newPath);

  return i as Output;

  // todo: fix cannot find module sharp even though it is installed
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
