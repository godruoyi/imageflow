import fs from "fs";
import yaml from "js-yaml";
import path from "path";
import { getSelectedFinderItems, showToast, Toast } from "@raycast/api";
import { Config2, Configs, Image, Imager, Input, V } from "./types";

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
  return { type: "path", value: path };
}

export function toInput(path: string): Input {
  return { image: toImage(path) };
}

export async function showError(e?: Error | undefined) {
  await showToast({
    style: Toast.Style.Failure,
    title: "Error",
    message: e instanceof Error ? e.message : "An error occurred",
  });
}

function getWorkflowConfigPath(): string {
  // todo: using custom path
  const filePath = path.join(process.env.HOME || "", ".config", "workflow.yaml");

  if (!fs.existsSync(filePath)) {
    throw new Error("Workflow config file not found, path: " + filePath);
  }

  return filePath;
}

export async function getWorkflowConfigs(): Promise<Configs> {
  const path = getWorkflowConfigPath();
  const content = fs.readFileSync(path, "utf-8");
  const doc = yaml.load(content);

  if (!doc) {
    console.error("failed to parse workflow config file:", path);

    return {} as Configs;
  }

  return doc as Configs;
}

export async function saveStreamToTmpFile(stream: NodeJS.ReadableStream, originPath: string): Promise<string> {
  // todo: widows support?
  const tmp = path.join("/tmp", `imageflow_${Date.now()}_${path.basename(originPath)}`);

  console.log(tmp);

  return saveStreamToFile(stream, tmp);
}

export async function saveStreamToFile(stream: NodeJS.ReadableStream, outputPath: string): Promise<string> {
  const outputStream = fs.createWriteStream(outputPath);

  return new Promise((resolve, reject) => {
    stream.pipe(outputStream);
    stream.on("error", reject);
    outputStream.on("finish", () => resolve(outputPath));
  });
}

export class EasyImager implements Imager {
  private image: Image;

  constructor(i: Input) {
    this.image = i.image;
  }

  get(): Image {
    return this.image;
  }

  set(i: Image): void {
    this.image = i;
  }
}

export class YamlConfig implements Config2 {
  private data;

  constructor(data: unknown) {
    this.data = data;
  }

  get(k: string, defaultV?: V): V {
    return defaultV.;
  }
}
