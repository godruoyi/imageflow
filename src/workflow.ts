import { Configs, Input, Output, IWorkflow, WorkflowAlias, Node } from "./types";

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
    // implement it with array reduce
    this.nodes.reduce(async (previousValue, currentValue): Promise<Output> => {
      const x = await currentValue.action.execute(previousValue);

      return x as Input;
    }, Promise.resolve(i));

    return i as Output;
  }
}

class NullWorkflow implements IWorkflow {
  async run(i: Input) {
    return i as Output;
  }
}
