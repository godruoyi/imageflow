import { getSelectedFinderItems } from "@raycast/api";
import { Image, Imager, Input } from "../types";
import path from "path";

const ImageExtensions = [".png", ".jpg", ".jpeg", ".webp"];

export async function getSelectedImages(): Promise<Image[]> {
  try {
    const images = (await getSelectedFinderItems())
      .map((f) => f.path)
      .filter(isImage)
      .map((p) => toImage(p));

    if (images.length === 0 || images.length > 1) {
      throw new Error("Please select only one image");
    }
    
    return images;
  } catch (e) {
    const message = e instanceof Error ? e.message : "An error occurred";
    throw new Error(message);
  }
}

export function buildNewImageName(image: Image, extension: string): string {
  const originName = path.basename(image.value);
  const ext = path.extname(originName);

  return originName.replace(ext, normalizeExtension(extension));
}

/**
 * See https://developer.mozilla.org/en-US/docs/Web/Media/Guides/Formats/Image_types
 *
 * @param mimeType
 */
export function imageMimeTypeToExtension(mimeType: string): string {
  switch (mimeType) {
    case "image/apng":
      return ".apng";
    case "image/avif":
      return ".avif";
    case "image/jpeg":
      return ".jpg"; // .jpg, .jpeg, .jfif, .pjpeg, .pjp
    case "image/png":
      return ".png";
    case "image/webp":
      return ".webp";
    default:
      throw new Error("Unsupported image mime type");
  }
}

export function imageExtensionToMimeType(extension: string): string {
  extension = normalizeExtension(extension);

  switch (extension) {
    case ".apng":
      return "image/apng";
    case ".avif":
      return "image/avif";
    case ".jpg":
    case ".jpeg":
    case ".jfif":
    case ".pjpeg":
    case ".pjp":
      return "image/jpeg";
    case ".png":
      return "image/png";
    case ".webp":
      return "image/webp";
    default:
      throw new Error("Unsupported image extension");
  }
}

function normalizeExtension(extension: string): string {
  extension = extension.toLowerCase();

  return extension.startsWith(".") ? extension : `.${extension}`;
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

function isImage(path: string): boolean {
  return ImageExtensions.some((ext) => path.endsWith(ext));
}

function toImage(path: string): Image {
  return { type: "filepath", value: path };
}
