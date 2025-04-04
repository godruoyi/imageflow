import React from "react";
import { Input, WorkflowAlias } from "./types";
import { getFiles, getImages } from "./supports/image";
import { getWorkflowConfigs } from "./supports/workflow";
import { createMarkdownLogger, createWorkflow } from "./workflow";

export async function processor(
  setMarkdown: React.Dispatch<React.SetStateAction<string>>,
  setError: React.Dispatch<React.SetStateAction<Error | undefined>>,
  fileType: "file" | "image",
  workflowAlias?: WorkflowAlias,
): Promise<string> {
  try {
    const images = fileType === "image" ? await getImages() : await getFiles();
    const configs = await getWorkflowConfigs();
    const workflowName = workflowAlias || ("default" as WorkflowAlias);
    const workflowNodes = configs.workflows[workflowName];
    const logger = createMarkdownLogger(workflowNodes, setMarkdown);
    const workflow = await createWorkflow(configs, workflowNodes, logger);

    for (const image of images) {
      await workflow.run(image as Input);
    }
  } catch (e) {
    setError(e instanceof Error ? e : new Error("An error occurred"));
  }

  return "";
}
