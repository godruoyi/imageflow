import { Input, WorkflowAlias } from "./types";
import { createWorkflow } from "./workflow";
import { getSelectedImages } from "./supports/image";
import { getWorkflowConfigs } from "./supports/workflow";
import { showError } from "./supports/error";

type Props = {
  arguments: {
    workflow?: WorkflowAlias;
  };
};

export default async function main(props: Props) {
  try {
    const images = await getSelectedImages();
    const configs = await getWorkflowConfigs();
    const workflowName = props.arguments.workflow || ("default" as WorkflowAlias);
    const workflow = await createWorkflow(configs, workflowName);

    await Promise.all(images.map((image) => workflow.run(image as Input)));
  } catch (e) {
    await showError(e as Error);
  }
}
