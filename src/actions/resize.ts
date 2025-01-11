import { Config, Input, Output } from "../types";

export default async function (i: Input, config: Config): Promise<Output> {
  console.log("resize image with: ", config);

  return { images: ["resize"] } as Output;
}
