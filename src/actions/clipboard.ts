import { Input, Output } from "../types";
import { Clipboard } from "@raycast/api";

/**
 * Copy the input to clipboard.
 *
 * @param i image file path or url
 *
 * @return the input itself
 */
export default async function (i: Input): Promise<Output> {
  if (i.type === "url") {
    await Clipboard.copy(i.value);
  } else if (i.type === "filepath") {
    const fileContent: Clipboard.Content = { file: i.value };
    await Clipboard.copy(fileContent);
  }

  return i as Output;
}
