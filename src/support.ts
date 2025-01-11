import fs from "fs";
import yaml from "js-yaml";
import path from "path";
import { getSelectedFinderItems, showToast, Toast } from "@raycast/api";
import { Configs } from "./types";

const ImageExtensions = [".png", ".jpg", ".jpeg", ".webp"];

export async function getSelectedImages(): Promise<string[]> {
  try {
    return (await getSelectedFinderItems()).map((f) => f.path).filter(isImage);
  } catch (e) {
    const message = e instanceof Error ? e.message : "An error occurred";
    throw new Error(message);
  }
}

export function isImage(path: string): boolean {
  return ImageExtensions.some((ext) => path.endsWith(ext));
}

export async function showError(e?: Error | undefined) {
  await showToast({
    style: Toast.Style.Failure,
    title: "Error",
    message: e instanceof Error ? e.message : "An error occurred",
  });
}

export async function showSuccess(message: string) {
  await showToast({
    style: Toast.Style.Animated,
    title: "Success",
    message,
  });
}

function getWorkflowConfigPath(): string {
  const filePath = path.join(process.env.HOME || "", ".config", "workflow.yaml");

  if (!fs.existsSync(filePath)) {
    console.warn("Cannot found custom workflow file, use default workflow file instead, path:", filePath);

    return path.join(__dirname, "..", "workflow.yaml");
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
