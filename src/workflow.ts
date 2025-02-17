import { Input, Output, IWorkflow, WorkflowConfigs, WorkflowAlias, WorkflowNode, Image } from "./types";
import resolveAction from "./actions";
import { EasyImager } from "./supports/image";
import React from "react";
import path from "path";

export async function createWorkflow(
  configs: WorkflowConfigs,
  name: WorkflowAlias,
  stater?: React.Dispatch<React.SetStateAction<string>>,
): Promise<IWorkflow> {
  const nodes = configs.workflows[name];

  if (!nodes || nodes.length === 0) {
    return new NullWorkflow();
  }

  return new Workflow(nodes, configs, stater);
}

class Workflow implements IWorkflow {
  private readonly nodes: WorkflowNode[];
  private readonly configs: WorkflowConfigs;
  private readonly stater: React.Dispatch<React.SetStateAction<string>>;

  constructor(nodes: WorkflowNode[], configs: WorkflowConfigs, stater?: React.Dispatch<React.SetStateAction<string>>) {
    this.nodes = nodes;
    this.configs = configs;
    this.stater = stater || (() => {});
  }

  async run(i: Input) {
    const imager = new EasyImager(i);
    const updater = new StateUpdater(this.stater, this.nodes, i as Image);

    return (await this.nodes.reduce(async (acc: Promise<Input>, cur: WorkflowNode) => {
      const input = await acc;
      const fn = resolveAction(cur.action)(input, cur.params, this.configs.services, imager);

      return this.terminate(cur, this.wrapWithProcessing(cur, fn), updater);
    }, Promise.resolve(i))) as Output;
  }

  async wrapWithProcessing(n: WorkflowNode, fn: Promise<Input>): Promise<Input> {
    await new Promise((resolve) => setTimeout(resolve, 2000));

    console.log(`Processing ${n.name}...`);
    return fn;
  }

  async terminate(n: WorkflowNode, fn: Promise<Input>, state: StateUpdater): Promise<Input> {
    const input = await fn;
    console.log(`Processed ${n.name}`);

    await state.finish(n.name, input.value);

    return Promise.resolve(input);
  }
}

class NullWorkflow implements IWorkflow {
  async run(i: Input) {
    return i as Output;
  }
}

class StateUpdater {
  private log: string;

  private readonly stater: React.Dispatch<React.SetStateAction<string>>;

  constructor(stater: React.Dispatch<React.SetStateAction<string>>, nodes: WorkflowNode[], i: Image) {
    this.stater = stater;
    this.log = this.prepareInitState(nodes, i);
    this.stater(this.get());
  }

  get() {
    return this.log;
  }

  async finish(step: string, result: string) {
    const log = this.updateStepStatus(step, this.get(), result);

    this.log = log;
    this.stater(log);
  }

  prepareInitState(nodes: WorkflowNode[], i: Image) {
    const filename = path.basename(i.value);
    const setups = nodes.map((n) => `- ☑️ ${n.name}`).join("\n");

    return `
## Progressing image (${filename}) ![loading](https://images.godruoyi.com/loading.gif)

${setups}
`;
  }

  updateStepStatus(step: string, state: string, result: string) {
    if (step === "") {
      return state;
    }

    const lines = state.split(/\n/);
    let index = -1;
    let allStepsDone = true;

    const updatedLines = lines.map((line, i) => {
      if (line.includes("Progressing image")) {
        index = i;
      }
      if (line.includes(step)) {
        const l = line.replace(/^(\s*-\s*)\S+/, "$1✅");
        const subLine = `  - ${result}`;
        return `${l}\n${subLine}`;
      }
      if (line.includes("☑️")) {
        allStepsDone = false;
      }
      return line;
    });

    if (allStepsDone && index !== -1) {
      updatedLines[index] = updatedLines[index]
        .replace("Progressing", "Successfully processed")
        .replace("![loading](https://images.godruoyi.com/loading.gif)", "✅");
    }

    return updatedLines.join("\n");
  }
}
