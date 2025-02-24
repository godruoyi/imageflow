import { Input, Output, IWorkflow, WorkflowConfigs, WorkflowAlias, WorkflowNode, Image } from "./types";
import resolveAction from "./actions";
import { EasyImager } from "./supports/image";
import React from "react";
import logger from "./supports/logger";

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
    const log = logger.markdownLogger(this.prepareStages());
    this.stater(log.toMarkdown);

    return (await this.nodes.reduce(async (acc: Promise<Input>, cur: WorkflowNode) => {
      const input = await acc;
      const fn = resolveAction(cur.action)(input, cur.params, this.configs.services, imager);

      return this.terminate(cur, this.wrapWithProcessing(cur, fn), updater);
    }, Promise.resolve(i))) as Output;
  }

  async wrapWithProcessing(n: WorkflowNode, fn: Promise<Input>): Promise<Input> {
    return fn;
  }

  async terminate(n: WorkflowNode, fn: Promise<Input>, state: StateUpdater): Promise<Input> {
    try {
      const output = await fn;
      await state.success(n.name, `done: ${output.value}`);
      return Promise.resolve(output);
    } catch (e) {
      await state.error(n.name, e instanceof Error ? e.message : "unknown error");

      throw e;
    }
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

  async error(step: string, msg: string) {
    return this.logging(step, msg, "🚨");
  }

  async success(step: string, msg: string) {
    return this.logging(step, msg, "✅");
  }

  async logging(step: string, msg: string, emoji: string) {
    const log = this.updateStepStatus(step, this.get(), msg, emoji);

    this.log = log;
    this.stater(log);
  }

  prepareInitState(nodes: WorkflowNode[], i: Image) {
    const setups = nodes.map((n) => `- ☑️ ${n.name}`).join("\n");

    return `
## Progressing image ![loading](https://images.godruoyi.com/loading.gif)

image: ${i.value}

${setups}
`;
  }

  updateStepStatus(step: string, state: string, result: string, emoji?: string) {
    if (step === "") {
      return state;
    }

    // todo, i don't like this flow right now, let's refactor it later
    const lines = state.split(/\n/);
    let index = -1;
    let allStepsDone = true;
    const error = emoji !== "✅";

    const updatedLines = lines.map((line, i) => {
      if (line.includes("Progressing image")) {
        index = i;
      }

      if (line.includes(step)) {
        const l = line.replace(/^(\s*-\s*)\S+/, `$1${emoji}`);
        const subLine = `  - \`${result}\``;
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
    if (error && index !== -1) {
      updatedLines[index] = updatedLines[index]
        .replace("Progressing", "Error Process")
        .replace("![loading](https://images.godruoyi.com/loading.gif)", emoji as string);
    }

    return updatedLines.join("\n");
  }
}
