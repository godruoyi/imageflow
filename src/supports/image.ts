import { getSelectedFinderItems } from "@raycast/api";
import { Image, Imager, Input } from "../types";

const ImageExtensions = [".png", ".jpg", ".jpeg", ".webp"];

export async function getSelectedImages(): Promise<Image[]> {
  try {
    return (await getSelectedFinderItems())
      .map((f) => f.path)
      .filter(isImage)
      .map((p) => toImage(p));
  } catch (e) {
    const message = e instanceof Error ? e.message : "An error occurred";
    throw new Error(message);
  }
}

export function isImage(path: string): boolean {
  return ImageExtensions.some((ext) => path.endsWith(ext));
}

export function toImage(path: string): Image {
  return { type: "filepath", value: path };
}

export class EasyImager implements Imager {
  private image: Image;

  constructor(i: Input) {
    this.image = i as Image;
  }

  get(): Image {
    return this.image;
  }

  set(i: Image): void {
    this.image = i;
  }
}
