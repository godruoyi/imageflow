import { Config, Input, Output } from "../types";

export default async function (i: Input, config: Config): Promise<Output> {
  console.log("upload image with: ", config, i);

  return i as Output;
}
