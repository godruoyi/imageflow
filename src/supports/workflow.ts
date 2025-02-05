import fs from "fs";
import yaml from "js-yaml";
import path from "path";
import { Configs } from "../types";

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

function getWorkflowConfigPath(): string {
  // todo: using custom path
  const filePath = path.join(process.env.HOME || "", ".config", "workflow.yaml");

  if (!fs.existsSync(filePath)) {
    throw new Error("Workflow config file not found, path: " + filePath);
  }

  return filePath;
}
