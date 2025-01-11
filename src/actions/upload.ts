import { Config, Input, Output } from "../types";

export default async function (i: Input, config: Config): Promise<Output> {
  console.log("upload image with: ", config);

  return { images: ["upload"] } as Output;
}
