import { Input, Output, IWorkflow, WorkflowConfigs, WorkflowAlias, WorkflowNode } from "./types";
import resolveAction from "./actions";
import { showToast, Toast } from "@raycast/api";
import { EasyImager } from "./supports/image";

export async function createWorkflow(configs: WorkflowConfigs, name: WorkflowAlias): Promise<IWorkflow> {
  const nodes = configs.workflows[name];

  if (!nodes || nodes.length === 0) {
    return new NullWorkflow();
  }

  return new Workflow(nodes, configs);
}

class Workflow implements IWorkflow {
  private readonly nodes: WorkflowNode[];
  private readonly configs: WorkflowConfigs;

  constructor(nodes: WorkflowNode[], configs: WorkflowConfigs) {
    this.nodes = nodes;
    this.configs = configs;
  }

  async run(i: Input) {
    const imager = new EasyImager(i);
    return (await this.nodes.reduce(async (acc: Promise<Input>, cur: WorkflowNode) => {
      const input = await acc;
      const fn = resolveAction(cur.action)(input, cur.params, this.configs.services, imager);

      return this.terminate(this.wrapWithCleanup(input, this.wrapWithProcessing(cur, fn)));
    }, Promise.resolve(i))) as Output;
  }

  async wrapWithProcessing(n: WorkflowNode, fn: Promise<Input>): Promise<Input> {
    await showToast({
      style: Toast.Style.Success,
      title: `${n.name}...`,
    });

    // testing
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return fn;
  }

  async wrapWithCleanup(input: Input, fn: Promise<Input>): Promise<Input> {
    // todo
    // console.log("Clean up the temporary artifacts from the previous step...", input);

    return fn;
  }

  async terminate(fn: Promise<Input>): Promise<Input> {
    const input = await fn;

    await showToast({
      style: Toast.Style.Success,
      title: `All done!`,
    });

    return Promise.resolve(input);
  }
}

class NullWorkflow implements IWorkflow {
  async run(i: Input) {
    return i as Output;
  }
}
