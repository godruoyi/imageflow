import { Detail } from "@raycast/api";
import { Image, WorkflowAlias } from "./types";
import { ReactNode, useEffect, useRef, useState } from "react";
import { showError } from "./supports/error";
import { usePromise } from "@raycast/utils";
import { processor } from "./processor";
import { getWorkflowConfigs } from "./supports/workflow";

export function Process({
  workflowName,
  imageLoader,
  action,
}: {
  workflowName: WorkflowAlias;
  imageLoader: () => Promise<Image[]>;
  action?: ReactNode;
}) {
  const [markdown, setMarkdown] = useState("");
  const [error, setError] = useState<Error>();
  const hasRun = useRef(false);

  useEffect(() => {
    if (error) {
      showError(error);

      setMarkdown(`❌ Oops ${error.message}`);
    }
  }, [error]);

  usePromise(async () => {
    if (hasRun.current) {
      return;
    }
    hasRun.current = true;

    try {
      const configs = await getWorkflowConfigs();
      const images = await imageLoader();
      await processor(images, configs, workflowName, setMarkdown);
    } catch (e) {
      setError(e instanceof Error ? e : new Error("An error occurred"));
    }
  }, []);

  return <Detail markdown={markdown} actions={action} />;
}
