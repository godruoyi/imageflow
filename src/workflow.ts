import { Configs, Input, Output, IWorkflow, WorkflowAlias, Node } from "./types";
import resolveAction from "./actions";
import { showToast, Toast } from "@raycast/api";

export async function createWorkflow(configs: Configs, name: WorkflowAlias): Promise<IWorkflow> {
  const nodes = configs.workflows[name];

  if (!nodes || nodes.length === 0) {
    return new NullWorkflow();
  }

  return new Workflow(nodes, configs);
}

class Workflow implements IWorkflow {
  private readonly nodes: Node[];
  private readonly configs: Configs;

  constructor(nodes: Node[], configs: Configs) {
    this.nodes = nodes;
    this.configs = configs;
  }

  async run(i: Input) {
    return (await this.nodes.reduce(async (acc: Promise<Input>, cur: Node) => {
      const input = await acc;
      const fn = resolveAction(cur.action)(input, cur.params, this.configs);

      return this.terminate(this.wrapWithCleanup(input, this.wrapWithProcessing(cur, fn)));
    }, Promise.resolve(i))) as Output;
  }

  async wrapWithProcessing(n: Node, fn: Promise<Input>): Promise<Input> {
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
    console.log("Clean up the temporary artifacts from the previous step...");

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
