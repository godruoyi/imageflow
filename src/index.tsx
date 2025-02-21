import { Detail } from "@raycast/api";
import { usePromise } from "@raycast/utils";
import React, { useRef, useState } from "react";
import { Input, WorkflowAlias } from "./types";
import { getImages } from "./supports/image";
import { getWorkflowConfigs } from "./supports/workflow";
import { createWorkflow } from "./workflow";
import { showError } from "./supports/error";

type Props = {
  arguments: {
    workflow?: WorkflowAlias;
  };
};

export default function Index(props: Props) {
  const [markdown, setMarkdown] = useState("");
  const hasRun = useRef(false);

  usePromise(async () => {
    if (hasRun.current) {
      return;
    }

    hasRun.current = true;
    await run(setMarkdown, props.arguments.workflow);
  }, []);

  return <Detail markdown={markdown} />;
}

async function run(
  setMarkdown: React.Dispatch<React.SetStateAction<string>>,
  workflowAlias?: WorkflowAlias,
): Promise<string> {
  try {
    const images = await getImages();
    const configs = await getWorkflowConfigs();
    const workflowName = workflowAlias || ("default" as WorkflowAlias);
    const workflow = await createWorkflow(configs, workflowName, setMarkdown);

    await Promise.all(images.map((image) => workflow.run(image as Input)));
  } catch (e) {
    await showError(e);
  }

  return "";
}
