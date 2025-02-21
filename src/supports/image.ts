import { getSelectedFinderItems, Clipboard } from "@raycast/api";
import { Image, Imager, Input } from "../types";
import path from "path";
import { fileTypeFromFile } from "file-type";

const ImageExtensions = [".png", ".jpg", ".jpeg", ".webp", ".avif", ".apng"];

export async function getImages(): Promise<Image[]> {
  let images: Image[] = [];

  try {
    // if finder is not the front-most application will try to get images from clipboard
    images = await getImagesFromSelectedFinderItems();
  } catch (e) {
    images = await getImagesFromClipboard();
  }

  if (images.length === 0) {
    throw new Error("cannot get images from Finder or Clipboard or the selected images are not supported");
  }

  return images;
}

async function getImagesFromSelectedFinderItems(): Promise<Image[]> {
  return (await getSelectedFinderItems())
    .map((f) => f.path)
    .filter(isImage)
    .map((p) => toImage(p));
}

async function getImagesFromClipboard(): Promise<Image[]> {
  const { file } = await Clipboard.read();

  if (!file || !file.startsWith("file://")) {
    return [] as Image[];
  }

  // format image path to convert %20 to space
  const p = file.replace("%20", " ").replace("file://", "");
  const meta = await fileTypeFromFile(p);

  if (!meta) {
    console.error("cannot get file type for clipboard file path, file: ", file);
    return [] as Image[];
  }

  if (meta.mime.startsWith("image/") && isImage(`.${meta.ext}`)) {
    return [{ type: "filepath", value: p } as Image];
  }

  return [] as Image[];
}

export function buildNewImageName(image: Image, extension: string): string {
  const originName = path.basename(image.value);
  const ext = path.extname(originName);
  const newExt = normalizeExtension(extension);

  if (!ext) {
    return `${originName}${newExt}`;
  }

  return originName.replace(new RegExp(`${ext}$`), newExt);
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
