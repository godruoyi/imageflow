import React from "react";
import { Image, Input, WorkflowAlias, WorkflowConfigs } from "./types";
import { createMarkdownLogger, createWorkflow } from "./workflow";

export async function processor(
  images: Image[],
  configs: WorkflowConfigs,
  workflowName: WorkflowAlias,
  setMarkdown: React.Dispatch<React.SetStateAction<string>>,
): Promise<string> {
  const workflowNodes = configs.workflows[workflowName];
  if (!workflowNodes) {
    throw Error(`Workflow [${workflowName}] not found`);
  }

  const logger = createMarkdownLogger(workflowNodes, setMarkdown);
  const workflow = await createWorkflow(configs, workflowNodes, logger);

  for (const image of images) {
    await workflow.run(image as Input);
  }

  return "";
}
