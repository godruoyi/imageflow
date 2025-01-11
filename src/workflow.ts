import { Configs, Input, Output, IWorkflow, WorkflowAlias, Node } from "./types";
import resolveAction from "./actions";

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
      return resolveAction(cur.action)(input, cur.params);
    }, Promise.resolve(i))) as Output;
  }
}

class NullWorkflow implements IWorkflow {
  async run(i: Input) {
    return i as Output;
  }
}
